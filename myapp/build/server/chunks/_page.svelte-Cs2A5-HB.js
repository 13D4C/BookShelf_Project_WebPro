import { a2 as store_get, a6 as ensure_array_like, a5 as attr, a4 as escape_html, a3 as unsubscribe_stores, t as pop, p as push } from './exports-awn_jp61.js';
import './client-RwyKh1r1.js';
import { w as writable } from './index2-BlDWhwEb.js';

function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let filteredProducts, searchedProducts, categories;
  let products = [];
  const isLoading = writable(true);
  let searchTerm = "";
  filteredProducts = products;
  searchedProducts = filteredProducts;
  (() => {
    let sorted = [...searchedProducts];
    return sorted;
  })();
  categories = [
    ...new Set(products.map((product) => product.book_category))
  ];
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(categories);
    $$payload.out += `<div class="container mx-auto p-4"><h1 class="text-3xl font-bold mb-4">Marketplace</h1> <div class="mb-4 flex flex-col md:flex-row gap-4"><input type="text" placeholder="Search..."${attr("value", searchTerm)} class="border p-2 rounded w-full md:w-1/2"> <select class="border p-2 rounded w-full md:w-1/4"><option${attr("value", null)}>All Categories</option><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let category = each_array[$$index];
      $$payload.out += `<option${attr("value", category)}>${escape_html(category)}</option>`;
    }
    $$payload.out += `<!--]--></select> <select class="border p-2 rounded w-full md:w-1/4"><option${attr("value", null)}>Sort By</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest</option></select></div> `;
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p>Loading products...</p>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer">`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cs2A5-HB.js.map
