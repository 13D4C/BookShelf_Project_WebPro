<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import { page } from "$app/stores";
    import { quintOut } from "svelte/easing";
    import { fade, scale } from "svelte/transition";

  let products: any[] = [];
  const isLoading = writable(true);
  let userToken: string | null;
  let loading = true;
  let error: string | null = null;
  let searchTerm: string = "";
  let selectedCategory: string | null = null;
  let sortBy: "price-asc" | "price-desc" | "newest" | null = null;

  async function fetchProducts() {
    try {
            let url = "http://localhost:3000/seller/books?all=true";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            products = await response.json();
            loading = false;
        } catch (error) {
            console.error("Error fetching books:", error);
            products = [];
        } finally {
            isLoading.set(false);
        }
  }

  $: filteredProducts = selectedCategory
    ? products.filter((product) => product.book_category === selectedCategory)
    : products;

  $: searchedProducts = searchTerm
    ? filteredProducts.filter(
        (product) =>
          product.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filteredProducts;

  $: sortedProducts = (() => {
    let sorted = [...searchedProducts];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.book_price - b.book_price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.book_price - a.book_price);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => b.seller_book_idid - a.seller_book_idid);
    }
    return sorted;
  })();

  $: categories = [...new Set(products.map((product) => product.book_category))];

  onMount(async () => {
      userToken = localStorage.getItem("userToken");
      await fetchProducts();
    });

  function goToBookDetail(bookId) {
    goto(`/marketdetails/${bookId}`);
  }
</script>

{#if $isLoading}<div 
class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"
transition:fade={{ duration: 300 }}
>
<div 
  class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
  transition:scale={{ duration: 300, easing: quintOut }}
></div>
</div>{:else}
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Marketplace</h1>

    <div class="mb-4 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search..."
        bind:value={searchTerm}
        class="border p-2 rounded w-full md:w-1/2"
      />

      <select
        bind:value={selectedCategory}
        class="border p-2 rounded w-full md:w-1/4"
      >
        <option value={null}>All Categories</option>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>

      <select bind:value={sortBy} class="border p-2 rounded w-full md:w-1/4">
        <option value={null}>Sort By</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>

    {#if loading}
      <p>Loading products...</p>
    {:else}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {#each sortedProducts as product (product.seller_book_id)}
          <div
            class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200 h-full flex flex-col"
          >
            <img
              src={product.book_image}
              alt={product.book_name}
              class="w-full h-48 object-cover rounded-t-lg"
            />
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">{product.book_name}</h2>
              <p class="text-gray-600 mb-2 line-clamp-12">{product.description}</p>
            </div>
            <div class="mt-auto">
              <div class="flex items-center">
                <img
                  src={product.user_image}
                  alt={product.user_name}
                  class="w-8 h-8 rounded-full mr-2"
                />
                <p>{product.user_name}</p>
              </div>
              <p class="text-green-600 font-bold text-lg mb-2">
                ฿{product.book_price.toLocaleString()}
              </p>
              <button
                    class="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                    on:click={() => goToBookDetail(product.seller_book_id)}
                  >
                    ซื้อเลย
                  </button>
                </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
