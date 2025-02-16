<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import Swiper from 'swiper/bundle';
	import 'swiper/css/bundle';


	let products: any[] = [];
	 let swiperContainer;

	async function getBooks() {
		try {
			const response = await fetch("http://localhost:3000/books");

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			products = await response.json();
		} catch (error) {
			console.error("Error fetching books:", error);
			products = [];
		}
	}

	function ProfilePage() {
		goto("/Profile");
	}

	function MainPage() {
		goto("/main");
	}

	let weeklyHighlightProducts = [
		{
			id: 7,
			name: "ฝึกวินัยให้คุณแม่",
			price: "150 บาท",
			image: "https://miku-doujin.com/uploads/thumbnail/5721960596506d8921948659dc568ba2.jpg",
		},
		{
			id: 8,
			name: "ถึงเสียตัวก็ไม่บอก",
			price: "130 บาท",
			image: "https://miku-doujin.com/uploads/thumbnail/504036b078791902bd732c2f817c8968.jpg",
		},
		{
			id: 9,
			name: "Circle",
			price: "90 บาท",
			image: "https://doujin-new.com/wp-content/uploads/2023/12/Theater-Society-Circles-200x300.jpg",
		},
		{
			id: 10,
			name: "ไม่มีหญิงใดในต่างโลก",
			price: "110 บาท",
			image: "https://i3.wp.com/doujin89.com/wp-content/uploads/2024/01/77a948371e804e07c34132a2b6c0c1f4ukqr6BWvKbRUNP9Q-0.jpg",
		},
		{
			id: 11,
			name: "แผน NTR แฟนรุ่นพี่ แค้นนี้ต้องชำระ",
			price: "100 บาท",
			image: "https://www.phoenixnext.com/media/brand/tmp/_LN_Kanojo_NTR_KV_2.jpg",
		},
	];
	let novelProducts = [
		{
			id: 12,
			name: "มุมมองนักอ่านพระเจ้า",
			price: "230 บาท",
			image: "https://th.bing.com/th/id/OIP.-cvt_ItGz5YCKfbt0OqnXgAAAA?rs=1&pid=ImgDetMain",
		},
		{
			id: 13,
			name: "คุณอาเรีย เว้าอีสานใส่",
			price: "230 บาท",
			image: "https://cdn.myanimelist.net/images/manga/1/298216l.jpg",
		},
		{
			id: 12,
			name: "เกิดชาตินี้พี่ต้องเทพ",
			price: "230 บาท",
			image: "https://images-se-ed.com/ws/Storage/Originals/552284/015/5522840154347L.jpg?h=90e2ce479a1a9e85f6fb7821ced24629",
		},
		{
			id: 12,
			name: "Sword Art Online",
			price: "230 บาท",
			image: "https://th.bing.com/th/id/OIP.RsRj05nfWlKr8UyNBYj8_wHaLS?rs=1&pid=ImgDetMain",
		},
		{
			id: 12,
			name: "Nisekoi",
			price: "230 บาท",
			image: "https://th.bing.com/th/id/OIP.FaPFujqjjVjyQ-b4SRilNAHaLc?rs=1&pid=ImgDetMain",
		},
	];
	const footerLinks = [
		{ title: "เกี่ยวกับเรา", url: "/about" }, // เปลี่ยน URL
		{ title: "ติดต่อเรา", url: "/contact" }, // เปลี่ยน URL
		{ title: "นโยบายความเป็นส่วนตัว", url: "/privacy" }, // เปลี่ยน URL
		// เพิ่ม links อื่นๆ
	];

	const socialLinks = [
		{
			icon: "fab fa-facebook-f",
			url: "https://www.facebook.com/yourpage",
			label: "Facebook",
		}, // เปลี่ยน URL
		{
			icon: "fab fa-twitter",
			url: "https://twitter.com/yourhandle",
			label: "Twitter",
		}, // เปลี่ยน URL
		{
			icon: "fab fa-instagram",
			url: "https://www.instagram.com/youraccount",
			label: "Instagram",
		}, // เปลี่ยน URL
		// เพิ่ม social media อื่นๆ ได้
	];

	const contactInfo = {
		address: "123 ถ.สุขุมวิท, กรุงเทพฯ", // เปลี่ยนที่อยู่
		phone: "02-123-4567", // เปลี่ยนเบอร์โทร
		email: "info@example.com", // เปลี่ยนอีเมล
	};
	let categories = [
		"ภาษาศาสตร์",
		"บริหาร",
		"สารคดี",
		"ศิลปะ",
		"ชีวประวัติ",
		"ประวัติศาสตร์",
		"อาหาร",
		"นิยายวัย",
	];

	function navigateToProduct(id: number) {
		goto(`/product/${id}`);
	}

	let currentIndex = 0;
	let itemsPerPage = 5; // ค่าเริ่มต้น
	let visibleProducts: any[] = [];

	// ฟังก์ชันตรวจจับขนาดหน้าจอ และกำหนด itemsPerPage
	function updateItemsPerPage() {
		const width = window.innerWidth;
		if (width < 640)
			itemsPerPage = 1; // sm (มือถือ)
		else if (width < 768)
			itemsPerPage = 3; // md (แท็บเล็ต)
		else if (width < 1024)
			itemsPerPage = 4; // lg (แล็ปท็อป)
		else itemsPerPage = 5; // xl ขึ้นไป (เดสก์ท็อป)

		
		// อัปเดตสินค้าตาม index ใหม่
		updateVisibleProducts();
	}

	// ฟังก์ชันอัปเดต `visibleProducts`
	function updateVisibleProducts() {
		visibleProducts = products.slice(
			currentIndex,
			currentIndex + itemsPerPage,
		);
		if (visibleProducts.length < itemsPerPage) {
			visibleProducts = visibleProducts.concat(
				products.slice(0, itemsPerPage - visibleProducts.length),
			);
		}
	}
	// ฟังก์ชันเลื่อนสินค้าไปข้างหน้า
	// function slideNext() {
	// 	currentIndex = (currentIndex + 1) % products.length;
	// 	updateVisibleProducts();
	// }

	// // ฟังก์ชันเลื่อนสินค้าไปข้างหลัง
	// function slidePrev() {
	// 	currentIndex = (currentIndex - 1 + products.length) % products.length;
	// 	updateVisibleProducts();
	// }

	onMount(() => {
	// ตรวจจับการเปลี่ยนขนาดจอ
		getBooks().then(() => {
			console.log(products);
			updateItemsPerPage();
			window.addEventListener("resize", updateItemsPerPage);
			return () =>
				window.removeEventListener("resize", updateItemsPerPage);
		});

		let swiper1 = new Swiper(".swiper1", {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: true,
	  navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
	  pagination: { 
		el: ".swiper-pagination",
		clickable: true },
	  breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
      },
   	 	});
	});
	let bannerImages = [
		"https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/323203587/original/8f16754c80f8ea7a8a2b87b24c40f123ed219937/do-a-colorful-and-dynamic-anime-or-manga-banner-for-you.png",
		"https://i.redd.it/t4x28924inbc1.jpeg",
		"https://cdn.vectorstock.com/i/500p/26/35/merry-christmas-podium-display-snowman-banner-vector-54372635.jpg",
	];

	let currentBannerIndex = 0;

	// เปลี่ยนรูป Banner ทุก 3 วินาที
	function startAutoSlide() {
		setInterval(() => {
			currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
		}, 3000); // 3000ms = 3 วินาที
	}

	startAutoSlide();

	// Weekly Highlight Logic - Exactly like New Products
	let weeklyHighlightCurrentIndex = 0;
	let visibleWeeklyHighlightProducts = weeklyHighlightProducts.slice(0, 5);

	function slideWeeklyHighlightNext() {
		weeklyHighlightCurrentIndex =
			(weeklyHighlightCurrentIndex + 1) % weeklyHighlightProducts.length;
		visibleWeeklyHighlightProducts = weeklyHighlightProducts.slice(
			weeklyHighlightCurrentIndex,
			weeklyHighlightCurrentIndex + 5,
		);
		if (visibleWeeklyHighlightProducts.length < 5) {
			visibleWeeklyHighlightProducts =
				visibleWeeklyHighlightProducts.concat(
					weeklyHighlightProducts.slice(
						0,
						5 - visibleWeeklyHighlightProducts.length,
					),
				);
		}
	}

	function slideWeeklyHighlightPrev() {
		weeklyHighlightCurrentIndex =
			(weeklyHighlightCurrentIndex - 1 + weeklyHighlightProducts.length) %
			weeklyHighlightProducts.length;
		visibleWeeklyHighlightProducts = weeklyHighlightProducts.slice(
			weeklyHighlightCurrentIndex,
			weeklyHighlightCurrentIndex + 5,
		);
		if (visibleWeeklyHighlightProducts.length < 5) {
			visibleWeeklyHighlightProducts = weeklyHighlightProducts
				.slice(
					weeklyHighlightProducts.length -
						(5 - visibleWeeklyHighlightProducts.length),
				)
				.concat(visibleWeeklyHighlightProducts);
		}
	}
	// Novel Section Logic -  like Weekly Highlight
	let novelCurrentIndex = 0;
	let visibleNovelProducts = novelProducts.slice(0, 5);

	function slideNovelNext() {
		novelCurrentIndex = (novelCurrentIndex + 1) % novelProducts.length;
		visibleNovelProducts = novelProducts.slice(
			novelCurrentIndex,
			novelCurrentIndex + 5,
		);
		if (visibleNovelProducts.length < 5) {
			visibleNovelProducts = visibleNovelProducts.concat(
				novelProducts.slice(0, 5 - visibleNovelProducts.length),
			);
		}
	}
	function slideNovelPrev() {
		novelCurrentIndex =
			(novelCurrentIndex - 1 + novelProducts.length) %
			novelProducts.length;
		visibleNovelProducts = novelProducts.slice(
			novelCurrentIndex,
			novelCurrentIndex + 5,
		);
		if (visibleNovelProducts.length < 5) {
			visibleNovelProducts = novelProducts
				.slice(novelProducts.length - (5 - visibleNovelProducts.length))
				.concat(visibleNovelProducts);
		}
	}

	let smallBannerImages = [
		"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/56108c72-51ea-4e26-8de9-008fde4723c4/dfhaomu-59c653ab-3da1-4c81-9a4b-bbd042eec441.jpg/v1/fill/w_1280,h_427,q_75,strp/hentai_banner_by_bankysenpai_dfhaomu-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDI3IiwicGF0aCI6IlwvZlwvNTYxMDhjNzItNTFlYS00ZTI2LThkZTktMDA4ZmRlNDcyM2M0XC9kZmhhb211LTU5YzY1M2FiLTNkYTEtNGM4MS05YTRiLWJiZDA0MmVlYzQ0MS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.iARBneFwUhe2l5QaD7tde0SZRIUGiBQxZnFadq0DFMQ",
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0IUgoI9H2LpPoSSvg5nJxns3acKbS-gdQjQ&s",
	];

