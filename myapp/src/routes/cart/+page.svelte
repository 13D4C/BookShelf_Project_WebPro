<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let selectAll = false;
  let userToken = null;
  const isLoading = writable(true);

  let cart = [];
  let filterType = "official";

  function updateQuantity(index, amount) {
    // Use filteredCart for index calculation, but update the main cart
    const originalIndex = cart.findIndex(
      (item) => item.item_id === filteredCart[index].item_id,
    );

    if (cart[originalIndex].amount + amount > 0) {
      cart[originalIndex].amount += amount;
      // Send update to server
      updateCartItem(cart[originalIndex].item_id, cart[originalIndex].amount);
    }
  }


  //  Modify getTotalPrice to use filteredCart
  function getTotalPrice() {
    let total = filteredCart.reduce((sum, item) => {
      return sum + item.book_price * item.amount;
    }, 0);
    return total.toFixed(2);
  }

  function checkAndRedirect(token, routeId) {
    const isAuthRoute = routeId === "/" || routeId === "/Register";

    if (!token && !isAuthRoute) {
      goto("/");
    } else {
      isLoading.set(false);
    }
  }

  async function removeItem(index) {
    // Find the correct index in the original cart array
    const originalIndex = cart.findIndex(
      (item) => item.item_id === filteredCart[index].item_id,
    );
    const itemToRemove = cart[originalIndex];
    if (itemToRemove.type === "official"){
      try {
        const response = await fetch(
          "http://localhost:3000/shop/publisher/cart/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ item_id: itemToRemove.item_id }),
          },
        );

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            alert(errorData.error);
          } else {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
        }

        const data = await response.json();
        //  Remove the item from the local cart array using the original index
        cart = cart.filter((_, i) => i !== originalIndex);
      } catch (error) {
        alert("Failed to remove item from cart. Please try again.");
      }
    }
  else {
    try {
      const response = await fetch(
        "http://localhost:3000/shop/seller/cart/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ seller_item_id: itemToRemove.seller_item_id }),
        },
      );

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          alert(errorData.error);
        } else {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
      }

      const data = await response.json();
      cart = cart.filter((_, i) => i !== originalIndex);
    } catch (error) {
      alert("Failed to remove item from cart. Please try again.");
    }
  }
  }

  async function fetchCart() {
    try {
      const response = await fetch(
        "http://localhost:3000/shop/publisher/cart/get",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: userToken }),
        },
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      const response2 = await fetch(
        "http://localhost:3000/shop/seller/cart/get",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: userToken }),
        },
      );

      if (!response2.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data2 = await response2.json();
      let officialCart = data.cart_info
        ? data.cart_info.map((item) => ({ ...item, type: "official" }))
        : [];
      let sellerCart = data2.cart_info
        ? data2.cart_info.map((item) => ({ ...item, type: "seller" }))
        : [];

      cart = [...officialCart, ...sellerCart];
    } catch (error) {
      console.error("Skibidi Error", error);
    }
  }

  // Filter the cart based on filterType
  $: filteredCart = cart.filter((item) => {
    if (filterType === "all") {
      return true;
    } else if (filterType === "official") {
      return item.type === "official";
    } else {
      return item.type === "seller";
    }
  });

  async function updateCartItem(itemId, newAmount) {
    try {
      // Determine which API endpoint to use based on item type.
      const itemToUpdate = cart.find((item) => item.item_id === itemId);
      let url = "http://localhost:3000/shop/publisher/cart/update"; // Default to official cart

      if (itemToUpdate && itemToUpdate.type === "seller") {
        url = "http://localhost:3000/shop/seller/cart/update"; // URL for seller cart updates
      }

      const response = await fetch(url, {
        method: "PUT", // Use PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId, amount: newAmount }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          alert(errorData.error);
        } else {
          const errorData = await response.json(); //get error from body
          throw new Error(
            `Network response was not ok: ${response.status}, ${errorData.error}`,
          ); //show error
        }
      }
      //optional show success message
      //const data = await response.json(); //if return message
      //alert(data.message);
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert("Failed to update cart. Please try again.");
      // Re-fetch the cart to get the correct state from the server
      await fetchCart();
    }
  }

  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    checkAndRedirect(userToken, $page.route.id);
    await fetchCart();
    });
