import { a5 as attr, a6 as ensure_array_like, a4 as escape_html, t as pop, a7 as stringify, p as push } from './exports-awn_jp61.js';
import './client-RwyKh1r1.js';

function _page($$payload, $$props) {
  push();
  let user = {};
  let sellerRequests = [];
  $$payload.out += `<div class="min-h-screen bg-blue-50"><div class="container mx-auto px-4 py-8 flex flex-col sm:flex-row"><div class="sm:hidden"><button class="text-blue-700 focus:outline-none"><i class="fa-solid fa-bars text-xl"></i></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="hidden sm:block bg-blue-700 w-64 min-w-[256px] p-4 rounded-lg mr-4"><h2 class="text-lg font-semibold text-white">บัญชีของฉัน</h2> <ul class="mt-4">`;
  if (user.user_permission === "Manager") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<li${attr("class", `p-2 rounded cursor-pointer hover:bg-blue-800 ${stringify("bg-blue-900 text-white")}`)}><i class="fa-solid fa-user-check mr-2"></i>ยืนยันการเปิดร้าน</li> <li${attr("class", `p-2 rounded cursor-pointer hover:bg-blue-800 ${stringify("text-white")}`)}><i class="fa-solid fa-ban mr-2"></i>จัดการการแบน</li> <li${attr("class", `p-2 rounded cursor-pointer hover:bg-blue-800 ${stringify("text-white")}`)}><i class="fa-solid fa-flag mr-2"></i>ตรวจสอบรายงาน</li>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></ul></div> <div class="flex-1 p-4">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<h1 class="text-2xl font-semibold mb-4">ยืนยันการเปิดร้าน</h1> `;
    if (sellerRequests.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p>ไม่มีคำขอเปิดร้านค้าในขณะนี้</p>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(sellerRequests);
      $$payload.out += `<div class="bg-white rounded-lg shadow-md overflow-x-auto"><table class="min-w-full"><thead><tr class="bg-gray-100"><th class="py-2 px-4 text-left">Username</th><th class="py-2 px-4 text-left">Email</th><th class="py-2 px-4 text-left">Actions</th></tr></thead><tbody><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let request = each_array[$$index];
        $$payload.out += `<tr class="border-b"><td class="py-2 px-4">${escape_html(request.user_name)}</td><td class="py-2 px-4">${escape_html(request.user_email)}</td><td class="py-2 px-4"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">รายละเอียด</button> <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">อนุมัติ</button> <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">ปฏิเสธ</button></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer">`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-QRvrfd1W.js.map
