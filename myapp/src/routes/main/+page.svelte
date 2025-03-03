<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte"; // Import onDestroy
  import { page } from "$app/stores";
  import Swiper from "swiper/bundle";
  import { writable } from "svelte/store";
  import "swiper/css/bundle";
  import { generateStars } from "$lib/utils";
  import { Rating, AdvancedRating, ScoreRating } from "flowbite-svelte";

  let products: any[] = [];
  let eachbook: any[] = [];
  const isLoading = writable(true); // This is fine, we'll use it correctly
  let userToken: string | null; // Explicitly type userToken

  async function getBooks() {
    try {
      const response = await fetch("http://localhost:3000/books");
      const response2 = await fetch("http://localhost:3000/books/one-each");

      if (!response.ok && !response2.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      products = await response.json();
      eachbook = await response2.json();
    } catch (error) {
      console.error("Error fetching books:", error);
      products = [];
      eachbook = [];
    } finally {
      isLoading.set(false);
    }
  }
  function getBooksByCategory(category: string, books: any[]) {
    return books.filter(
      (book) =>
        Array.isArray(book.book_category) &&
        book.book_category.includes(category)
    );
  }

  function ProfilePage() {
    goto("/Profile");
  }

  function MainPage() {
    goto("/main");
  }
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
    "Fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Horror",
    "Romance",
    "Historical Fiction",
    "Literary Fiction",
    "Young Adult",
    "Children's",
    "Graphic Novels",
    "Dystopian",
    "Action",
    "Western",
    "Nonfiction",
    "History",
    "Biography/Autobiography",
    "Self-help",
    "Science & Technology",
    "Health & Wellness",
    "Business & Economics",
    "True Crime",
    "Travel",
    "Cookbooks",
    "Art & Photography",
    "Religion & Spirituality",
    "Philosophy",
    "Humor",
    "Essays",
    "Reference",
    "Girl Love",
    "Boy Love",
    "R18+",
    "Light Novel",
    "Manga",
    "Manwha",
    "manhua",
    "Comic",
    "SuperHero",
    "Drama",
    "Adventure",
  ];

  function navigateToProduct(id: number) {
    goto(`/details/${id}`);
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
    visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);
    if (visibleProducts.length < itemsPerPage) {
      visibleProducts = visibleProducts.concat(
        products.slice(0, itemsPerPage - visibleProducts.length)
      );
    }
  }

  let resizeListener: () => void;

  onMount(async () => {
    await getBooks();
    updateItemsPerPage();
    resizeListener = updateItemsPerPage;
    window.addEventListener("resize", resizeListener);

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
        clickable: true,
      },
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

    let swiper2 = new Swiper(".swiper2", {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
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

  onDestroy(() => {
    if (resizeListener) {
      window.removeEventListener("resize", resizeListener);
    }
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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0IUgoI9H2LpPoSSvg5nJxns3acKbS-gdQjQ&s",
  ];
</script>

{#if $isLoading}{:else}
  <div class="h-full bg-blue-50">
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
        {#if products.length == 0}
          <!-- svelte-ignore a11y_missing_attribute -->
          <iframe
            class="aspect-video w-3/4"
            src="https://www.youtube.com/embed/8ytKQE-8-Hw?autoplay=1"
            allow="autoplay"
          >
          </iframe>
        {/if}

        <div class="contents">
          <div class="swiper swiper1">
            <div class="swiper-wrapper">
              {#each products as product}
                <div class="swiper-slide" style="text-align: center;">
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
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
                    <p class="text-center truncate">
                      {product.book_name_th}
                    </p>

                    <Rating id="example-3" total={5} rating={product.book_score}
                    ></Rating>

                    <p class="text-center text-red-500">
                      {product.book_price}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <br /><br />
            <div class="swiper-pagination sm:hidden sm:block"></div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">หมวดหมู่</h2>
        <div class="flex flex-wrap space-x-2">
          {#each categories as category}
            <a
              href="/all?category={encodeURIComponent(category)}"
              class="bg-blue-200 text-blue-800 px-4 py-2 rounded-md mb-2 hover:bg-blue-300 transition duration-200"
            >
              {category}
            </a>
          {/each}
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">หนังสือในแต่ละ หมวดหมู่</h2>

        {#each categories as category}
          {#if getBooksByCategory(category, eachbook).length >= 5}
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                {category}
              </h3>
              <div class="contents">
                <div class="swiper swiper2">
                  <div class="swiper-wrapper">
                    {#each getBooksByCategory(category, eachbook) as product}
                      <div class="swiper-slide">
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                          class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200"
                          on:click={() => navigateToProduct(product.book_id)}
                        >
                          <div class="h-56 mb-2 rounded-md overflow-hidden">
                            <img
                              src={product.book_image}
                              alt={product.book_name_originl}
                              class="h-48 w-96 object-scale-down place-content-center"
                            />
                          </div>
                          <p class="text-center truncate">
                            {product.book_name_originl}
                          </p>
                          <Rating
                            id="example-3"
                            total={5}
                            rating={product.book_score}
                          ></Rating>

                          <p class="text-center text-red-500">
                            {product.book_price}
                          </p>
                        </div>
                      </div>
                    {/each}
                  </div>
                  <div class="swiper-button-next"></div>
                  <div class="swiper-button-prev"></div>
                  <br /><br />
                  <div class="swiper-pagination sm:hidden sm:block"></div>
                </div>
              </div>
            </div>
          {/if}
        {/each}
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
            © {new Date().getFullYear()} ร้านหนังสือของป้าแพรวา. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
{/if}

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
  img {
    border-radius: 8px;
    margin-bottom: 10px;
  }
  /* Swiper */
  /* @media screen and (min-width: 1350px) {
		.swiper-button-next {
			position: absolute;
			right: -80px;
		}
		.swiper-button-prev {
			position: absolute;
			left: -80px;
		}
	} */

  @media screen and (max-width: 767px) {
    .swiper-button-next,
    .swiper-button-prev {
      display: none !important;
    }
  }

  /*  Font Awesome  */
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
</style>
