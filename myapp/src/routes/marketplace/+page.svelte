<script lang="ts">
    import { onMount } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import { goto } from '$app/navigation';
  
    interface Product {
      id: number;
      title: string;
      price: number;
      description: string;
      category: string;
      image: string;
      location: string;
      seller: {
        name: string;
        profilePic: string;
        userId: string; // Add userId to the seller object
      };
    }
  
    let products: Product[] = [];
    let loading = true;
    let error: string | null = null;
    let searchTerm: string = '';
    let selectedCategory: string | null = null;
    let sortBy: 'price-asc' | 'price-desc' | 'newest' | null = null;
  
      async function fetchProducts() {
      try {
      await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData: Product[] = [
          {
            id: 1,
            title: "Vintage Leather Jacket",
            price: 75,
            description: "Classic brown leather jacket in excellent condition.",
            category: "Clothing",
            image: "https://via.placeholder.com/300x400?text=Jacket",
            location: "Bangkok",
            seller: { name: "John Doe", profilePic: "https://via.placeholder.com/50?text=JD", userId: "user123" }, // Added userId
          },
          {
            id: 2,
            title: "Antique Wooden Chair",
            price: 120,
            description: "Hand-carved wooden chair from the early 20th century.",
            category: "Furniture",
            image: "https://via.placeholder.com/300x400?text=Chair",
            location: "Chiang Mai",
            seller: { name: "Jane Smith", profilePic: "https://via.placeholder.com/50?text=JS", userId: "user456" }, // Added userId
          },
          {
            id: 3,
            title: "Used Smartphone",
            price: 200,
            description: "Good condition, unlocked, 64GB storage.",
            category: "Electronics",
            image: "https://via.placeholder.com/300x400?text=Phone",
            location: "Phuket",
            seller: { name: "David Lee", profilePic: "https://via.placeholder.com/50?text=DL", userId: "user789" }, // Added userId
          },
        ];
         products = mockData;
        }
        catch (err:any) {
        error = `Error: ${err.message || err}`;
        } finally {
         loading = false;
        }
      }
  
      $: filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;
  
      $: searchedProducts = searchTerm
      ? filteredProducts.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : filteredProducts;
      
    $: sortedProducts = (() => {
      let sorted = [...searchedProducts];
      if (sortBy === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        sorted.sort((a, b) => b.id - a.id);
      }
      return sorted;
    })();
  
      $: categories = [...new Set(products.map((product) => product.category))];
  
    onMount(async () => {
      await fetchProducts();
    });
  
      // Function to navigate to the seller's profile  --  UPDATED!
      function goToSellerProfile(userId: string) {
          goto(`/storeProfile/${userId}`); //  <--  CHANGED HERE
      }
  </script>
  
  <Navbar />
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Marketplace</h1>
  
    <div class="mb-4 flex flex-col md:flex-row gap-4">
       <input
        type="text"
        placeholder="Search..."
        bind:value={searchTerm}
        class="border p-2 rounded w-full md:w-1/2"
      />
  
      <select bind:value={selectedCategory} class="border p-2 rounded w-full md:w-1/4">
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
    {:else if error}
      <p class="text-red-500">Error: {error}</p>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each sortedProducts as product (product.id)}
          <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
            <img src={product.image} alt={product.title} class="w-full h-48 object-cover rounded-t-lg" />
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">{product.title}</h2>
              <p class="text-gray-600 mb-2">{product.description}</p>
              <p class="text-green-600 font-bold text-lg mb-2">฿{product.price.toLocaleString()}</p>
              <p class="text-sm text-gray-500 mb-2">
                <i class="fas fa-map-marker-alt"></i> {product.location}
              </p>
               <div class="flex items-center">
                <img src={product.seller.profilePic} alt={product.seller.name} class="w-8 h-8 rounded-full mr-2" />
                  <button
                    on:click={() => goToSellerProfile(product.seller.userId)}
                    class="text-sm text-blue-600 hover:underline focus:outline-none"
                  >
                    {product.seller.name}
                  </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />