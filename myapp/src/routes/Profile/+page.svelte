<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils"; // Make sure this path is correct
  import { writable } from "svelte/store";

  // --- State & Variables ---
  const isLoading = writable(true);
  let user: any = {};
  let activeMenu = "account"; // Start on account
  let userToken: string | null;
  let qrCodeImage: string | null = null;
  let idCardImage: string | null = null;
  let isOpen = false; // For mobile menu
  let expandedOrderId = null;

  // --- Orders Data ---
  let orders: any[] = []; //  Use any[] for more flexibility
  let seller_orders: any[] = []; // Use any[]

  // --- Helper Functions ---

  function formatDate(dateString: string) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "รอการชำระเงิน":
        return "text-yellow-500";
      case "กำลังดำเนินการ": // Added to handle new status
        return "text-blue-500";
      case "จัดส่งแล้ว":
        return "text-green-500";
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
          `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"
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

  // --- Order Details Toggle ---
  function toggleOrderDetails(orderId: string | number) {
    // Use type assertion since expandedOrder can be string | number | null
    expandedOrderId = expandedOrderId === orderId ? null : orderId;
  }

  // --- Image Upload for Orders (Publisher) ---
  let fileInputs = {};  // Store file input refs per orderId
  let base64Images = {}; // Store Base64 strings per orderId

  // --- Image Upload for Orders (Seller) ---
  let fileInputsSeller = {};
  let base64ImagesSeller = {};


  function handleFileChangeOrder(orderId: string | number, event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (!file) {
      base64Images = { ...base64Images, [orderId]: "" }; // Clear if no file
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      base64Images = { ...base64Images, [orderId]: "" }; // Clear if no file
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; // Clear input
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds the limit (5MB).");
      base64Images = { ...base64Images, [orderId]: "" }; // Clear if no file
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; // Clear input
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Use object spread for immutability
      base64Images = { ...base64Images, [orderId]: reader.result as string };
    };
    reader.onerror = () => {
      base64Images = { ...base64Images, [orderId]: "" };
      alert("Error reading file.");
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; // Clear input
      }
    };
    reader.readAsDataURL(file);
  }


  async function uploadSlip(orderId: string | number) {
    if (!base64Images[orderId]) {
      alert("Please select a payment slip image.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/shop/publisher/payment/upload-proof",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            payment_slip: base64Images[orderId],
            // payment_time: new Date().toISOString()  // No need, backend handles this
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Failed to upload payment proof.";
        alert(errorMessage);
        return;
      }

      // Success!  Update UI (e.g., refetch orders, show a message)
      alert("Payment proof submitted successfully!");

      // Find the order in the 'orders' array and update its status *and* payment_slip
      orders = orders.map(order => {
        if (order.order_id === orderId) {
          return { ...order, payment_slip: base64Images[orderId], order_status: "กำลังดำเนินการ" }; //Update status
        }
        return order;
      });
      base64Images = { ...base64Images, [orderId]: "" }; //clear image
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = "";  //clear input
      }

    } catch (error) {
      console.error("Error uploading slip:", error);
      alert(`Error: ${error.message}`); // Display error to user
    }
  }



  function handleFileChangeOrderSeller(orderId: string | number, event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (!file) {
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds the limit (5MB).");
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      base64ImagesSeller = {
        ...base64ImagesSeller,
        [orderId]: reader.result as string,
      };
    };
    reader.onerror = () => {
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      alert("Error reading file.");
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";
      }
    }
    reader.readAsDataURL(file);
  }

  async function uploadSlipSeller(orderId: string | number) {
    if (!base64ImagesSeller[orderId]) {
      alert("Please select a payment slip image.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/shop/seller/payment/upload-proof",  // Correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_order_id: orderId,
            payment_slip: base64ImagesSeller[orderId],
            // payment_time: new Date().toISOString() // Let the backend handle this
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to upload payment proof.";
        alert(errorMessage);
        return;
      }

      alert("Payment proof submitted successfully!");

      // Update seller_orders, similar to how we update 'orders'
      seller_orders = seller_orders.map((order) => {
        if (order.order_id === orderId) {
          return {
            ...order,
            payment_slip: base64ImagesSeller[orderId],
            order_status: "กำลังดำเนินการ" // Or whatever status you want
          };
        }
        return order;
      });
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" }; //clear image
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";  //clear input
      }

    } catch (error) {
      console.error("Error uploading slip (seller):", error);
      alert(`Error: ${error.message}`);
    }
  }


  // --- Fetch Orders ---
  async function getOrder() {
    try {
      const response = await fetch(
        `http://localhost:3000/shop/publisher/order?token=${userToken}`,
      );
      if (!response.ok) {
        throw new Error(`Publisher API Error: ${response.status} - ${await response.text()}`);
      }
      const publisherData = await response.json();
      orders = publisherData;

    } catch (err) {
      orders = [];
    }
    try {
      const response2 = await fetch(
        `http://localhost:3000/shop/seller/order?token=${userToken}`,
      );
      if (!response2.ok) {
        throw new Error(`Seller API Error: ${response2.status} - ${await response2.text()}`);
      }
      const sellerData = await response2.json();
      seller_orders = sellerData;

    } catch (err) {
      seller_orders = [];
    }
  }

  // --- Lifecycle Hook ---
  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    if (!userToken) {
      goto("/login"); // Redirect to login if no token
      return;
    }
    try {
      const userData = await getUser(userToken);
      if (userData) {
        user = userData;
        user.user_name = user.user_name || "N/A";
        user.user_firstname = user.user_firstname || "N/A";
        user.user_lastname = user.user_lastname || "N/A";
        user.user_email = user.user_email || "N/A";
        user.user_image = user.user_image || "/placeholder-profile.png"; // Default image
      } else {
        // Handle case where getUser returns null (e.g., invalid token)
        console.error("Failed to fetch user data");
        goto("/login"); // Redirect to login
        return;
      }
    }
    catch (error) {
      console.error("On mount error", error);
      goto("/login");
      return;
    }

    await getOrder();
    isLoading.set(false);
  });
