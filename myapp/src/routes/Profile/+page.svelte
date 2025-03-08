<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getUser } from "$lib/utils"; // Make sure this path is correct
  import { writable } from "svelte/store";
  import { fade, scale, slide } from "svelte/transition"; // Import transitions
  import { quintOut } from "svelte/easing";

  // --- State & Variables ---
  const isLoading = writable(true);
  let user: any = {};
  let activeMenu = "account"; // Start on account
  let userToken: string | null;
  let qrCodeImage: string | null = null;
  let idCardImage: string | null = null;
  let isOpen = false; // For mobile menu
  let expandedOrderId = null;

  // --- Orders Data ---
  let orders: any[] = []; //  Use any[] for more flexibility
  let seller_orders: any[] = []; // Use any[]
  let shop_orders: any[] = [];
  let shop_seller: any[] = [];

  // --- Seller Request Data ---
  let sellerRequest: any = null; // Store seller request data
  let isSellerRequestLoading = writable(false);

  // --- Temp Data ----
  let tracking_number = '';
  let showTrackingModal = false;
  let showTrackingModalSeller = false;
  let order_id = 0;

  // --- Helper Functions ---

  function formatDate(dateString: string) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "รอการชำระเงิน":
        return "text-yellow-500";
      case "กำลังดำเนินการ": // Added to handle new status
        return "text-blue-500";
      case "อนุมัติ":
        return "text-green-500";
      case "จัดส่งแล้ว":
        return "text-green-500";
      case "ไม่อนุมัติ":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  }

  function formatCurrency(amount: number) {
    return amount.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    });
  }

  // --- Event Handlers ---

  function handleFileUpload(event: Event, type: "qr" | "id") {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "qr") {
          qrCodeImage = e.target?.result as string;
        } else {
          idCardImage = e.target?.result as string;
        }
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  async function updateUser(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedUserData = {
      user_name: formData.get("name")?.toString().trim(), // Use optional chaining and trim
      user_email: formData.get("email")?.toString().trim(), // Use optional chaining and trim
      user_pass: formData.get("pass")?.toString().trim(), // Get password (even if empty), and trim
    };

    if (
      !updatedUserData.user_name ||
      !updatedUserData.user_email ||
      !updatedUserData.user_pass
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      const userId = user.user_id;
      if (!userId) return;

      const response = await fetch("http://localhost:3000/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, user_data: updatedUserData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update user object with *only* the provided data
      user = { ...user, ...updatedUserData };
      alert("อัปเดตข้อมูลสำเร็จ!");
      goto("/Profile");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล!");
    }
  }

  async function submitShopRequest(event: Event) {
    event.preventDefault();

    if (!qrCodeImage || !idCardImage) {
      alert("กรุณาอัปโหลดรูป QR Code และบัตรประชาชน");
      return;
    }

    try {
      if (!userToken) return;

      const response = await fetch(
        "http://localhost:3000/user/request-seller",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            qr_code: qrCodeImage,
            proof_image: idCardImage,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorData.message || "Unknown error"
          }`,
        );
      }
      const result = await response.json();
      // Refetch seller request status after successful submission
      await fetchSellerRequestStatus();

      if (result.success) {
        alert(result.message || "คำขอเปิดร้านค้าถูกส่งแล้ว!");
      } else {
        alert(result.message || "เกิดข้อผิดพลาดในการส่งคำขอ!");
      }
    } catch (error) {
      console.error("Error submitting shop request:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      qrCodeImage = null;
      idCardImage = null;
      const qrCodeInput = document.getElementById("qrCode") as HTMLInputElement;
      const idCardInput = document.getElementById("idCard") as HTMLInputElement;

      if (qrCodeInput) qrCodeInput.value = "";
      if (idCardInput) idCardInput.value = "";
    }
  }

  // --- Menu Toggle (Mobile) ---
  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }


  // -- Modal --
  function closeTrackingModal() {
    showTrackingModal = false;
    tracking_number = '';
    order_id = 0;
  }

  function openTrackingModal(order_id_in:any) {
    order_id = order_id_in
    showTrackingModal = true;
  }
  
  function openTrackingModalSeller(order_id_in:any) {
    order_id = order_id_in
    showTrackingModalSeller = true;
  }

  function closeTrackingModalSeller() {
    showTrackingModalSeller = false;
    tracking_number = '';
    order_id = 0;
  }
  // --- Order Details Toggle ---
  function toggleOrderDetails(orderId: string | number) {
    // Use type assertion since expandedOrder can be string | number | null
    expandedOrderId = expandedOrderId === orderId ? null : orderId;
  }

  // --- Image Upload for Orders (Publisher) ---
  let fileInputs = {}; // Store file input refs per orderId
  let base64Images = {}; // Store Base64 strings per orderId

  // --- Image Upload for Orders (Seller) ---
  let fileInputsSeller = {};
  let base64ImagesSeller = {};

  function handleFileChangeOrder(orderId: string | number, event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (!file) {
      base64Images = { ...base64Images, [orderId]: "" }; // Clear if no file
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      base64Images = { ...base64Images, [orderId]: "" }; // Clear if no file
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; // Clear input
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds the limit (5MB).");
      base64Images = { ...base64Images, [orderId]: "" }; // Clear if no file
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; // Clear input
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Use object spread for immutability
      base64Images = { ...base64Images, [orderId]: reader.result as string };
    };
    reader.onerror = () => {
      base64Images = { ...base64Images, [orderId]: "" };
      alert("Error reading file.");
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; // Clear input
      }
    };
    reader.readAsDataURL(file);
  }

  async function uploadSlip(orderId: string | number) {
    if (!base64Images[orderId]) {
      alert("Please select a payment slip image.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/shop/publisher/payment/upload-proof",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            payment_slip: base64Images[orderId],
            // payment_time: new Date().toISOString()  // No need, backend handles this
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Failed to upload payment proof.";
        alert(errorMessage);
        return;
      }

      // Success!  Update UI (e.g., refetch orders, show a message)
      alert("Payment proof submitted successfully!");

      // Find the order in the 'orders' array and update its status *and* payment_slip
      orders = orders.map((order) => {
        if (order.order_id === orderId) {
          return {
            ...order,
            payment_slip: base64Images[orderId],
            order_status: "กำลังดำเนินการ",
          }; //Update status
        }
        return order;
      });
      base64Images = { ...base64Images, [orderId]: "" }; //clear image
      if (fileInputs[orderId]) {
        fileInputs[orderId].value = ""; //clear input
      }
    } catch (error) {
      console.error("Error uploading slip:", error);
      alert(`Error: ${error.message}`); // Display error to user
    }
  }

  function handleFileChangeOrderSeller(orderId: string | number, event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (!file) {
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds the limit (5MB).");
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      base64ImagesSeller = {
        ...base64ImagesSeller,
        [orderId]: reader.result as string,
      };
    };
    reader.onerror = () => {
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" };
      alert("Error reading file.");
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = "";
      }
    };
    reader.readAsDataURL(file);
  }

  async function uploadSlipSeller(orderId: string | number) {
    if (!base64ImagesSeller[orderId]) {
      alert("Please select a payment slip image.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/shop/seller/payment/upload-proof", // Correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_order_id: orderId,
            payment_slip: base64ImagesSeller[orderId],
            // payment_time: new Date().toISOString() // Let the backend handle this
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Failed to upload payment proof.";
        alert(errorMessage);
        return;
      }

      alert("Payment proof submitted successfully!");

      // Update seller_orders, similar to how we update 'orders'
      seller_orders = seller_orders.map((order) => {
        if (order.order_id === orderId) {
          return {
            ...order,
            payment_slip: base64ImagesSeller[orderId],
            order_status: "กำลังดำเนินการ", // Or whatever status you want
          };
        }
        return order;
      });
      base64ImagesSeller = { ...base64ImagesSeller, [orderId]: "" }; //clear image
      if (fileInputsSeller[orderId]) {
        fileInputsSeller[orderId].value = ""; //clear input
      }
    } catch (error) {
      console.error("Error uploading slip (seller):", error);
      alert(`Error: ${error.message}`);
    }
  }

  // --- Fetch Orders ---
  async function getOrder() {
    try {
      const response = await fetch(
        `http://localhost:3000/shop/publisher/order?token=${userToken}`,
      );
      if (!response.ok) {
        throw new Error(
          `Publisher API Error: ${response.status} - ${await response.text()}`,
        );
      }
      const publisherData = await response.json();
      orders = publisherData;
    } catch (err) {
      orders = [];
    }
    try {
      const response2 = await fetch(
        `http://localhost:3000/shop/seller/order?token=${userToken}`,
      );
      if (!response2.ok) {
        throw new Error(
          `Seller API Error: ${response2.status} - ${await response2.text()}`,
        );
      }
      const sellerData = await response2.json();
      seller_orders = sellerData;
    } catch (err) {
      seller_orders = [];
    }
  }

  async function getShopOrder() {
    try {
      const response = await fetch(
        `http://localhost:3000/shop/publisher/order/getall/${user.user_id}`,
      );
      if (!response.ok) {
        throw new Error(
          `Publisher API Error: ${response.status} - ${await response.text()}`,
        );
      }
      const publisherData = await response.json();
      shop_orders = publisherData;
    } catch (err) {
      shop_orders = [];
    }
  }

  async function getShopOrderSeller() {
    try {
      const response = await fetch(
        `http://localhost:3000/shop/seller/order/getall/${user.user_id}`,
      );
      if (!response.ok) {
        throw new Error(
          `Seller API Error: ${response.status} - ${await response.text()}`,
        );
      }
      const sellerData = await response.json();
      shop_seller = sellerData;
    } catch (err) {
      shop_seller = [];
    }
  }

  async function approvePaySeller(seller_order_id:any) {
    try {
      const response = await fetch(`http://localhost:3000/shop/seller/payment/approve/${seller_order_id}`);
      if(!response.ok) {
        alert("การอนุมัติไม่สำเร็จ")
        return;
      }
      alert("การอนุมัติสำเร็จ")
    }
    catch {
      alert("การอนุมัติไม่สำเร็จ")
    }
    finally {
      await getShopOrderSeller();
    }
  }

  async function approvePayPublisher(order_id:any) {
    try {
      const response = await fetch(`http://localhost:3000/shop/publisher/payment/approve/${order_id}`);
      if(!response.ok) {
        alert("การอนุมัติไม่สำเร็จ")
        return;
      }
      alert("การอนุมัติสำเร็จ")
    }
    catch {
      alert("การอนุมัติไม่สำเร็จ")
    }
    finally {
      await getShopOrder();
    }
  }

  async function rejectPayPublisher(order_id:any) {
    try {
      const response = await fetch(`http://localhost:3000/shop/publisher/payment/reject/${order_id}`);
      if(!response.ok) {
        alert("ไม่อนุมัติไม่สำเร็จ")
      }
      alert("ไม่อนุมัติสำเร็จ")
    }
    catch {
      alert("การอนุมัติไม่สำเร็จ")
    }
    finally {
      await getShopOrder();
    }
  }

  async function rejectPaySeller(seller_order_id:any) {
    try {
      const response = await fetch(`http://localhost:3000/shop/seller/payment/reject/${seller_order_id}`);
      if(!response.ok) {
        alert("ไม่อนุมัติไม่สำเร็จ")
      }
      alert("ไม่อนุมัติสำเร็จ")
    }
    catch {
      alert("การอนุมัติไม่สำเร็จ")
    }
    finally {
      await getShopOrderSeller();
    }
  }

  async function shippingPublisher() {
    try {
      const response = await fetch("http://localhost:3000/shop/publisher/order/shipping", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                order_id: order_id,
                tracking_number: tracking_number
            })
      });
      if(!response.ok) {
        alert("การจัดส่งไม่สำเร็จ");
        return;
      }
      alert("การจัดส่งสำเร็จ");
    }
    catch {
      alert("การจัดสังไม่สำเร็จ");
    }
    finally {
      order_id = 0;
      tracking_number = '';
      await getShopOrder();
      closeTrackingModal();
    }
  }
  

  async function shippingSeller() {
    try {
      const response = await fetch("http://localhost:3000/shop/seller/order/shipping", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                seller_order_id: order_id,
                tracking_number: tracking_number
            })
      });
      if(!response.ok) {
        alert("การจัดส่งไม่สำเร็จ");
        return;
      }
      alert("การจัดส่งสำเร็จ");
    }
    catch {
      alert("การจัดสังไม่สำเร็จ");
    }
    finally {
      order_id = 0;
      tracking_number = '';
      await getShopOrderSeller();
      closeTrackingModalSeller();
    }
  }

  async function orderPublisherReceive(order_id:any) {
    try {
      const response = await fetch(`http://localhost:3000/shop/buyer/publisher/order/received`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              order_id: order_id,
            })
      });
      if(!response.ok) {
        alert("เกิดข้อผิดพลาดขึ้นกรุณาลองใหม่ภายหลัง");
        return;
      }
      alert("ยืนยันการได้รับของเเล้ว");
    }
    catch {
      alert("เกิดข้อผิดพลาดขึ้นกรุณาลองใหม่ภายหลัง");
    }
    finally {
      await getOrder();
    }
  }

  async function orderSellerReceive(seller_order_id:any) {
    try {
      const response = await fetch(`http://localhost:3000/shop/buyer/seller/order/received`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              seller_order_id: seller_order_id,
            })
      });
      if(!response.ok) {
        alert("เกิดข้อผิดพลาดขึ้นกรุณาลองใหม่ภายหลัง");
        return;
      }
      alert("ยืนยันการได้รับของเเล้ว");
    }
    catch {
      alert("เกิดข้อผิดพลาดขึ้นกรุณาลองใหม่ภายหลัง");
    }
    finally {
      await getOrder();
    }
  }

  // --- Fetch Seller Request Status ---
  async function fetchSellerRequestStatus() {
    isSellerRequestLoading.set(true);
    try {
      const response = await fetch(
        `http://localhost:3000/user/request-seller/get/${user.user_id}`,
      );
      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${await response.text()}`,
        );
      }
      const data = await response.json();
      sellerRequest = data.seller_register; // Store the request data
    } catch (error) {
      console.error("Error fetching seller request status:", error);
      sellerRequest = null; // Set to null on error
    } finally {
      isSellerRequestLoading.set(false);
    }
  }

  // --- Lifecycle Hook ---
  onMount(async () => {
    userToken = localStorage.getItem("userToken");
    if (!userToken) {
      goto("/login"); // Redirect to login if no token
      return;
    }
    try {
      const userData = await getUser(userToken);
      if (userData) {
        user = userData;
        user.user_name = user.user_name || "N/A";
        user.user_firstname = user.user_firstname || "N/A";
        user.user_lastname = user.user_lastname || "N/A";
        user.user_email = user.user_email || "N/A";
        user.user_image = user.user_image; // Default image
      } else {
        // Handle case where getUser returns null (e.g., invalid token)
        console.error("Failed to fetch user data");
        goto("/login"); // Redirect to login
        return;
      }
    } catch (error) {
      console.error("On mount error", error);
      goto("/login");
      return;
    }

    await getOrder();
    await getShopOrder();
    await getShopOrderSeller();
    await fetchSellerRequestStatus(); // Fetch request status on mount
    isLoading.set(false);
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
  <div class="min-h-screen bg-gray-100" in:fade>
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar (Desktop & Mobile) -->
        <aside
          class="w-full md:w-64 bg-blue-600 rounded-lg shadow-lg p-4 text-white transition-all duration-300"
          in:slide
        >
          <div class="md:hidden flex justify-between items-center mb-4">
            <button
              on:click={toggleMenu}
              class="text-white hover:text-gray-200 focus:outline-none"
            >
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
            {#if isOpen}
              <div
                class="absolute bg-blue-600 w-64 rounded-lg shadow-lg p-4 z-10 top-16 left-4"
                in:slide
              >
                <button
                  on:click={closeMenu}
                  class="text-white text-right block w-full"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
                <ul class="mt-4 space-y-2">
                  <li
                    class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                    'account'
                      ? 'bg-blue-800 text-white'
                      : 'text-white'}"
                    on:click={() => {
                      activeMenu = "account";
                      closeMenu();
                    }}
                  >
                    <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
                  </li>
                  <li
                    class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                    'orders'
                      ? 'bg-blue-800 text-white'
                      : 'text-white'}"
                    on:click={() => {
                      activeMenu = "orders";
                      closeMenu();
                    }}
                  >
                    <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
                  </li>
                  {#if user.user_permission == "Publisher" || user.user_permission == "Seller"}
                  <li
                      class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                      'shoporders'
                        ? 'bg-blue-800'
                        : ''}"
                      on:click={() => (activeMenu = "shopOrder")}
                    >
                      <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของร้าน
                    </li>
                  {/if}
                  {#if user.user_permission == "User" || user.user_permission == "Seller"}
                  <li
                    class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
                    'shopRequest'
                      ? 'bg-blue-800 text-white'
                      : 'text-white'}"
                    on:click={() => {
                      activeMenu = "shopRequest";
                      closeMenu();
                    }}
                  >
                    <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
                  </li>
                  {/if}
                </ul>
              </div>
            {/if}
          </div>
          <!-- desktop -->
          <h2 class="text-lg font-semibold mb-4 hidden md:block">
            บัญชีของฉัน
          </h2>
          <ul class="space-y-2 hidden md:block">
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'account'
                ? 'bg-blue-800'
                : ''}"
              on:click={() => (activeMenu = "account")}
            >
              <i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้
            </li>
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'orders'
                ? 'bg-blue-800'
                : ''}"
              on:click={() => (activeMenu = "orders")}
            >
              <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน
            </li>
            {#if user.user_permission == "Publisher" || user.user_permission == "Seller"}
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'shoporders'
                ? 'bg-blue-800'
                : ''}"
              on:click={() => (activeMenu = "shopOrder")}
            >
              <i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของร้าน
            </li>
            {/if}
            <li
              class="px-4 py-2 rounded cursor-pointer hover:bg-blue-700 {activeMenu ===
              'shopRequest'
                ? 'bg-blue-800'
                : ''}"
              on:click={() => (activeMenu = "shopRequest")}
            >
              <i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า
            </li>
          </ul>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 mt-4 md:mt-0">
          {#if activeMenu === "account"}
            <div
              class="bg-white rounded-lg shadow-md p-6"
              in:fade={{ delay: 200 }}
            >
              <h1 class="text-2xl font-semibold mb-4">บัญชีผู้ใช้</h1>
              <div class="flex items-center mb-4">
                <img
                  src={user.user_image}
                  alt="Profile"
                  class="w-20 h-20 rounded-full mr-4 ring-2 ring-blue-500"
                />
                <div>
                  <p class="text-lg font-medium">
                    ชื่อบัญชี: <span class="font-normal">{user.user_name}</span>
                  </p>
                  <p class="text-gray-600">
                    ชื่อจริง: {user.user_firstname}
                    {user.user_lastname}
                  </p>
                  <p class="text-gray-600">อีเมล: {user.user_email}</p>
                </div>
              </div>

              <form on:submit={updateUser} class="mt-6 space-y-4">
                <div>
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="name"
                  >
                    ชื่อบัญชี:
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    id="name"
                    type="text"
                    name="name"
                    value={user?.user_name ?? ""}
                  />
                </div>
                <div>
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="email"
                  >
                    อีเมล:
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    id="email"
                    type="text"
                    name="email"
                    value={user?.user_email ?? ""}
                  />
                </div>
                <div>
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="pass"
                  >
                    รหัสผ่าน:
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    id="pass"
                    type="password"
                    name="pass"
                    placeholder="********"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    ปล่อยว่างไว้ หากไม่ต้องการเปลี่ยนรหัสผ่าน
                  </p>
                </div>
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  บันทึก
                </button>
              </form>
            </div>
          {:else if activeMenu === "orders"}
            <div
              class="bg-white rounded-lg shadow-md p-6"
              in:fade={{ delay: 200 }}
            >
              <h1 class="text-2xl font-semibold mb-6">คำสั่งซื้อของฉัน</h1>

              {#if orders.length === 0 && seller_orders.length === 0}
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p class="font-bold text-yellow-700">ยังไม่มีคำสั่งซื้อ</p>
                  <p class="text-sm text-yellow-600">
                    คุณยังไม่มีรายการสั่งซื้อใด ๆ ในขณะนี้.
                  </p>
                </div>
              {:else}
                {#if orders.length > 0}
                  <h2 class="text-xl font-semibold mb-4 text-blue-600">
                    Publisher Orders
                  </h2>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            วันที่
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            สถานะ
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ยอดรวม
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            การจ่ายเงิน
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ดำเนินการ
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            รายละเอียด
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        {#each orders as order (order.order_id)}
                          <tr
                            class="transition-colors duration-200 hover:bg-gray-50"
                            in:slide
                          >
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              {order.order_id}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {formatDate(order.order_time)}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm {getStatusColor(
                                order.order_status,
                              )}"
                            >
                              {order.order_status}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {formatCurrency(order.total_price)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              {#if order.payment_slip}
                                <span class="text-sm text-green-600">
                                  <i class="fas fa-check-circle mr-1"></i> ส่งสลิปแล้ว
                                </span>
                              {:else}
                                <div
                                  class="flex flex-col items-start space-y-2"
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    bind:this={fileInputs[order.order_id]}
                                    on:change={(event) =>
                                      handleFileChangeOrder(
                                        order.order_id,
                                        event,
                                      )}
                                    class="text-sm"
                                  />
                                  <button
                                    on:click|stopPropagation={() =>
                                      uploadSlip(order.order_id)}
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                                  >
                                    Upload Slip
                                  </button>
                                </div>
                              {/if}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                            {#if order.order_status == "จัดส่งเเล้ว"}
                              <button
                              on:click={() => orderPublisherReceive(order.order_id)}
                              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              >ได้รับสินค้าเเล้ว</button>
                              {/if}  
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                            >
                              <button
                                on:click={() =>
                                  toggleOrderDetails(order.order_id)}
                                class="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {expandedOrderId === order.order_id
                                  ? "Hide Details"
                                  : "Show Details"}
                              </button>
                            </td>
                          </tr>
                          {#if expandedOrderId === order.order_id}
                            <tr in:slide>
                              <td colspan="6" class="bg-gray-50 p-4">
                                {#if base64Images[order.order_id]}
                                  <img
                                    src={base64Images[order.order_id]}
                                    alt="Uploaded Slip"
                                    style="max-width: 200px;"
                                    class="mb-4 rounded-lg shadow-sm"
                                  />
                                {/if}
                                <!-- Display other order details here -->
                                <p class="mb-1 text-sm font-semibold">
                                  Fullname: <span class="text-gray-700"
                                    >{order.fullname}</span
                                  >
                                </p>
                                <p class="mb-1 text-sm font-semibold">
                                  Email: <span class="text-gray-700"
                                    >{order.email}</span
                                  >
                                </p>
                                <p class="mb-1 text-sm font-semibold">
                                  Phone: <span class="text-gray-700"
                                    >{order.phone}</span
                                  >
                                </p>
                                <p class="mb-3 text-sm font-semibold">
                                  Address: <span class="text-gray-700"
                                    >{order.address}</span
                                  >
                                </p>

                                {#if order.tracking_number}
                                    รหัสติดตามของ: <span class="text-gray-700"
                                    >{order.tracking_number}</span>
                                {/if}

                                {#if order.payment_slip}
                                  <img
                                    src={order.payment_slip}
                                    alt="Uploaded Slip"
                                    style="max-width: 200px;"
                                    class="mb-4 rounded-lg shadow-sm"
                                  />
                                {/if}

                                <h4 class="text-lg font-semibold mb-2">
                                  Items:
                                </h4>
                                {#each order.items as item}
                                  <div
                                    class="mb-4 p-4 border rounded-lg shadow-sm flex items-start bg-white"
                                  >
                                    <div>
                                      <p class="font-semibold text-blue-600">
                                        {item.book_name_th}
                                      </p>
                                      {#if item.cover_color}
                                        <span class="font-semibold">สีปก:</span>
                                        {item.cover_color}
                                      {/if}
                                      {#if item.cover_type}
                                        <span class="font-semibold">ชนิดปก:</span>
                                        {item.cover_type}
                                      {/if}
                                      {#if item.font_family}
                                        <span class="font-semibold">ฟอนต์:</span>
                                        {item.font_family}
                                      {/if}
                                      {#if item.font_size}
                                        <span class="font-semibold">ฟอนต์:</span>
                                        {item.font_size}
                                      {/if}
                                      {#if item.paper_type}
                                        <span class="font-semibold">ชนิดกระดาษ:</span>
                                        {item.paper_type}
                                      {/if}
                                      {#if item.marker}
                                        <span class="font-semibold">ข้อความ:</span>
                                        {item.marker}
                                      {/if}
                                        <p class="text-sm">
                                        <span class="font-semibold">Price:</span
                                        >
                                        {formatCurrency(item.book_price)} x {item.amount}
                                      </p>
                                      <p class="text-sm">
                                        <span class="font-semibold">Total:</span
                                        >
                                        {formatCurrency(
                                          item.book_price * item.amount,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                {/each}
                              </td>
                            </tr>
                          {/if}
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}

                {#if seller_orders.length > 0}
                  <h2 class="text-xl font-semibold mb-4 text-blue-600 mt-8">
                    Seller Orders
                  </h2>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            วันที่
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            สถานะ
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ยอดรวม
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            การจ่ายเงิน
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ดำเนินการ
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            รายละเอียด
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        {#each seller_orders as order (order.order_id)}
                          <tr
                            class="transition-colors duration-200 hover:bg-gray-50"
                            in:slide
                          >
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              {order.order_id}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {formatDate(order.order_time)}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm {getStatusColor(
                                order.order_status,
                              )}"
                            >
                              {order.order_status}
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {formatCurrency(order.total_price)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              {#if order.payment_slip}
                                <span class="text-sm text-green-600">
                                  <i class="fas fa-check-circle mr-1"></i> ส่งสลิปแล้ว
                                </span>
                              {:else}
                                <div
                                  class="flex flex-col items-start space-y-2"
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    bind:this={fileInputsSeller[order.order_id]}
                                    on:change={(event) =>
                                      handleFileChangeOrderSeller(
                                        order.order_id,
                                        event,
                                      )}
                                    class="text-sm"
                                  />
                                  <button
                                    on:click|stopPropagation={() =>
                                      uploadSlipSeller(order.order_id)}
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                                  >
                                    Upload Slip
                                  </button>
                                </div>
                              {/if}
                            </td>

                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                            {#if order.order_status == "จัดส่งเเล้ว"}
                              <button
                              on:click={() => orderSellerReceive(order.order_id)}
                              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              >ได้รับสินค้าเเล้ว</button>
                            {/if}  
                            </td>

                            <td
                              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                            >
                              <button
                                on:click={() =>
                                  toggleOrderDetails(order.order_id)}
                                class="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {expandedOrderId === order.order_id
                                  ? "Hide Details"
                                  : "Show Details"}
                              </button>
                            </td>
                          </tr>

                          {#if expandedOrderId === order.order_id}
                            <tr in:slide>
                              <td colspan="6" class="bg-gray-50 p-4">
                                {#if base64ImagesSeller[order.order_id]}
                                  <img
                                    src={base64ImagesSeller[order.order_id]}
                                    alt="Uploaded Slip Seller"
                                    style="max-width: 200px;"
                                    class="mb-4 rounded-lg shadow-sm"
                                  />
                                {/if}
                                <!-- Display other order details here -->
                                <p class="mb-1 text-sm font-semibold">
                                  Fullname: <span class="text-gray-700"
                                    >{order.fullname}</span
                                  >
                                </p>
                                <p class="mb-1 text-sm font-semibold">
                                  Email: <span class="text-gray-700"
                                    >{order.email}</span
                                  >
                                </p>
                                <p class="mb-1 text-sm font-semibold">
                                  Phone: <span class="text-gray-700"
                                    >{order.phone}</span
                                  >
                                </p>
                                <p class="mb-3 text-sm font-semibold">
                                  Address: <span class="text-gray-700"
                                    >{order.address}</span
                                  >
                                </p>

                                {#if order.tracking_number}
                                    รหัสติดตามของ: <span class="text-gray-700"
                                    >{order.tracking_number}</span>
                                {/if}

                                {#if order.payment_slip}
                                  <img
                                    src={order.payment_slip}
                                    alt="Payment Slip"
                                    class="mb-4 rounded-lg shadow-sm"
                                  />
                                {/if}
                                <h4 class="text-lg font-semibold mb-2">
                                  Items:
                                </h4>

                                {#each order.items as item}
                                  <div
                                    class="mb-4 p-4 border rounded-lg shadow-sm flex items-start bg-white"
                                  >
                                    <div>
                                      <p class="font-semibold text-blue-600">
                                        {item.book_name}
                                      </p>
                                      <p class="text-sm">
                                        <span class="font-semibold">Price:</span
                                        >
                                        {formatCurrency(item.book_price)} x {item.amount}
                                      </p>
                                      <p class="text-sm">
                                        <span class="font-semibold">Total:</span
                                        >
                                        {formatCurrency(
                                          item.book_price * item.amount,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                {/each}
                              </td>
                            </tr>
                          {/if}
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              {/if}
            </div>
          {:else if activeMenu === "shopRequest"}
            <div
              class="bg-white rounded-lg shadow-md p-6"
              in:fade={{ delay: 200 }}
            >
              <h1 class="text-2xl font-semibold mb-4">การขอเปิดร้านค้า</h1>

              {#if $isSellerRequestLoading}
                <p>Loading...</p>
              {:else if sellerRequest}
                <!-- Display seller request details -->
                <div class="mb-4">
                  <p class="text-lg font-medium">
                    สถานะ: <span class={getStatusColor(sellerRequest.status)}
                      >{sellerRequest.status}</span
                    >
                  </p>
                  <p>วันที่ส่งคำขอ: {formatDate(sellerRequest.create_time)}</p>
                  <p>QR Code:</p>
                  <img
                    src={sellerRequest.qr_code}
                    alt="QR Code"
                    class="mt-2 max-h-48"
                  />
                  <p>Proof Image:</p>
                  <img
                    src={sellerRequest.proof_image}
                    alt="Proof of Identity"
                    class="mt-2 max-h-48"
                  />
                </div>
              {:else}
                <form on:submit={submitShopRequest} class="space-y-4">
                  <div>
                    <label
                      for="qrCode"
                      class="block text-sm font-medium text-gray-700"
                    >
                      รูป QR Code:
                    </label>
                    <input
                      type="file"
                      id="qrCode"
                      accept="image/*"
                      on:change={(e) => handleFileUpload(e, "qr")}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {#if qrCodeImage}
                      <img
                        src={qrCodeImage}
                        alt="QR Code Preview"
                        class="mt-2 max-h-48"
                      />
                    {/if}
                  </div>
                  <div>
                    <label
                      for="idCard"
                      class="block text-sm font-medium text-gray-700"
                    >
                      รูปบัตรประชาชน:
                    </label>
                    <input
                      type="file"
                      id="idCard"
                      accept="image/*"
                      on:change={(e) => handleFileUpload(e, "id")}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {#if idCardImage}
                      <img
                        src={idCardImage}
                        alt="ID Card Preview"
                        class="mt-2 max-h-48"
                      />
                    {/if}
                  </div>
                  <button
                    type="submit"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    ส่งคำขอ
                  </button>
                </form>
              {/if}
            </div>
            {:else if activeMenu === "shopOrder"}
              <div
                  class="bg-white rounded-lg shadow-md p-6"
                  in:fade={{ delay: 200 }}
              >
              <h1 class="text-2xl font-semibold mb-6">คำสั่งซื้อของร้าน</h1>
          {#if user.user_permission == "Publisher"}

                        {#if shop_orders.length === 0}
                          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p class="font-bold text-yellow-700">ยังไม่มีคำสั่งซื้อ</p>
                            <p class="text-sm text-yellow-600">
                              คุณยังไม่มีรายการขอสั่งซื้อใด ๆ ในขณะนี้.
                            </p>
                          </div>
                        {:else}

                          {#if shop_orders.length > 0}
                            <h2 class="text-xl font-semibold mb-4 text-blue-600">
                              Orders All
                            </h2>
                            <div class="overflow-x-auto">
                              <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Order ID
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      วันที่
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      สถานะ
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      ยอดรวม
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      การดำเนินการ
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      รายละเอียด
                                    </th>
                                  </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                  {#each shop_orders as order (order.order_id)}
                                    <tr
                                      class="transition-colors duration-200 hover:bg-gray-50"
                                      in:slide
                                    >
                                      <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                      >
                                        {order.order_id}
                                      </td>
                                      <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {formatDate(order.order_time)}
                                      </td>
                                      <td
                                        class="px-6 py-4 whitespace-nowrap text-sm {getStatusColor(
                                          order.order_status,
                                        )}"
                                      >
                                        {order.order_status}
                                      </td>
                                      <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {formatCurrency(order.total_price)}
                                      </td>
                                      <td class="px-6 py-4 whitespace-nowrap">
                                        <!-- <button
                                        class="bg-blue-500 text-white rounded p-1">
                                        ตรวจสอบเสร็จสิ้น</button> -->
                                        {#if order.order_status == "อยู่ระหว่างการจัดส่ง"}
                                          <button
                                          class="bg-blue-500 text-white rounded p-1"
                                          on:click={openTrackingModal(order.order_id)}>
                                          จัดส่งเเล้ว</button>
                                        {/if}
                                        {#if order.order_status == "กำลังดำเนินการ"}
                                          <button
                                          on:click={() => approvePayPublisher(order.order_id)}
                                          class="bg-green-500 text-white rounded p-1">
                                          อนุมัติ</button>
                                          <button
                                          on:click={() => rejectPayPublisher(order.order_id)}
                                          class="bg-red-500 text-white rounded p-1">
                                          ไม่อนุมัติ</button>
                                        {/if}

                                      </td>
                                      <td
                                        class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                      >
                                        <button
                                          on:click={() =>
                                            toggleOrderDetails(order.order_id)}
                                          class="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                          {expandedOrderId === order.order_id
                                            ? "Hide Details"
                                            : "Show Details"}
                                        </button>
                                      </td>
                                    </tr>
                                    {#if expandedOrderId === order.order_id}
                                      <tr in:slide>
                                        <td colspan="6" class="bg-gray-50 p-4">
                                          {#if base64Images[order.order_id]}
                                            <img
                                              src={base64Images[order.order_id]}
                                              alt="Uploaded Slip"
                                              style="max-width: 200px;"
                                              class="mb-4 rounded-lg shadow-sm"
                                            />
                                          {/if}
                                          <!-- Display other order details here -->
                                          <p class="mb-1 text-sm font-semibold">
                                            Fullname: <span class="text-gray-700"
                                              >{order.fullname}</span
                                            >
                                          </p>
                                          <p class="mb-1 text-sm font-semibold">
                                            Email: <span class="text-gray-700"
                                              >{order.email}</span
                                            >
                                          </p>
                                          <p class="mb-1 text-sm font-semibold">
                                            Phone: <span class="text-gray-700"
                                              >{order.phone}</span
                                            >
                                          </p>
                                          <p class="mb-3 text-sm font-semibold">
                                            Address: <span class="text-gray-700"
                                              >{order.address}</span
                                            >
                                          </p>
                                          {#if order.tracking_number}
                                          รหัสติดตามของ: <span class="text-gray-700"
                                          >{order.tracking_number}</span
                                          >
                                          {/if}
                                          {#if order.payment_slip}
                                            <img
                                              src={order.payment_slip}
                                              alt="Uploaded Slip"
                                              style="max-width: 200px;"
                                              class="mb-4 rounded-lg shadow-sm"
                                            />
                                          {/if}
                                        

                                          <h4 class="text-lg font-semibold mb-2">
                                            Items:
                                          </h4>
                                          {#each order.items as item}
                                            <div
                                              class="mb-4 p-4 border rounded-lg shadow-sm flex items-start bg-white"
                                            >
                                              <div>
                                                <p class="font-semibold text-blue-600">
                                                  {item.book_name_th}
                                                </p>
                                                <p class="text-sm">
                                                  <span class="font-semibold">Price:</span
                                                  >
                                                  {formatCurrency(item.book_price)} x {item.amount}
                                                </p>
                                                {#if item.cover_color}
                                                  <span class="font-semibold">สีปก:</span>
                                                  {item.cover_color}
                                                {/if}
                                                {#if item.cover_type}
                                                  <span class="font-semibold">ชนิดปก:</span>
                                                  {item.cover_type}
                                                {/if}
                                                {#if item.font_family}
                                                  <span class="font-semibold">ฟอนต์:</span>
                                                  {item.font_family}
                                                {/if}
                                                {#if item.font_size}
                                                  <span class="font-semibold">ฟอนต์:</span>
                                                  {item.font_size}
                                                {/if}
                                                {#if item.paper_type}
                                                  <span class="font-semibold">ชนิดกระดาษ:</span>
                                                  {item.paper_type}
                                                {/if}
                                                {#if item.marker}
                                                  <span class="font-semibold">ข้อความ:</span>
                                                  {item.marker}
                                                {/if}
                                                <p class="text-sm">
                                                  <span class="font-semibold">Total:</span
                                                  >
                                                  {formatCurrency(
                                                    item.book_price * item.amount,
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                          {/each}
                                        </td>
                                      </tr>
                                    {/if}
                                  {/each}
                                </tbody>
                              </table>
                            </div>
                          {/if}
                        {/if}
                    {/if}
                    <!-- --------->
                    <!-- SELLER -->
                     <!-- --------->
                    {#if user.user_permission == "Seller"}
                    {#if shop_seller.length === 0}
                          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p class="font-bold text-yellow-700">ยังไม่มีคำสั่งซื้อ</p>
                            <p class="text-sm text-yellow-600">
                              คุณยังไม่มีรายการขอสั่งซื้อใด ๆ ในขณะนี้.
                            </p>
                          </div>
                    {/if}
                    {#if shop_seller.length > 0}
                        <h2 class="text-xl font-semibold mb-4 text-blue-600 mt-8">
                          Orders All
                        </h2>
                        <div class="overflow-x-auto">
                          <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Order ID
                                </th>
                                <th
                                  scope="col"
                                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  วันที่
                                </th>
                                <th
                                  scope="col"
                                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  สถานะ
                                </th>
                                <th
                                  scope="col"
                                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  ยอดรวม
                                </th>
                                <th
                                  scope="col"
                                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  การดำเนินการ
                                </th>
                                <th
                                  scope="col"
                                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  รายละเอียด
                                </th>
                              </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                              {#each shop_seller as order (order.order_id)}
                                <tr
                                  class="transition-colors duration-200 hover:bg-gray-50"
                                  in:slide
                                >
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                  >
                                    {order.order_id}
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                  >
                                    {formatDate(order.order_time)}
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm {getStatusColor(
                                      order.order_status,
                                    )}"
                                  >
                                    {order.order_status}
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                  >
                                    {formatCurrency(order.total_price)}
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <!-- <button
                                    class="bg-blue-500 text-white rounded p-1">
                                    ตรวจสอบเสร็จสิ้น</button> -->
                                    {#if order.order_status == "อยู่ระหว่างการจัดส่ง"}
                                      <button
                                      class="bg-blue-500 text-white rounded p-1"
                                      on:click={() => openTrackingModalSeller(order.order_id)}>
                                      จัดส่งเเล้ว</button>
                                    {/if}
                                    {#if order.order_status == "กำลังดำเนินการ"}
                                      <button
                                      on:click={() => approvePaySeller(order.order_id)}
                                      class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                      อนุมัติ</button>
                                      <button
                                      on:click={() => rejectPaySeller(order.order_id)}
                                      class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                      ไม่อนุมัติ</button>
                                    {/if}

                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                  >
                                    <button
                                      on:click={() =>
                                        toggleOrderDetails(order.order_id)}
                                      class="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                      {expandedOrderId === order.order_id
                                        ? "Hide Details"
                                        : "Show Details"}
                                    </button>
                                  </td>
                                </tr>
      
                                {#if expandedOrderId === order.order_id}
                                  <tr in:slide>
                                    <td colspan="6" class="bg-gray-50 p-4">
                                      {#if base64ImagesSeller[order.order_id]}
                                        <img
                                          src={base64ImagesSeller[order.order_id]}
                                          alt="Uploaded Slip Seller"
                                          style="max-width: 200px;"
                                          class="mb-4 rounded-lg shadow-sm"
                                        />
                                      {/if}
                                      <!-- Display other order details here -->
                                      <p class="mb-1 text-sm font-semibold">
                                        Fullname: <span class="text-gray-700"
                                          >{order.fullname}</span
                                        >
                                      </p>
                                      <p class="mb-1 text-sm font-semibold">
                                        Email: <span class="text-gray-700"
                                          >{order.email}</span
                                        >
                                      </p>
                                      <p class="mb-1 text-sm font-semibold">
                                        Phone: <span class="text-gray-700"
                                          >{order.phone}</span
                                        >
                                      </p>
                                      <p class="mb-3 text-sm font-semibold">
                                        Address: <span class="text-gray-700"
                                          >{order.address}</span
                                        >
                                      </p>                 
                                      
                                      {#if order.tracking_number}
                                          รหัสติดตามของ: <span class="text-gray-700"
                                          >{order.tracking_number}</span
                                          >
                                      {/if}
                                      
                                      {#if order.payment_slip}
                                      <img
                                        src={order.payment_slip}
                                        alt="Uploaded Slip"
                                        style="max-width: 200px;"
                                        class="mb-4 rounded-lg shadow-sm"
                                      />
                                      {/if}

                                                           
                                    
                                      <h4 class="text-lg font-semibold mb-2">
                                        Items:
                                      </h4>
      
                                      {#each order.items as item}
                                        <div
                                          class="mb-4 p-4 border rounded-lg shadow-sm flex items-start bg-white"
                                        >
                                          <div>
                                            <p class="font-semibold text-blue-600">
                                              {item.book_name}
                                            </p>
                                            <p class="text-sm">
                                              <span class="font-semibold">Price:</span
                                              >
                                              {formatCurrency(item.book_price)} x {item.amount}
                                            </p>
                                            <p class="text-sm">
                                              <span class="font-semibold">Total:</span
                                              >
                                              {formatCurrency(
                                                item.book_price * item.amount,
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      {/each}
                                    </td>
                                  </tr>
                                {/if}
                              {/each}
                            </tbody>
                          </table>
                        </div>
                      {/if}
                    {/if}
                  </div>  
                  {/if}
            </main>
          </div>
        </div>
      </div>
    {/if}

<!-- sent modal -->
{#if showTrackingModal}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50 transform">
  <div 
    class="bg-white p-10 rounded-lg shadow-xl w-[65vw] max-w-xl max-h-[50vh] space-y-6 border overflow-y-auto">
      <h2 
        class="text-2xl font-semibold text-gray-800">ส่งเลขพัสดุ</h2>
    <form>
      <div class="space-y-4">
        <div>
            <label for="reason" class="block text-gray-600">เลขพัสดุ</label>
            <input
              id="reason"
              type="text"
              bind:value={tracking_number}
              class="w-full px-4 py-2 border rounded-lg shadow-sm" required>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-6">
        <button
        type="button"
        on:click={closeTrackingModal}
        class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600">ยกเลิก</button>

        <button
        type="button"
        on:click={shippingPublisher}
        class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600">ยืนยัน</button>
      </div>
    </form>
  </div>
</div>
{/if}

{#if showTrackingModalSeller}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50 transform">
  <div 
    class="bg-white p-10 rounded-lg shadow-xl w-[65vw] max-w-xl max-h-[50vh] space-y-6 border overflow-y-auto">
      <h2 
        class="text-2xl font-semibold text-gray-800">ส่งเลขพัสดุ</h2>
    <form>
      <div class="space-y-4">
        <div>
            <label for="reason" class="block text-gray-600">เลขพัสดุ</label>
            <input
              id="reason"
              type="text"
              bind:value={tracking_number}
              class="w-full px-4 py-2 border rounded-lg shadow-sm" required>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-6">
        <button
        type="button"
        on:click={closeTrackingModalSeller}
        class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600">ยกเลิก</button>

        <button
        type="button"
        on:click={shippingSeller}
        class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600">ยืนยัน</button>
      </div>
    </form>
  </div>
</div>
{/if}

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>

<style>
  /* Add any custom styles here, if needed, to further refine the appearance */
</style>
