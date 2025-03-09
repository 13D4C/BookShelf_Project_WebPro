<script lang="ts">
  import { goto } from "$app/navigation";
  import Navbar from "$lib/components/navbar.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { page } from "$app/stores";
  import { generateStars } from "$lib/utils";
  import {
    Sidebar,
    SidebarBrand,
    SidebarCta,
    SidebarDropdownItem,
    SidebarDropdownWrapper,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
    Rating,
    AdvancedRating,
    ScoreRating,
  } from "flowbite-svelte";
  import { Drawer, Button, CloseButton } from "flowbite-svelte";
  import { FilterSolid } from "flowbite-svelte-icons";
  import { quintOut, sineIn } from "svelte/easing";
    import { fade, scale } from "svelte/transition";
  let hidden1 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };

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
          book.book_category && book.book_category.includes(selectedCategory)
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

  $: if (filteredBooks) {
    equalizeCardHeights();
  }

  // Function to navigate to book detail page
  function goToBookDetail(bookId) {
    goto(`/details/${bookId}`); // Use the goto function
  }

  // onMount lifecycle hook
  onMount(async () => {
    cards = document.querySelectorAll(".book-card");
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

  function clearSearch() {
    isLoading.set(true);
    goto("/all");
  }
</script>

{#if $isLoading}
<div 
class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"
transition:fade={{ duration: 300 }}
>
<div 
  class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
  transition:scale={{ duration: 300, easing: quintOut }}
></div>
</div>
{:else}
  <div class="min-h-screen bg-white">
    <div class="max-w-6xl mx-auto p-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-bold text-blue-700">ร้านหนังสือ</h1>
      </div>

      <!-- Main content area with flex layout -->
      <div class="flex gap-4">
        <!-- Sidebar -->
        <aside
          class="hidden lg:block w-[20%] border border-blue-500 p-4 rounded-lg bg-blue-50 h-fit"
        >
          <h2 class="text-xl font-semibold text-blue-700">หมวดหมู่</h2>
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
        <div class="md:container md:mx-auto">
          <!-- Checkbox (placed above the book grid) -->
          <div class="mb-4">
            <label class="flex items-center w-full justify-between">
              <div class="flex items-center space-x-2">
                {#if search}
                  <button on:click={clearSearch} class="btn btn-primary"
                    >{search} ❌</button
                  >
                {/if}
                <input
                  type="checkbox"
                  bind:checked={showTrustedOnly}
                  class="form-checkbox h-5 w-5 text-blue-600"
                />
                <span class="text-sm text-gray-700"
                  >แสดงเฉพาะร้านค้าที่น่าเชื่อถือ</span
                >
              </div>
              <Button
                class="block lg:hidden"
                on:click={() => (hidden1 = false)}
              >
                <FilterSolid class="w-5 h-5 me-2.5" />Filter
              </Button>
            </label>

            <Drawer
              transitionType="fly"
              {transitionParams}
              bind:hidden={hidden1}
              id="sidebar1"
            >
              <div class="flex items-center">
                <h5
                  id="drawer-label"
                  class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
                >
                  <FilterSolid class="w-5 h-5 me-2.5" />Filter
                </h5>
                <CloseButton
                  on:click={() => (hidden1 = true)}
                  class="mb-4 dark:text-white"
                />
              </div>
              <h2 class="text-xl font-semibold text-blue-700">หมวดหมู่</h2>
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
            </Drawer>
          </div>
          <!-- Book grid -->
          <div class="md:container md:mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  <p class="font-semibold text-blue-700 truncate">
                    {book.book_name_th}
                  </p>
                  <Rating id="example-3" total={5} rating={book.book_score}
                  ></Rating>

                  <p class="text-blue-500 font-bold">
                    {book.book_price}
                  </p>
                  <button
                    class="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                    on:click={() => goToBookDetail(book.book_id)}
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
