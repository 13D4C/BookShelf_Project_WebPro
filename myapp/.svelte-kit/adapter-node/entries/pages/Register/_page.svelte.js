import { Y as attr, X as escape_html, T as pop, _ as stringify, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let email = "";
  let error = "";
  function isValidEmail() {
    return email.includes("@");
  }
  $$payload.out += `<main class="flex h-screen relative"><button class="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-lg">ลงชื่อเข้าใช้</button> <div class="hidden md:flex flex-1 bg-cover bg-center" style="background-image: url('https://y.yarn.co/3ba26216-6da9-4e33-a71a-17968dbaa03d_screenshot.jpg');"></div> <div class="flex items-center justify-center w-full md:w-1/3 bg-white shadow-lg"><div class="w-full max-w-md p-8 space-y-6"><div class="text-center"><img src="https://i.imgflip.com/6362lr.png" alt="Logo" class="w-24 h-24 mx-auto mb-4"> <h1 class="text-2xl font-semibold text-gray-800">สมัคร ดิ๊</h1></div> <form class="space-y-4"><div><label for="username" class="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label> <input type="text" id="username" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่ชื่อผู้ใช้"></div> <div><label for="email" class="block text-sm font-medium text-gray-700">อีเมล</label> <input type="text" id="email"${attr("value", email)} class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่อีเมล"></div> <div><label for="phone" class="block text-sm font-medium text-gray-700">โทรศัพท์</label> <input type="text" id="phone" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่เบอร์โทรศัพท์"></div> <div><label for="username" class="block text-sm font-medium text-gray-700">ชื่อจริง</label> <input type="text" id="firstname" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่ชื่อจริง"></div> <div><label for="username" class="block text-sm font-medium text-gray-700">นามสกุล</label> <input type="text" id="lastname" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่นามสกุล"></div> <div><label for="password" class="block text-sm font-medium text-gray-700">รหัสผ่าน</label> <input type="password" id="password" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่รหัสผ่าน"></div> <p>${escape_html(error)}</p> <div><button type="submit"${attr("class", `w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${stringify([
    isValidEmail() ? "bg-blue-600" : "",
    isValidEmail() ? "hover:bg-blue-700" : "",
    !isValidEmail() ? "bg-gray-400" : "",
    !isValidEmail() ? "cursor-not-allowed" : ""
  ].filter(Boolean).join(" "))}`)}${attr("disabled", !isValidEmail(), true)}>ลงชื่อเข้าใช้</button></div></form></div></div></main>`;
  pop();
}
export {
  _page as default
};
