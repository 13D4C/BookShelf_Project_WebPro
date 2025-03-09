import { a2 as store_get, a6 as ensure_array_like, a3 as unsubscribe_stores, t as pop, a4 as escape_html, a5 as attr, p as push } from './exports-awn_jp61.js';
import './client-RwyKh1r1.js';
import { p as page } from './stores-BNzwRNFq.js';
import { w as writable } from './index2-BlDWhwEb.js';

function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let book = {};
  let quantity = 1;
  let relatedBooks = [];
  let isLoadingRelatedBooks = true;
  let isLoadingBook = true;
  let errorMessage = "";
  let bookId = store_get($$store_subs ??= {}, "$page", page).params.id;
  let update = true;
  async function fetchBookData(bookId2) {
    isLoadingBook = true;
    isLoadingRelatedBooks = true;
    errorMessage = "";
    try {
      const response = await fetch(`http://localhost:3000/seller/books?id=${bookId2}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        book = data;
      } else {
        book = {};
        errorMessage = "Book not found";
      }
    } catch (error) {
      console.error("Error fetching main book details:", error);
      errorMessage = "Failed to load book details. Please try again later.";
    } finally {
      isLoadingBook = false;
      isLoading.set(false);
    }
    if (book.owner_id) {
      try {
        const response = await fetch(`http://localhost:3000/seller/books?ownerId=${book.owner_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        relatedBooks = data;
      } catch (error) {
        console.error("Error fetching related books:", error);
        errorMessage = "Failed to load related books.";
        relatedBooks = [];
      } finally {
        isLoadingRelatedBooks = false;
      }
    } else {
      relatedBooks = [];
      isLoadingRelatedBooks = false;
    }
  }
  const isLoading = writable(true);
  if (store_get($$store_subs ??= {}, "$page", page).params.id || update) {
    quantity = 1;
    bookId = store_get($$store_subs ??= {}, "$page", page).params.id;
    fetchBookData(bookId);
    update = false;
  }
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="min-h-screen bg-blue-50"><div class="max-w-5xl mx-auto p-6">`;
    if (errorMessage) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(errorMessage)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (isLoadingBook) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="animate-pulse"><div class="h-64 bg-gray-300 rounded-lg"></div> <div class="mt-4 space-y-2"><div class="h-6 bg-gray-300 rounded"></div> <div class="h-4 bg-gray-300 rounded w-3/4"></div> <div class="h-4 bg-gray-300 rounded w-1/2"></div></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="relative">`;
      if (book.book_image) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="max-w-xs"><img class="w-full rounded-lg object-cover"${attr("src", book.book_image)}${attr("alt", book.book_name)}></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="space-y-4"><h1 class="text-3xl font-bold">${escape_html(book.book_name)}</h1> <p class="text-2xl text-red-600 font-semibold">${escape_html(book.book_price)} บาท</p> <div class="flex items-center"><label class="mr-2 text-lg">จำนวน</label> <button class="px-4 py-2 bg-gray-500 rounded text-xl">-</button> <span class="px-4 text-xl">${escape_html(quantity)}</span> <button class="px-4 py-2 bg-gray-300 rounded text-xl">+</button></div> <div class="flex gap-4"><button class="px-8 py-3 border border-orange-500 text-orange-500 rounded text-lg">ใส่รถเข็น</button></div> <div class="mt-8"><h2 class="text-xl font-semibold">รายละเอียด :</h2> <p class="text-gray-600 mt-2">${escape_html(book.description)}</p></div></div></div>`;
    }
    $$payload.out += `<!--]--> <div class="mt-8"><button class="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">📢 รายงานหนังสือเล่มนี้</button></div> <div class="mt-8"><h2 class="text-xl font-semibold">หนังสือที่เกี่ยวข้อง</h2> `;
    if (isLoadingRelatedBooks) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(Array(4));
      $$payload.out += `<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$payload.out += `<div class="bg-gray-200 h-40 rounded-lg animate-pulse"></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array_1 = ensure_array_like(relatedBooks);
      $$payload.out += `<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">`;
      if (each_array_1.length !== 0) {
        $$payload.out += "<!--[-->";
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let related = each_array_1[$$index_1];
          $$payload.out += `<div class="bg-gray-200 h-40 rounded-lg overflow-hidden">`;
          if (related.book_image) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<img class="h-48 w-96 object-scale-down place-content-center"${attr("src", related.book_image)}${attr("alt", related.book_name_originl || "Related Book")} loading="lazy">`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--></div>`;
        }
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<p>No related books found.</p>`;
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-1eHYl8AX.js.map
