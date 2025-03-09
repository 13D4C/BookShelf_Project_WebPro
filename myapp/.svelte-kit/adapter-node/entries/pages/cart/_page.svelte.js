import { V as store_get, Y as attr, X as escape_html, Z as ensure_array_like, W as unsubscribe_stores, T as pop, _ as stringify, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { w as writable } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let filteredCart;
  const isLoading = writable(true);
  let cart = [];
  function getTotalPrice() {
    let total = filteredCart.reduce(
      (sum, item) => {
        return sum + item.book_price * item.amount;
      },
      0
    );
    return total.toFixed(2);
  }
  filteredCart = cart.filter((item) => {
    {
      return item.type === "official";
    }
  });
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="flex flex-col md:flex-row gap-6 p-6"><div class="flex-1 bg-white p-6 rounded-lg shadow"><h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2> <div class="mb-4"><button${attr("class", `px-4 py-2 rounded ${stringify("bg-blue-500 text-white")}`)}>Official : ${escape_html(cart.filter((item) => item.type === "official").length)}</button> <button${attr("class", `px-4 py-2 rounded ${stringify("bg-gray-200")}`)}>Official : ${escape_html(cart.filter((item) => item.type === "seller").length)}</button></div> `;
    {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(filteredCart);
      if (each_array.length !== 0) {
        $$payload.out += "<!--[-->";
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let item = each_array[index];
          $$payload.out += `<div class="flex items-center gap-4 border-b pb-4 mb-4"><img${attr("src", item.book_image)} alt="Product" class="w-20 h-20 object-cover rounded-lg"> <div class="flex-1"><h3 class="text-sm font-medium">${escape_html(item.book_name_th)}</h3> <p class="text-lg font-semibold text-blue-600">${escape_html(item.book_price)} บาท</p></div> <div class="flex items-center"><button class="px-2 py-1 border rounded">-</button> <span class="px-4">${escape_html(item.amount)}</span> <button class="px-2 py-1 border rounded">+</button></div> <button class="text-gray-500 hover:text-red-500">🗑️</button></div> `;
          if (item.marker) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<p>${escape_html(item.marker)} ${escape_html(item.cover_color)}</p>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]-->`;
        }
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<p>ไม่มีสินค้าในตะกร้า</p>`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></div> <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow self-start"><h2 class="text-lg font-semibold mb-4">สรุปการสั่งซื้อ</h2> <div class="flex justify-between mb-2"><span>จำนวนหนังสือ</span> <span>${escape_html(filteredCart.reduce((sum, item) => sum + item.amount, 0))} เล่ม</span></div> <div class="flex justify-between font-bold text-lg"><span>ยอดสุทธิ</span> <span>${escape_html(getTotalPrice())} บาท</span></div> `;
    if (filteredCart.length != 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="w-full bg-green-500 text-white py-2 rounded mt-4">ดำเนินการต่อ</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <button class="w-full border mt-2 py-2 rounded text-white bg-blue-500">เลือกสินค้าต่อ</button></div></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
