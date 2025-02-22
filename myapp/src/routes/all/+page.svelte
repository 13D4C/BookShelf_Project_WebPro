<script lang="ts">
    import { goto } from "$app/navigation";
    import Navbar from "$lib/components/navbar.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { page } from "$app/stores";
    import { generateStars } from "$lib/utils";

    let books: any[] = [];
    let userToken: string | null;
    let search: string | null;
    let uniqueCategories: any[] = [];
    let selectedCategory = null; // Initially, no category is selected
    let showTrustedOnly = false;
    let cards: any[] = [];
    const isLoading = writable(true);

    function getUniqueCategories(booksData) {
        let categories = new Set();

        booksData.forEach((book) => {
            if (book.book_category) {
                const individualCategories = book.book_category.split(",");
                individualCategories.forEach((category) => {
                    categories.add(category);
                });
            }
        });

        return Array.from(categories);
    }

    async function getBooks() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const nameParam = urlParams.get("name");
            let url = "http://localhost:3000/books/searched/f?";
            if (nameParam) {
                search = nameParam;
                url += `name=${encodeURIComponent(nameParam)}`;
            } else {
                url = "http://localhost:3000/books?all=true";
            }
            console.log(url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            books = await response.json();
            uniqueCategories = getUniqueCategories(books); // Calculate here after books are fetched

            // Check for category parameter and apply filter *after* books are loaded.
            const categoryParam = urlParams.get("category");
            if (categoryParam) {
                selectedCategory = categoryParam; // Set selectedCategory directly.
            }

        } catch (error) {
            console.error("Error fetching books:", error);
            books = [];
            uniqueCategories = []; // Also reset uniqueCategories on error.
        } finally {
            isLoading.set(false);
        }
    }



    // Function to filter books based on selected category
    function filterBooks(category) {
        selectedCategory = category;
        equalizeCardHeights(); // Re-equalize after filtering
    }


    // Reactive statement to filter books
    $: filteredBooks = (() => {
        let result = books;

        if (selectedCategory !== null) {
            result = result.filter(
                (book) =>
                    book.book_category &&
                    book.book_category.includes(selectedCategory),
            );
        }

        // if (showTrustedOnly) {
        //     result = result.filter(book => book.trusted);
        // }

        return result;
    })();

  $: if (books.length > 0) {
    // Chain the dependency: recalculate when 'books' changes
        equalizeCardHeights();
    }

    $: if(filteredBooks) {
        equalizeCardHeights();
    }

    // Function to navigate to book detail page
    function goToBookDetail(bookId) {
        goto(`/details/${bookId}`); // Use the goto function
    }

    // onMount lifecycle hook
    onMount(async () => {
        cards = document.querySelectorAll(".book-card");
        page.subscribe(($page) => {
            userToken = localStorage.getItem("userToken");
            checkAndRedirect(userToken, $page.route.id);

        });
        await getBooks(); // Initial fetch of books
    });



    function equalizeCardHeights() {
      // Use querySelectorAll directly on the filtered books' container if possible.  If not, a slight delay is needed.
         if (!cards.length) return; // Exit if no cards

        let maxHeight = 0;

        // Reset heights first (important for responsiveness)
        cards.forEach((card) => {
            card.style.height = "auto";
        });

        // Find the maximum height
        cards.forEach((card) => {
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });

        // Set all cards to the maximum height
        cards.forEach((card) => {
            card.style.height = `${maxHeight}px`;
        });
    }

    $: $page.url && getBooks();

    function checkAndRedirect(token: string | null, routeId: string | null) {
        const isAuthRoute = routeId === "/" || routeId === "/Register";

        if (!token && !isAuthRoute) {
            goto("/");
        } else {
             //isLoading.set(false); // moved to getBooks()
        }
    }

    function clearSearch() {
        isLoading.set(true);
        goto("/all");
    }


</script>

{#if $isLoading}
{:else}
    <Navbar />

    <div class="min-h-screen bg-white">
        <div class="max-w-6xl mx-auto p-4">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-3xl font-bold text-blue-700">ร้านหนังสือ</h1>
            </div>

            <!-- Main content area with flex layout -->
            <div class="flex gap-4">
                <!-- Sidebar -->
                <aside
                    class="w-[20%] border border-blue-500 p-4 rounded-lg bg-blue-50 h-fit"
                >
                    <h2 class="text-xl font-semibold text-blue-700">
                        หมวดหมู่
                    </h2>
                    <ul class="mt-2 space-y-2">
                        <li
                            class="text-blue-600 cursor-pointer hover:underline"
                            on:click={() => filterBooks(null)}
                        >
                            ทั้งหมด
                        </li>
                        {#each uniqueCategories as category}
                            <li
                                class="text-blue-600 cursor-pointer hover:underline"
                                on:click={() => filterBooks(category)}
                                class:font-bold={selectedCategory === category}
                            >
                                {category}
                            </li>
                        {/each}
                    </ul>
                </aside>

                <!-- Book list and checkbox container -->
                <div class="w-[80%]">
                    <!-- Checkbox (placed above the book grid) -->
                    <div class="mb-4">
                        <label class="flex items-center space-x-2">
                            {#if search}<button on:click={clearSearch}  class="btn btn-primary" >{search} ❌</button>{/if}
                            <input
                                type="checkbox"
                                bind:checked={showTrustedOnly}
                                class="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span class="text-sm text-gray-700"
                                >แสดงเฉพาะร้านค้าที่น่าเชื่อถือ</span
                            >
                        </label>
                    </div>
                    <!-- Book grid -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {#each filteredBooks as book}
                            <div
                                class="book-card border border-blue-500 rounded-lg shadow-lg bg-white flex flex-col"
                            >
                                <!-- Image container with fixed height -->
                                <div class="p-4">
                                    <img
                                        src={book.book_image}
                                        alt={book.book_name_originl}
                                        class="object-contain w-full h-[200px] rounded"
                                    />
                                </div>

                                <!-- Text and button container -->
                                <div class="px-4 pb-4 flex-grow">
                                    <p class="font-semibold text-blue-700">
                                        {book.book_name_originl}
                                    </p>
                                    {@html generateStars(book.book_score)}
                                    <p class="text-blue-500 font-bold">
                                        {book.book_price}
                                    </p>
                                    <button
                                        class="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                                        on:click={() =>
                                            goToBookDetail(book.book_id)}
                                    >
                                        ซื้อเลย
                                    </button>
                                </div>
                            </div>
                        {:else}
                            <p>No books in this category.</p>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}