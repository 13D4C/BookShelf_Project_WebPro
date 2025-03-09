import { Z as ensure_array_like, X as escape_html, T as pop, Q as push } from "../../../chunks/index.js";
import { N as Navbar_1 } from "../../../chunks/navbar.js";
function _page($$payload, $$props) {
  push();
  let registrations = [
    {
      userId: "1",
      userName: "user1",
      userEmail: "user1@example.com",
      userPhone: "0812345678",
      dateOfBirth: "1990-01-15",
      status: "pending",
      idCard: "https://preview.redd.it/r72kvnykeui41.png?auto=webp&s=6f903e95e64269773d4129a38194de0753d14a84",
      // Placeholder image
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      // Placeholder QR code
      shopName: "Shop 1",
      shopDescription: "Description 1"
    },
    {
      userId: "2",
      userName: "user2",
      userEmail: "user2@example.com",
      userPhone: "0898765432",
      dateOfBirth: "1985-05-20",
      status: "pending",
      idCard: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      // Placeholder image
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      // Placeholder QR code
      shopName: "Shop 2",
      shopDescription: "Description 2",
      message: "Please provide a clearer ID card image."
    },
    {
      userId: "3",
      userName: "user3",
      userEmail: "user3@example.com",
      userPhone: "0898765432",
      dateOfBirth: "1995-05-20",
      status: "approved",
      idCard: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      // Placeholder image
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      // Placeholder QR code
      shopName: "Shop 3",
      shopDescription: "Description 3",
      message: "Please provide a clearer ID card image."
    }
  ];
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = /* @__PURE__ */ new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || m === 0 && today.getDate() < dob.getDate()) {
      age--;
    }
    return age;
  }
  Navbar_1($$payload);
  $$payload.out += `<!----> <div class="p-4 svelte-rgghj"><h1 class="text-2xl font-bold mb-4">Seller Registration Review (Admin)</h1> `;
  {
    $$payload.out += "<!--[!-->";
    {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(registrations);
      $$payload.out += `<div class="overflow-x-auto"><table class="min-w-full bg-white border border-gray-300"><thead><tr class="bg-gray-100"><th class="py-2 px-4 border-b">Username</th><th class="py-2 px-4 border-b">Name</th><th class="py-2 px-4 border-b">Email</th><th class="py-2 px-4 border-b">Phone</th><th class="py-2 px-4 border-b">Age</th><th class="py-2 px-4 border-b">Shop Name</th><th class="py-2 px-4 border-b">Shop Description</th><th class="py-2 px-4 border-b">Status</th><th class="py-2 px-4 border-b">Actions</th></tr></thead><tbody><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let registration = each_array[$$index];
        $$payload.out += `<tr class="hover:bg-gray-50"><td class="py-2 px-4 border-b">${escape_html(registration.userName)}</td><td class="py-2 px-4 border-b">${escape_html(registration.userName)}</td><td class="py-2 px-4 border-b">${escape_html(registration.userEmail)}</td><td class="py-2 px-4 border-b">${escape_html(registration.userPhone)}</td><td class="py-2 px-4 border-b">${escape_html(calculateAge(registration.dateOfBirth))}</td><td class="py-2 px-4 border-b">${escape_html(registration.shopName)}</td><td class="py-2 px-4 border-b">${escape_html(registration.shopDescription)}</td><td class="py-2 px-4 border-b">${escape_html(registration.status)}</td><td class="py-2 px-4 border-b"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">Detail</button> `;
        if (registration.status === "pending") {
          $$payload.out += "<!--[-->";
          $$payload.out += `<button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">Approve</button> <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Deny</button>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
