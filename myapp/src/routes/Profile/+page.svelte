<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils";
  import { writable } from "svelte/store";

  // --- State & Variables ---
  let isLoading = writable(true);
  let user: any = {};
  let activeMenu = "account"; // Start on account
  let userToken: string | null;
  let qrCodeImage: string | null = null;
  let idCardImage: string | null = null;
  let isOpen = false; // For mobile menu
  let expandedOrder: null = null;

  // --- Orders Data (Example) ---
  let orders: string | any[] = [];

  // --- Helper Functions ---

  function formatDate(dateString: string) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "กำลังดำเนินการ":
        return "text-yellow-500";
      case "จัดส่งแล้ว":
        return "text-green-500";
      case "คืนสินค้า":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  }

  function formatCurrency(amount: number) {
    return amount.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    });
  }

  // --- Event Handlers ---

  async function updateUser(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedUserData = {
      user_name: formData.get("name")?.toString().trim(), // Use optional chaining and trim
      user_email: formData.get("email")?.toString().trim(), // Use optional chaining and trim
      user_pass: formData.get("pass")?.toString().trim(), // Get password (even if empty), and trim
    };

    if (
      !updatedUserData.user_name ||
      !updatedUserData.user_email ||
      !updatedUserData.user_pass
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      const userId = user.user_id;
      if (!userId) return;

      const response = await fetch("http://localhost:3000/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, user_data: updatedUserData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update user object with *only* the provided data
      user = { ...user, ...updatedUserData };
      alert("อัปเดตข้อมูลสำเร็จ!");
      goto("/Profile");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล!");
    }
  }

  function handleFileUpload(event: Event, type: "qr" | "id") {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "qr") {
          qrCodeImage = e.target?.result as string;
        } else {
          idCardImage = e.target?.result as string;
        }
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  async function submitShopRequest(event: Event) {
    event.preventDefault();

    if (!qrCodeImage || !idCardImage) {
      alert("กรุณาอัปโหลดรูป QR Code และบัตรประชาชน");
      return;
    }

    try {
      if (!userToken) return;

      const response = await fetch("http://localhost:3000/user/shopRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          qrCode: qrCodeImage,
          idCard: idCardImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorData.message || "Unknown error"
          }`,
        );
      }
      const result = await response.json();

      if (result.success) {
        alert(result.message || "คำขอเปิดร้านค้าถูกส่งแล้ว!");
      } else {
        alert(result.message || "เกิดข้อผิดพลาดในการส่งคำขอ!");
      }
    } catch (error) {
      console.error("Error submitting shop request:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      qrCodeImage = null;
      idCardImage = null;
      const qrCodeInput = document.getElementById("qrCode") as HTMLInputElement;
      const idCardInput = document.getElementById("idCard") as HTMLInputElement;

      if (qrCodeInput) qrCodeInput.value = "";
      if (idCardInput) idCardInput.value = "";
    }
  }

  // --- Menu Toggle (Mobile) ---
  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }
  function toggleOrderDetails(orderId) {
    if (expandedOrder === orderId) {
      expandedOrder = null;
    } else {
      expandedOrder = orderId;
    }
  }

  async function getOrder() {
    try {
      const response = await fetch(
        `http://localhost:3000/shop/publisher/order?token=${userToken}`,
      );
      const data = await response.json();
      if (data) {
        orders = data;
      } else {
        orders = [];
      }
    } catch (err) {
      console.error(err);
    }
  }

  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    await getUser(userToken).then((data) => {
      user = data;
      user.user_name = user.user_name || "N/A";
      user.user_firstname = user.user_firstname || "N/A";
      user.user_lastname = user.user_lastname || "N/A";
      user.user_email = user.user_email || "N/A";
      user.user_image = user.user_image || "/placeholder-profile.png"; // Default image
    });
    await getOrder();
    isLoading.set(false);
    console.log(orders);
  });
</script>

