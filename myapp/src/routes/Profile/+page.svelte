<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils";

  // --- State & Variables ---
  let user: any = {};
  let address = "คุณยังไม่ได้ระบุที่อยู่ใดๆ";
  let activeMenu = "account"; // Start on sellerRequests
  let userToken: string | null;
  let qrCodeImage: string | null = null;
  let idCardImage: string | null = null;
  let isOpen = false; // For mobile menu
  let banSearchTerm: string = ""; // Search input
  let filteredUsers: any[] = [];   // Store filtered search result
  let users: any[] = [];           // All users (for ban management)

  // --- Modal State ---
  let showModal = false;
  let currentRequest: SellerRequest | null = null;

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

  // --- Seller Requests Data (Mockup) ---
  interface SellerRequest {
    id: number;
    user_name: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    shopName: string;
    shopDescription: string;
    status: "pending" | "approved" | "rejected";
    qrCode: string;
    idCard: string;
    token: string;
  }

  // Mockup data
  let sellerRequests: SellerRequest[] = [
    {
      id: 1,
      user_name: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "0812345678",
      age: 30,
      shopName: "John's Bookstore",
      shopDescription:
        "A cozy bookstore with a wide selection of new and used books.",
      status: "pending",
      qrCode: "https://example.com/qrcode1.png", // Use example URLs
      idCard: "https://example.com/idcard1.jpg", // Use example URLs
      token: "token_user1",
    },
    {
      id: 2,
      user_name: "user2",
      name: "Jane Smith",
      email: "jane.smith@example.net",
      phone: "0898765432",
      age: 25,
      shopName: "Jane's Crafts",
      shopDescription: "Handmade crafts and gifts for all occasions.",
      status: "pending",
      qrCode: "https://example.com/qrcode2.png",
      idCard: "https://example.com/idcard2.jpg",
      token: "token_user2",
    },
    {
      id: 3,
      user_name: "user3",
      name: "Peter Jones",
      email: "peter.jones@example.org",
      phone: "0876543210",
      age: 42,
      shopName: "Peter's Tech Shop",
      shopDescription: "Your one-stop shop for all your tech needs.",
      status: "approved",
      qrCode: "https://example.com/qrcode3.png",
      idCard: "https://example.com/idcard3.jpg",
      token: "token_user3",
    },
    {
      id: 4,
      user_name: "user4",
      name: "Mary Brown",
      email: "mary.brown@example.co.uk",
      phone: "0865432109",
      age: 35,
      shopName: "Mary's Boutique",
      shopDescription: "Fashionable clothing and accessories for women.",
      status: "rejected",
      qrCode: "https://example.com/qrcode4.png",
      idCard: "https://example.com/idcard4.jpg",
      token: "token_user4",
    },
    {
      id: 5,
      user_name: "user5",
      name: "Michael Davis",
      email: "michael.davis@example.com",
      phone: "0854321098",
      age: 28,
      shopName: "Michael's Sports Gear",
      shopDescription: "High-quality sports equipment and apparel.",
      status: "pending",
      qrCode: "https://example.com/qrcode5.png",
      idCard: "https://example.com/idcard5.jpg",
      token: "token_user5",
    },
  ];

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

  function getSellerStatusColor(status: "pending" | "approved" | "rejected") {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  }


    // Get all user (for ban management)
  async function getAllUsers() {
    try {
      // Assuming you have an endpoint like /admin/users to fetch all users
      const response = await fetch("http://localhost:3000/admin/users", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`, // Send admin token for authorization
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      users = await response.json();
      filteredUsers = [...users]; // Initialize filteredUsers with all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }


  //Comment out during use mockup data.
  // async function getSellerRequests() {
  //  ...
  // }

  // --- Event Handlers ---

  async function updateUser(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedUserData = {
      user_name: formData.get("name"),
      date_of_birth: formData.get("dob"),
      Gender: formData.get("gender"),
      user_email: formData.get("email"),
    };
    try {
      const token = userToken;
      if (!token) return;

      const response = await fetch(
        "http://localhost:3000/user/updateUserProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, ...updatedUserData }),
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
  async function updateAddress(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newAddress = form.address.value;

    try {
      if (!userToken) return;
      const response = await fetch("http://localhost:3000/user/updateAddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userToken, address: newAddress }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      address = newAddress;
      alert("อัปเดตที่อยู่สำเร็จ!");
    } catch (error) {
      console.error("Error updating address:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตที่อยู่");
    }
  }
  // --- Search Functionality ---
  function searchUsers() {
    const term = banSearchTerm.toLowerCase();
    filteredUsers = users.filter(
      (user) =>
        user.user_name.toLowerCase().includes(term) || // Search by username
        user.id.toString().includes(term), // Search by user ID
    );
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

  // --- Approve/Deny Seller Request ---
  async function handleSellerAction(
    requestId: number,
    action: "approve" | "reject",
    token: string,
  ) {
    try {
       // Call the backend API to approve/reject
      const response = await fetch(`http://localhost:3000/admin/seller-requests/${requestId}/${action}`, {
        method: 'PUT', // Or POST, depending on your API
        headers: {
          'Authorization': `Bearer ${userToken}`,  // Use the ADMIN's token here
          'Content-Type': 'application/json',
        },
        // You might not need a body, or you might send { reason: "..." }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update local state ONLY after successful API call
      sellerRequests = sellerRequests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: action === "approve" ? "approved" : "rejected",
          };
        }
        return req;
      });

      alert(`Seller request ${action}ed successfully!`);


    } catch (error) {
      console.error(`Error ${action}ing seller request:`, error);
      alert(`Failed to ${action} seller request.`);
    }
  }

  // --- Ban User ---
