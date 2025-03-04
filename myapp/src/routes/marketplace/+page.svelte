<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import { page } from "$app/stores";
    import { load } from "../+layout";

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
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  $: searchedProducts = searchTerm
    ? filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filteredProducts;

  $: sortedProducts = (() => {
    let sorted = [...searchedProducts];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  })();

  $: categories = [...new Set(products.map((product) => product.category))];

  function checkAndRedirect(token, routeId) {
    const isAuthRoute = routeId === "/" || routeId === "/Register";

    if (!token && !isAuthRoute) {
      goto("/");
    } else {
      isLoading.set(false);
    }
  }
  onMount(async () => {
    page.subscribe(async ($page) => {
      userToken = localStorage.getItem("userToken");
      checkAndRedirect(userToken, $page.route.id);
      await fetchProducts();
    });
  });

  // Function to navigate to the seller's profile  --  UPDATED!
  function goToSellerProfile(userId: string) {
    goto(`/storeProfile/${userId}`); //  <--  CHANGED HERE
  }

  function goToBookDetail(bookId) {
    goto(`/marketdetails/${bookId}`);
  }
</script>

{#if !$isLoading}
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
            class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200"
          >
            <img
              src={product.book_image}
              alt={product.book_name}
              class="w-full h-48 object-cover rounded-t-lg"
            />
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">{product.book_name}</h2>
              <p class="text-gray-600 mb-2">{product.description}</p>
              <p class="text-green-600 font-bold text-lg mb-2">
                ฿{product.book_price.toLocaleString()}
              </p>
              <!-- <div class="flex items-center">
                <img
                  src={product.seller.profilePic}
                  alt={product.seller.name}
                  class="w-8 h-8 rounded-full mr-2"
                />
                <button
                  on:click={() => goToSellerProfile(product.seller.userId)}
                  class="text-sm text-blue-600 hover:underline focus:outline-none"
                >
                  {product.seller.name}
                </button>
              </div> -->
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
