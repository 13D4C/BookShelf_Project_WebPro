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

  function updateQuantity(index, amount) {
    if (cart[index].amount + amount > 0) {
      cart[index].amount += amount;
    }
  }

  function toggleSelectAll() {
    selectAll = !selectAll;
    cart = cart.map((item) => ({ ...item, selected: selectAll }));
  }

  function getTotalPrice() {
    let total = cart.reduce((sum, item) => {
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
    const itemToRemove = cart[index];

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
      cart = cart.filter((_, i) => i !== index);
      getTotalPrice();
    } catch (error) {
      alert("Failed to remove item from cart. Please try again.");
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
      cart = data.cart_info;
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  }

  onMount(async () => {
    page.subscribe(async ($page) => {
      userToken = localStorage.getItem("userToken");
      checkAndRedirect(userToken, $page.route.id);
      await fetchCart();
    });
  });
</script>

{#if $isLoading}{:else}
  <div class="flex flex-col md:flex-row gap-6 p-6">
    <!-- Cart Section -->
    <div class="flex-1 bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2>
      {#each cart as item, index}
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
          </div>
          <div class="flex items-center">
            <button
              class="px-2 py-1 border rounded"
              on:click={() => updateQuantity(index, -1)}>-</button
            >
            <span class="px-4">{item.amount}</span>
            <button
              class="px-2 py-1 border rounded"
              on:click={() => updateQuantity(index, 1)}>+</button
            >
          </div>
          <button
            class="text-gray-500 hover:text-red-500"
            on:click={() => removeItem(index)}>🗑️</button
          >
        </div>
      {/each}
    </div>

    <!-- Order Summary -->
    <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow self-start">
      <h2 class="text-lg font-semibold mb-4">สรุปการสั่งซื้อ</h2>
      <div class="flex justify-between mb-2">
        <span>จำนวนหนังสือ</span>
        <span>{cart.reduce((sum, item) => sum + item.amount, 0)} เล่ม</span>
      </div>
      <div class="flex justify-between font-bold text-lg">
        <span>ยอดสุทธิ</span>
        <span>{getTotalPrice()} บาท</span>
      </div>

      <button class="w-full bg-green-500 text-white py-2 rounded mt-4" on:click={goto('/checkout')}
        >ดำเนินการต่อ</button
      >
      <button class="w-full border mt-2 py-2 rounded" on:click={goto('/all')}>เลือกสินค้าต่อ</button>
    </div>
  </div>
{/if}
