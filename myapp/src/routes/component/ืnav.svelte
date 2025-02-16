<script>
    import { goto } from '$app/navigation';
  
    function goToProfilePage() {
      goto('/profile'); // ใช้ camelCase สำหรับชื่อฟังก์ชัน
    }
  
    function goToMainPage() {
      goto('/'); // โดยทั่วไปหน้าหลักมักจะอยู่ที่ root ('/')
    }
  
    let searchQuery = ''; // เพิ่มตัวแปรสำหรับเก็บค่าใน input
  
    function handleSearch() {
      // ทำอะไรบางอย่างกับ searchQuery เช่น redirect ไปหน้าผลลัพธ์การค้นหา
      // ตัวอย่าง:
      goto(`/search?q=${searchQuery}`); // ส่ง query parameter
      // หรือถ้ามี component สำหรับแสดงผลลัพธ์การค้นหา ก็อาจจะ set state บางอย่าง
    }
  
    // (Optional) Handle Enter key press in search input
    function handleSearchKeyDown(event) {
      if (event.key === 'Enter') {
        handleSearch();
      }
    }
  
  </script>
  
  <div class="min-h-screen bg-blue-50">
    <header class="bg-blue-900 text-white py-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Make the store name clickable -->
        <button class="text-xl font-bold" on:click={goToMainPage}>
          ร้านหนังสือของป้าแพรวา
        </button>
        <div class="relative ml-auto">
          <input
            type="text"
            placeholder="ค้นหา"
            class="rounded-md p-2 w-64 text-black"
            role="search"
            aria-label="Search"
            bind:value={searchQuery}  <!-- Bind ค่า input กับตัวแปร -->
            on:keydown={handleSearchKeyDown}  <!-- (Optional) Handle Enter key -->
          />
          <button
            class="absolute right-0 top-1/2 -translate-y-1/2 text-blue-900 p-2"
            on:click={handleSearch}
          >
            🔍
          </button>
        </div>
         <button class="text-2xl ml-6" on:click={() => goto('/cart')}>🛒</button>
        <button class="ml-6 text-2xl" on:click={goToProfilePage}>👤</button>
      </div>
    </header>
    <!-- Navigation -->
    <nav class="bg-blue-700 text-white py-2">
      <div class="container mx-auto flex space-x-4">
        <a href="/novel" class="hover:underline">นิยาย</a>
        <a href="/book" class="hover:underline">หนังสือ</a>
        <a href="/entertainment" class="hover:underline">บันเทิง</a>
        <a href="/comic" class="hover:underline">การ์ตูน</a>
      </div>
    </nav>
  </div>