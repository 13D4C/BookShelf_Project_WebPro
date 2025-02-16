<script>
    export let totalAmount = 0;
  
    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // สามารถอัปโหลดไฟล์ได้แต่ไม่แสดงผล
        console.log("ไฟล์ที่อัปโหลด:", file.name);
      }
    }
  
    function goToNextPage() {
      window.location.href = "/next-page"; // แก้ URL ตามหน้าถัดไปที่ต้องการ
    }
  </script>
  
  <style>
    body {
      @apply bg-gray-100;
    }
  </style>
  
  <div class="container mx-auto p-4">
    <h1 class="text-xl font-bold text-blue-900 text-center">ชำระเงิน</h1>
    <div class="bg-white p-4 shadow-lg rounded-lg text-center max-w-sm mx-auto">
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png" alt="QR Code" class="mx-auto" />
      <p class="mt-2 text-blue-600 font-bold">ยอดเงิน: {totalAmount} บาท</p>
      <p class="text-sm text-gray-500">ทุกนาทีอัปเดตอัตโนมัติ, กดเพื่อรีเฟรช</p>
      <input type="file" accept="image/*" class="mt-4 p-2 border rounded" on:change={handleFileUpload} />
      <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" on:click={goToNextPage}>
        ดำเนินการต่อ
      </button>
    </div>
  </div>
  