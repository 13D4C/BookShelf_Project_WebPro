<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils";
  import { writable } from "svelte/store";

  // --- State & Variables ---
  let isLoading = writable(true);
  let user: any = {};
  let activeMenu = "account"; // Start on sellerRequests
  let userToken: string | null;
  let qrCodeImage: string | null = null;
  let idCardImage: string | null = null;
  let isOpen = false; // For mobile menu

  // --- Orders Data (Example) ---
  let orders = [
    {
      id: "ORD-2023-001",
      date: "2023-12-20",
      status: "กำลังดำเนินการ",
      total: 1290,
      items: [
        { name: "หนังสือ A", price: 250, quantity: 2 },
        { name: "หนังสือ B", price: 790, quantity: 1 },
      ],
    },
    {
      id: "ORD-2023-002",
      date: "2024-01-15",
      status: "จัดส่งแล้ว",
      total: 450,
      items: [{ name: "หนังสือ C", price: 450, quantity: 1 }],
    },
    {
      id: "ORD-2024-003",
      date: "2024-02-28",
      status: "คืนสินค้า",
      total: 300,
      items: [{ name: "หนังสือ D", price: 150, quantity: 2 }],
    },
  ];

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


  async function updateUser(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedUserData = {
      user_name: formData.get("name"),
      user_email: formData.get("email"),
      user_pass: formData.get("pass"),
    };
    if (!updatedUserData.user_name || !updatedUserData.user_email || !updatedUserData.user_pass) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }
    try {
      const userId = user.user_id;
      if (!userId) return;

      const response = await fetch(
        "http://localhost:3000/user/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id:userId, user_data:updatedUserData }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      user = { ...user, ...updatedUserData };
      alert("อัปเดตข้อมูลสำเร็จ!");
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
          `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
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

  function navigateTo(route: string) {
    goto(route);
  }

  // --- Lifecycle Hooks ---

  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    await getUser(userToken).then((data) => {
      user = data;
    });
    isLoading.set(false);
  });
</script>

{#if !$isLoading}
  <div class="min-h-screen bg-blue-50">
    <div class="container mx-auto px-4 py-8 flex flex-col sm:flex-row">
      <!-- Sidebar (Mobile) -->
      <div class="sm:hidden">
        <button on:click={toggleMenu} class="text-blue-700 focus:outline-none">
          <i class="fa-solid fa-bars text-xl"></i>
        </button>
        {#if isOpen}
          <div
            class="absolute bg-blue-700 w-64 min-w-[256px] p-4 rounded-lg z-10"
          >
            <button
              on:click={closeMenu}
              class="text-white text-right block w-full"
            >
              <i class="fa-solid fa-times"></i>
            </button>
            <ul class="mt-4">
              <!-- Menu  -->
              <li
                class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
                'address'
                  ? 'bg-blue-900 text-white'
                  : 'text-white'}"
                on:click={() => {
                  activeMenu = "account";
                  closeMenu();
                }}
              ><i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้</li>
              <li
                class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
                'orders'
                  ? 'bg-blue-900 text-white'
                  : 'text-white'}"
                on:click={() => {
                  activeMenu = "orders";
                  closeMenu();
                }}
              >
                <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
              </li>
              <li
                class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
                'shopRequest'
                  ? 'bg-blue-900 text-white'
                  : 'text-white'}"
                on:click={() => {
                  activeMenu = "shopRequest";
                  closeMenu();
                }}
              >
                <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
              </li>
              <li
                class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
                'banManagement'
                  ? 'bg-blue-900 text-white'
                  : 'text-white'}"
                on:click={() => {
                  activeMenu = "banManagement";
                  closeMenu();
                }}
              ></li>
            </ul>
          </div>
        {/if}
      </div>

      <!-- Sidebar (Desktop) -->
      <div
        class="hidden sm:block bg-blue-700 w-64 min-w-[256px] p-4 rounded-lg mr-4"
      >
        <h2 class="text-lg font-semibold text-white">บัญชีของฉัน</h2>
        <ul class="mt-4">
          <!-- Menu -->
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'account'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "account")}
          >
            <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
          </li>
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'orders'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "orders")}
          >
            <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
          </li>
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'shopRequest'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "shopRequest")}
          >
            <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
          </li>
        </ul>
      </div>

      <div class="flex-1 p-4">
        {#if activeMenu === "account"}
          <h1 class="text-2xl font-semibold mb-4">บัญชีผู้ใช้</h1>
          <img
            src={user.user_image}
            alt="Profile"
            class="w-24 h-24 rounded-full"
          />
          <h1>ชื่อบัญชี: {user.user_name}</h1>
          <h1>ชื่อจริง: {user.user_firstname} {user.user_lastname}</h1>
          <h1>อีเมลผู้ใช้: {user.user_email}</h1>
          <form
            on:submit={updateUser}
            class="bg-white p-6 rounded-lg shadow-md"
          >
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name">ชื่อบัญชี:</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={user?.user_name ?? ""}
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email">อีเมล:</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={user?.user_email ?? ""}
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="pass">รหัสผ่าน:</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="pass"
                type="txt"
                name="pass"
                value=""
              />
            </div>
            <button
              type="submit"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              บันทึก
            </button>
          </form>
        {:else if activeMenu === "orders"}
          <h1 class="text-2xl font-semibold mb-4">คำสั่งซื้อของฉัน</h1>
          {#if orders.length === 0}
            <p>ไม่มีคำสั่งซื้อในขณะนี้</p>
          {:else}
            <div class="bg-white rounded-lg shadow-md overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-left">Order ID</th>
                    <th class="py-2 px-4 text-left">วันที่</th>
                    <th class="py-2 px-4 text-left">สถานะ</th>
                    <th class="py-2 px-4 text-left">ยอดรวม</th>
                    <th class="py-2 px-4 text-left">รายการ</th>
                  </tr>
                </thead>
                <tbody>
                  {#each orders as order (order.id)}
                    <tr class="border-b">
                      <td class="py-2 px-4">{order.id}</td>
                      <td class="py-2 px-4">{formatDate(order.date)}</td>
                      <td class="py-2 px-4 {getStatusColor(order.status)}">
                        {order.status}
                      </td>
                      <td class="py-2 px-4">
                        {order.total.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                        })}
                      </td>
                      <td class="py-2 px-4">
                        <ul>
                          {#each order.items as item}
                            <li>
                              {item.name} (x{item.quantity}) -
                              {item.price.toLocaleString("th-TH", {
                                style: "currency",
                                currency: "THB",
                              })}
                            </li>
                          {/each}
                        </ul>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        {:else if activeMenu === "shopRequest"}
          <h1 class="text-2xl font-semibold mb-4">การขอเปิดร้านค้า</h1>
          <form
            on:submit={submitShopRequest}
            class="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <div>
              <label
                for="qrCode"
                class="block text-sm font-medium text-gray-700"
                >รูป QR Code:</label
              >
              <input
                type="file"
                id="qrCode"
                accept="image/*"
                on:change={(e) => handleFileUpload(e, "qr")}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {#if qrCodeImage}
                <img
                  src={qrCodeImage}
                  alt="QR Code Preview"
                  class="mt-2 h-24"
                />
              {/if}
            </div>
            <div>
              <label
                for="idCard"
                class="block text-sm font-medium text-gray-700"
                >รูปบัตรประชาชน:</label
              >
              <input
                type="file"
                id="idCard"
                accept="image/*"
                on:change={(e) => handleFileUpload(e, "id")}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {#if idCardImage}
                <img
                  src={idCardImage}
                  alt="ID Card Preview"
                  class="mt-2 h-24"
                />
              {/if}
            </div>
            <button
              type="submit"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ส่งคำขอ
            </button>
          </form>
          {/if}
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