</script>

{#if $isLoading}
  <div>Loading...</div>
{:else}
  <div class="flex flex-col md:flex-row gap-6 p-6">
    <!-- Cart Section -->
    <div class="flex-1 bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2>

      <!-- Filter Buttons -->
      <div class="mb-4">
        <button
          class="px-4 py-2 rounded {filterType === 'official'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200'}"
          on:click={() => (filterType = "official")}
        >
          Official
        </button>
        <button
          class="px-4 py-2 rounded {filterType === 'seller'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200'}"
          on:click={() => (filterType = "seller")}
        >
          Seller
        </button>
      </div>
      {#if filterType === "official"}
      {#each filteredCart as item, index (item.item_id)}
        <div class="flex items-center gap-4 border-b pb-4 mb-4">
          <img
            src={item.book_image}
            alt="Product"
            class="w-20 h-20 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h3 class="text-sm font-medium">{item.book_name_th}</h3>
            <p class="text-lg font-semibold text-blue-600">
              {item.book_price} บาท
            </p>
            <!-- Display item type (optional, for debugging) -->
            <!-- <p class="text-xs text-gray-500">Type: {item.type}</p>  -->
          </div>
          <div class="flex items-center">
            <button
              class="px-2 py-1 border rounded"
              on:click={() => updateQuantity(index, -1)}
            >
              -
            </button>
            <span class="px-4">{item.amount}</span>
            <button
              class="px-2 py-1 border rounded"
              on:click={() => updateQuantity(index, 1)}
            >
              +
            </button>
          </div>
          <button
            class="text-gray-500 hover:text-red-500"
            on:click={() => removeItem(index)}
          >
            🗑️
          </button>
        </div>
      {:else}
        <p>ไม่มีสินค้าในตะกร้า</p>
      {/each}
      {:else}
      {#each filteredCart as item, index (item.seller_item_id)}
        <div class="flex items-center gap-4 border-b pb-4 mb-4">
          <img
            src={item.book_image}
            alt="Product"
            class="w-20 h-20 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h3 class="text-sm font-medium">{item.book_name_th}</h3>
            <p class="text-lg font-semibold text-blue-600">
              {item.book_price} บาท
            </p>
            <!-- Display item type (optional, for debugging) -->
            <!-- <p class="text-xs text-gray-500">Type: {item.type}</p>  -->
          </div>
          <div class="flex items-center">
            <button
              class="px-2 py-1 border rounded"
              on:click={() => updateQuantity(index, -1)}
            >
              -
            </button>
            <span class="px-4">{item.amount}</span>
            <button
              class="px-2 py-1 border rounded"
              on:click={() => updateQuantity(index, 1)}
            >
              +
            </button>
          </div>
          <button
            class="text-gray-500 hover:text-red-500"
            on:click={() => removeItem(index)}
          >
            🗑️
          </button>
        </div>
      {:else}
        <p>ไม่มีสินค้าในตะกร้า</p>
      {/each}
      {/if}
    </div>

    <!-- Order Summary -->
    <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow self-start">
      <h2 class="text-lg font-semibold mb-4">สรุปการสั่งซื้อ</h2>
      <div class="flex justify-between mb-2">
        <span>จำนวนหนังสือ</span>
        <span
          >{filteredCart.reduce((sum, item) => sum + item.amount, 0)} เล่ม</span
        >
      </div>
      <div class="flex justify-between font-bold text-lg">
        <span>ยอดสุทธิ</span>
        <span>{getTotalPrice()} บาท</span>
      </div>

      <button
        class="w-full bg-green-500 text-white py-2 rounded mt-4"
        on:click={() => goto(`/checkout?type=${filterType}`)}
      >
        ดำเนินการต่อ
      </button>
      <button
        class="w-full border mt-2 py-2 rounded"
        on:click={() => goto("/all")}
      >
        เลือกสินค้าต่อ
      </button>
    </div>
  </div>
{/if}
