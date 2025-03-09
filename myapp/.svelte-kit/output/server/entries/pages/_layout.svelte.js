import { V as store_get, W as unsubscribe_stores, T as pop, Q as push } from "../../chunks/index.js";
import "../../chunks/client.js";
import { N as Navbar_1 } from "../../chunks/navbar.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import { w as writable } from "../../chunks/index2.js";
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  const isLoading = writable(true);
  const shouldRenderContent = writable(false);
  onDestroy(() => {
    isLoading.set(true);
  });
  let { children } = $$props;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    Navbar_1($$payload);
    $$payload.out += `<!----> `;
    if (store_get($$store_subs ??= {}, "$shouldRenderContent", shouldRenderContent)) {
      $$payload.out += "<!--[-->";
      children($$payload);
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
