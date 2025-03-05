<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; // Import สำหรับ SvelteKit

  // Mock Data (คุณสามารถย้ายไปไว้ใน +page.server.js ได้ตามที่แนะนำก่อนหน้านี้)
  export let stores = [
    { id: 1, name: "ร้าน A", qrCode: "https://th.bing.com/th/id/OIP.VfrGvim12lMo8DRnHOCTlwHaHU?rs=1&pid=ImgDetMain", amount: 75, slip: null },
    { id: 2, name: "ร้าน B", qrCode: "https://th.bing.com/th/id/OIP.VfrGvim12lMo8DRnHOCTlwHaHU?rs=1&pid=ImgDetMain", amount: 50, slip: null} // เพิ่มร้าน B เพื่อให้เห็นภาพ
  ];

  function thxPage() {
		goto("/thx");
	}



  onMount(() => {
    // (Optional) fetch QR Codes here
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


  // ฟังก์ชันตรวจสอบว่าอัปโหลดสลิปครบทุกร้านหรือยัง
  function allSlipsUploaded() {
    return stores.every(store => store.slip !== null);
  }

  // ฟังก์ชันสำหรับไปหน้าถัดไป (ใช้ SvelteKit's navigation)
    function goToNextPage() {
        goto('/next-page'); // เปลี่ยน '/next-page' เป็น path จริงของหน้าถัดไป
    }

</script>

<style>
  /* (Optional) เพิ่ม custom styles ได้ที่นี่ */
  .slip-preview {
    max-width: 100px;
    max-height: 100px;
    margin: 0 auto;
  }
</style>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold text-blue-900 text-center mb-4">ชำระเงิน</h1>

  {#each stores as store (store.id)}
    <div class="bg-white p-4 shadow-lg rounded-lg mb-4">
      <h2 class="text-lg font-semibold text-blue-700">{store.name}</h2>
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="mb-4 md:mb-0">
          <img src={store.qrCode} alt="QR Code {store.name}" class="mx-auto w-32 h-32" />
          <p class="text-center text-blue-600 font-bold mt-2">
            ยอดเงิน: {store.amount} บาท
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
    <p class="text-xl font-bold text-center">ยอดรวมทั้งหมด: {calculateTotal()} บาท</p>
  </div>

    {#if allSlipsUploaded()}
      <div class="text-center mt-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={thxPage()}
        >
          ดำเนินการต่อ
        </button>
      </div>
    {/if}
</div>