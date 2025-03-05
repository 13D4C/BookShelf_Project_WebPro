<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils";

  // --- State & Variables ---
  let user: any = {};
  let activeMenu = "sellerRequests"; // Start on sellerRequests
  let userToken: string | null;
  let isOpen = false; // For mobile menu
  let banSearchTerm: string = ""; // Search input
  let filteredUsers: any[] = []; // Store filtered search result
  let users: any[] = []; // All users (for ban management)

  // --- Modal State ---
  let showModal = false;
  let currentRequest: SellerRequest | null = null;
  let showReportModal = false; // Modal for report details
  let currentReport: Report | null | ReportSeller = null; // Current report for the modal
  let showOrderModal = false; // Modal for order details
  let currentOrder: Order | null = null; // Current order for modal
  let showBanModal = false;
  let showDeleteModal =false;

  // --- Seller Requests Data (Mockup) ---
  interface SellerRequest {
    user_id: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    status: string;
    qr_code: string
    proof_image: string;
  }

  // --- Report Data ---
  interface Report {
    book_report_id: number;
    reporter_id: number;
    report_reason: string;
    book_id: number;
    user_name: string;
    book_name_originl: string
    owner_id: number
    report_status: string;
  }

  interface ReportSeller {
    report_id: number;
    reporter_id: number;
    report_reason: string;
    seller_book_id: number;
    user_name: string;
    book_name: string
    owner_id: number
    report_status: string;
  }

  // --- Order Data (Mockup) ---
  interface Order {
    id: number;
    buyer_username: string;
    buyer_name: string;
    shop_name: string;
    order_date: string; // Use string for simplicity, consider Date in real app
    total_amount: number;
    status: "pending" | "confirmed" | "shipped" | "completed" | "cancelled";
    items: OrderItem[];
    payment_slip: string; // URL to payment slip image
  }

  interface OrderItem {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }

  // Mockup data (Keep this)
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

  let reports: Report[] = [];
  let reportsSeller: ReportSeller[] = [];

  
  // Temp Variables
  let manageUserId = null;
  let reason:any = null;

  // ban Variables
  let date:any;

  // --- Helper Functions ---
  // Get all user (for ban management)

  async function goDetail(book_id:any) {
    window.open(`/details/${book_id}`, "_blank");
  }

  async function goSellerDetail(seller_book_id:any) {
    window.open(`/marketdetails/${seller_book_id}`, "_blank");
  }

  async function getAllUsers() {
    try {
      // Assuming you have an endpoint like /admin/users to fetch all users
      const response = await fetch("http://localhost:3000/user");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      users = await response.json();
      filteredUsers = [...users]; // Initialize filteredUsers with all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  // Get all report
  async function getReport() {
    try {
      const response = await fetch("http://localhost:3000/report/book/publisher/get");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      let reportInfo = data.report;
      reports = reportInfo;
    }
    catch (error) {
      console.log("Error fetching report:", error)
    }
  }

  async function getSellerReport() {
    try {
      const response = await fetch("http://localhost:3000/report/book/seller/get");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      let reportInfo = data.report;
      reportsSeller = reportInfo;

    }
    catch (error) {
      console.log("Error fetching report:", error)
    }
  }

  async function approveReportBook(report_id:any) {
    try {
      console.log(report_id);
      const response = await fetch(`http://localhost:3000/report/book/publisher/approve/${report_id}`);
      if (!response.ok) {
        alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
        return;
      }
      alert("จัดการรายงานเสร็จสิ้น");
    }
    catch {
      alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
    }
    finally{
      await getReport();
    }
  }

  async function rejectReportBook(report_id:any) {
    try {
      console.log(report_id);
      const response = await fetch(`http://localhost:3000/report/book/publisher/reject/${report_id}`);
      if (!response.ok) {
        alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
        return;
      }
      alert("เพิกเฉยรายงานเสร็จสิ้น");
    }
    catch {
      alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
    }
    finally{
      await getReport();
    }
  }

  async function approveReportSeller(report_id:any) {
    try {
      console.log(report_id);
      const response = await fetch(`http://localhost:3000/report/book/seller/approve/${report_id}`);
      if (!response.ok) {
        alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
        return;
      }
      alert("จัดการรายงานเสร็จสิ้น");
    }
    catch {
      alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
    }
    finally{
      await getSellerReport();
    }
  }

  async function rejectReportSeller(report_id:any) {
    try {
      console.log(report_id);
      const response = await fetch(`http://localhost:3000/report/book/seller/reject/${report_id}`);
      if (!response.ok) {
        alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
        return;
      }
      alert("เพิกเฉยรายงานเสร็จสิ้น");
    }
    catch {
      alert("ไม่สามารถทำรายการได้ในขณะโปรดลองอีกครั้งภายหลัง");
    }
    finally{
      await getSellerReport();
    }
  }


  //Comment out during use mockup data.
  // async function getSellerRequests() {
  //  ...
  // }

  // --- Event Handlers ---
  // --- Search Functionality ---
  function searchUsers() {
    const term = banSearchTerm.toLowerCase();
    filteredUsers = users.filter(
      (user) =>
        user.user_name.toLowerCase().includes(term) || // Search by username
        user.user_id.toString().includes(term), // Search by user ID
    );
  }

  // --- Approve/Deny Seller Request ---
  async function handleSellerAction(
    requestId: number,
    action: "approve" | "reject",
    token: string,
  ) {
    try {
      // Call the backend API to approve/reject
      const response = await fetch(
        `http://localhost:3000/admin/seller-requests/${requestId}/${action}`,
        {
          method: "PUT", // Or POST, depending on your API
          headers: {
            Authorization: `Bearer ${userToken}`, // Use the ADMIN's token here
            "Content-Type": "application/json",
          },
          // You might not need a body, or you might send { reason: "..." }
        },
      );

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
  async function banUser() {
    try {
      if (!userToken) {
        return; // Or show an error
      }

      const response = await fetch(`http://localhost:3000/user/manage/ban`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
        { 
            token: userToken,
            user_id: manageUserId!,
            reason: reason,
            user_unban_time: date

        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      users = users.map((u) =>
        u.user_id === manageUserId! ? { ...u, user_status: "Banned" } : u
      );
      filteredUsers = filteredUsers.map((u) =>
        u.user_id === manageUserId! ? { ...u, user_status: "Banned" } : u
      );
      manageUserId = null;
      date = null;
      reason = null;
      closeBanModal();
      alert("User banned successfully!");
    } catch (error) {
      manageUserId = null;
      reason = null;
      date = null;
      console.error("Error banning user:", error);
      alert("Failed to ban user.");
    }
  }

  // --- Unban User ---
  async function unbanUser(user_id:any) {
      try {
        if (!userToken) {
            return; // Or show an error
        }
        const response = await fetch(`http://localhost:3000/user/manage/unban`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
          { 
              token: userToken,
              user_id: user_id,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        users = users.map((u) =>
        u.user_id === user_id! ? { ...u, user_status: "Normal" } : u
        );
        filteredUsers = filteredUsers.map((u) =>
          u.user_id === user_id! ? { ...u, user_status: "Normal" } : u
        );

        alert("User unbanned successfully!");
      } catch(error) {
        console.error("Error unbanning user:", error);
        alert("Failed to unban user.");
      }
  }

  // --- Delete User ---
async function deleteUser() {
  try {
    if (!userToken) {
      return; // Or show an error
    }
    if(!reason) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const response = await fetch(`http://localhost:3000/user/manage/delete`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
      { 
          token: userToken,
          user_id: manageUserId!,
          reason: reason,
      }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    users = users.filter((u) => u.user_id !== manageUserId!);
    filteredUsers = filteredUsers.filter((u) => u.user_id !== manageUserId!);
    manageUserId = null;
    reason = null;
    closeDeleteModal();
    alert("User Delete successfully!");
  } catch (error) {
    manageUserId = null;
    reason = null;
    console.error("Error delete user:", error);
    alert("Failed to delete user.");
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

  // --- Report Modal Functions ---
  function openReportModal(report: Report) {
    currentReport = report;
    showReportModal = true;
  }

  function closeReportModal() {
    showReportModal = false;
    currentReport = null;
  }

  // --- Manage user Modal Functions ---
  async function openBanModal(user_id:any){
      manageUserId = await user_id;
      showBanModal = true;
    }

    function closeBanModal(){
      manageUserId = null;
      reason = null;
      date = null;
      showBanModal = false;
    }

    async function openDeleteModal(user_id:any){
      manageUserId = await user_id;
      showDeleteModal = true;
    }

    function closeDeleteModal(){
      manageUserId = null;
      reason = null;
      showDeleteModal = false;
    }

  async function handleReportReview(reportId: number) {
    // In a real application, you would make an API call here
    // For this example, we're just updating the local state
    try {
      //Simulate API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true });
        }, 500);
      });

      if (!response.ok) {
        throw new Error("Simulated HTTP error");
      }
      reports = reports.map((report) => {
        if (report.book_report_id === reportId) {
          return { ...report, report_status: "reviewed" };
        }
        return report;
      });
      closeReportModal();
      alert("Report marked as reviewed.");
    } catch (error) {
      console.error("Error marking report as reviewed:", error);
      alert("Failed to mark report as reviewed");
    }
  }

  // --- Order Modal Functions ---
  function openOrderModal(order: Order) {
    currentOrder = order;
    showOrderModal = true;
  }

  function closeOrderModal() {
    showOrderModal = false;
    currentOrder = null;
  }

  // --- Confirm Order ---
  async function confirmOrder(orderId: number) {
    try {
      // Simulate API call to confirm order
      const response = await new Promise<{ ok: boolean; status?: string }>(
        (resolve) => {
          setTimeout(() => {
            // Simulate success, but could also simulate failure
            resolve({ ok: true, status: "confirmed" }); // Add a status to the response
          }, 500);
        },
      );

      if (!response.ok) {
        throw new Error("Simulated HTTP error");
      }

      // Update local state *only* if the API call was successful
      orders = orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: response.status || "confirmed",
          }; // Use updated status.  Default to "confirmed" if no status is in the response.
        }
        return order;
      });

      closeOrderModal();
      alert("Order confirmed successfully.");
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order");
    }
  }

  // --- Menu Toggle (Mobile) ---
  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

  // --- Lifecycle Hooks ---

  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    await getUser(userToken).then((data) => {
      user = data;
    });
    if (userToken) {
      // Only fetch if logged in as admin
      await getAllUsers();
      await getReport();
      await getSellerReport();
    }
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
              <li
                class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
                'reportManagement'
                  ? 'bg-blue-900 text-white'
                  : 'text-white'}"
                on:click={() => {
                  activeMenu = "reportManagement";
                  closeMenu();
                }}
              >
                <i class="fa-solid fa-flag mr-2"></i>ตรวจสอบรายงาน
              </li>
              <li
                class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
                'orderManagement'
                  ? 'bg-blue-900 text-white'
                  : 'text-white'}"
                on:click={() => {
                  activeMenu = "orderManagement";
                  closeMenu();
                }}
              >
                <i class="fa-solid fa-clipboard-check mr-2"></i>ตรวจสอบคำสั่งซื้อ
              </li>
            {/if}
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
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'reportManagement'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "reportManagement")}
          >
            <i class="fa-solid fa-flag mr-2"></i>ตรวจสอบรายงาน
          </li>
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'orderManagement'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "orderManagement")}
          >
            <i class="fa-solid fa-clipboard-check mr-2"></i>ตรวจสอบคำสั่งซื้อ
          </li>
        {/if}
      </ul>
    </div>

    <!-- Content Area -->
    <div class="flex-1 p-4">
      {#if activeMenu === "sellerRequests"}
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
        <h1 class="text-2xl font-semibold mb-4">
          จัดการผู้ใช้ (แบน/ปลดแบน)
        </h1>

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
              {#each filteredUsers as user (user.user_id)}
               <tr class="border-b">
                   <td class="py-2 px-4">{user.user_id}</td>
                   <td class="py-2 px-4">{user.user_name}</td>
                   <td class="py-2 px-4">{user.user_email}</td>
                   <td class="py-2 px-4">
                     {#if user.user_status == "Banned"}
                       <span class="text-red-500">เเบน</span>
                     {:else}
                       <span class="text-green-500">ปกติ</span>
                     {/if}
                   </td>
                   <td class="py-2 px-4">
                     {#if user.user_status == "Banned"}
                       <button on:click={() => unbanUser(user.user_id)} class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">ปลดเเบน</button>
                     {:else}
                       <button on:click={() => openBanModal(user.user_id)} class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded">เเบน</button>
                     {/if}
                     <button on:click={() => openDeleteModal(user.user_id)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">ลบบัญชี</button>
                   </td>
               </tr>
              {/each}
           </tbody>
          </table>
        </div>
      {:else if activeMenu === "reportManagement"}
        <h1 class="text-2xl font-semibold mb-4">ตรวจสอบรายงาน</h1>
        <h6 class="text-xl font-semibold mb-4 pt-5">เกี่ยวกับหนังสือของสำนักพิมพ์</h6>
        {#if reports.length === 0}
          <p>ไม่มีรายงานของสำนักพิมพ์ในขณะนี้</p>
        {:else}
          <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-left">Report ID</th>
                  <th class="py-2 px-4 text-left">Reporter</th>
                  <th class="py-2 px-4 text-left">Book</th>
                  <th class="py-2 px-4 text-left">Status</th>
                  <th class="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each reports as report (report.book_report_id)}
                  <tr class="border-b">
                    <td class="py-2 px-4">{report.book_report_id}</td>
                    <td class="py-2 px-4">{report.user_name}</td>
                    <td 
                      class="py-2 px-4 cursor-pointer hover:bg-gray-200 hover:text-blue-600"
                      on:click={() => goDetail(report.book_id)}
                    >{report.book_name_originl}</td>
                    <td class="py-2 px-4">
                      <button
                        on:click={() => openReportModal(report)}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >รายละเอียด</button
                      >
                      
                    </td>
                    <td class="py-2 px-4">
                      <button
                        on:click={() => approveReportBook(report.book_report_id)}
                        class="bg-green-500 hover:bg-gren-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >ลบหนังสือ</button
                      >
                      <button
                        on:click={() => rejectReportBook(report.book_report_id)}
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >เพิกเฉย</button
                      >
                      
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        
        <h6 class="text-xl font-semibold mb-4 pt-5">เกี่ยวกับหนังสือของผู้ขาย</h6>
        {#if reportsSeller.length === 0}
          <p>ไม่มีรายงานของผู้ขายในขณะนี้</p>
        {:else}
          <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-left">Report ID</th>
                  <th class="py-2 px-4 text-left">Reporter</th>
                  <th class="py-2 px-4 text-left">Book</th>
                  <th class="py-2 px-4 text-left">Status</th>
                  <th class="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each reportsSeller as report (report.report_id)}
                  <tr class="border-b">
                    <td class="py-2 px-4">{report.report_id}</td>
                    <td class="py-2 px-4">{report.user_name}</td>
                    <td 
                      class="py-2 px-4 cursor-pointer hover:bg-gray-200 hover:text-blue-600"
                      on:click={() => goSellerDetail(report.seller_book_id)}
                    >{report.book_name}</td>
                    <td class="py-2 px-4">
                      <button
                        on:click={() => openReportModal(report)}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >รายละเอียด</button
                      >
                      
                    </td>
                    <td class="py-2 px-4">
                      <button
                        on:click={() => approveReportSeller(report.report_id)}
                        class="bg-green-500 hover:bg-gren-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >ลบหนังสือ</button
                      >
                      <button
                        on:click={() => rejectReportSeller(report.report_id)}
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >เพิกเฉย</button
                      >
                      
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {:else if activeMenu === "orderManagement"}
        <h1 class="text-2xl font-semibold mb-4">ตรวจสอบคำสั่งซื้อ</h1>
        {#if orders.length === 0}
          <p>ไม่มีคำสั่งซื้อในขณะนี้</p>
        {:else}
          <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-left">Order ID</th>
                  <th class="py-2 px-4 text-left">Buyer</th>
                  <th class="py-2 px-4 text-left">Shop</th>
                  <th class="py-2 px-4 text-left">Date</th>
                  <th class="py-2 px-4 text-left">Total</th>
                  <th class="py-2 px-4 text-left">Status</th>
                  <th class="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each orders as order (order.id)}
                  <tr class="border-b">
                    <td class="py-2 px-4">{order.id}</td>
                    <td class="py-2 px-4">{order.buyer_username}</td>
                    <td class="py-2 px-4">{order.shop_name}</td>
                    <td class="py-2 px-4">{order.order_date}</td>
                    <td class="py-2 px-4">{order.total_amount}</td>
                    <td class="py-2 px-4">
                      {#if order.status === "pending"}
                        <span class="text-yellow-600">Pending</span>
                      {:else if order.status === "confirmed"}
                        <span class="text-blue-600">Confirmed</span>
                      {:else if order.status === "shipped"}
                        <span class="text-indigo-600">Shipped</span>
                      {:else if order.status === "completed"}
                        <span class="text-green-600">Completed</span>
                      {:else}
                        <span class="text-red-600">Cancelled</span>
                      {/if}
                    </td>
                    <td class="py-2 px-4">
                      <button
                        on:click={() => openOrderModal(order)}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >Detail</button
                      >
                      {#if order.status === "pending"}
                        <button
                          on:click={() => confirmOrder(order.id)}
                          class="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Confirm
                        </button>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <!-- Seller Request Modal -->
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
          aria-hidden="true"
          >​</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
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

  <!-- Report Detail Modal -->
  {#if showReportModal && currentReport}
    <div
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="report-modal-title"
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
          aria-hidden="true"
          >​</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="report-modal-title">
                  รายระเอียดการรายงาน
                </h3>
                <div class="mt-2">
                  <p>
                    <strong>ไอดีของผู้รายงาน:</strong> {currentReport.reporter_id}
                  </p>
                  {#if currentReport.book_report_id}
                    <p>
                      <strong>ไอดีของหนังสือที่รายงาน:</strong> {currentReport.book_id}
                    </p>
                    <p>
                      <strong >ชื่อหนังสือที่รายงาน:</strong>{currentReport.book_name_originl}
                    </p>
                  {/if}
                  {#if currentReport.report_id}
                    <p>
                      <strong>ไอดีของหนังสือที่รายงาน:</strong> {currentReport.seller_book_id}
                    </p>
                    <p>
                      <strong >ชื่อหนังสือที่รายงาน:</strong>{currentReport.book_name}
                    </p>
                  {/if}

                  <p>
                    <strong>ไอดีของผู้ขายหนังสือ:</strong> {currentReport.owner_id}
                  </p>

                  <p>
                    <strong>เหตุผลการรายงาน:</strong> {currentReport.report_reason}
                  </p>
                  <p><strong>สถานะ:</strong> {currentReport.report_status}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              on:click={closeReportModal}
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Order Detail Modal -->
  {#if showOrderModal && currentOrder}
    <div
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="order-modal-title"
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
          aria-hidden="true"
          >
        </span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="order-modal-title">
                  Order Details
                </h3>
                <div class="mt-2">
                  <p><strong>Order ID:</strong> {currentOrder.id}</p>
                  <p>
                    <strong>Buyer Username:</strong> {currentOrder.buyer_username}
                  </p>
                  <p><strong>Buyer Name:</strong> {currentOrder.buyer_name}</p>
                  <p><strong>Shop Name:</strong> {currentOrder.shop_name}</p>
                  <p><strong>Order Date:</strong> {currentOrder.order_date}</p>
                  <p><strong>Total Amount:</strong> {currentOrder.total_amount}</p>
                  <p>
                    <strong>Status:</strong>
                    {#if currentOrder.status === "pending"}
                      <span class="text-yellow-600">Pending</span>
                    {:else if currentOrder.status === "confirmed"}
                      <span class="text-blue-600">Confirmed</span>
                    {:else if currentOrder.status === "shipped"}
                      <span class="text-indigo-600">Shipped</span>
                    {:else if currentOrder.status === "completed"}
                      <span class="text-green-600">Completed</span>
                    {:else}
                      <span class="text-red-600">Cancelled</span>
                    {/if}
                  </p>
                  <p><strong>Items:</strong></p>
                  <ul>
                    {#each currentOrder.items as item}
                      <li>
                        {item.product_name} (ID: {item.product_id}) - Quantity:
                        {item.quantity}, Price: {item.price}
                      </li>
                    {/each}
                  </ul>
                  <p class="mt-4"><strong>Payment Slip:</strong></p>
                  <img
                    src={currentOrder.payment_slip}
                    alt="Payment Slip"
                    class="w-64 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {#if currentOrder.status === 'pending'}
              <button
                on:click={() => confirmOrder(currentOrder.id)}
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Confirm Order
              </button>
            {/if}
            <button
              type="button"
              on:click={closeOrderModal}
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if showBanModal}
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50 transform">
    <div 
      class="bg-white p-10 rounded-lg shadow-xl w-[65vw] max-w-xl max-h-[50vh] space-y-6 border overflow-y-auto">
        <h2 
          class="text-2xl font-semibold text-gray-800">เเบนผู้ใช้</h2>
      <form>
        <div class="space-y-4">
          <div>
              <label for="reason" class="block text-gray-600">เหตุผลที่ทำการเเบน</label>
              <textarea
                id="reason"
                bind:value={reason}
                class="w-full px-4 py-2 border rounded-lg shadow-sm" required></textarea>
          </div>
        </div>
        <div class="space-y-4">
          <div>
              <label for="date" class="block text-gray-600">เเบนจนถึงวันที่</label>
              <input
                id="date"
                bind:value={date}
                type="date"
                class="w-full px-4 py-2 border rounded-lg shadow-sm" required />
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button
          type="button"
          on:click={closeBanModal}
          class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600">ยกเลิก</button>

          <button
          type="submit"
          on:click={banUser}
          class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600">เเบน</button>
        </div>

      </form>
    </div>
  </div>
  {/if}


<!-- delete book -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50 transform">
  <div 
    class="bg-white p-10 rounded-lg shadow-xl w-[65vw] max-w-xl max-h-[50vh] space-y-6 border overflow-y-auto">
      <h2 
        class="text-2xl font-semibold text-gray-800">ลบบัญชีผู้ใช้</h2>
    <form>
      <div class="space-y-4">
        <div>
            <label for="reason" class="block text-gray-600">เหตุผลที่ทำการลบ</label>
            <textarea
              id="reason"
              bind:value={reason}
              class="w-full px-4 py-2 border rounded-lg shadow-sm" required></textarea>
              <p>⚠️ คำเตือนการลบจะไม่สามารถย้อนกลับได้</p>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-6">
        <button
        type="button"
        on:click={closeDeleteModal}
        class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600">ยกเลิก</button>

        <button
        type="button"
        on:click={deleteUser}
        class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600">ลบ</button>
      </div>
    </form>
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