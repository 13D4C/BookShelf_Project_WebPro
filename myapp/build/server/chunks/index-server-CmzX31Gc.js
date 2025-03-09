import { al as current_component } from './exports-awn_jp61.js';

function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}

export { onDestroy as o };
//# sourceMappingURL=index-server-CmzX31Gc.js.map
