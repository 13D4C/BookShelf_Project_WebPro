<script>
  function goToHomePage() {
    window.location.href = "/main";
  }
  //ใช้ทุก page
  import { goto } from "$app/navigation";
  import Navbar from "$lib/components/navbar.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  let userToken = null;
  const isLoading = writable(true);
  function checkAndRedirect(token, routeId) {
    const isAuthRoute = routeId === "/" || routeId === "/Register";

    if (!token && !isAuthRoute) {
      goto("/");
    } else {
      isLoading.set(false);
    }
  }
  onMount(async () => {
    page.subscribe(async ($page) => {
      userToken = localStorage.getItem("userToken");
      checkAndRedirect(userToken, $page.route.id);
    });
  });
  
</script>
{#if $isLoading}{:else}
  <Navbar />//จบตรงนี้
<div class="flex items-center justify-center h-screen">
  <div class="bg-white p-6 shadow-lg rounded-lg text-center max-w-sm">
    <img
      src="https://media.tenor.com/W6R7KFBYwhMAAAAe/thank-you.png"
      alt="Thank You"
      class="mx-auto w-24 h-24 mb-4"
    />
    <h1 class="text-2xl font-bold text-green-600">ขอบคุณสำหรับการชำระเงิน!</h1>
    <p class="mt-2 text-gray-600">
      คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว
    </p>
    <button
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      on:click={goToHomePage}
    >
      กลับสู่หน้าหลัก
    </button>
  </div>
</div>
{/if}
<style>
  body {
    @apply bg-gray-100 flex items-center justify-center h-screen;
  }
</style>
