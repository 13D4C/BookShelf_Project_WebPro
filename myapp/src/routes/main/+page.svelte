<script>
    import { goto } from "$app/navigation";

    let products = [
        {
            id: 1,
            name: "แฟนเช่า 1",
            price: "100 บาท",
            image: "https://upload.wikimedia.org/wikipedia/th/b/b9/Rent-A-Girlfriend%2C_volume_1_thai_version.jpg",
        },
        {
            id: 2,
            name: "Bluelock 1",
            price: "120 บาท",
            image: "https://storage.naiin.com/system/application/bookstore/resource/product/202209/559989/6000065220_front_XXL.jpg?imgname=BLUE-LOCK-%E0%B8%82%E0%B8%B1%E0%B8%87%E0%B8%94%E0%B8%A7%E0%B8%A5%E0%B9%81%E0%B8%82%E0%B9%89%E0%B8%87-%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1-1",
        },
        {
            id: 3,
            name: "Blue Box 1",
            price: "80 บาท",
            image: "https://down-th.img.susercontent.com/file/acca9e4811a1d28473c307449f0484c2",
        },
        {
            id: 4,
            name: "Yosuga no sora",
            price: "60 บาท",
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659108226i/9468160.jpg",
        },
        {
            id: 5,
            name: "Jujutsu kaisen",
            price: "80 บาท",
            image: "https://prodimage.images-bn.com/pimages/9781974751884_p0_v3_s1200x630.jpg",
        },
        {
            id: 6,
            name: "Jujutsu kaisen",
            price: "80 บาท",
            image: "https://prodimage.images-bn.com/pimages/9781974751884_p0_v3_s1200x630.jpg",
        },
    ];

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

    function navigateToProduct(id) {
        goto(`/product/${id}`);
    }

    let currentIndex = 0;
    let visibleProducts = products.slice(0, 5);

    function slideNext() {
        currentIndex = (currentIndex + 1) % products.length;
        visibleProducts = products.slice(currentIndex, currentIndex + 5);
        if (visibleProducts.length < 5) {
            visibleProducts = visibleProducts.concat(
                products.slice(0, 5 - visibleProducts.length),
            );
        }
    }

    function slidePrev() {
        currentIndex = (currentIndex - 1 + products.length) % products.length;
        visibleProducts = products.slice(currentIndex, currentIndex + 5);
        if (visibleProducts.length < 5) {
            visibleProducts = products
                .slice(products.length - (5 - visibleProducts.length))
                .concat(visibleProducts);
        }
    }
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

    let smallBannerImages = [
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/56108c72-51ea-4e26-8de9-008fde4723c4/dfhaomu-59c653ab-3da1-4c81-9a4b-bbd042eec441.jpg/v1/fill/w_1280,h_427,q_75,strp/hentai_banner_by_bankysenpai_dfhaomu-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDI3IiwicGF0aCI6IlwvZlwvNTYxMDhjNzItNTFlYS00ZTI2LThkZTktMDA4ZmRlNDcyM2M0XC9kZmhhb211LTU5YzY1M2FiLTNkYTEtNGM4MS05YTRiLWJiZDA0MmVlYzQ0MS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.iARBneFwUhe2l5QaD7tde0SZRIUGiBQxZnFadq0DFMQ",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0IUgoI9H2LpPoSSvg5nJxns3acKbS-gdQjQ&s",
    ];
</script>

<div class="min-h-screen bg-blue-50">
    <!-- Header -->
    <header class="bg-blue-900 text-white py-4">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-xl font-bold">ร้านหนังสือของป้าแพรวา</div>
            <div class="relative">
                <input
                    type="text"
                    placeholder="ค้นหา"
                    class="rounded-md p-2 w-64"
                />
                <button class="absolute right-2 top-2 text-blue-900">
                    🔍
                </button>
            </div>
            <div class="text-2xl">🛒</div>
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
                class="col-span-3 relative bg-gray-300 h-64 rounded-lg overflow-hidden"
            >
                <img
                    src={bannerImages[currentBannerIndex]}
                    alt="Banner"
                    class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
                />
            </div>

            <!-- Small Banners -->
            <div class="space-y-4">
                <div class="bg-gray-300 h-20 rounded-lg overflow-hidden">
                    <img
                        src={smallBannerImages[0]}
                        alt="Small Banner 1"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="bg-gray-300 h-20 rounded-lg overflow-hidden">
                    <img
                        src={smallBannerImages[1]}
                        alt="Small Banner 2"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>

        <section class="mb-8 relative">
            <h2 class="text-xl font-bold mb-4">สินค้าออกใหม่</h2>
            <div class="grid grid-cols-5 gap-4">
                {#each visibleProducts as product}
                    <div
                        class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200"
                        on:click={() => navigateToProduct(product.id)}
                    >
                        <div class="h-56 mb-2 rounded-md overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <p class="text-center">{product.name}</p>
                        <p class="text-center text-red-500">{product.price}</p>
                    </div>
                {/each}
            </div>

            <button
                class="absolute top-1/2 -translate-y-1/2 left-[-80px] bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
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
                class="absolute top-1/2 -translate-y-1/2 right-[-80px] bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
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
            </button>
        </section>

        <!-- Categories -->
        <section class="mb-8">
            <h2 class="text-xl font-bold mb-4">หมวดหมู่</h2>
            <div class="flex space-x-2">
                {#each categories as category}
                    <button
                        class="bg-blue-200 text-blue-800 px-4 py-2 rounded-md"
                    >
                        {category}
                    </button>
                {/each}
            </div>
        </section>
        <section class="mb-8 relative">
            <h2 class="text-xl font-bold mb-4">สินค้าขายดีประจำสัปดาห์</h2>
            <div class="grid grid-cols-5 gap-4">
                {#each visibleWeeklyHighlightProducts as product}
                    <div
                        class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200"
                        on:click={() => navigateToProduct(product.id)}
                    >
                        <div class="h-56 mb-2 rounded-md overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <p class="text-center">{product.name}</p>
                        <p class="text-center text-red-500">{product.price}</p>
                    </div>
                {/each}
            </div>

            <button
                class="absolute top-1/2 -translate-y-1/2 left-[-80px] bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
                on:click={slideWeeklyHighlightPrev}
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
                class="absolute top-1/2 -translate-y-1/2 right-[-80px] bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
                on:click={slideWeeklyHighlightNext}
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
            </button>
        </section>
    </main>
</div>

<style>
    .container {
        max-width: 1200px;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .arrow-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: #f8f8f8;
        padding: 0.5rem;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s;
    }

    .arrow-button:hover {
        background-color: #e2e8f0;
    }
</style>
