import { V as store_get, a9 as copy_payload, aa as assign_payload, W as unsubscribe_stores, T as pop, Z as ensure_array_like, Y as attr, _ as stringify, X as escape_html, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { w as writable } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/stores.js";
import { b as browser } from "../../../chunks/index4.js";
import { B as Button, C as CloseButton, s as sineIn } from "../../../chunks/index3.js";
import { F as FilterSolid, D as Drawer } from "../../../chunks/FilterSolid.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let filteredBooks;
  let hidden1 = true;
  let transitionParams = { x: -320, duration: 200, easing: sineIn };
  let books = [];
  let userToken;
  let uniqueCategories = [];
  let selectedCategory = null;
  let userData;
  let cards = [];
  const isLoading = writable(true);
  function getUniqueCategories(booksData) {
    let categories = /* @__PURE__ */ new Set();
    booksData.forEach((book) => {
      if (book.book_category) {
        const individualCategories = book.book_category.split(",");
        individualCategories.forEach((category) => {
          categories.add(category);
        });
      }
    });
    return Array.from(categories);
  }
  async function getBooks() {
    try {
      userData = await getUser();
      let url;
      if (userData) {
        switch (userData.user_permission) {
          case "Seller":
            url = `http://localhost:3000/seller/books?ownerId=${userData.user_id}`;
            break;
          case "Manager":
            url = `http://localhost:3000/seller/books?all=true`;
            break;
        }
      } else {
        return null;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      books = await response.json();
      uniqueCategories = getUniqueCategories(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      books = [];
      uniqueCategories = [];
    } finally {
      isLoading.set(false);
    }
  }
  async function getUser() {
    try {
      if (browser) ;
      else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }
  function equalizeCardHeights() {
    if (!cards.length) return;
    let maxHeight = 0;
    cards.forEach((card) => {
      card.style.height = "auto";
    });
    cards.forEach((card) => {
      maxHeight = Math.max(maxHeight, card.offsetHeight);
    });
    cards.forEach((card) => {
      card.style.height = `${maxHeight}px`;
    });
  }
  filteredBooks = /* @__PURE__ */ (() => {
    let result = books;
    return result;
  })();
  if (books.length > 0) {
    equalizeCardHeights();
  }
  if (filteredBooks) {
    equalizeCardHeights();
  }
  store_get($$store_subs ??= {}, "$page", page).url && getBooks();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      const each_array_1 = ensure_array_like(uniqueCategories);
      const each_array_2 = ensure_array_like(filteredBooks);
      $$payload2.out += `<div class="min-h-screen bg-white"><div class="max-w-6xl mx-auto p-4"><div class="flex items-center justify-between mb-4"><h1 class="text-3xl font-bold text-blue-700">หนังสือทั้งหมดของผู้ขาย</h1> `;
      Button($$payload2, {
        class: "block lg:hidden",
        children: ($$payload3) => {
          FilterSolid($$payload3, { class: "w-5 h-5 me-2.5" });
          $$payload3.out += `<!---->Filter`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----></div> `;
      Drawer($$payload2, {
        transitionType: "fly",
        transitionParams,
        id: "sidebar1",
        get hidden() {
          return hidden1;
        },
        set hidden($$value) {
          hidden1 = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          const each_array = ensure_array_like(uniqueCategories);
          $$payload3.out += `<div class="flex items-center"><h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">`;
          FilterSolid($$payload3, { class: "w-5 h-5 me-2.5 place-content-center" });
          $$payload3.out += `<!---->Filter</h5> `;
          CloseButton($$payload3, { class: "mb-4 dark:text-white" });
          $$payload3.out += `<!----></div> <h2 class="text-xl font-semibold text-blue-700">หมวดหมู่</h2> <ul class="mt-2 space-y-2"><li class="text-blue-600 cursor-pointer hover:underline">ทั้งหมด</li> <!--[-->`;
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let category = each_array[$$index];
            $$payload3.out += `<li${attr("class", `text-blue-600 cursor-pointer hover:underline ${stringify([
              selectedCategory === category ? "font-bold" : ""
            ].filter(Boolean).join(" "))}`)}>${escape_html(category)}</li>`;
          }
          $$payload3.out += `<!--]--></ul>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <div class="flex gap-4"><aside class="hidden lg:block w-[20%] border border-blue-500 p-4 rounded-lg bg-blue-50 h-fit"><h2 class="text-xl font-semibold text-blue-700">หมวดหมู่</h2> <ul class="mt-2 space-y-2"><li class="text-blue-600 cursor-pointer hover:underline">ทั้งหมด</li> <!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let category = each_array_1[$$index_1];
        $$payload2.out += `<li${attr("class", `text-blue-600 cursor-pointer hover:underline ${stringify([
          selectedCategory === category ? "font-bold" : ""
        ].filter(Boolean).join(" "))}`)}>${escape_html(category)}</li>`;
      }
      $$payload2.out += `<!--]--></ul></aside> <div class="md:container md:mx-auto">`;
      if (userData.user_permission != "Manager" && userData.user_permission != "User") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div class="mb-4"><button class="mt-2 w-full bg-blue-800 text-white py-2 rounded">เพิ่มหนังสือ</button></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> <div class="md:container md:mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">`;
      if (each_array_2.length !== 0) {
        $$payload2.out += "<!--[-->";
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let book = each_array_2[$$index_2];
          $$payload2.out += `<div class="book-card border border-blue-500 rounded-lg shadow-lg bg-white flex flex-col"><div class="p-4"><img${attr("src", book.book_image)}${attr("alt", book.book_name)} class="object-contain w-full h-[200px] rounded"></div> <div class="px-4 pb-4 flex-grow"><p class="font-semibold text-blue-700 truncate">${escape_html(book.book_name)}</p> `;
          if (userData.user_permission != "User" && userData.user_permission != "Publisher") {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<button class="mt-2 w-full bg-blue-500 text-white py-2 rounded">เเก้ไขหนังสือ</button>`;
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--> `;
          if (userData.user_permission != "User" && userData.user_permission != "Publisher") {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<button data-modal-target="popup-modal" data-modal-toggle="popup-modal" class="mt-2 w-full bg-blue-500 text-white py-2 rounded">ลบหนังสือ</button>`;
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--></div></div>`;
        }
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<p>No books in this category.</p>`;
      }
      $$payload2.out += `<!--]--></div></div></div></div></div> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
