<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { quintOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { fade, scale } from "svelte/transition";
  import { Button, Modal } from "flowbite-svelte";
  import { Li, List, Heading } from "flowbite-svelte";
  let defaultModal = false;

  let userToken = null;
  const isLoading = writable(true);

  let cart = [];
  let filterType = "official";

  async function updateQuantity(index, amount) {
    let url;
    const originalIndex = cart.findIndex(
      (item) =>
        (item.item_id && item.item_id === filteredCart[index].item_id) ||
        (item.seller_item_id &&
          item.seller_item_id === filteredCart[index].seller_item_id),
    );
    console.log(amount);
    if (amount == -1) {
      if (cart[originalIndex].type === "official") {
        url = `http://localhost:3000/shop/publisher/cart/adjust/${cart[originalIndex].item_id}?reduce=true`;
      } else {
        url = `http://localhost:3000/shop/seller/cart/adjust/${cart[originalIndex].seller_item_id}?reduce=true`;
      }
      cart[originalIndex].amount -= 1;
    } else {
      if (cart[originalIndex].type === "official") {
        url = `http://localhost:3000/shop/publisher/cart/adjust/${cart[originalIndex].item_id}?increase=true`;
      } else {
        url = `http://localhost:3000/shop/seller/cart/adjust/${cart[originalIndex].seller_item_id}?increase=true`;
      }
      cart[originalIndex].amount += 1;
    }
    const response = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  function getTotalPrice() {
    let total = filteredCart.reduce((sum, item) => {
      return sum + item.book_price * item.amount;
    }, 0);
    return total.toFixed(2);
  }

  async function removeItem(index) {
    const originalIndex = cart.findIndex(
      (item) =>
        (item.item_id && item.item_id === filteredCart[index].item_id) ||
        (item.seller_item_id &&
          item.seller_item_id === filteredCart[index].seller_item_id),
    );
    const itemToRemove = cart[originalIndex];
    if (itemToRemove.type === "official") {
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
    } else {
      try {
        const response = await fetch(
          "http://localhost:3000/shop/seller/cart/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              seller_item_id: itemToRemove.seller_item_id,
            }),
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
      if (officialCart.length < sellerCart.length) {
        filterType = "seller";
      } else {
        filterType = "official";
      }
      isLoading.set(false);
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

  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    await fetchCart();
  });
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
          Official : {cart.filter((item) => item.type === "official").length}
        </button>
        <button
          class="px-4 py-2 rounded {filterType === 'seller'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200'}"
          on:click={() => (filterType = "seller")}
        >
          Official : {cart.filter((item) => item.type === "seller").length}
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
            </div>
            <div class="flex items-center">
              <div class="px-4">
              {#if item.marker}
                <div class="grid grid-cols-1 gap-4">
                  <Button on:click={() => (defaultModal = true)}
                    >Custom detail</Button
                  >
                </div>
                <Modal title="Custom detail" bind:open={defaultModal} autoclose>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="col-span-1 mb-4 md:mb-0">
                      <div
                        class="h-[330px] md:h-[462px] color-display border rounded-lg flex items-center justify-center"
                      >
                        <div
                          class="h-full border rounded shadow-lg flex flex-col px-4 pt-12 pb-4 overflow-hidden"
                          style="background-color: {item.cover_color};"
                        >
                          <h1
                            class="text-center text-xl font-bold text-white mb-4 break-words w-full overflow-hidden"
                            style="font-size: {item.font_size}px; color:{item.color_text}; font-family: '{item.font_family}', sans-serif;"
                          >
                            {item.marker}
                          </h1>
                          <p
                            class="whitespace-pre-wrap text-center overflow-hidden break-words"
                            style="font-family: '{item.font_family}'"
                          >
                            {item.text}
                          </p>
                          <div
                            class="mt-auto text-center"
                            style="color:{item.color_text}"
                          >
                            <h6
                              class="text-sm md:text-base"
                              style="font-family: '{item.font_family}'"
                            >
                              {item.book_name_th}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-span-1">
                      <Heading
                        tag="h2"
                        customSize="text-lg font-semibold"
                        class="mb-2 text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        List Custom
                      </Heading>
                      <List
                        tag="ul"
                        class="space-y-1 text-gray-500 dark:text-gray-400 text-sm md:text-base"
                      >
                        <Li>Book Name: {item.marker}</Li>
                        <Li>Font Family: {item.font_family}</Li>
                        <Li>Font Size: {item.font_size}</Li>
                        <Li>Color Text: {item.color_text}</Li>
                        <Li>Color Background: {item.cover_color}</Li>
                        <Li>Paper Type: {item.paper_type}</Li>
                        <Li>Cover Type: {item.cover_type}</Li>
                        <Li>Text: {item.text}</Li>
                      </List>
                    </div>
                  </div>

                  <svelte:fragment slot="footer">
                    <div class="w-full flex justify-end space-x-2">
                      <Button color="alternative" class="text-sm md:text-base"
                        >Close</Button
                      >
                    </div>
                  </svelte:fragment>
                </Modal>
              {/if}
            </div>
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
      {#if filteredCart.length != 0}
        <button
          class="w-full bg-green-500 text-white py-2 rounded mt-4"
          on:click={() => goto(`/checkout?type=${filterType}`)}
        >
          ดำเนินการต่อ
        </button>
      {/if}
      <button
        class="w-full border mt-2 py-2 rounded text-white bg-blue-500"
        on:click={() => goto("/all")}
      >
        เลือกสินค้าต่อ
      </button>
    </div>
  </div>
{/if}
