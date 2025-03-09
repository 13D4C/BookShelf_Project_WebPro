import "clsx";
import { T as pop, Q as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<div class="container mx-auto p-4"><h1 class="text-2xl font-bold text-blue-900 text-center mb-4">ชำระเงิน</h1> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-center">Loading...</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