{#if !$isLoading}
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row">
        <!-- Sidebar (Mobile) -->
        <div class="md:hidden">
          <button
            on:click={toggleMenu}
            class="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <i class="fa-solid fa-bars text-xl"></i>
          </button>
          {#if isOpen}
            <div
              class="absolute bg-blue-600 w-64 rounded-lg shadow-lg p-4 z-10"
            >
              <button
                on:click={closeMenu}
                class="text-white text-right block w-full"
              >
                <i class="fa-solid fa-times"></i>
              </button>
              <ul class="mt-4 space-y-2">
                <li
                  class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                  'account'
                    ? 'bg-blue-800 text-white'
                    : 'text-white'}"
                  on:click={() => {
                    activeMenu = "account";
                    closeMenu();
                  }}
                >
                  <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
                </li>
                <li
                  class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                  'orders'
                    ? 'bg-blue-800 text-white'
                    : 'text-white'}"
                  on:click={() => {
                    activeMenu = "orders";
                    closeMenu();
                  }}
                >
                  <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
                </li>
                <li
                  class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                  'shopRequest'
                    ? 'bg-blue-800 text-white'
                    : 'text-white'}"
                  on:click={() => {
                    activeMenu = "shopRequest";
                    closeMenu();
                  }}
                >
                  <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
                </li>
              </ul>
            </div>
          {/if}
        </div>

        <!-- Sidebar (Desktop) -->
        <div
          class="hidden md:block w-64 bg-blue-600 rounded-lg shadow-lg p-4 mr-4"
        >
          <h2 class="text-lg font-semibold text-white mb-4">บัญชีของฉัน</h2>
          <ul class="space-y-2">
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'account'
                ? 'bg-blue-800 text-white'
                : 'text-white'}"
              on:click={() => (activeMenu = "account")}
            >
              <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
            </li>
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'orders'
                ? 'bg-blue-800 text-white'
                : 'text-white'}"
              on:click={() => (activeMenu = "orders")}
            >
              <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
            </li>
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'shopRequest'
                ? 'bg-blue-800 text-white'
                : 'text-white'}"
              on:click={() => (activeMenu = "shopRequest")}
            >
              <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
            </li>
          </ul>
        </div>

        <!-- Main Content -->
        <div class="flex-1 mt-4 md:mt-0">
          {#if activeMenu === "account"}
            <div class="bg-white rounded-lg shadow-md p-6">
              <h1 class="text-2xl font-semibold mb-4">บัญชีผู้ใช้</h1>
              <div class="flex items-center mb-4">
                <img
                  src={user.user_image}
                  alt="Profile"
                  class="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p class="text-lg font-medium">
                    ชื่อบัญชี: <span class="font-normal">{user.user_name}</span>
                  </p>
                  <p class="text-gray-600">
                    ชื่อจริง: {user.user_firstname}
                    {user.user_lastname}
                  </p>
                  <p class="text-gray-600">อีเมล: {user.user_email}</p>
                </div>
              </div>

              <form on:submit={updateUser} class="mt-6">
                <div class="mb-4">
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="name"
                  >
                    ชื่อบัญชี:
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    id="name"
                    type="text"
                    name="name"
                    value={user?.user_name ?? ""}
                  />
                </div>
                <div class="mb-4">
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="email"
                  >
                    อีเมล:
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    id="email"
                    type="text"
                    name="email"
                    value={user?.user_email ?? ""}
                  />
                </div>
                <div class="mb-6">
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="pass"
                  >
                    รหัสผ่าน:
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    id="pass"
                    type="password"
                    name="pass"
                    placeholder="********"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    ปล่อยว่างไว้ หากไม่ต้องการเปลี่ยนรหัสผ่าน
                  </p>
                </div>
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  บันทึก
                </button>
              </form>
            </div>
          {:else if activeMenu === "orders"}
            <div class="bg-white rounded-lg shadow-md p-6">
              <h1 class="text-2xl font-semibold mb-4">คำสั่งซื้อของฉัน</h1>
              {#if orders.length === 0}
                <p class="text-gray-600">ไม่มีคำสั่งซื้อในขณะนี้</p>
              {:else}
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead class="bg-gray-100">
                      <tr>
                        <th
                          class="py-2 px-4 text-left text-sm font-medium text-gray-600"
                        >
                          Order ID
                        </th>
                        <th
                          class="py-2 px-4 text-left text-sm font-medium text-gray-600"
                        >
                          วันที่
                        </th>
                        <th
                          class="py-2 px-4 text-left text-sm font-medium text-gray-600"
                        >
                          สถานะ
                        </th>
                        <th
                          class="py-2 px-4 text-left text-sm font-medium text-gray-600"
                        >
                          ยอดรวม
                        </th>
                        <!-- Removed the "รายการ" header -->
                      </tr>
                    </thead>
                    <tbody>
                      {#each orders as order (order.order_id)}
                        <tr
                          class="border-b cursor-pointer"
                          on:click={() => toggleOrderDetails(order.order_id)}
                        >
                          <td class="py-2 px-4 text-sm">{order.order_id}</td>
                          <td class="py-2 px-4 text-sm">
                            {formatDate(order.order_time)}
                          </td>
                          <td
                            class="py-2 px-4 text-sm {getStatusColor(
                              order.order_status,
                            )}"
                          >
                            {order.order_status}
                          </td>
                          <td class="py-2 px-4 text-sm">
                            {formatCurrency(order.total_price)}
                          </td>
                          <!-- Removed the "Show/Hide Details" cell -->
                        </tr>
                        {#if expandedOrder === order.order_id}
                          <tr>
                            <td colspan="4">
                              <div class="p-4 bg-gray-50">
                                {#each order.items as item}
                                  <div
                                    class="mb-2 border-b pb-2 flex items-start"
                                  >
                                    {#if item.book_image}
                                      <img
                                        src={item.book_image}
                                        alt={item.book_name_th}
                                        class="w-24 h-auto mr-4"
                                      />
                                    {/if}
                                    <div>
                                      <p class="font-semibold">
                                        {item.book_name_th}
                                      </p>
                                      <p>
                                        <span class="font-semibold">Price:</span
                                        >
                                        {formatCurrency(item.book_price)} x {item.amount}
                                      </p>
                                      <p>
                                        <span class="font-semibold">Total:</span
                                        >
                                        {formatCurrency(
                                          item.book_price * item.amount,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                {/each}
                              </div>
                            </td>
                          </tr>
                        {/if}
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>
          {:else if activeMenu === "shopRequest"}
            <div class="bg-white rounded-lg shadow-md p-6">
              <h1 class="text-2xl font-semibold mb-4">การขอเปิดร้านค้า</h1>
              <form on:submit={submitShopRequest} class="space-y-4">
                <div>
                  <label
                    for="qrCode"
                    class="block text-sm font-medium text-gray-700"
                  >
                    รูป QR Code:
                  </label>
                  <input
                    type="file"
                    id="qrCode"
                    accept="image/*"
                    on:change={(e) => handleFileUpload(e, "qr")}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {#if qrCodeImage}
                    <img
                      src={qrCodeImage}
                      alt="QR Code Preview"
                      class="mt-2 max-h-48"
                    />
                  {/if}
                </div>
                <div>
                  <label
                    for="idCard"
                    class="block text-sm font-medium text-gray-700"
                  >
                    รูปบัตรประชาชน:
                  </label>
                  <input
                    type="file"
                    id="idCard"
                    accept="image/*"
                    on:change={(e) => handleFileUpload(e, "id")}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {#if idCardImage}
                    <img
                      src={idCardImage}
                      alt="ID Card Preview"
                      class="mt-2 max-h-48"
                    />
                  {/if}
                </div>
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  ส่งคำขอ
                </button>
              </form>
            </div>
          {:else if activeMenu === "banManagement"}
            <div class="bg-white rounded-lg shadow-md p-6">
              <h1 class="text-2xl font-semibold mb-4">จัดการการแบน</h1>
              <p class="text-gray-600">(เนื้อหาส่วนนี้จะถูกพัฒนาในภายหลัง)</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
