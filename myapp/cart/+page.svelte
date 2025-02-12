<script>
    import { goto } from '$app/navigation';

    function ProfilePage() {
        goto('/Profile');
    }

    function MainPage() {
        goto('/main');
    }

    let selectAll = false;
    let discountCode = "";
    let discountApplied = false; // เช็คว่ามีการใช้โค้ดแล้วหรือยัง

    let cart = [
        { id: 7, name: 'ฝึกวินัยให้คุณแม่', price: 150, image: 'https://miku-doujin.com/uploads/thumbnail/5721960596506d8921948659dc568ba2.jpg', quantity: 1, available: true, selected: false },
        { id: 8,name: 'ถึงเสียตัวก็ไม่บอก',price: 130 ,image: 'https://miku-doujin.com/uploads/thumbnail/504036b078791902bd732c2f817c8968.jpg',quantity: 1, available: true, selected: false },
        { id: 9,name: 'Circle',price: 90 ,image: 'https://doujin-new.com/wp-content/uploads/2023/12/Theater-Society-Circles-200x300.jpg', quantity: 1, available: true, selected: false },
    ];

    function updateQuantity(index, amount) {
        if (cart[index].quantity + amount > 0) {
            cart[index].quantity += amount;
        }
    }

    function removeItem(index) {
        cart = cart.filter((_, i) => i !== index);
    }

    function toggleSelectAll() {
        selectAll = !selectAll;
        cart = cart.map(item => ({ ...item, selected: selectAll }));
    }

    function applyDiscount() {
        if (discountCode === "ManopAV8888") {
            discountApplied = true;
        } else {
            discountApplied = false;
            alert("โค้ดไม่ถูกต้อง!");
        }
    }

    function getTotalPrice() {
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return discountApplied ? (total * 0.85).toFixed(2) : total.toFixed(2);
    }
</script>

<div class="min-h-screen bg-blue-50">
  <header class="bg-blue-900 text-white py-4">
    <div class="container mx-auto flex justify-between items-center">
      <button class="text-xl font-bold" on:click={MainPage}>ร้านหนังสือของป้าแพรวา</button>
      <div class="relative ml-auto">
        <input type="text" placeholder="ค้นหา" class="rounded-md p-2 w-64 text-black" role="search" aria-label="Search" />
        <button class="absolute right-0 top-1/2 -translate-y-1/2 text-blue-900">🔍</button>
      </div>
      <button class="text-2xl ml-6">🛒</button>
      <a href="#" on:click={ProfilePage} class="ml-6 text-2xl">👤</a>
    </div>
  </header>

  <nav class="bg-blue-700 text-white py-2">
    <div class="container mx-auto flex space-x-4">
      <a href="#" class="hover:underline">นิยาย</a>
      <a href="#" class="hover:underline">หนังสือ</a>
      <a href="#" class="hover:underline">บันเทิง</a>
      <a href="#" class="hover:underline">การ์ตูน</a>
    </div>
  </nav>

  <div class="flex flex-col md:flex-row gap-6 p-6">
    <!-- Cart Section -->
    <div class="flex-1 bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2>
      <div class="border-b pb-4 mb-4">
        <input type="checkbox" bind:checked={selectAll} on:click={toggleSelectAll} class="mr-2" />
        <span class="text-blue-500 cursor-pointer" on:click={toggleSelectAll}>
          {selectAll ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกสินค้าทั้งหมด'} ({cart.length})
        </span>
      </div>

      {#each cart as item, index}
        <div class="flex items-center gap-4 border-b pb-4 mb-4">
          <input type="checkbox" bind:checked={item.selected} class="mr-2" />
          <img src={item.image} alt="Product" class="w-20 h-20 object-cover rounded-lg" />
          <div class="flex-1">
            <h3 class="text-sm font-medium">{item.name}</h3>
            <p class="text-lg font-semibold text-blue-600">{item.price} บาท</p>
          </div>
          <div class="flex items-center">
            <button class="px-2 py-1 border rounded" on:click={() => updateQuantity(index, -1)}>-</button>
            <span class="px-4">{item.quantity}</span>
            <button class="px-2 py-1 border rounded" on:click={() => updateQuantity(index, 1)}>+</button>
          </div>
          <button class="text-gray-500 hover:text-red-500" on:click={() => removeItem(index)}>🗑️</button>
        </div>
      {/each}
    </div>

    <!-- Order Summary -->
    <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow self-start">
      <h2 class="text-lg font-semibold mb-4">สรุปการสั่งซื้อ</h2>
      <div class="flex justify-between mb-2">
        <span>ราคา</span>
        <span>{getTotalPrice()} บาท</span>
      </div>

      <div class="flex mb-4">
        <input bind:value={discountCode} placeholder="โค้ดส่วนลด" class="border px-2 py-1 flex-1 rounded-l" />
        <button class="bg-blue-500 text-white px-3 rounded-r" on:click={applyDiscount}>ใช้</button>
      </div>

      {#if discountApplied}
        <p class="text-green-500">✅ ใช้ส่วนลด 15% แล้ว!</p>
      {/if}

      <div class="flex justify-between font-bold text-lg">
        <span>ยอดสุทธิ</span>
        <span>{getTotalPrice()} บาท</span>
      </div>

      <button class="w-full bg-green-500 text-white py-2 rounded mt-4">ดำเนินการต่อ</button>
      <button class="w-full border mt-2 py-2 rounded">ขอใบเสนอราคา</button>
      <button class="w-full border mt-2 py-2 rounded">เลือกสินค้าต่อ</button>
    </div>
  </div>
</div>