</script>

<div class="bg-blue-50">
	<header class="bg-blue-900 text-white py-4">
	<div class="container mx-auto flex flex-wrap items-center justify-between gap-4">
		<button class="hidden sm:block font-bold text-lg sm:text-xl md:text-2xl" on:click={MainPage}>
			ร้านหนังสือของป้าแพรวา
		</button>

		<div class="relative ml-auto">
			<input
				type="text"
				placeholder="ค้นหา"
				class="rounded-md p-2 w-40 sm:w-64 text-black text-sm sm:text-base"
				role="search"
				aria-label="Search"
			/>
			<button class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-900">
				🔍
			</button>
		</div>

		<div class="flex items-center gap-4">
			<button class="text-xl sm:text-2xl">🛒</button>
			<a href="#" on:click={ProfilePage} class="text-xl sm:text-2xl">👤</a>
		</div>
	</div>
</header>


	<!-- Navigation -->
	<nav class="bg-blue-700 text-white py-2">
		<div class="container mx-auto flex space-x-4">
			<a href="#" class="hover:underline">นิยาย</a>
			<a href="#" class="hover:underline">หนังสือ</a>
			<a href="#" class="hover:underline">บันเทิง</a>
			<a href="#" class="hover:underline">การ์ตูน</a>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="container mx-auto py-8">
		<!-- Banner -->
		<div class="grid grid-cols-4 gap-4 mb-8 relative">
			<!-- Main Banner -->
			<div
				class="col-span-4 md:col-span-3 relative bg-gray-300 h-64 rounded-lg overflow-hidden"
			>
				<img
					src={bannerImages[currentBannerIndex]}
					alt="Banner"
					class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
				/>
			</div>

			<!-- Small Banners -->
			<div class="col-span-4 md:col-span-1 space-y-4">
				{#each smallBannerImages as banner, index}
					<div class="bg-gray-300 h-20 rounded-lg overflow-hidden">
						<img
							src={banner}
							alt={`Small Banner ${index + 1}`}
							class="w-full h-full object-cover"
						/>
					</div>
				{/each}
			</div>
		</div>

		<section class="mb-8 relative">
			<h2 class="text-xl font-bold mb-4">สินค้าออกใหม่</h2>
			<!-- <div
				class="hidden sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
			>
				{#each visibleProducts as product}
					<div
						class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200"
						on:click={() => navigateToProduct(product.book_id)}
					>
						<div class="h-56 mb-2 rounded-md overflow-hidden">
							<img
								src={product.book_image}
								alt={product.book_name_th}
								class="h-full w-full object-cover"
							/>
						</div>
						<p class="text-center">{product.book_name_th}</p>
						<p class="text-center text-red-500">
							{product.book_price}
						</p>
					</div>
				{/each}
			</div>

			<button
				class=" hidden sm:block absolute left-2 sm:left-[-80px] top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10 max-w-[calc(100%-20px)]"
				on:click={slidePrev}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6"
				>
					<path
						fill-rule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-2.47-2.47H16.5a.75.75 0 000-1.5H6.51l2.47-2.47a.75.75 0 10-1.06-1.06l-3 3z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<button
				class=" hidden sm:block absolute right-2 sm:right-[-80px] top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10 max-w-[calc(100%-20px)]"
				on:click={slideNext}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6"
				>
					<path
						fill-rule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s-4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3.53 10.78a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l2.47 2.47H7.5a.75.75 0 000 1.5h7.94l-2.47 2.47a.75.75 0 101.06 1.06l3-3z"
						clip-rule="evenodd"
					/>
				</svg>
			</button> -->
<div class="contents">
	<div class="swiper swiper1">
		<div class="swiper-wrapper">
		{#each products as product}
					<div class="swiper-slide ">
						<div
						class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200"
						on:click={() => navigateToProduct(product.book_id)}
						>
						<div class="h-56 mb-2 rounded-md overflow-hidden">
							<img
							src={product.book_image}
							alt={product.book_name_th}
							class="h-48 w-96 object-scale-down place-content-center"
							/>
						</div>
						<p class="text-center truncate">{product.book_name_th}</p>
						<p class="text-center text-red-500">{product.book_price}</p>
						</div>
					</div>
					{/each}
		</div>
	</div>	
  	<div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
	<br><br>
	<div class="swiper-pagination sm:hidden sm:block"></div>

</div>
		</section>






		<!-- Categories -->
		<section class="mb-8">
			<h2 class="text-xl font-bold mb-4">หมวดหมู่</h2>
			<div class="flex flex-wrap space-x-2">
				{#each categories as category}
					<button
						class="bg-blue-200 text-blue-800 px-4 py-2 rounded-md mb-2 hover:bg-blue-300 transition duration-200"
					>
						{category}
					</button>
				{/each}
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-bold mb-4">สินค้าขายดีประจำสัปดาห์</h2>
			<div class="relative">
				<div
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
				>
					{#each visibleWeeklyHighlightProducts as product}
						<div
							class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200 transition duration-200"
							on:click={() => navigateToProduct(product.id)}
						>
							<div class="h-56 mb-2 rounded-md overflow-hidden">
								<img
									src={product.image}
									alt={product.name}
									class="h-full w-full object-scale-down"
								/>
							</div>
							<p class="text-center h-24">{product.name}</p>
							<p class="text-center text-red-500 place-content-center">
								{product.price}
							</p>
						</div>
					{/each}
				</div>

				{#if weeklyHighlightProducts.length > 5}
					<button
						class="absolute top-1/2 -translate-y-1/2 left-4 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition duration-200"
						on:click={slideWeeklyHighlightPrev}
						aria-label="Previous"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-2.47-2.47H16.5a.75.75 0 000-1.5H6.51l2.47-2.47a.75.75 0 10-1.06-1.06l-3 3z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<button
						class="absolute top-1/2 -translate-y-1/2 right-4 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition duration-200"
						on:click={slideWeeklyHighlightNext}
						aria-label="Next"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 9.22a.75.75 0 000 1.06l-3 3a.75.75 0 001.06 1.06l2.47-2.47H7.5a.75.75 0 000-1.5h9.94l-2.47-2.47a.75.75 0 00-1.06-1.06l-3 3z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</section>

		<!-- Novel Section -->
		<section class="mb-8">
			<h2 class="text-xl font-bold mb-4">นิยาย แนะนำ</h2>
			<div class="relative">
				<div
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
				>
					{#each visibleNovelProducts as product}
						<div
							class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200 transition duration-200"
							on:click={() => navigateToProduct(product.id)}
						>
							<div class="h-56 mb-2 rounded-md overflow-hidden">
								<img
									src={product.image}
									alt={product.name}
									class="h-full w-full object-scale-down"
								/>
							</div>
							<p class="text-center h-24">{product.name}</p>
							<p class="text-center text-red-500">
								{product.price}
							</p>
						</div>
					{/each}
				</div>

				{#if novelProducts.length > 5}
					<button
						class="absolute top-1/2 -translate-y-1/2 left-4 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition duration-200"
						on:click={slideNovelPrev}
						aria-label="Previous"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-2.47-2.47H16.5a.75.75 0 000-1.5H6.51l2.47-2.47a.75.75 0 10-1.06-1.06l-3 3z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<button
						class="absolute top-1/2 -translate-y-1/2 right-4 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition duration-200"
						on:click={slideNovelNext}
						aria-label="Next"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 9.22a.75.75 0 000 1.06l-3 3a.75.75 0 001.06 1.06l2.47-2.47H7.5a.75.75 0 000-1.5h9.94l-2.47-2.47a.75.75 0 00-1.06-1.06l-3 3z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</section>
	</main>

	<footer class="bg-blue-800 text-white py-8">
		<div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="md:col-span-1">
				<h4 class="text-lg font-semibold mb-3">Links</h4>
				<ul>
					{#each footerLinks as link}
						<li>
							<a
								href={link.url}
								class="hover:text-blue-300 transition-colors duration-300"
								>{link.title}</a
							>
						</li>
					{/each}
				</ul>
			</div>
			<div class="md:col-span-1">
				<h4 class="text-lg font-semibold mb-3">ติดต่อเรา</h4>
				<p>{contactInfo.address}</p>
				<p>โทร: {contactInfo.phone}</p>
				<p>
					อีเมล:
					<a
						href={"mailto:" + contactInfo.email}
						class="hover:text-blue-300 transition-colors duration-300"
						>{contactInfo.email}</a
					>
				</p>
			</div>
			<div class="md:col-span-1">
				<h4 class="text-lg font-semibold mb-3">Social Media</h4>
				<div class="flex space-x-4">
					{#each socialLinks as link}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-blue-300 transition-colors duration-300"
							title={link.label}
						>
							<i class={link.icon}></i>
							<span class="sr-only">{link.label}</span>
						</a>
					{/each}
				</div>
			</div>
			<div
				class="mt-8 border-t border-blue-700 pt-4 text-center col-span-full"
			>
				<p>
					© {new Date().getFullYear()} ร้านหนังสือของป้าแพรวา. All rights
					reserved.
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.container {
		max-width: 1200px; /* Adjust as needed */
		padding-left: 1rem;
		padding-right: 1rem;
		margin-left: auto;
		margin-right: auto;
	}
	/* Moved and simplified .arrow-button styles */
	.arrow-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: #f8f8f8; /* Or any color you prefer */
		padding: 0.5rem;
		border-radius: 50%;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		transition: background-color 0.2s;
		cursor: pointer; /* Add cursor pointer */
	}

	/* sr-only class (screen reader only) */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
	img{

  border-radius: 8px;
  margin-bottom: 10px;

	}
	/* Swiper */
@media screen and (min-width: 1350px) {
	.swiper-button-next{
		position: absolute;
		right: -80px;
	}
	.swiper-button-prev{
		position: absolute;
		left: -80px;
	}
}

@media screen and (max-width: 767px) {
  .swiper-button-next,
  .swiper-button-prev {
    display: none !important;
  }
}

	/*  Font Awesome  */
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
</style>
