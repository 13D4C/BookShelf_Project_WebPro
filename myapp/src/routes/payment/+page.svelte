<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let stores = [];
  let loading = true;
  let error = null;

  async function thxPage() {
    try {
      // Upload slips for each store
      for (const store of stores) {
        if (!store.slip) {
          // Handle cases where a slip hasn't been uploaded for a store
          // (This should ideally be prevented by the UI, but it's good to have a check)
          console.warn(`No slip uploaded for store ID ${store.id}`);
          continue; // Skip this store
        }

        const response = await fetch('http://localhost:3000/shop/publisher/payment/upload-proof', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: store.id,
            payment_slip: store.slip, // Send the base64 encoded image data
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to upload slip for store ${store.id}`);
        }
      }

      // If all uploads are successful, navigate to the thank you page
      goto("/thx");

    } catch (err) {
      // Display error to the user
      error = err.message;
      console.error(err);
      alert(err.message); // Or use a more sophisticated error display
    }
  }

    async function fetchOrderDetails(orderIds) {
    try {
      const fetchedStores = [];
      for (const orderId of orderIds) {
          const response = await fetch(`http://localhost:3000/shop/publisher/order/get/${orderId}`);

          if (!response.ok) {
              if (response.status === 204) { // No content
                  console.warn(`No order found for ID ${orderId}`);
                  //You could add a placeholder or skip adding anything to fetchedStores.
                  continue; // Skip to the next ID.
              } else {
                  throw new Error(`Failed to fetch order ${orderId}: ${response.status}`);
              }
          }

          const data = await response.json();
          console.log(data);

          if (data && data.order_info && data.order_info[0] && data.shop && data.shop[0]) {
            // Check if required data exists.  Crucial for robust error handling
            const storeData = {
              id: data.order_info[0].order_id,  //Use the actual order ID
              name: data.shop[0].shop_name,
              qrCode: data.shop[0].qr_code,
              amount: parseFloat(data.order_info[0].total_price), // Ensure amount is a number
              slip: null,
              items: data.item, // Add the items related to this order
              buyer: data.buyer,
              address: data.order_info[0].address,
            };
              fetchedStores.push(storeData);
          } else {
              console.error("Unexpected data structure:", data);
              throw new Error(`Invalid data received for order ID ${orderId}`);
          }
      }
      stores = fetchedStores;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
      console.error(err);
    }
  }


  onMount(async () => {
    const orderIdsParam = $page.url.searchParams.get("order_ids");
    if (orderIdsParam) {
      const orderIds = orderIdsParam.split(",");
      await fetchOrderDetails(orderIds);
    } else {
      error = "No order IDs provided.";
      loading = false;
    }
  });

    function handleSlipUpload(event, storeId) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const storeIndex = stores.findIndex((store) => store.id === storeId);
        if (storeIndex !== -1) {
          const updatedStores = [...stores];
          updatedStores[storeIndex] = {
            ...updatedStores[storeIndex],
            slip: e.target.result,
          };
          stores = updatedStores;
        }
      };
      reader.readAsDataURL(file);
    }
  }


    function calculateTotal() {
    return stores.reduce((total, store) => total + store.amount, 0);
  }

  function allSlipsUploaded() {
    return stores.every(store => store.slip !== null);
  }


  function goToNextPage() {
    goto('/next-page'); // Replace with your actual next page
  }
</script>

<style>
  .slip-preview {
    max-width: 100px;
    max-height: 100px;
    margin: 0 auto;
  }
</style>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold text-blue-900 text-center mb-4">ชำระเงิน</h1>

  {#if loading}
    <p class="text-center">Loading...</p>
  {:else if error}
    <p class="text-red-500 text-center">Error: {error}</p>
  {:else}
    {#each stores as store (store.id)}
      <div class="bg-white p-4 shadow-lg rounded-lg mb-4">
        <h2 class="text-lg font-semibold text-blue-700">{store.name}</h2>
           {#if store.address}
            <p class="text-sm text-gray-600">Address: {store.address}</p>
          {/if}
		  <div class="mt-2">
          <h3 class="text-md font-semibold">Items:</h3>
          <ul>
		  {#each store.items as item}
			  {#if item.marker}
                <li>{item.book_name_th} x {item.amount} - {item.book_price} (Cover color : {item.cover_color} marker : {item.marker})</li>
			  {:else}
				<li>{item.book_name_th} x {item.amount} - {item.book_price}</li>
			  {/if}
          {/each}
        </ul>
          </div>
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-4 md:mb-0">
            <img src={store.qrCode} alt="QR Code {store.name}" class="mx-auto w-32 h-32" />
            <p class="text-center text-blue-600 font-bold mt-2">
              ยอดเงิน: {store.amount.toFixed(2)} บาท
            </p>
          </div>

          <div class="flex flex-col items-center">
            <p class="text-gray-500">อัปโหลดสลิป:</p>
            {#if store.slip}
              <img src={store.slip} alt="Slip Preview" class="slip-preview" />
            {:else}
              <input
                type="file"
                accept="image/*"
                class="mt-2 p-2 border rounded"
                on:change={(event) => handleSlipUpload(event, store.id)}
              />
            {/if}
          </div>
        </div>
      </div>
    {/each}

    <div class="mt-8 p-4 bg-gray-200 rounded-lg">
      <p class="text-xl font-bold text-center">ยอดรวมทั้งหมด: {calculateTotal().toFixed(2)} บาท</p>
    </div>

    {#if allSlipsUploaded()}
      <div class="text-center mt-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={thxPage}
        >
          ดำเนินการต่อ
        </button>
      </div>
    {/if}
  {/if}
</div>