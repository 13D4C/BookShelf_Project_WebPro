<script>
    import { onMount } from "svelte";
  
    let categories = [
      { name: "มังงะ/การ์ตูน", color: "bg-green-100", icon: "📚" },
      { name: "นิยาย/วรรณกรรม", color: "bg-yellow-100", icon: "📖" },
      { name: "สำหรับเด็ก", color: "bg-pink-100", icon: "🧒" },
      { name: "นิตยสาร", color: "bg-orange-100", icon: "📰" },
      { name: "ทั่วไป/อื่นๆ", color: "bg-purple-100", icon: "📄" },
      { name: "พรีออเดอร์", color: "bg-blue-100", icon: "🛒" },
    ];
  
    let slides = [
      {
        img: "https://m.media-amazon.com/images/S/pv-target-images/1c7673199fafc72304080c0811a5ff1b7bb18bb59631ec51dca09853e2344629.jpg",
        title: "Blue Lock",
        description: "ญี่ปุ่นจัดตั้งโปรเจกต์ Blue Lock เพื่อค้นหาศูนย์หน้าที่ดีที่สุดหนึ่งเดียวจาก 300 คน หลังจากทีมชาติญี่ปุ่นมีผลงานย่ำแย่ในฟุตบอลโลก ผู้ที่แพ้จะถูกตัดสิทธิ์เป็นตัวแทนทีมชาติตลอดชีวิต ตัวเอกคืออิซางิ โยอิจิ เด็กหนุ่มที่มีความฝันอยากเป็นศูนย์หน้าที่เก่งที่สุดในโลก แม้หลายคนจะมองว่าโปรเจกต์นี้บ้าคลั่ง แต่อิซางิกลับมุ่งมั่นที่จะเข้าร่วมและคว้าชัยชนะให้ได้",
      },
      {
        img: "https://i.ytimg.com/vi/tcK9Eghsfq8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBjbfUKrIgbefohd5OwiB5CGHPBow",
        title: "Blue Box",
        description: "อิโนมาตะ ไทกิ สมาชิกชมรมแบดมินตันตกหลุมรักคาโนะ จินัตสึ รุ่นพี่ชมรมบาสเกตบอลหญิงเขาถูกดึงดูดด้วยท่าทางเอาจริงเอาจังตอนซ้อมส่วนตัวแต่แล้วไทกิก็ต้องค้นพบความจริงที่ว่าตนไม่อาจสมหวัง...!?หนทางยังอีกยาวไกล แต่หัวใจอยู่ใกล้ชิดกันเรื่องราวความรักวัยว้าวุ่นเริ่มต้นขึ้นแล้ว!",
      },
      {
        img: "https://cms.dmpcdn.com/moviearticle/2021/10/01/cb4f7200-2267-11ec-b691-59cd11b5d80c_original.jpg",
        title: "แฟนยืด",
        description: "คิโนะชิตะ คาสึยะ เป็นคนที่ถูกทิ้งโดยนานามิ มามิ แฟนของเขา หลังจากออกเดทเป็นเวลาหนึ่งเดือน จากนั้นเขาก็ตัดสินใจใช้แอพออนไลน์เพื่อเช่าแฟนที่ชื่อว่ามิซุฮาระ จิซึรุ เป็นผู้หญิงสาวสวยและน่าสนใจ อย่างไรก็ตาม เพราะเธอได้ปรากฏจะสมบูรณ์แบบเกินไป เขาให้คะแนนเธอต่ำ เมื่อจิซึรุตำหนิเขาสำหรับสิ่งนั้น เขารู้ว่าเธอใจร้ายกว่าที่เขาคาดไว้ อย่างไรก็ตาม เมื่อยายของคาสึยะได้ทรุดลงในโรงพยาบาล เขาพาเธอไปด้วยและยายของเขาก็พอใจกับความยิ่งใหญ่ของเธอ คาสึยะยังคงเช่าจิซึรุต่อไปเพื่อให้ได้ปรากฏตัวกับครอบครัวและเพื่อน ๆ ของเขา แต่สิ่งต่าง ๆ กลับซับซ้อนขึ้นเมื่อพวกเขาพบว่าพวกเขาเป็นเพื่อนบ้านของอพาร์ทเมนต์ข้าง ๆ และเข้าเรียนในวิทยาลัยเดียวกัน หลังจากนั้น ผู้หญิงคนอื่น ๆ จากธุรกิจแฟนยังเข้าร่วมในการออกเดทและแสดงความสนใจในคาสึยะ",
      },
    ];
  
    let currentSlide = 0;
  
    onMount(() => {
      const interval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
      }, 3000);
  
      return () => clearInterval(interval);
    });
  </script>
  
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto py-8">
      <div class="bg-red-600 text-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 h-72">
        <img
          src={slides[currentSlide].img}
          alt="Book Banner"
          class="rounded-lg shadow-lg h-full w-auto object-cover"
        />
        <div class="flex-1 overflow-hidden">
          <h2 class="text-3xl font-bold mb-4 truncate">{slides[currentSlide].title}</h2>
          <p class="text-base leading-relaxed line-clamp-4">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>
      <div class="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each categories as category}
          <div class={`rounded-xl p-4 flex items-center gap-4 shadow ${category.color}`}>
            <span class="text-3xl">{category.icon}</span>
            <span class="text-lg font-semibold">{category.name}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <style>
    .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>