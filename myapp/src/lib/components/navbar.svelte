<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { getUser } from "$lib/utils";
	import { onMount, onDestroy } from "svelte";
	import { writable } from "svelte/store";
	import { afterNavigate } from "$app/navigation";

	// --- Stores ---
	const cartCount = writable(0);
	const user = writable<any>(null);
	const isAuthenticated = writable(false);
	const isLoading = writable(false);  // For loading states

	let searchInput: string = "";
	let isOpen = false;
	let user_id: any; // Keep user_id

	// --- Helper Functions ---

	function toggleMenu() {
		isOpen = !isOpen;
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
		localStorage.removeItem("userToken");
		sessionStorage.clear();
		isAuthenticated.set(false); // Update store
        user.set(null);
        cartCount.set(0);
		await goto("/");
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
            if(!userResponse) throw new Error("getUser failed");
            user.set(userResponse);  // Update user store
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
                throw new Error(
                    `Network response was not ok: ${response.status}`,
                );
            }

            const data = await response.json();
            cartCount.set(data.cart_info.reduce(
                (total, item) => total + item.amount,
                0,
            ));

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
                throw new Error(
                    `Network response was not ok: ${response.status}`,
                );
            }

            const data2 = await response2.json();
            cartCount.update(currentCount => currentCount + data2.cart_info.reduce( // Use update for immutability
                (total, item) => total + item.amount,
                0,
            ));
        } catch (error) {
            console.error("Error fetching cart count:", error);
            // cartCount.set(0); // Consider *not* resetting on error, show previous value
        } finally {
			      isLoading.set(false);
		    }
    } else {
		    cartCount.set(0);  // No user, cart is 0
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
        if (navigation.from.route.id !== "/" && navigation.from.route.id !== "/Register") {
            await fetchCartCount();
        }
    });
</script>

{#if $page.url.pathname !== "/" && $page.url.pathname !== "/Register" && $page.url.pathname !== "/Register/promax"}
<header class="bg-blue-900 text-white py-4 shadow-lg relative z-50">
		<div class="container mx-auto flex items-center justify-between">
			<!-- ชื่อร้าน -->
			<button
				class="font-bold text-lg sm:text-xl md:text-2xl"
				on:click={MainPage}
			>
				ร้านหนังสือของป้าแพรวา
			</button>

			<!-- ปุ่มเปิดเมนูมือถือ -->
			<button
				class="md:hidden p-2 rounded-md bg-blue-900 text-gray-400 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
				on:click={toggleMenu}
			>
				<!-- ไอคอนเมนู -->
				<svg
					class="size-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>

			<!-- เมนูเดสก์ท็อป -->
			<div class="hidden md:flex items-center gap-6">
				<div class="relative">
					<input
						bind:value={searchInput}
						type="text"
						placeholder="ค้นหา"
						class="rounded-md p-2 w-64 text-black"
						on:keydown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
					<button
						on:click={handleSearch}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900"
						>🔍</button
					>
				</div>
                {#if $isLoading}
                    <a class="text-2xl">🛒<sup>Loading...</sup></a>
                {:else}
				    <a href="/cart" class="text-2xl">🛒<sup>{$cartCount}</sup></a>
                {/if}
                {#if $isLoading}
                    <button class="text-2xl">👤Loading</button>
                {:else}
                    <button on:click={ProfilePage} class="text-2xl"
					>👤{$user?.user_name}</button
				>
                {/if}
				{#if $user && $user.user_permission === "Manager"}
					<button on:click={AdminPage} class="text-2xl">⚙️</button>
				{/if}
				<button on:click={Logout} class="text-2xl">Logout</button>
			</div>
		</div>
	</header>

	<!-- Background overlay -->
	{#if isOpen}
		<div
			class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
			on:click={closeMenu}
		/>
	{/if}

	<!-- เมนูมือถือ -->
	<nav
		class="fixed top-0 left-0 w-full bg-blue-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
		class:translate-y-0={isOpen}
		class:-translate-y-full={!isOpen}
	>
		<div class="p-6 space-y-4">
			<button class="text-white text-lg font-bold" on:click={closeMenu}
				>✖</button
			>

			<div class="relative">
				<input
					bind:value={searchInput}
					type="text"
					placeholder="ค้นหา"
					class="block w-full rounded-md p-2 text-black bg-gray-100"
					on:keydown={(e) => {
						if (e.key === "Enter") {
							handleSearch();
						}
					}}
				/>
				<button
					class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900"
					on:click={handleSearch}>🔍</button
				>
			</div>

			<div
				class="flex items-center gap-4 bg-white-800 text-white p-3 rounded-md"
			>
              {#if $isLoading}
                    <a class="text-2xl">🛒<sup>Loading...</sup></a>
                {:else}
				    <a href="/cart" class="text-2xl">ตระกร้า🛒<sup>{$cartCount}</sup></a>
                {/if}
                {#if $isLoading}
                    <button class="text-2xl">👤Loading</button>
                {:else}
                   <button on:click={ProfilePage} class="text-xl">โปรไฟล์👤</button>
                {/if}
				<button on:click={AdminPage} class="text-xl">⚙️</button>
				<button on:click={Logout} class="text-xl">Logout</button>
			</div>
		</div>
	</nav>

	<!-- Navigation -->
	<nav class="bg-blue-700 text-white py-2">
		<div class="container mx-auto flex space-x-4 text-sm md:text-base">
			<a href="/main" class="hover:underline">หน้าหลัก</a>
			<a href="/all" class="hover:underline">หนังสือทั้งหมด</a>
			<a href="/marketplace" class="hover:underline">ร้านค้าชุมชน</a>
			{#if $user && $user.user_permission === "Publisher"}
				<a href="/managebook" class="hover:underline">จัดการหนังสือ</a>
			{/if}
			{#if $user && $user.user_permission === "Seller"}
				<a href="/managesellerbook" class="hover:underline"
					>จัดการหนังสือ</a
				>
			{/if}
			{#if $user && $user.user_permission === "Manager"}
				<a href="/managebook" class="hover:underline"
					>จัดการหนังสือของสำนักพิมพ์</a
				>
			{/if}
			{#if $user && $user.user_permission === "Manager"}
				<a href="/managesellerbook" class="hover:underline"
					>จัดการหนังสือของผู้ขาย</a
				>
			{/if}
		</div>
	</nav>
{/if}