</script>

{#if !$isLoading}
<div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row">
            <!-- Sidebar (Mobile) -->
            <div class="md:hidden">
                <button on:click={toggleMenu} class="text-blue-600 hover:text-blue-800 focus:outline-none">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
                {#if isOpen}
                <div class="absolute bg-blue-600 w-64 rounded-lg shadow-lg p-4 z-10">
                    <button on:click={closeMenu} class="text-white text-right block w-full">
                        <i class="fa-solid fa-times"></i>
                    </button>
                    <ul class="mt-4 space-y-2">
                        <li class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                  'account'
                    ? 'bg-blue-800 text-white'
                    : 'text-white'}" on:click={() => {
                    activeMenu = "account";
                    closeMenu();
                  }}>
                            <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
                        </li>
                        <li class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                  'orders'
                    ? 'bg-blue-800 text-white'
                    : 'text-white'}" on:click={() => {
                    activeMenu = "orders";
                    closeMenu();
                  }}>
                            <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
                        </li>
                        <li class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                  'shopRequest'
                    ? 'bg-blue-800 text-white'
                    : 'text-white'}" on:click={() => {
                    activeMenu = "shopRequest";
                    closeMenu();
                  }}>
                            <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
                        </li>
                    </ul>
                </div>
                {/if}
            </div>

            <!-- Sidebar (Desktop) -->
            <div class="hidden md:block w-64 bg-blue-600 rounded-lg shadow-lg p-4 mr-4">
                <h2 class="text-lg font-semibold text-white mb-4">บัญชีของฉัน</h2>
                <ul class="space-y-2">
                    <li class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'account'
                ? 'bg-blue-800 text-white'
                : 'text-white'}" on:click={() => (activeMenu = "account")}>
                        <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
                    </li>
                    <li class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'orders'
                ? 'bg-blue-800 text-white'
                : 'text-white'}" on:click={() => (activeMenu = "orders")}>
                        <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
                    </li>
                    <li class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'shopRequest'
                ? 'bg-blue-800 text-white'
                : 'text-white'}" on:click={() => (activeMenu = "shopRequest")}>
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
                        <img src={user.user_image} alt="Profile" class="w-20 h-20 rounded-full mr-4" />
                        <div>
                            <p class="text-lg font-medium">
                                ชื่อบัญชี: <span class="font-normal">{user.user_name}</span>
                            </p>
                            <p class="text-gray-600">
                                ชื่อจริง: {user.user_firstname} {user.user_lastname}
                            </p>
                            <p class="text-gray-600">อีเมล: {user.user_email}</p>
                        </div>
                    </div>

                    <form on:submit={updateUser} class="mt-6">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                                ชื่อบัญชี:
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="name" type="text" name="name" value={user?.user_name ?? ""} />
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                                อีเมล:
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="email" type="text" name="email" value={user?.user_email ?? ""} />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="pass">
                                รหัสผ่าน:
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="pass" type="password" name="pass" placeholder="********" />
                            <p class="text-xs text-gray-500 mt-1">
                                ปล่อยว่างไว้ หากไม่ต้องการเปลี่ยนรหัสผ่าน
                            </p>
                        </div>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            บันทึก
                        </button>
                    </form>
                </div>
                {:else if activeMenu === "orders"}
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h1 class="text-2xl font-semibold mb-4">คำสั่งซื้อของฉัน</h1>

                    {#if orders.length === 0 && seller_orders.length === 0}
                    <p class="text-gray-600">ไม่มีคำสั่งซื้อในขณะนี้</p>
                    {:else}
                    {#if orders.length > 0}
                    <h2 class="text-lg font-semibold mb-2">Publisher Orders</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">วันที่</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">สถานะ</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">ยอดรวม</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">การจ่ายเงิน</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each orders as order (order.order_id)}
                                <tr class="border-b">
                                    <td class="py-2 px-4 text-sm">{order.order_id}</td>
                                    <td class="py-2 px-4 text-sm">{formatDate(order.order_time)}</td>
                                    <td class="py-2 px-4 text-sm {getStatusColor(order.order_status)}">{order.order_status}</td>
                                    <td class="py-2 px-4 text-sm">{formatCurrency(order.total_price)}</td>
                                    <td class="py-2 px-4 text-sm">
                                        {#if order.payment_slip}
                                        <span class="text-green-500">ส่งสลิปแล้ว</span>
                                        {:else}
                                        <input type="file" accept="image/*" bind:this={fileInputs[order.order_id]} on:change={(event) => handleFileChangeOrder(order.order_id, event)} />
                                        <button on:click|stopPropagation={() => uploadSlip(order.order_id)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1">Upload</button>
                                        {/if}
                                    </td>
                                    <td class="py-2 px-4"><button on:click={() => toggleOrderDetails(order.order_id)} class="text-blue-500 hover:underline">
                                            {expandedOrderId === order.order_id ? 'Hide Details' : 'Show Details'}
                                        </button></td>
                                </tr>
                                {#if expandedOrderId === order.order_id}
                                <tr>
                                    <td colspan="6" class="p-4 bg-gray-50">
                                        {#if base64Images[order.order_id]}
                                        <img src={base64Images[order.order_id]} alt="Uploaded Slip" style="max-width: 200px;" />
                                        {/if}
                                        <!-- Display other order details here -->
                                        <p>Fullname: {order.fullname}</p>
                                        <p>Email: {order.email}</p>
                                        <p>Phone: {order.phone}</p>
                                        <p>Address: {order.address}</p>
                                        {#each order.items as item}
                                        <div class="mb-2 border-b pb-2 flex items-start">
                                            <div>
                                                <p class="font-semibold">
                                                    {item.book_name_th}
                                                </p>
                                                <p>
                                                    <span class="font-semibold">Price:</span>
                                                    {formatCurrency(item.book_price)} x {item.amount}
                                                </p>
                                                <p>
                                                    <span class="font-semibold">Total:</span>
                                                    {formatCurrency(
                                          item.book_price * item.amount,
                                        )}
                                                </p>
                                            </div>
                                        </div>
                                        {/each}
                                    </td>
                                </tr>
                                {/if}
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    {/if}

                    {#if seller_orders.length > 0}
                    <h2 class="text-lg font-semibold mb-2 mt-6">Seller Orders</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">วันที่</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">สถานะ</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">ยอดรวม</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">การจ่ายเงิน</th>
                                    <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each seller_orders as order (order.order_id)}
                                <tr class="border-b">
                                    <td class="py-2 px-4 text-sm">{order.order_id}</td>
                                    <td class="py-2 px-4 text-sm">{formatDate(order.order_time)}</td>
                                    <td class="py-2 px-4 text-sm {getStatusColor(order.order_status)}">{order.order_status}</td>
                                    <td class="py-2 px-4 text-sm">{formatCurrency(order.total_price)}</td>
                                    <td class="py-2 px-4 text-sm">
                                        {#if order.payment_slip}
                                        <span class="text-green-500">ส่งสลิปแล้ว</span>
                                        {:else}
                                        <input type="file" accept="image/*" bind:this={fileInputsSeller[order.order_id]} on:change={(event) => handleFileChangeOrderSeller(order.order_id, event)} />
                                        <button on:click|stopPropagation={() => uploadSlipSeller(order.order_id)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1">
                                            Upload
                                        </button>
                                        {/if}
                                    </td>
                                    <td class="py-2 px-4"><button on:click={() => toggleOrderDetails(order.order_id)} class="text-blue-500 hover:underline">
                                            {expandedOrderId === order.order_id ? 'Hide Details' : 'Show Details'}
                                        </button></td>
                                </tr>

                                {#if expandedOrderId === order.order_id}
                                <tr>
                                    <td colspan="6">
                                         <div class="p-4 bg-gray-50">
                                        {#if base64ImagesSeller[order.order_id]}
                                        <img src={base64ImagesSeller[order.order_id]} alt="Uploaded Slip Seller" style="max-width: 200px;" />
                                       {/if}
                                       <!-- Display other order details here -->
                                        <p>Fullname: {order.fullname}</p>
                                        <p>Email: {order.email}</p>
                                        <p>Phone: {order.phone}</p>
                                        <p>Address: {order.address}</p>
                                        {#each order.items as item}
                                        <div class="mb-2 border-b pb-2 flex items-start">
                                            <div>
                                                <p class="font-semibold">
                                                    {item.book_name}
                                                </p>
                                                <p>
                                                    <span class="font-semibold">Price:</span>
                                                    {formatCurrency(item.book_price)} x {item.amount}
                                                </p>
                                                <p>
                                                    <span class="font-semibold">Total:</span>
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
                    {/if}
                </div>
                {:else if activeMenu === "shopRequest"}
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h1 class="text-2xl font-semibold mb-4">การขอเปิดร้านค้า</h1>
                    <form on:submit={submitShopRequest} class="space-y-4">
                        <div>
                            <label for="qrCode" class="block text-sm font-medium text-gray-700">
                                รูป QR Code:
                            </label>
                            <input type="file" id="qrCode" accept="image/*" on:change={(e) => handleFileUpload(e, "qr")} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            {#if qrCodeImage}
                            <img src={qrCodeImage} alt="QR Code Preview" class="mt-2 max-h-48" />
                            {/if}
                        </div>
                        <div>
                            <label for="idCard" class="block text-sm font-medium text-gray-700">
                                รูปบัตรประชาชน:
                            </label>
                            <input type="file" id="idCard" accept="image/*" on:change={(e) => handleFileUpload(e, "id")} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            {#if idCardImage}
                            <img src={idCardImage} alt="ID Card Preview" class="mt-2 max-h-48" />
                            {/if}
                        </div>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />