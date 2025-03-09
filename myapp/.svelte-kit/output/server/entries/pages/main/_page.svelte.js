import { V as store_get, Z as ensure_array_like, Y as attr, X as escape_html, a6 as clsx, W as unsubscribe_stores, T as pop, _ as stringify, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import "swiper/bundle";
import { w as writable } from "../../../chunks/index2.js";
import { R as Rating } from "../../../chunks/Rating.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let products = [];
  let eachbook = [];
  const isLoading = writable(true);
  function getBooksByCategory(category, books) {
    return books.filter((book) => Array.isArray(book.book_category) && book.book_category.includes(category));
  }
  const footerLinks = [
    { title: "เกี่ยวกับเรา", url: "/about" },
    // เปลี่ยน URL
    { title: "ติดต่อเรา", url: "/contact" },
    // เปลี่ยน URL
    {
      title: "นโยบายความเป็นส่วนตัว",
      url: "/privacy"
    }
    // เปลี่ยน URL
  ];
  const socialLinks = [
    {
      icon: "fab fa-facebook-f",
      url: "https://www.facebook.com/yourpage",
      label: "Facebook"
    },
    // เปลี่ยน URL
    {
      icon: "fab fa-twitter",
      url: "https://twitter.com/yourhandle",
      label: "Twitter"
    },
    // เปลี่ยน URL
    {
      icon: "fab fa-instagram",
      url: "https://www.instagram.com/youraccount",
      label: "Instagram"
    }
    // เปลี่ยน URL
  ];
  const contactInfo = {
    address: "123 ถ.สุขุมวิท, กรุงเทพฯ",
    // เปลี่ยนที่อยู่
    phone: "02-123-4567",
    // เปลี่ยนเบอร์โทร
    email: "info@example.com"
    // เปลี่ยนอีเมล
  };
  let categories = [
    "Fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Horror",
    "Romance",
    "Historical Fiction",
    "Literary Fiction",
    "Young Adult",
    "Children's",
    "Graphic Novels",
    "Dystopian",
    "Action",
    "Western",
    "Nonfiction",
    "History",
    "Biography/Autobiography",
    "Self-help",
    "Science & Technology",
    "Health & Wellness",
    "Business & Economics",
    "True Crime",
    "Travel",
    "Cookbooks",
    "Art & Photography",
    "Religion & Spirituality",
    "Philosophy",
    "Humor",
    "Essays",
    "Reference",
    "Girl Love",
    "Boy Love",
    "R18+",
    "Light Novel",
    "Manga",
    "Manwha",
    "manhua",
    "Comic",
    "SuperHero",
    "Drama",
    "Adventure"
  ];
  onDestroy(() => {
  });
  let bannerImages = [
    "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/323203587/original/8f16754c80f8ea7a8a2b87b24c40f123ed219937/do-a-colorful-and-dynamic-anime-or-manga-banner-for-you.png",
    "https://i.redd.it/t4x28924inbc1.jpeg",
    "https://cdn.vectorstock.com/i/500p/26/35/merry-christmas-podium-display-snowman-banner-vector-54372635.jpg"
  ];
  let currentBannerIndex = 0;
  function startAutoSlide() {
    setInterval(
      () => {
        currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
      },
      3e3
    );
  }
  startAutoSlide();
  let smallBannerImages = [
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/56108c72-51ea-4e26-8de9-008fde4723c4/dfhaomu-59c653ab-3da1-4c81-9a4b-bbd042eec441.jpg/v1/fill/w_1280,h_427,q_75,strp/hentai_banner_by_bankysenpai_dfhaomu-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDI3IiwicGF0aCI6IlwvZlwvNTYxMDhjNzItNTFlYS00ZTI2LThkZTktMDA4ZmRlNDcyM2M0XC9kZmhhb211LTU5YzY1M2FiLTNkYTEtNGM4MS05YTRiLWJiZDA0MmVlYzQ0MS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.iARBneFwUhe2l5QaD7tde0SZRIUGiBQxZnFadq0DFMQ",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0IUgoI9H2LpPoSSvg5nJxns3acKbS-gdQjQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0IUgoI9H2LpPoSSvg5nJxns3acKbS-gdQjQ&s"
  ];
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50 svelte-1oara7u"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full svelte-1oara7u"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(smallBannerImages);
    const each_array_1 = ensure_array_like(products);
    const each_array_2 = ensure_array_like(categories);
    const each_array_3 = ensure_array_like(categories);
    const each_array_5 = ensure_array_like(footerLinks);
    const each_array_6 = ensure_array_like(socialLinks);
    $$payload.out += `<div class="h-full bg-blue-50 svelte-1oara7u"><main class="container mx-auto py-8 svelte-1oara7u"><div class="grid grid-cols-4 gap-4 mb-8 relative svelte-1oara7u"><div class="col-span-4 md:col-span-3 relative bg-gray-300 h-64 rounded-lg overflow-hidden svelte-1oara7u"><img${attr("src", bannerImages[currentBannerIndex])} alt="Banner" class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 svelte-1oara7u"></div> <div class="col-span-4 md:col-span-1 space-y-4 svelte-1oara7u"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let banner = each_array[index];
      $$payload.out += `<div class="bg-gray-300 h-20 rounded-lg overflow-hidden svelte-1oara7u"><img${attr("src", banner)}${attr("alt", `Small Banner ${index + 1}`)} class="w-full h-full object-cover svelte-1oara7u"></div>`;
    }
    $$payload.out += `<!--]--></div></div> <section class="mb-8 relative svelte-1oara7u"><h2 class="text-xl font-bold mb-4 svelte-1oara7u">สินค้าออกใหม่</h2> `;
    if (products.length == 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<iframe class="aspect-video w-3/4 svelte-1oara7u" src="https://www.youtube.com/embed/8ytKQE-8-Hw?autoplay=1" allow="autoplay"></iframe>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="contents svelte-1oara7u"><div class="swiper swiper1 svelte-1oara7u"><div class="swiper-wrapper svelte-1oara7u"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let product = each_array_1[$$index_1];
      $$payload.out += `<div class="swiper-slide svelte-1oara7u" style="text-align: center;"><div class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200 svelte-1oara7u"><div class="h-56 mb-2 rounded-md overflow-hidden svelte-1oara7u"><img${attr("src", product.book_image)}${attr("alt", product.book_name_th)} class="h-48 w-96 object-scale-down place-content-center svelte-1oara7u"></div> <p class="text-center truncate svelte-1oara7u">${escape_html(product.book_name_th)}</p> `;
      Rating($$payload, {
        id: "example-3",
        total: 5,
        rating: product.book_score
      });
      $$payload.out += `<!----> <p class="text-center text-red-500 svelte-1oara7u">${escape_html(product.book_price)}</p></div></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="swiper-button-next svelte-1oara7u"></div> <div class="swiper-button-prev svelte-1oara7u"></div> <br class="svelte-1oara7u"><br class="svelte-1oara7u"> <div class="swiper-pagination sm:hidden sm:block svelte-1oara7u"></div></div></div></section> <section class="mb-8 svelte-1oara7u"><h2 class="text-xl font-bold mb-4 svelte-1oara7u">หมวดหมู่</h2> <div class="flex flex-wrap space-x-2 svelte-1oara7u"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let category = each_array_2[$$index_2];
      $$payload.out += `<a${attr("href", `/all?category=${stringify(encodeURIComponent(category))}`)} class="bg-blue-200 text-blue-800 px-4 py-2 rounded-md mb-2 hover:bg-blue-300 transition duration-200 svelte-1oara7u">${escape_html(category)}</a>`;
    }
    $$payload.out += `<!--]--></div></section> <section class="mb-8 svelte-1oara7u"><h2 class="text-xl font-bold mb-4 svelte-1oara7u">หนังสือในแต่ละ หมวดหมู่</h2> <!--[-->`;
    for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
      let category = each_array_3[$$index_4];
      if (getBooksByCategory(category, eachbook).length >= 5) {
        $$payload.out += "<!--[-->";
        const each_array_4 = ensure_array_like(getBooksByCategory(category, eachbook));
        $$payload.out += `<div class="mb-6 svelte-1oara7u"><h3 class="text-lg font-semibold mb-2 svelte-1oara7u">${escape_html(category)}</h3> <div class="contents svelte-1oara7u"><div class="swiper swiper2 svelte-1oara7u"><div class="swiper-wrapper svelte-1oara7u"><!--[-->`;
        for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
          let product = each_array_4[$$index_3];
          $$payload.out += `<div class="swiper-slide svelte-1oara7u"><div class="bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-200 svelte-1oara7u"><div class="h-56 mb-2 rounded-md overflow-hidden svelte-1oara7u"><img${attr("src", product.book_image)}${attr("alt", product.book_name_originl)} class="h-48 w-96 object-scale-down place-content-center svelte-1oara7u"></div> <p class="text-center truncate svelte-1oara7u">${escape_html(product.book_name_originl)}</p> `;
          Rating($$payload, {
            id: "example-3",
            total: 5,
            rating: product.book_score
          });
          $$payload.out += `<!----> <p class="text-center text-red-500 svelte-1oara7u">${escape_html(product.book_price)}</p></div></div>`;
        }
        $$payload.out += `<!--]--></div> <div class="swiper-button-next svelte-1oara7u"></div> <div class="swiper-button-prev svelte-1oara7u"></div> <br class="svelte-1oara7u"><br class="svelte-1oara7u"> <div class="swiper-pagination sm:hidden sm:block svelte-1oara7u"></div></div></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></section></main> <footer class="bg-blue-800 text-white py-8 svelte-1oara7u"><div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 svelte-1oara7u"><div class="md:col-span-1 svelte-1oara7u"><h4 class="text-lg font-semibold mb-3 svelte-1oara7u">Links</h4> <ul class="svelte-1oara7u"><!--[-->`;
    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
      let link = each_array_5[$$index_5];
      $$payload.out += `<li class="svelte-1oara7u"><a${attr("href", link.url)} class="hover:text-blue-300 transition-colors duration-300 svelte-1oara7u">${escape_html(link.title)}</a></li>`;
    }
    $$payload.out += `<!--]--></ul></div> <div class="md:col-span-1 svelte-1oara7u"><h4 class="text-lg font-semibold mb-3 svelte-1oara7u">ติดต่อเรา</h4> <p class="svelte-1oara7u">${escape_html(contactInfo.address)}</p> <p class="svelte-1oara7u">โทร: ${escape_html(contactInfo.phone)}</p> <p class="svelte-1oara7u">อีเมล: <a${attr("href", "mailto:" + contactInfo.email)} class="hover:text-blue-300 transition-colors duration-300 svelte-1oara7u">${escape_html(contactInfo.email)}</a></p></div> <div class="md:col-span-1 svelte-1oara7u"><h4 class="text-lg font-semibold mb-3 svelte-1oara7u">Social Media</h4> <div class="flex space-x-4 svelte-1oara7u"><!--[-->`;
    for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
      let link = each_array_6[$$index_6];
      $$payload.out += `<a${attr("href", link.url)} target="_blank" rel="noopener noreferrer" class="hover:text-blue-300 transition-colors duration-300 svelte-1oara7u"${attr("title", link.label)}><i${attr("class", clsx(link.icon) + " svelte-1oara7u")}></i> <span class="sr-only svelte-1oara7u">${escape_html(link.label)}</span></a>`;
    }
    $$payload.out += `<!--]--></div></div> <div class="mt-8 border-t border-blue-700 pt-4 text-center col-span-full svelte-1oara7u"><p class="svelte-1oara7u">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} ร้านหนังสือของป้าแพรวา. All rights reserved.</p></div></div></footer></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