async function banUser(userId: number) {
  try {
    if (!userToken) {
      return; // Or show an error
    }

    const response = await fetch(`http://localhost:3000/admin/users/${userId}/ban`, {
      method: "PUT", // Or POST
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ reason: "Some reason" }),  // Optional: Add if needed
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    users = users.map((u) =>
      u.id === userId ? { ...u, is_banned: true } : u
    );
     filteredUsers = filteredUsers.map((u) =>
      u.id === userId ? { ...u, is_banned: true } : u
    );

    alert("User banned successfully!");
  } catch (error) {
    console.error("Error banning user:", error);
    alert("Failed to ban user.");
  }
}

  // --- Unban User ---
  async function unbanUser(userId: number) {
    try {
      if (!userToken) {
          return; // Or show an error
      }
      const response = await fetch(`http://localhost:3000/admin/users/${userId}/unban`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      users = users.map(u => u.id === userId ? { ...u, is_banned: false } : u);
      filteredUsers = filteredUsers.map(u => u.id === userId ? { ...u, is_banned: false} : u);

      alert("User unbanned successfully!");
    } catch(error) {
      console.error("Error unbanning user:", error);
      alert("Failed to unban user.");
    }
  }


  // --- Modal Functions ---

  function openModal(request: SellerRequest) {
    currentRequest = request;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    currentRequest = null;
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
    if (userToken) { // Only fetch if logged in as admin
      await getAllUsers();
    }

    // await getSellerRequests(); //Comment out during use mockup data.
    page.subscribe(($page) => {});
  });
