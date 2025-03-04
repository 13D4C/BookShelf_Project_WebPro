<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { getUser } from "$lib/utils";


  let book = {}; // Initialize as an empty object
  let quantity = 1;
  let relatedBooks: any[] = [];
  let isLoadingRelatedBooks = true;
  let isLoadingBook = true;
  let errorMessage = "";
  let userToken: string | null;
  let userId: Number;
  let bookId = $page.params.id;
  let update = true;



  onMount(async () => {
      userToken = localStorage.getItem("userToken");
      await getUser(userToken).then((user) => {
        userId = user.user_id;
      });
    });



  function navigateToProduct(id: number) {
    goto(`/marketdetails/${id}`);
  }

  // Reactive statement to fetch data
  $: if ($page.params.id || update) {
    quantity = 1;
    bookId = $page.params.id;
    fetchBookData(bookId);
    update = false;
  }

  async function fetchBookData(bookId: string) {
    isLoadingBook = true;
    isLoadingRelatedBooks = true;
    errorMessage = "";

    try {
      const response = await fetch(`http://localhost:3000/seller/books?id=${bookId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        book = data;
      } else {
        book = {}; // Handle case where no book is found
        errorMessage = "Book not found";
      }
    } catch (error) {
      console.error("Error fetching main book details:", error);
      errorMessage = "Failed to load book details. Please try again later.";
    } finally {
      isLoadingBook = false;
      isLoading.set(false);
    }

    if (book.owner_id) {
      try {
        const response = await fetch(
          `http://localhost:3000/seller/books?ownerId=${book.owner_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        relatedBooks = data;
      } catch (error) {
        console.error("Error fetching related books:", error);
        errorMessage = "Failed to load related books.";
        relatedBooks = [];
      } finally {
        isLoadingRelatedBooks = false;
      }
    } else {
      relatedBooks = [];
      isLoadingRelatedBooks = false;
    }
  }

  const isLoading = writable(true);
  const API_BASE = "http://localhost:3000";


  async function addToCart(bookId: number, amount: number) {
    try {
      const response = await fetch(
        "http://localhost:3000/shop/seller/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_book_id: bookId,
            token: userToken,
            amount,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert("Book not found");
          throw new Error(`Book not found`);
        }
        const errorData = await response.json();
        throw new Error(
          `Failed to add to cart: ${errorData.error} - ${errorData.details}`
        );
      }
      goto($page.url);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Add to cart failed");
    }
  }
</script>

{#if $isLoading}{:else}
  <div class="min-h-screen bg-blue-50">
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
                  <img
                    class="w-full rounded-lg object-cover"
                    src={book.book_image}
                    alt={book.book_name}
                  />
              </div>
            {/if}
          </div>

          <!-- Book Details -->
          <div class="space-y-4">
            <h1 class="text-3xl font-bold">
              {book.book_name}
            </h1>
            <p class="text-2xl text-red-600 font-semibold">
                {book.book_price} บาท
            </p>

            <div class="flex items-center">
              <label class="mr-2 text-lg">จำนวน</label>
              <button
                class="px-4 py-2 bg-gray-500 rounded text-xl"
                on:click={() => (quantity = Math.max(1, quantity - 1))}
                >-</button
              >
              <span class="px-4 text-xl">{quantity}</span>
              <button
                class="px-4 py-2 bg-gray-300 rounded text-xl"
                on:click={() => quantity++}>+</button
              >
            </div>

            <div class="flex gap-4">
              <button
                class="px-8 py-3 border border-orange-500 text-orange-500 rounded text-lg"
                on:click={() => addToCart(book.seller_book_id, quantity)}
                >ใส่รถเข็น</button
              >
            </div>
            <div class="mt-8">
              <h2 class="text-xl font-semibold">รายละเอียด :</h2>
              <p class="text-gray-600 mt-2">{book.description}</p>
            </div>
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
              <div
                class="bg-gray-200 h-40 rounded-lg overflow-hidden"
                on:click={() => navigateToProduct(related.seller_book_id)}
              >
                {#if related.book_image}
                  <img
                    class="h-48 w-96 object-scale-down place-content-center"
                    src={related.book_image}
                    alt={related.book_name_originl || "Related Book"}
                    loading="lazy"
                  />
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
{/if}

<style>
  .comment-textarea {
    resize: vertical; /* Allow vertical resizing */
  }
  .comment-form-controls {
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
    justify-content: space-between;
  }
  .score-label {
    margin-right: 0.5rem;
    font-weight: 500;
    align-self: center;
  }

  .score-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.25rem;
    align-self: center;
  }
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .submit-comment-button {
    padding: 0.5rem 1rem;
    background-color: #f97316; /* Orange-500 */
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    align-self: flex-end;
  }

  .submit-comment-button:hover {
    background-color: #ea580c; /* Darker orange on hover */
  }

  /* Comments List */
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Spacing between comments */
  }

  .comment-card {
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: #fff;
  }

  /* Comment Header */
  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .user-image {
    width: 2.5rem; /* Slightly larger avatar */
    height: 2.5rem;
    border-radius: 50%; /* Circular avatar */
    margin-right: 0.75rem;
    object-fit: cover; /* Ensure image covers the space */
  }
  .placeholder-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e2e8f0; /* Light gray background */
    color: #4a5568;
    font-weight: 500;
    text-transform: uppercase;
  }
  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 500;
    color: #2d3748;
  }

  .timestamp {
    font-size: 0.75rem;
    color: #718096; /* Gray color for timestamp */
  }

  /* Comment Body */
  .comment-body {
    margin-bottom: 0.5rem;
    color: #4a5568;
    word-wrap: break-word; /* Handle long words */
  }

  .delete-button,
  .reply-button {
    padding: 0.25rem 0.5rem;
    background-color: transparent;
    color: #718096;
    border: 1px solid #cbd5e0;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .delete-button:hover,
  .reply-button:hover {
    background-color: #e2e8f0;
    color: #2d3748;
  }

  /* Reply Section */
  .reply-section {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.25rem;
    background-color: #f8fafc;
    margin-left: 3rem; /* Indent reply section */
  }

  .reply-textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.25rem;
    resize: vertical;
    margin-bottom: 0.5rem;
  }

  .submit-reply-button {
    padding: 0.25rem 0.75rem;
    background-color: #3490dc; /* Blue-500 */
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;
  }

  .submit-reply-button:hover {
    background-color: #2779bd; /* Darker blue on hover */
  }

  /* Replies List */
  .replies-list {
    margin-top: 0.5rem;
    margin-left: 3rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .reply-comment {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background-color: #f8fafc;
  }
  .reply-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .reply-body {
    margin-bottom: 0.5rem;
    color: #4a5568;
    word-wrap: break-word;
  }
  /* No Comments */
  .no-comments {
    color: #718096;
    font-style: italic;
  }
  textarea {
    resize: none;
  }
</style>
