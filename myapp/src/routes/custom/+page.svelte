<script>
  import { onMount } from 'svelte';
  import iro from '@jaames/iro';
  import Navbar from "$lib/components/navbar.svelte";

  let colorPicker;
  let colorHex = '#ff0000'; // ค่าสีเริ่มต้น
  let colorJson = ''; // เก็บค่าสีในรูปแบบ JSON
  let inputText = 'New Book';

  onMount(() => {
    // สร้างอินสแตนซ์ของ iro.ColorPicker
    colorPicker = new iro.ColorPicker('#colorPicker', {
      width: 280,
      color: colorHex,
      borderWidth: 1,
      borderColor: '#fff'
    });

    // ฟังก์ชันที่ถูกเรียกเมื่อสีมีการเปลี่ยนแปลง
    colorPicker.on('color:change', (color) => {
      colorHex = color.hexString;
    });
  });

  // ฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้กรอกค่าสี HEX ใหม่
  function updateColor(event) {
    const newColor = event.target.value;
    colorPicker.color.hexString = newColor;
  }

  // ฟังก์ชันที่ถูกเรียกเมื่อกดปุ่ม "ตกลง"
  function submitColor() {
    // สร้างอ็อบเจ็กต์ที่มีค่าสี
    const colorData = {
      color: colorHex
    };
    // แปลงอ็อบเจ็กต์เป็นสตริง JSON
    colorJson = JSON.stringify(colorData);
    // แสดงผลหรือส่งค่า colorJson ตามต้องการ
    console.log(colorJson);
  }
</script>

<style>


</style>


<Navbar />
<div class="min-h-screen bg-blue-50 flex items-center">
  <!-- Container แบบสองคอลัมน์ -->
  <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
    <!-- Left Column: ตัวอย่างปกหนังสือ -->
    <div class="w-full md:w-1/2 flex flex-col items-center">
      <div 
        class=" w-1/2 h-full color-display border rounded shadow-lg flex items-center justify-center"
        style="background-color: {colorHex};"
      >
        <h1 class="text-center text-xl font-bold text-white">{inputText}</h1>
      </div>
    </div>

    <!-- Right Column: คอนโทรลแก้ไข -->
    <div class="w-full md:w-1/2 space-y-4">
      <!-- อินพุตสำหรับเปลี่ยนข้อความใน h1 -->
      <input 
        type="text" 
        bind:value={inputText} 
        placeholder="ชื่อหนังสื่อ" 
        class="border p-2 w-full" 
      />

      <!-- Container สำหรับ iro.js color picker -->
      <div id="colorPicker" class="mx-auto"></div>

      <!-- อินพุตสำหรับแก้ไขค่าสี HEX -->
      <input type="text" bind:value={colorHex} on:input={updateColor} placeholder="#ffffff" class="border p-2 w-full"/>

      <!-- ปุ่มตกลงส่งค่าสีเป็น JSON -->
      <button on:click={submitColor} class="px-4 py-2 bg-blue-500 text-white rounded border border-slate-300 hover:border-slate-400 hover:bg-blue-400">ตกลง</button>

      <!-- แสดงค่าสีในรูปแบบ JSON -->
      {#if colorJson}
        <div class="p-4 bg-white border rounded shadow">
          <h2 class="text-lg font-semibold mb-2">ค่าสีในรูปแบบ JSON:</h2>
          <pre class="text-sm whitespace-pre-wrap">{colorJson}</pre>
        </div>
      {/if}
    </div>
  </div>
</div>