</script>
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
             {#if user.user_permission === "Manager"}
            <li
              class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
              'sellerRequests'
                ? 'bg-blue-900 text-white'
                : 'text-white'}"
              on:click={() => {
                activeMenu = "sellerRequests";
                closeMenu();
              }}
            >
              <i class="fa-solid fa-user-check mr-2"></i>ยืนยันการเปิดร้าน
            </li>
            <li
              class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
              'account'
                ? 'bg-blue-900 text-white'
                : 'text-white'}"
              on:click={() => {
                activeMenu = "account";
                closeMenu();
              }}
            >
            <i class="fa-solid fa-ban mr-2"></i>จัดการการแบน
          </li>
          {/if}
            <li>
              <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
            </li>
            <li
              class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
              'address'
                ? 'bg-blue-900 text-white'
                : 'text-white'}"
              on:click={() => {
                activeMenu = "address";
                closeMenu();
              }}
            >
            </li>
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
            >
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
        <!--admin-->
        {#if user.user_permission === "Manager"}
        <li
          class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
          'sellerRequests'
            ? 'bg-blue-900 text-white'
            : 'text-white'}"
          on:click={() => (activeMenu = "sellerRequests")}
        >
          <i class="fa-solid fa-user-check mr-2"></i>ยืนยันการเปิดร้าน
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
        >
          <i class="fa-solid fa-ban mr-2"></i>จัดการการแบน
        </li>
        {/if}
      </ul>
    </div>

    <!-- Content Area -->
    <div class="flex-1 p-4">
      {#if activeMenu === "account"}
        <h1 class="text-2xl font-semibold mb-4">บัญชีผู้ใช้</h1>
        <img src={user.user_image} alt="Profile" class="w-24 h-24 rounded-full" />
        <h1>ชื่อบัญชี: {user.user_name}</h1>
        <h1>ชื่อจริง: {user.user_firstname} {user.user_lastname}</h1>
        <h1>อีเมลผู้ใช้: {user.user_email}</h1>
        <form on:submit={updateUser} class="bg-white p-6 rounded-lg shadow-md">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
              >ชื่อ:</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={user?.user_name ?? ""}
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="dob"
              >วันเกิด:</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dob"
              type="date"
              name="dob"
              value={user?.date_of_birth
                ? user.date_of_birth.split("T")[0]
                : ""}
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="gender">เพศ:</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="gender"
              type="text"
              name="gender"
              value={user?.Gender ?? ""}
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
            <label for="qrCode" class="block text-sm font-medium text-gray-700"
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
              <img src={qrCodeImage} alt="QR Code Preview" class="mt-2 h-24" />
            {/if}
          </div>
          <div>
            <label for="idCard" class="block text-sm font-medium text-gray-700"
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
              <img src={idCardImage} alt="ID Card Preview" class="mt-2 h-24" />
            {/if}
          </div>
          <button
            type="submit"
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ส่งคำขอ
          </button>
        </form>
      {:else if activeMenu === "sellerRequests"}
        <h1 class="text-2xl font-semibold mb-4">ยืนยันการเปิดร้าน</h1>
        {#if sellerRequests.length === 0}
          <p>ไม่มีคำขอเปิดร้านค้าในขณะนี้</p>
        {:else}
          <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-left">Username</th>
                  <th class="py-2 px-4 text-left">Name</th>
                  <th class="py-2 px-4 text-left">Email</th>
                  <th class="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each sellerRequests as request (request.id)}
                  <tr class="border-b">
                    <td class="py-2 px-4">{request.user_name}</td>
                    <td class="py-2 px-4">{request.name}</td>
                    <td class="py-2 px-4">{request.email}</td>
                    <td class="py-2 px-4">
                      <button
                        on:click={() => openModal(request)}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >Detail</button
                      >
                      {#if request.status === "pending"}
                        <button
                          on:click={() =>
                            handleSellerAction(
                              request.id,
                              "approve",
                              request.token,
                            )}
                          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                          >Approve</button
                        >
                        <button
                          on:click={() =>
                            handleSellerAction(
                              request.id,
                              "reject",
                              request.token,
                            )}
                          class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          >Deny</button
                        >
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>

          </div>
          
        {/if}
        {:else if activeMenu === "banManagement"}
    <h1 class="text-2xl font-semibold mb-4">จัดการผู้ใช้ (แบน/ปลดแบน)</h1>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        type="text"
        bind:value={banSearchTerm}
        on:input={searchUsers}
        placeholder="ค้นหาด้วยชื่อผู้ใช้ หรือ ID"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    <!-- User List Table -->
    <div class="bg-white rounded-lg shadow-md overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-100">
                <th class="py-2 px-4 text-left">ID</th>
                <th class="py-2 px-4 text-left">Username</th>
                <th class="py-2 px-4 text-left">Email</th>
                <th class="py-2 px-4 text-left">Status</th>
                <th class="py-2 px-4 text-left">Actions</th>
            </tr>
        </thead>
        <tbody>
           {#each filteredUsers as user (user.id)}
            <tr class="border-b">
                <td class="py-2 px-4">{user.id}</td>
                <td class="py-2 px-4">{user.user_name}</td>
                <td class="py-2 px-4">{user.user_email}</td>
                <td class="py-2 px-4">
                  {#if user.is_banned}
                    <span class="text-red-500">Banned</span>
                  {:else}
                    <span class="text-green-500">Active</span>
                  {/if}
                </td>
                <td class="py-2 px-4">
                  {#if user.is_banned}
                    <button on:click={() => unbanUser(user.id)} class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Unban</button>
                  {:else}
                    <button on:click={() => banUser(user.id)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Ban</button>
                  {/if}
                </td>
            </tr>
           {/each}
        </tbody>
        </table>
    </div>
      {/if}
    </div>
  </div>

  <!-- Modal -->
  {#if showModal && currentRequest}
    <div
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true">​</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Registration Details
                </h3>
                <div class="mt-2">
                  <p><strong>Username:</strong> {currentRequest.user_name}</p>
                  <p><strong>Name:</strong> {currentRequest.name}</p>
                  <p><strong>Email:</strong> {currentRequest.email}</p>
                  <p><strong>Phone:</strong> {currentRequest.phone}</p>
                  <p><strong>Age:</strong> {currentRequest.age}</p>
                  <p><strong>Shop Name:</strong> {currentRequest.shopName}</p>
                  <p>
                    <strong>Shop Description:</strong>
                    {currentRequest.shopDescription}
                  </p>
                  <p><strong>Status:</strong> {currentRequest.status}</p>

                  <div class="mt-4">
                    <p><strong>ID Card:</strong></p>
                    <img
                      src={currentRequest.idCard}
                      alt="ID Card"
                      class="w-64 h-48 object-cover mb-4"
                    />

                    <p><strong>QR Code:</strong></p>
                    <img
                      src={currentRequest.qrCode}
                      alt="QR Code"
                      class="w-48 h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              on:click={closeModal}
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
