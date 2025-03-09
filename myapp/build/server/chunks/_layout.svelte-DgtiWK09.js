import { a2 as store_get, a3 as unsubscribe_stores, t as pop, p as push } from './exports-awn_jp61.js';
import './client-RwyKh1r1.js';
import { N as Navbar_1 } from './navbar-DFx4JnJx.js';
import { o as onDestroy } from './index-server-CmzX31Gc.js';
import { w as writable } from './index2-BlDWhwEb.js';
import './stores-BNzwRNFq.js';
import './bundle-mjs-DQTJBhGO.js';
import './index3-C_6sHup2.js';
import './html-FW6Ia4bL.js';

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

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DgtiWK09.js.map
