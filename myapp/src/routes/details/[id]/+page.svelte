<script lang='ts'>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let book = {}; // Initialize as an empty object
    let quantity = 1;
    let relatedBooks = [];
    let isLoadingRelatedBooks = true;
    let isLoadingBook = true;
    let errorMessage = '';

    $: discountedPrice = book.discount
        ? book.price * (1 - book.discount / 100)
        : book.price;

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="text-yellow-500">★</span>';
        }
        if (halfStar) {
            starsHTML +=
                '<svg class="text-yellow-500 inline-block h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="text-gray-300">★</span>';
        }
        return starsHTML;
    }

    function navigateToProduct(id: number) {
        goto(`/details/${id}`);
    }
    function ProfilePage() {
        goto('/Profile');
    }

    function MainPage() {
        goto('/main');
    }

    // Reactive statement to fetch data
    $: if ($page.params.id) {
        fetchBookData($page.params.id);
    }

    async function fetchBookData(bookId: string) {
        isLoadingBook = true;
        isLoadingRelatedBooks = true;
        errorMessage = ''; // Reset error message

        try {
            const response = await fetch(`http://localhost:3000/books?id=${bookId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                book = data;
            } else {
                book = {}; // Handle case where no book is found
                errorMessage = 'Book not found';
            }
        } catch (error) {
            console.error("Error fetching main book details:", error);
            errorMessage = "Failed to load book details. Please try again later.";
        } finally {
            isLoadingBook = false;
        }

        // Fetch related books
        if (book.serie_id) {
            try {
                const response = await fetch(`http://localhost:3000/books/series/${book.serie_id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                relatedBooks = data;
            } catch (error) {
                console.error('Error fetching related books:', error);
                errorMessage = 'Failed to load related books.';
                relatedBooks = [
                    { image: 'https://via.placeholder.com/200', title: 'Book 1' },
                    { image: 'https://via.placeholder.com/200', title: 'Book 2' },
                    { image: 'https://via.placeholder.com/200', title: 'Book 3' },
                ];
            } finally {
                isLoadingRelatedBooks = false;
            }
        } else {
            relatedBooks = []; // Clear related books if no serie_id
            isLoadingRelatedBooks = false;
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


    <nav class="bg-blue-700 text-white py-2">
        <div class="container mx-auto flex space-x-4">
            <a href="#" class="hover:underline">นิยาย</a>
            <a href="#" class="hover:underline">หนังสือ</a>
            <a href="#" class="hover:underline">บันเทิง</a>
            <a href="#" class="hover:underline">การ์ตูน</a>
        </div>
    </nav>

    <div class="max-w-5xl mx-auto p-6">
        {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {/if}

        {#if isLoadingBook}
            <div class="animate-pulse">
                <div class="h-64 bg-gray-300 rounded-lg"></div>
                <div class="mt-4 space-y-2">
                    <div class="h-6 bg-gray-300 rounded"></div>
                    <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        {:else}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Book Image -->
                <div class="relative">
                    {#if book.book_image}
                        <div class="max-w-xs">
                            <img class="w-full rounded-lg object-cover" src={book.book_image} alt={book.book_name_originl} />
                        </div>
                    {/if}
                </div>

                <!-- Book Details -->
                <div class="space-y-4">
                    <h1 class="text-3xl font-bold">{book.book_name_originl}</h1>
                    <div class="flex items-center">
                        {@html generateStars(book.book_score)}
                        <span class="text-gray-800 ml-7 text-lg">({book.book_score})</span>
                    </div>
                    <p class="text-2xl text-red-600 font-semibold">
                        {#if book.discount}
                            <span class="line-through text-gray-600 text-lg">{book.book_price} บาท</span>
                            {discountedPrice.toFixed(0)} บาท
                        {:else}
                            {book.book_price} บาท
                        {/if}
                    </p>

                    <div class="flex items-center">
                        <label class="mr-2 text-lg">จำนวน</label>
                        <button class="px-4 py-2 bg-gray-500 rounded text-xl"
                            on:click={() => (quantity = Math.max(1, quantity - 1))}>-</button>
                        <span class="px-4 text-xl">{quantity}</span>
                        <button class="px-4 py-2 bg-gray-300 rounded text-xl" on:click={() => quantity++}>+</button>
                    </div>

                    <div class="flex gap-4">
                        <button class="px-8 py-3 border border-orange-500 text-orange-500 rounded text-lg">ใส่รถเข็น</button>
                        <button class="px-8 py-3 bg-orange-500 text-white rounded text-lg">ซื้อ</button>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="mt-8">
                <h2 class="text-xl font-semibold">รายละเอียด : </h2>
                <p class="text-gray-600 mt-2">{book.book_descriptions}</p>
            </div>

            <!-- Reviews -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-100 p-4 rounded-lg">
                    <p class="text-3xl font-bold">{Math.round(book.book_score * 10) / 10}</p>
                    <div class="mt-2">{@html generateStars(book.book_score)}</div>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg">
                    <h3 class="font-semibold">รีวิวจากลูกค้า</h3>
                    <p class="text-gray-600 mt-2">{book.reviewText}</p>
                </div>
            </div>
        {/if}

        <!-- Related Books -->
        <div class="mt-8">
            <h2 class="text-xl font-semibold">หนังสือที่เกี่ยวข้อง</h2>
            {#if isLoadingRelatedBooks}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {#each Array(4) as _}
                        <div class="bg-gray-200 h-40 rounded-lg animate-pulse"></div>
                    {/each}
                </div>
            {:else}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {#each relatedBooks as related}
                        <div class="bg-gray-200 h-40 rounded-lg overflow-hidden" on:click={() => navigateToProduct(related.book_id)}>
                            {#if related.book_image}
                                <img class="h-full w-full object-cover" src={related.book_image}
                                    alt={related.book_name_originl || 'Related Book'} loading="lazy" />
                            {/if}
                        </div>
                    {:else}
                        <p>No related books found.</p>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
    }
</style>