<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount, onDestroy } from "svelte"; // Import onDestroy
	import Swiper from 'swiper/bundle';
	import 'swiper/css/bundle';

	interface Product {
		id: number;
		name: string;
		price: string;
		image: string;
		book_id?: number; // Optional, since some products might not have it
		book_name_th?: string; // Optional
		book_image?: string;   // Optional
		book_price?: string; // Optional
	}

	let products: Product[] = [
		{
			book_id: 1,
			name: "ยอดนักสืบจิ๋วโคนัน เล่ม 100",
			image: "https://miku-doujin.com/uploads/thumbnail/5721960596506d8921948659dc568ba2.jpg",
			price: "150 บาท",
		},
		{
			book_id: 2,
			name: "ดาบพิฆาตอสูร เล่ม 23",
			image: "https://miku-doujin.com/uploads/thumbnail/5721960596506d8921948659dc568ba2.jpg",
			price: "90 บาท",
		},
		{
			book_id: 3,
			name: "มหาเวทย์ผนึกมาร เล่ม 0",
			image: "https://miku-doujin.com/uploads/thumbnail/5721960596506d8921948659dc568ba2.jpg",
			price: "120 บาท",
		},
		{
			book_id: 4,
			name: "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว เล่ม 18",
			image: "https://miku-doujin.com/uploads/thumbnail/5721960596506d8921948659dc568ba2.jpg",
			price: "350 บาท",
		},
		{
			book_id: 5,
			name: "One Piece เล่ม 105",
			image: "https://www.mbookstore.com/images_book/978/978616464982/9786164649828_1_full.jpg?1702279275",
			price: "95 บาท",
		},
		{
			book_id: 6,
			name: "SPY x FAMILY เล่ม 10",
			image: "https://www.mbookstore.com/images_book/978/978616575966/9786165759669_1_full.jpg?1709519277",
			price: "120 บาท",
		},
	];


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
	let weeklyHighlightProducts: Product[] = [
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
	let novelProducts: Product[] = [
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
			id: 14,
			name: "เกิดชาตินี้พี่ต้องเทพ",
			price: "230 บาท",
			image: "https://images-se-ed.com/ws/Storage/Originals/552284/015/5522840154347L.jpg?h=90e2ce479a1a9e85f6fb7821ced24629",
		},
		{
			id: 15,
			name: "Sword Art Online",
			price: "230 บาท",
			image: "https://th.bing.com/th/id/OIP.RsRj05nfWlKr8UyNBYj8_wHaLS?rs=1&pid=ImgDetMain",
		},
		{
			id: 16,
			name: "Nisekoi",
			price: "230 บาท",
			image: "https://th.bing.com/th/id/OIP.FaPFujqjjVjyQ-b4SRilNAHaLc?rs=1&pid=ImgDetMain",
		},
	];
	const footerLinks = [
		{ title: "เกี่ยวกับเรา", url: "/about" },
		{ title: "ติดต่อเรา", url: "/contact" },
		{ title: "นโยบายความเป็นส่วนตัว", url: "/privacy" },
	];

	const socialLinks = [
		{
			icon: "fab fa-facebook-f",
			url: "https://www.facebook.com/yourpage",
			label: "Facebook",
		},
		{
			icon: "fab fa-twitter",
			url: "https://twitter.com/yourhandle",
			label: "Twitter",
		},
		{
			icon: "fab fa-instagram",
			url: "https://www.instagram.com/youraccount",
			label: "Instagram",
		},
	];

	const contactInfo = {
		address: "123 ถ.สุขุมวิท, กรุงเทพฯ",
		phone: "02-123-4567",
		email: "info@example.com",
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


    // --- Swiper Section ---
    interface SectionConfig {
        products: Product[];
        title: string;
        swiperClass: string;
        nextButtonClass: string;
        prevButtonClass: string;
        paginationClass: string;
		refreshInterval?: number; 
    }

    const sections: SectionConfig[] = [
        {
            products: products,
            title: "สินค้าออกใหม่",
            swiperClass: "swiper-new-products",
            nextButtonClass: "swiper-button-next-new",
            prevButtonClass: "swiper-button-prev-new",
            paginationClass: "swiper-pagination-new",
			refreshInterval: 100,
        },
        {
            products: weeklyHighlightProducts,
            title: "สินค้าขายดีประจำสัปดาห์",
            swiperClass: "swiper-weekly",
            nextButtonClass: "swiper-button-next-weekly",
            prevButtonClass: "swiper-button-prev-weekly",
            paginationClass: "swiper-pagination-weekly",
			refreshInterval: 100,
        },
        {
            products: novelProducts,
            title: "นิยาย แนะนำ",
            swiperClass: "swiper-novel",
            nextButtonClass: "swiper-button-next-novel",
            prevButtonClass: "swiper-button-prev-novel",
            paginationClass: "swiper-pagination-novel",
			refreshInterval: 100,
        },
    ];

    let itemsPerPageMap: Record<string, number> = {}; // Store itemsPerPage for each section
	let swiperInstances: Swiper[] = []; // Store Swiper instances
	let refreshTimers: NodeJS.Timeout[] = [];

    function updateItemsPerPage(sectionClass: string) {
        const width = window.innerWidth;
        if (width < 640)
            itemsPerPageMap[sectionClass] = 1;
        else if (width < 768)
            itemsPerPageMap[sectionClass] = 3;
        else if (width < 1024)
            itemsPerPageMap[sectionClass] = 4;
        else
            itemsPerPageMap[sectionClass] = 5;
    }

	function destroySwipers() {
		swiperInstances.forEach(swiper => {
			if (swiper && swiper.destroy) { // Check if destroy is available
				swiper.destroy(true, true); // Clean up Swiper instance
			}
		});
		swiperInstances = []; // Clear the array
	}

		function initSwiper() {
		// Destroy existing swipers before re-initializing
		destroySwipers();

		sections.forEach(section => {
			updateItemsPerPage(section.swiperClass); // Initialize itemsPerPage

			const swiper = new Swiper("." + section.swiperClass, {
				slidesPerView: itemsPerPageMap[section.swiperClass] || 5, // Default to 5 if not found
				spaceBetween: 30,
				freeMode: true,
				navigation: {
					nextEl: "." + section.nextButtonClass,
					prevEl: "." + section.prevButtonClass,
				},
				pagination: {
					el: "." + section.paginationClass,
					clickable: true
				},
			});

			swiperInstances.push(swiper); // Store the Swiper instance

			// Set up refresh interval, storing the timer ID
			if (section.refreshInterval) {
				const timerId = setInterval(() => {
					// Use getVirtualData to re-render without re-fetching data
					swiper.update(); // Just update the Swiper instance
					//console.log(`Refreshing ${section.title}`);
				}, section.refreshInterval);
				refreshTimers.push(timerId);
			}


		});
	}



    onMount(() => {
        initSwiper();

        window.addEventListener('resize', () => {
            sections.forEach(section => {
                updateItemsPerPage(section.swiperClass);
            });
             // No need to destroy here; it's handled in initSwiper
			initSwiper()
        });

		// Clear intervals on component destruction
        return () => {
            window.removeEventListener('resize', () => {
				sections.forEach(section=>{
					updateItemsPerPage(section.swiperClass)
				})
				initSwiper()
			});

			// Clear all refresh timers
			refreshTimers.forEach(timerId => clearInterval(timerId));
			destroySwipers();  //Destroy Swiper when unmount

        };
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

		{#each sections as section}
    <section class="mb-8 relative">
        <h2 class="text-xl font-bold mb-4">{section.title}</h2>
        <div class="contents">
            <div class={section.swiperClass + " swiper"}>
                <div class="swiper-wrapper">
                    {#each section.products as product}
                        <div class="swiper-slide">
                            <div
                                class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200"
                                on:click={() => navigateToProduct(product.book_id || product.id)}
                            >
                                <div class="h-56 mb-2 rounded-md overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        class="h-48 w-96 object-scale-down place-content-center"
                                    />
                                </div>
                                <p class="text-center truncate">{product.name}</p>
                                <p class="text-center text-red-500">{product.price}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <div class={section.nextButtonClass + " swiper-button-next"}></div>
            <div class={section.prevButtonClass + " swiper-button-prev"}></div>
            <br><br>
            <div class={section.paginationClass + " swiper-pagination sm:hidden sm:block"}></div>
        </div>
    </section>
{/each}



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
	.swiper-button-next-new, .swiper-button-next-weekly, .swiper-button-next-novel{
		position: absolute;
		right: -80px;
	}
	.swiper-button-prev-new, .swiper-button-prev-weekly, .swiper-button-prev-novel{
		position: absolute;
		left: -80px;
	}
}

@media screen and (max-width: 767px) {
  .swiper-button-next-new,
  .swiper-button-prev-new,
  .swiper-button-next-weekly,
  .swiper-button-prev-weekly,
  .swiper-button-next-novel,
  .swiper-button-prev-novel
    {
    display: none !important;
  }
}

	/*  Font Awesome  */
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
</style>