import { V as store_get, Y as attr, X as escape_html, W as unsubscribe_stores, T as pop, _ as stringify, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { w as writable } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const isLoading = writable(true);
  let user = {};
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="min-h-screen bg-gray-100"><div class="container mx-auto px-4 py-8"><div class="flex flex-col md:flex-row gap-8"><aside class="w-full md:w-64 bg-blue-600 rounded-lg shadow-lg p-4 text-white transition-all duration-300"><div class="md:hidden flex justify-between items-center mb-4"><button class="text-white hover:text-gray-200 focus:outline-none"><i class="fa-solid fa-bars text-xl"></i></button> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <h2 class="text-lg font-semibold mb-4 hidden md:block">บัญชีของฉัน</h2> <ul class="space-y-2 hidden md:block"><li${attr("class", `px-4 py-2 rounded cursor-pointer hover:bg-blue-700 ${stringify("bg-blue-800")}`)}><i class="fa-solid fa-user mr-2"></i>บัญชีผู้ใช้</li> <li${attr("class", `px-4 py-2 rounded cursor-pointer hover:bg-blue-700 ${stringify("")}`)}><i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของฉัน</li> `;
    if (user.user_permission == "Publisher" || user.user_permission == "Seller") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<li${attr("class", `px-4 py-2 rounded cursor-pointer hover:bg-blue-700 ${stringify("")}`)}><i class="fa-solid fa-box mr-2"></i>คำสั่งซื้อของร้าน</li>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <li${attr("class", `px-4 py-2 rounded cursor-pointer hover:bg-blue-700 ${stringify("")}`)}><i class="fa-solid fa-store mr-2"></i>การขอเปิดร้านค้า</li></ul></aside> <main class="flex-1 mt-4 md:mt-0">`;
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="bg-white rounded-lg shadow-md p-6"><h1 class="text-2xl font-semibold mb-4">บัญชีผู้ใช้</h1> <div class="flex items-center mb-4"><img${attr("src", user.user_image)} alt="Profile" class="w-20 h-20 rounded-full mr-4 ring-2 ring-blue-500"> <div><p class="text-lg font-medium">ชื่อบัญชี: <span class="font-normal">${escape_html(user.user_name)}</span></p> <p class="text-gray-600">ชื่อจริง: ${escape_html(user.user_firstname)}
                    ${escape_html(user.user_lastname)}</p> <p class="text-gray-600">อีเมล: ${escape_html(user.user_email)}</p></div></div> <form class="mt-6 space-y-4"><div><label class="block text-gray-700 text-sm font-bold mb-2" for="name">ชื่อบัญชี:</label> <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="name" type="text" name="name"${attr("value", user?.user_name ?? "")}></div> <div><label class="block text-gray-700 text-sm font-bold mb-2" for="email">อีเมล:</label> <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="email" type="text" name="email"${attr("value", user?.user_email ?? "")}></div> <div><label class="block text-gray-700 text-sm font-bold mb-2" for="pass">รหัสผ่าน:</label> <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="pass" type="password" name="pass" placeholder="********"> <p class="text-xs text-gray-500 mt-1">ปล่อยว่างไว้ หากไม่ต้องการเปลี่ยนรหัสผ่าน</p></div> <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">บันทึก</button></form></div>`;
    }
    $$payload.out += `<!--]--></main></div></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer">`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
