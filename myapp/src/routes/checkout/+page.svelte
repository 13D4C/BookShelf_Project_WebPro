<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { getUser } from "$lib/utils";
  // State variables for form inputs
  let userToken = "";
  let cart = [];
  let Name = "";
  let email = "";
  let phone = "";
  let address = "";
  let city = "";
  let province = "";
  let postalCode = "";

  // Example data for provinces (replace with your actual data source)
  const provinces = [
    "กรุงเทพมหานคร",
    "กระบี่",
    "กาญจนบุรี",
    "กาฬสินธุ์",
    "กำแพงเพชร",
    "ขอนแก่น",
    "จันทบุรี",
    "ฉะเชิงเทรา",
    "ชลบุรี",
    "ชัยนาท",
    "ชัยภูมิ",
    "ชุมพร",
    "เชียงราย",
    "เชียงใหม่",
    "ตรัง",
    "ตราด",
    "ตาก",
    "นครนายก",
    "นครปฐม",
    "นครพนม",
    "นครราชสีมา",
    "นครศรีธรรมราช",
    "นครสวรรค์",
    "นนทบุรี",
    "นราธิวาส",
    "น่าน",
    "บึงกาฬ",
    "บุรีรัมย์",
    "ปทุมธานี",
    "ประจวบคีรีขันธ์",
    "ปราจีนบุรี",
    "ปัตตานี",
    "พระนครศรีอยุธยา",
    "พะเยา",
    "พังงา",
    "พัทลุง",
    "พิจิตร",
    "พิษณุโลก",
    "เพชรบุรี",
    "เพชรบูรณ์",
    "แพร่",
    "ภูเก็ต",
    "มหาสารคาม",
    "มุกดาหาร",
    "แม่ฮ่องสอน",
    "ยโสธร",
    "ยะลา",
    "ร้อยเอ็ด",
    "ระนอง",
    "ระยอง",
    "ราชบุรี",
    "ลพบุรี",
    "ลำปาง",
    "ลำพูน",
    "เลย",
    "ศรีสะเกษ",
    "สกลนคร",
    "สงขลา",
    "สตูล",
    "สมุทรปราการ",
    "สมุทรสงคราม",
    "สมุทรสาคร",
    "สระแก้ว",
    "สระบุรี",
    "สิงห์บุรี",
    "สุโขทัย",
    "สุพรรณบุรี",
    "สุราษฎร์ธานี",
    "สุรินทร์",
    "หนองคาย",
    "หนองบัวลำภู",
    "อ่างทอง",
    "อำนาจเจริญ",
    "อุดรธานี",
    "อุตรดิตถ์",
    "อุทัยธานี",
    "อุบลราชธานี",
  ];
  // Function to handle form submission (replace with your actual submission logic)
  async function handleSubmit() {
    if (
      !Name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !province ||
      !postalCode
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // Basic email validation (you should use a more robust validation in production)
    if (!email.includes("@")) {
      alert("อีเมลไม่ถูกต้อง");
      return;
    }
    // Basic Phone validation
    const phoneRegex = /^[0-9]{9,10}$/; //  9 or 10 digits
    if (!phoneRegex.test(phone)) {
      alert("เบอร์โทรศัพท์ไม่ถูกต้อง ความยาว 9-10 ตัวอักษร");
      return;
    }
    // Basic postal code validation
    const postalCodeRegex = /^[0-9]{5}$/; // Exactly 5 digits
    if (!postalCodeRegex.test(postalCode)) {
      alert("รหัสไปรษณีย์ไม่ถูกต้อง ความยาว 5 ตัวอักษร");
      return;
    }

    // Construct the shipping data object
    const shippingData =
      address + " " + city + " " + province + " " + postalCode;
    // @ts-ignore
    try {
      let url;
      if ($page.url.searchParams.get("type") === "official") {
        url = "http://localhost:3000/shop/publisher/order/create";
      } else {
        url = "http://localhost:3000/shop/seller/order/create";
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          fullname: Name,
          email,
          phone,
          address: shippingData,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
        ); // Throw error with server message
      }

      const data = await response.json();
      Name = "";
      email = "";
      phone = "";
      address = "";
      goto("/payment"); // Example redirect
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
  function getTotalPrice() {
    let total = cart.reduce((sum, item) => {
      return sum + item.book_price * item.amount;
    }, 0);
    return total.toFixed(2);
  }
  async function fetchCart() {
    if ($page.url.searchParams.get("type") == "official") {
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
    } else {
      try {
        const response = await fetch(
          "http://localhost:3000/shop/seller/cart/get",
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
  }

  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    await fetchCart();
  });
</script>

<div class="flex flex-col md:flex-row gap-6 p-6">
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
          <span class="px-4">{item.amount}</span>
        </div>
      </div>
    {/each}
  </div>

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
  </div>
</div>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">ข้อมูลการจัดส่ง</h1>

  <form
    on:submit|preventDefault={handleSubmit}
    class="grid grid-cols-1 md:grid-cols-2 gap-4"
  >
    <div>
      <label for="firstName" class="block text-sm font-medium text-gray-700"
        >ชื่อ - นามสกุล</label
      >
      <input
        type="text"
        id="firstName"
        bind:value={Name}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700"
        >อีเมล</label
      >
      <input
        type="email"
        id="email"
        bind:value={email}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700"
        >เบอร์โทรศัพท์</label
      >
      <input
        type="tel"
        id="phone"
        bind:value={phone}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div class="md:col-span-2">
      <label for="address" class="block text-sm font-medium text-gray-700"
        >ที่อยู่</label
      >
      <input
        type="text"
        id="address"
        bind:value={address}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label for="city" class="block text-sm font-medium text-gray-700"
        >ตำบล/แขวง</label
      >
      <input
        type="text"
        id="city"
        bind:value={city}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>
    <div>
      <label for="province" class="block text-sm font-medium text-gray-700"
        >จังหวัด</label
      >
      <select
        id="province"
        bind:value={province}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      >
        <option value="" disabled selected>เลือกจังหวัด</option>
        {#each provinces as provinceOption}
          <option value={provinceOption}>{provinceOption}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="postalCode" class="block text-sm font-medium text-gray-700"
        >รหัสไปรษณีย์</label
      >
      <input
        type="text"
        id="postalCode"
        bind:value={postalCode}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div class="md:col-span-2">
      <button
        type="submit"
        class="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        สั่งซื้อสินค้า
      </button>
    </div>
  </form>
</div>
