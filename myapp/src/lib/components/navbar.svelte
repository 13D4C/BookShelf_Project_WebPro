<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	let searchInput: string = "";
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function ProfilePage(event: Event) {
		event.preventDefault();
		goto("/Profile");
		closeMenu();
	}

	function MainPage(event: Event) {
		event.preventDefault();
		goto("/main");
		closeMenu();
	}
	function Logout() {
		localStorage.removeItem("userToken");
		goto("/"); // use goto
	}
	function handleSearch() {
             goto(`/all?name=${encodeURIComponent(searchInput)}`);

    }
</script>

{#if $page.url.pathname !== "/"}
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
						on:keydown={(e) => { if (e.key === 'Enter') { handleSearch(); } }}
					/>
					<button
					on:click={handleSearch}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900"
						>🔍</button
					>
				</div>
				<button class="text-2xl">🛒</button>
				<button on:click={ProfilePage} class="text-2xl">👤</button>
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
					on:keydown={(e) => { if (e.key === 'Enter') { handleSearch(); } }}
				/>
				<button
					class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900"
					on:click={handleSearch}>🔍</button
				>
			</div>

			<div
				class="flex items-center gap-4 bg-white-800 text-white p-3 rounded-md"
			>
				<button class="text-xl">ตระกร้า🛒</button>
				<button on:click={ProfilePage} class="text-xl">โปรไฟล์👤</button>
                <button on:click={Logout} class="text-xl">Logout</button>
			</div>
		</div>
	</nav>

	<!-- Navigation -->
	<nav class="bg-blue-700 text-white py-2">
		<div class="container mx-auto flex space-x-4">
			<a href="/main" class="hover:underline">หน้าหลัก</a>
			<a href="/all" class="hover:underline">หนังสือทั้งหมด</a>
			<a href="/" class="hover:underline">Custom</a>
		</div>
	</nav>
{/if}