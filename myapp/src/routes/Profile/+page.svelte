<script>
    import { goto } from '$app/navigation';
    function ProfilePage() {
    goto('/Profile');
  }
  function MainPage() {
    goto('/main');
  }
    let user = {
      name: "dasdasd dasd",
      memberId: "2210-4254",
      dob: "25-02-2005",
      gender: "ชาย",
      email: "Manop888@kmitl.ac.th",
    };
    let address = "คุณยังไม่ได้ระบุที่อยู่ใดๆ";
    let activeMenu = "dashboard";
    let newsLetter = "คุณยังไม่ได้สมัครรับจดหมายข่าวของเรา";
    let invoiceAddress = "คุณยังไม่ได้ระบุที่อยู่ใดๆ";
  
    // Added orders array
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
  
    function updateUser(event) {
      event.preventDefault();
      user.name = event.target.name.value;
      user.dob = event.target.dob.value;
      user.gender = event.target.gender.value;
      user.email = event.target.email.value;
    }
  
    function updateAddress(event) {
      event.preventDefault();
      address = event.target.address.value;
    }
  
    // Format date helper function
    function formatDate(dateString) {
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return new Date(dateString).toLocaleDateString('th-TH', options);
    }
  
    // Function to get status color
    function getStatusColor(status) {
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


    let isOpen = false; // ควบคุมสถานะเปิด/ปิดเมนู

  function toggleMenu() {
    isOpen = !isOpen;
    document.body.classList.toggle("overflow-hidden", isOpen);
  }

  function closeMenu() {
    isOpen = false;
    document.body.classList.remove("overflow-hidden");
  }
  </script>
  
  <div class="min-h-screen bg-blue-50">
    <header class="bg-blue-900 text-white py-4 shadow-lg relative z-50">
  <div class="container mx-auto flex items-center justify-between">
    
    <!-- ชื่อร้าน -->
    <button class="font-bold text-lg sm:text-xl md:text-2xl" on:click={MainPage}>
      ร้านหนังสือของป้าแพรวา
    </button>

    <!-- ปุ่มเปิดเมนูมือถือ -->
    <button 
      class="md:hidden p-2 rounded-md bg-blue-90 text-gray-400 hover:bg-blue-80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
      on:click={toggleMenu}>
        <!-- ไอคอนเมนู -->
        <svg class="size-6" fill="none" viewBox="0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
    </button>

    <!-- เมนูเดสก์ท็อป -->
    <div class="hidden md:flex items-center gap-6">
      <div class="relative">
        <input type="text" placeholder="ค้นหา" class="rounded-md p-2 w-64 text-black" />
        <button class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900">🔍</button>
      </div>
      <button class="text-2xl">🛒</button>
      <a href="#" on:click={ProfilePage} class="text-2xl">👤</a>
    </div>
  </div>
</header>

<!-- Background overlay -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
    on:click={closeMenu}
  ></div>
{/if}

<!-- เมนูมือถือ -->
<nav 
  class="fixed top-0 left-0 w-full bg-blue-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
  class:translate-y-0={isOpen}
  class:-translate-y-full={!isOpen}
>
  <div class="p-6 space-y-4">
    <button class="text-white text-lg font-bold" on:click={closeMenu}>✖</button>

    <div class="relative">
      <input type="text" placeholder="ค้นหา" class="block w-full rounded-md p-2 text-black bg-gray-100" />
      <button class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900">🔍</button>
    </div>

    <div class="flex items-center gap-4 bg-white-800 text-white p-3 rounded-md">
      <button class="text-xl">ตระกร้า🛒</button>
      <a href="#" on:click={ProfilePage} class="text-xl">โปรไฟล์👤</a>
    </div>
  </div>
</nav>


    <!-- Navigation -->
    <nav class="bg-blue-700 text-white py-2">
      <div class="container mx-auto flex space-x-4">
        <a href="#" class="hover:underline">นิยาย</a>
        <a href="#" class="hover:underline">หนังสือ</a>
        <a href="#" class="hover:underline">บันเทิง</a>
        <a href="#" class="hover:underline">การ์ตูน</a>
      </div>
    </nav>
    <!-- Main Content Wrapper (bg-blue-50 to match overall page background) -->
    <div class="container mx-auto px-4 py-8 flex">
      <!-- Sidebar -->
      <div class="hidden sm:block bg-blue-700 w-64 min-w-[256px] p-4 rounded-lg">
        <h2 class="text-lg font-semibold text-white">บัญชีของฉัน</h2>
        <ul class="mt-4">
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'dashboard'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "dashboard")}
          >
            <i class="fa-solid fa-gauge mr-2" />Dashboard
          </li>
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'account'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "account")}
          >
            <i class="fa-solid fa-user mr-2" />บัญชีผู้ใช้
          </li>
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'address'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "address")}
          >
            <i class="fa-solid fa-location-dot mr-2" />ที่อยู่
          </li>
          <li
            class="p-2 rounded cursor-pointer hover:bg-blue-800 {activeMenu ===
            'orders'
              ? 'bg-blue-900 text-white'
              : 'text-white'}"
            on:click={() => (activeMenu = "orders")}
          >
            <i class="fa-solid fa-box mr-2" />คำสั่งซื้อของฉัน
          </li>
        </ul>
      </div>
  
      <!-- Content -->
      <div class="flex-1 p-4 ml-4">
        <!-- Added ml-4 for spacing -->
        {#if activeMenu === "dashboard"}
          <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- User Account Card -->
            <div class="bg-white p-6 rounded-lg shadow-md relative">
              <!-- Added shadow-md -->
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                ข้อมูลติดต่อ
              </h2>
              <div class="absolute top-4 right-4">
                <i class="fa-solid fa-user-pen text-4xl text-gray-500" />
              </div>
              <p class="mb-2 text-gray-700">{user.name}</p>
              <p class="mb-2 text-gray-700">หมายเลขสมาชิก: {user.memberId}</p>
              <p class="mb-2 text-gray-700">วันเกิด: {user.dob}</p>
              <p class="mb-2 text-gray-700">เพศ: {user.gender}</p>
              <p class="mb-4 text-gray-700">{user.email}</p>
              <div class="flex space-x-2">
                <button
                  class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm flex items-center text-white"
                >
                  <i class="fa-solid fa-pen-to-square mr-1" /> แก้ไข
                </button>
                <button
                  class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm flex items-center text-white"
                >
                  <i class="fa-solid fa-key mr-1" /> เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>
  
            <!-- Address Card -->
            <div class="bg-white p-6 rounded-lg shadow-md relative">
              <!-- Added shadow-md -->
              <h2 class="text-xl font-semibold mb-4 text-gray-800">จดหมายข่าว</h2>
              <div class="absolute top-4 right-4">
                <i class="fa-regular fa-envelope text-4xl text-gray-500" />
              </div>
              <p class="mb-4 text-gray-700">{newsLetter}</p>
              <button
                class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm flex items-center text-white"
              >
                <i class="fa-solid fa-pen-to-square mr-1" />แก้ไข
              </button>
            </div>
  
            <!-- Address Management -->
            <div class="bg-white p-6 rounded-lg shadow-md">
              <!-- Added shadow-md -->
              <h2 class="text-xl font-semibold mb-4 text-gray-800">ที่อยู่</h2>
              <p class="mb-4 text-gray-700">ที่อยู่การเรียกเก็บเงินเริ่มต้น</p>
              <p class="mb-4 text-gray-700">{invoiceAddress}</p>
              <button
                class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm flex items-center text-white"
              >
                <i class="fa-solid fa-pen-to-square mr-1" />แก้ไขที่อยู่
              </button>
              <div class="mt-4 flex justify-end">
                <a
                  href="/address"
                  class="text-blue-700 hover:underline text-sm flex items-center"
                  >จัดการที่อยู่
                  <i class="fa-solid fa-arrow-right ml-1" /></a
                >
              </div>
            </div>
  
            <!-- Shipping Address -->
            <div class="bg-white p-6 rounded-lg shadow-md">
              <!-- Added shadow-md -->
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                ที่อยู่เริ่มต้นสำหรับออกใบเสร็จ
              </h2>
              <p class="mb-4 text-gray-700">{invoiceAddress}</p>
              <button
                class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm flex items-center text-white"
              >
                <i class="fa-solid fa-pen-to-square mr-1" />แก้ไขที่อยู่
              </button>
            </div>
          </div>
        {:else if activeMenu === "account"}
          <h1 class="text-2xl font-semibold mb-4">บัญชีผู้ใช้</h1>
          <form on:submit={updateUser} class="bg-white p-6 rounded-lg shadow-md">
            <!-- Added shadow-md -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
                >ชื่อ:</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                bind:value={user.name}
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
                bind:value={user.dob}
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="gender"
                >เพศ:</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="gender"
                type="text"
                name="gender"
                bind:value={user.gender}
              />
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
                >อีเมล:</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                bind:value={user.email}
              />
            </div>
            <button
              type="submit"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              บันทึก
            </button>
          </form>
        {:else if activeMenu === "address"}
          <h1 class="text-2xl font-semibold mb-4">ที่อยู่</h1>
          <form on:submit={updateAddress} class="bg-white p-6 rounded-lg shadow-md">
            <!-- Added shadow-md -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="address"
                >ที่อยู่:</label
              >
              <textarea
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                name="address"
                bind:value={address}
                rows="4"
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
        {/if}
      </div>
    </div>
  </div>
  
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />