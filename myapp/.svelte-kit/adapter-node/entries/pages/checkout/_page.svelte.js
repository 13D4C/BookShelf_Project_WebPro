import { V as store_get, Z as ensure_array_like, Y as attr, X as escape_html, W as unsubscribe_stores, T as pop, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { w as writable } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let cart = [];
  let Name = "";
  let email = "";
  let phone = "";
  let address = "";
  let city = "";
  let postalCode = "";
  let isLoading = writable(true);
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
    "อุบลราชธานี"
  ];
  function getTotalPrice() {
    let total = cart.reduce(
      (sum, item) => {
        return sum + item.book_price * item.amount;
      },
      0
    );
    return total.toFixed(2);
  }
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(cart);
    const each_array_1 = ensure_array_like(provinces);
    $$payload.out += `<div class="flex flex-col md:flex-row gap-6 p-6"><div class="flex-1 bg-white p-6 rounded-lg shadow"><h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2> <!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let item = each_array[index];
      $$payload.out += `<div class="flex items-center gap-4 border-b pb-4 mb-4"><img${attr("src", item.book_image)} alt="Product" class="w-20 h-20 object-cover rounded-lg"> <div class="flex-1"><h3 class="text-sm font-medium">${escape_html(item.book_name_th)}</h3> <p class="text-lg font-semibold text-blue-600">${escape_html(item.book_price)} บาท</p></div> <div class="flex items-center"><span class="px-4">${escape_html(item.amount)}</span></div></div> `;
      if (item.marker) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<p>Name:${escape_html(item.marker)} Cover Color:${escape_html(item.cover_color)}</p>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></div> <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow self-start"><h2 class="text-lg font-semibold mb-4">สรุปการสั่งซื้อ</h2> <div class="flex justify-between mb-2"><span>จำนวนหนังสือ</span> <span>${escape_html(cart.reduce((sum, item) => sum + item.amount, 0))} เล่ม</span></div> <div class="flex justify-between font-bold text-lg"><span>ยอดสุทธิ</span> <span>${escape_html(getTotalPrice())} บาท</span></div></div></div> <div class="container mx-auto p-4"><h1 class="text-2xl font-bold mb-4">ข้อมูลการจัดส่ง</h1> <form class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="firstName" class="block text-sm font-medium text-gray-700">ชื่อ - นามสกุล</label> <input type="text" id="firstName"${attr("value", Name)} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></div> <div><label for="email" class="block text-sm font-medium text-gray-700">อีเมล</label> <input type="email" id="email"${attr("value", email)} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></div> <div><label for="phone" class="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label> <input type="tel" id="phone"${attr("value", phone)} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></div> <div class="md:col-span-2"><label for="address" class="block text-sm font-medium text-gray-700">ที่อยู่</label> <input type="text" id="address"${attr("value", address)} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></div> <div><label for="city" class="block text-sm font-medium text-gray-700">ตำบล/แขวง</label> <input type="text" id="city"${attr("value", city)} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></div> <div><label for="province" class="block text-sm font-medium text-gray-700">จังหวัด</label> <select id="province" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required><option value="" disabled selected>เลือกจังหวัด</option><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let provinceOption = each_array_1[$$index_1];
      $$payload.out += `<option${attr("value", provinceOption)}>${escape_html(provinceOption)}</option>`;
    }
    $$payload.out += `<!--]--></select></div> <div><label for="postalCode" class="block text-sm font-medium text-gray-700">รหัสไปรษณีย์</label> <input type="text" id="postalCode"${attr("value", postalCode)} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></div> <div class="md:col-span-2"><button type="submit" class="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">สั่งซื้อสินค้า</button></div></form></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
