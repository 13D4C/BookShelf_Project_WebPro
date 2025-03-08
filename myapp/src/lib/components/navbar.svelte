<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils";
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { afterNavigate } from "$app/navigation";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownHeader,
    DropdownDivider,
    Button,
    Input,
  } from "flowbite-svelte";
  import { SearchOutline, CloseOutline } from "flowbite-svelte-icons";

  // --- Stores ---
  const cartCount = writable(0);
  const user = writable<any>(null);
  const isAuthenticated = writable(false);
  const isLoading = writable(false); // For loading states

  let searchInput: string = "";
  let isOpen = false;
  let user_id: any; // Keep user_id

  // --- Helper Functions ---

  let showSearch = false;

  function toggleSearch() {
    showSearch = !showSearch;
    if (showSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    console.log(showSearch);
  }

  function closeMenu() {
    isOpen = false;
  }

  function ProfilePage() {
    goto("/Profile");
    closeMenu();
  }

  function AdminPage() {
    goto("/adminmanage");
    closeMenu();
  }

  function MainPage() {
    goto("/main");
    closeMenu();
  }

  async function Logout() {
    isLoading.set(true);
    await goto("/");
    localStorage.removeItem("userToken");
    sessionStorage.clear();
    isAuthenticated.set(false); // Update store
    user.set(null);
    cartCount.set(0);
    isLoading.set(false);
  }

  function handleSearch() {
    goto(`/all?name=${encodeURIComponent(searchInput)}`);
  }

  // --- Fetch Cart Count (Your Original Logic) ---
  async function fetchCartCount() {
    isLoading.set(true);
    user_id = localStorage.getItem("userToken"); // Get from localStorage

    if (user_id) {
      try {
        const userResponse = await getUser(user_id);
        if (!userResponse) throw new Error("getUser failed");
        user.set(userResponse); // Update user store
        isAuthenticated.set(true);
        const response = await fetch(
          "http://localhost:3000/shop/publisher/cart/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: user_id }),
          },
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        cartCount.set(
          data.cart_info.reduce((total, item) => total + item.amount, 0),
        );

        const response2 = await fetch(
          "http://localhost:3000/shop/seller/cart/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: user_id }),
          },
        );

        if (!response2.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data2 = await response2.json();
        cartCount.update(
          (currentCount) =>
            currentCount +
            data2.cart_info.reduce(
              // Use update for immutability
              (total, item) => total + item.amount,
              0,
            ),
        );
      } catch (error) {
        console.error("Error fetching cart count:", error);
        // cartCount.set(0); // Consider *not* resetting on error, show previous value
      } finally {
        isLoading.set(false);
      }
    } else {
      cartCount.set(0); // No user, cart is 0
      isAuthenticated.set(false);
      user.set(null);
      isLoading.set(false);
    }
  }

  // --- Lifecycle Hooks and afterNavigate ---

  onMount(async () => {
    await fetchCartCount(); // Initial fetch
  });

  afterNavigate(async (navigation) => {
    console.log("afterNavigate triggered", navigation);
    if (
      navigation &&
      navigation.from?.route &&
      navigation.from.route.id !== "/" &&
      navigation.from.route.id !== "/Register"
    ) {
      await fetchCartCount();
    }
  });
</script>

{#if $page.url.pathname !== "/" && $page.url.pathname !== "/Register" && $page.url.pathname !== "/Register/promax"}
  <Navbar
    color="form"
    class="mx-auto flex flex-wrap justify-between items-center w-full bg-blue-900 text-white py-4 shadow-lg relative z-50"
  >
    <NavBrand href="/main">
      <span
        class="self-center whitespace-nowrap font-semibold text-sm md:text-base"
        >ร้านหนังสือของป้าแพรวา</span
      ><br /><br />
    </NavBrand>
    <div class="flex items-center md:order-2 gap-5">
      <div class="hidden relative md:block">
        <div
          class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none"
        >
          <SearchOutline
            class="w-4 h-4 text-blue-900"
            on:click={handleSearch}
          />
        </div>
        <Input
          bind:value={searchInput}
          id="search-navbar"
          class="ps-10"
          placeholder="Search..."
          on:keydown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>
      <div class="ms-auto flex items-center gap-5">
        <Button
          on:click={toggleSearch}
          color="none"
          data-collapse-toggle="mobile-menu-3"
          aria-controls="mobile-menu-3"
          aria-expanded="false"
          class="md:hidden text-gray-500 focus:outline-hidden focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5 me-1"
        >
          <SearchOutline class="w-5 h-5" />
        </Button>
        <Button
          color="blue"
          href="/cart"
          class="flex items-center text-white relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {#if $cartCount > 0}
            <span
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {$cartCount}
            </span>
          {/if}
        </Button>
        <Avatar
          id="avatar-menu"
          src={$user?.user_image ||
            "/src/lib/components/placeholder-profile.jpg"}
        />
      </div>
    </div>
    <NavHamburger class="w-full md:flex md:w-auto md:order-1" />
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
        <span class="block text-sm">{$user?.user_name || "Username"}</span>
        <span class="block truncate text-sm font-medium"
          >{$user?.user_email}</span
        >
      </DropdownHeader>
      <DropdownItem on:click={ProfilePage}>โปรไฟล์</DropdownItem>
      {#if $user.user_permission === "Manager"}<DropdownItem
          on:click={AdminPage}>จัดการ</DropdownItem
        >{/if}
      <DropdownDivider />
      <DropdownItem on:click={Logout}>ออกจากระบบ</DropdownItem>
    </Dropdown>
    <NavUl class="order-1">
      <NavLi href="/main" class="hover:text-gray-500 md:text-white">หน้าหลัก</NavLi>
      <NavLi href="/all" class="hover:underline md:text-white"
        >หนังสือทั้งหมด</NavLi
      >
      <NavLi href="/marketplace" class="hover:underline md:text-white"
        >ร้านค้าชุมชน</NavLi
      >
      {#if $user && $user.user_permission === "Publisher"}
        <NavLi href="/managebook" class="hover:underline md:text-white"
          >จัดการหนังสือ</NavLi
        >
      {/if}
      {#if $user && $user.user_permission === "Seller"}
        <NavLi href="/managesellerbook" class="hover:underline md:text-white"
          >จัดการหนังสือ</NavLi
        >
      {/if}
      {#if $user && $user.user_permission === "Manager"}
        <NavLi href="/managebook" class="hover:underline md:text-white"
          >จัดการหนังสือของสำนักพิมพ์</NavLi
        >
      {/if}
      {#if $user && $user.user_permission === "Manager"}
        <NavLi href="/managesellerbook" class="hover:underline md:text-white"
          >จัดการหนังสือของผู้ขาย</NavLi
        >
      {/if}
    </NavUl>
  </Navbar>
{/if}

{#if showSearch}
  <!-- Overlay ทั้งหน้าจอ -->
  <div class="fixed inset-0 z-50">
    <!-- พื้นหลังจาง -->
    <div class="absolute inset-0 bg-black opacity-80"></div>
    <!-- คอนเทนเนอร์สำหรับ Search Bar ที่อยู่ด้านบนสุด -->
    <div class="relative z-10">
      <input
        bind:value={searchInput}
        id="search-navbar"
        class="w-full border border-gray-300 rounded-md p-2 focus:border-blue-300 ps-10"
        placeholder="Search..."
        on:keydown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        on:click={toggleSearch}
        aria-label="Close search"
        class="ml-4 text-gray-500 hover:text-gray-700"
      >
        <CloseOutline class="w-6 h-6 absolute float-left absolute" />
      </button>
    </div>
  </div>
{/if}
