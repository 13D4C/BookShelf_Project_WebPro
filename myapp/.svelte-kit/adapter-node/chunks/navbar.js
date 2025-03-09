import { $ as rest_props, S as setContext, a0 as fallback, a1 as element, a2 as bind_props, T as pop, a3 as sanitize_props, Q as push, a4 as slot, a5 as spread_attributes, a6 as clsx, a7 as sanitize_slots, Y as attr, _ as stringify, a8 as spread_props, a9 as copy_payload, aa as assign_payload, ab as getContext, V as store_get, W as unsubscribe_stores, X as escape_html } from "./index.js";
import "./client.js";
import { p as page } from "./stores.js";
import { w as writable } from "./index2.js";
import { twMerge, twJoin } from "tailwind-merge";
import { C as CloseButton, T as ToolbarButton, s as sineIn, B as Button } from "./index3.js";
import * as dom from "@floating-ui/dom";
import { h as html } from "./html.js";
import "clsx";
const bgColors = {
  gray: "bg-gray-50 dark:bg-gray-800",
  red: "bg-red-50 dark:bg-gray-800",
  yellow: "bg-yellow-50 dark:bg-gray-800 ",
  green: "bg-green-50 dark:bg-gray-800 ",
  indigo: "bg-indigo-50 dark:bg-gray-800 ",
  purple: "bg-purple-50 dark:bg-gray-800 ",
  pink: "bg-pink-50 dark:bg-gray-800 ",
  blue: "bg-blue-50 dark:bg-gray-800 ",
  light: "bg-gray-50 dark:bg-gray-700",
  dark: "bg-gray-50 dark:bg-gray-800",
  default: "bg-white dark:bg-gray-800",
  dropdown: "bg-white dark:bg-gray-700",
  navbar: "bg-white dark:bg-gray-900",
  navbarUl: "bg-gray-50 dark:bg-gray-800",
  form: "bg-gray-50 dark:bg-gray-700",
  primary: "bg-primary-50 dark:bg-gray-800 ",
  orange: "bg-orange-50 dark:bg-orange-800",
  none: ""
};
function Frame($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "tag",
    "color",
    "rounded",
    "border",
    "shadow",
    "node",
    "use",
    "options",
    "role",
    "transition",
    "params",
    "open"
  ]);
  push();
  const noop = () => {
  };
  setContext("background", true);
  let tag = fallback($$props["tag"], () => $$restProps.href ? "a" : "div", true);
  let color = fallback($$props["color"], "default");
  let rounded = fallback($$props["rounded"], false);
  let border = fallback($$props["border"], false);
  let shadow = fallback($$props["shadow"], false);
  let node = fallback($$props["node"], () => void 0, true);
  let use = fallback($$props["use"], noop);
  let options = fallback($$props["options"], () => ({}), true);
  let role = fallback($$props["role"], () => void 0, true);
  let transition = fallback($$props["transition"], () => void 0, true);
  let params = fallback($$props["params"], () => ({}), true);
  let open = fallback($$props["open"], true);
  const textColors = {
    gray: "text-gray-800 dark:text-gray-300",
    red: "text-red-800 dark:text-red-400",
    yellow: "text-yellow-800 dark:text-yellow-300",
    green: "text-green-800 dark:text-green-400",
    indigo: "text-indigo-800 dark:text-indigo-400",
    purple: "text-purple-800 dark:text-purple-400",
    pink: "text-pink-800 dark:text-pink-400",
    blue: "text-blue-800 dark:text-blue-400",
    light: "text-gray-700 dark:text-gray-300",
    dark: "text-gray-700 dark:text-gray-300",
    default: "text-gray-500 dark:text-gray-400",
    dropdown: "text-gray-700 dark:text-gray-200",
    navbar: "text-gray-700 dark:text-gray-200",
    navbarUl: "text-gray-700 dark:text-gray-400",
    form: "text-gray-900 dark:text-white",
    primary: "text-primary-800 dark:text-primary-400",
    orange: "text-orange-800 dark:text-orange-400",
    none: ""
  };
  const borderColors = {
    gray: "border-gray-300 dark:border-gray-800 divide-gray-300 dark:divide-gray-800",
    red: "border-red-300 dark:border-red-800 divide-red-300 dark:divide-red-800",
    yellow: "border-yellow-300 dark:border-yellow-800 divide-yellow-300 dark:divide-yellow-800",
    green: "border-green-300 dark:border-green-800 divide-green-300 dark:divide-green-800",
    indigo: "border-indigo-300 dark:border-indigo-800 divide-indigo-300 dark:divide-indigo-800",
    purple: "border-purple-300 dark:border-purple-800 divide-purple-300 dark:divide-purple-800",
    pink: "border-pink-300 dark:border-pink-800 divide-pink-300 dark:divide-pink-800",
    blue: "border-blue-300 dark:border-blue-800 divide-blue-300 dark:divide-blue-800",
    light: "border-gray-500 divide-gray-500",
    dark: "border-gray-500 divide-gray-500",
    default: "border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700",
    dropdown: "border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600",
    navbar: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
    navbarUl: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
    form: "border-gray-300 dark:border-gray-700 divide-gray-300 dark:divide-gray-700",
    primary: "border-primary-500 dark:border-primary-200  divide-primary-500 dark:divide-primary-200 ",
    orange: "border-orange-300 dark:border-orange-800 divide-orange-300 dark:divide-orange-800",
    none: ""
  };
  let divClass;
  color = color ?? "default";
  setContext("color", color);
  divClass = twMerge(bgColors[color], textColors[color], rounded && "rounded-lg", border && "border", borderColors[color], shadow && "shadow-md", $$sanitized_props.class);
  if (transition && open) {
    $$payload.out += "<!--[-->";
    element(
      $$payload,
      tag,
      () => {
        $$payload.out += `${spread_attributes({
          role,
          ...$$restProps,
          class: clsx(divClass)
        })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", {}, null);
        $$payload.out += `<!---->`;
      }
    );
  } else {
    $$payload.out += "<!--[!-->";
    if (open) {
      $$payload.out += "<!--[-->";
      element(
        $$payload,
        tag,
        () => {
          $$payload.out += `${spread_attributes({
            role,
            ...$$restProps,
            class: clsx(divClass)
          })}`;
        },
        () => {
          $$payload.out += `<!---->`;
          slot($$payload, $$props, "default", {}, null);
          $$payload.out += `<!---->`;
        }
      );
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    tag,
    color,
    rounded,
    border,
    shadow,
    node,
    use,
    options,
    role,
    transition,
    params,
    open
  });
  pop();
}
function Indicator($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "color",
    "rounded",
    "size",
    "border",
    "placement",
    "offset"
  ]);
  push();
  let color = fallback($$props["color"], "gray");
  let rounded = fallback($$props["rounded"], false);
  let size = fallback($$props["size"], "md");
  let border = fallback($$props["border"], false);
  let placement = fallback($$props["placement"], () => void 0, true);
  let offset = fallback($$props["offset"], true);
  const colors = {
    gray: "bg-gray-200",
    dark: "bg-gray-900 dark:bg-gray-700",
    blue: "bg-blue-600",
    orange: "bg-orange-600",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    yellow: "bg-yellow-300",
    teal: "bg-teal-500",
    none: ""
  };
  const sizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-6 h-6"
  };
  const placements = {
    // top
    "top-left": "top-0 start-0",
    "top-center": "top-0 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rtl:translate-x-1/2",
    "top-right": "top-0 end-0",
    // center
    "center-left": "top-1/2 -translate-y-1/2 start-0",
    center: "top-1/2 -translate-y-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rtl:translate-x-1/2",
    "center-right": "top-1/2 -translate-y-1/2 end-0",
    // bottom
    "bottom-left": "bottom-0 start-0",
    "bottom-center": "bottom-0 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rtl:translate-x-1/2",
    "bottom-right": "bottom-0 end-0"
  };
  const offsets = {
    // top
    "top-left": "-translate-x-1/3 rtl:translate-x-1/3 -translate-y-1/3",
    "top-center": "-translate-y-1/3",
    "top-right": "translate-x-1/3 rtl:-translate-x-1/3 -translate-y-1/3",
    // center
    "center-left": "-translate-x-1/3 rtl:translate-x-1/3",
    center: "",
    "center-right": "translate-x-1/3 rtl:-translate-x-1/3",
    // bottom
    "bottom-left": "-translate-x-1/3 rtl:translate-x-1/3 translate-y-1/3",
    "bottom-center": "translate-y-1/3",
    "bottom-right": "translate-x-1/3 rtl:-translate-x-1/3 translate-y-1/3"
  };
  let dotClass;
  dotClass = twMerge("shrink-0", rounded ? "rounded" : "rounded-full", border && "border-2 border-white dark:border-gray-800", sizes[size], colors[color], $$slots.default && "inline-flex items-center justify-center", placement && "absolute " + placements[placement], placement && offset && offsets[placement], $$sanitized_props.class);
  $$payload.out += `<div${spread_attributes({ ...$$restProps, class: clsx(dotClass) })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div>`;
  bind_props($$props, {
    color,
    rounded,
    size,
    border,
    placement,
    offset
  });
  pop();
}
function Avatar($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "src",
    "href",
    "rounded",
    "border",
    "stacked",
    "dot",
    "alt",
    "size"
  ]);
  push();
  let src = fallback($$props["src"], "");
  let href = fallback($$props["href"], () => void 0, true);
  let rounded = fallback($$props["rounded"], false);
  let border = fallback($$props["border"], false);
  let stacked = fallback($$props["stacked"], false);
  let dot = fallback($$props["dot"], () => void 0, true);
  let alt = fallback($$props["alt"], "");
  let size = fallback($$props["size"], "md");
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
    xl: "w-36 h-36",
    none: ""
  };
  let avatarClass;
  dot = dot && {
    placement: "top-right",
    color: "gray",
    size: "lg",
    ...dot
  };
  avatarClass = twMerge(rounded ? "rounded" : "rounded-full", border && "p-1 ring-2 ring-gray-300 dark:ring-gray-500", sizes[size], stacked && "border-2 -ms-4 border-white dark:border-gray-800", "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 object-cover", $$sanitized_props.class);
  if (!src || !!href || $$slots.default || dot) {
    $$payload.out += "<!--[-->";
    element(
      $$payload,
      href ? "a" : "div",
      () => {
        $$payload.out += `${spread_attributes({
          href,
          ...$$restProps,
          class: `relative flex justify-center items-center ${stringify(avatarClass)}`
        })}`;
      },
      () => {
        if (src) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<img${attr("alt", alt)}${attr("src", src)}${attr("class", clsx(rounded ? "rounded" : "rounded-full"))}>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<!---->`;
          slot($$payload, $$props, "default", {}, () => {
            $$payload.out += `<svg${attr("class", `w-full h-full ${stringify(rounded ? "rounded" : "rounded-full")}`)} fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>`;
          });
          $$payload.out += `<!---->`;
        }
        $$payload.out += `<!--]--> `;
        if (dot) {
          $$payload.out += "<!--[-->";
          Indicator($$payload, spread_props([{ border: true, offset: rounded }, dot]));
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
    );
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<img${spread_attributes({
      alt,
      src,
      ...$$restProps,
      class: clsx(avatarClass)
    })} onload="this.__e=event" onerror="this.__e=event">`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    src,
    href,
    rounded,
    border,
    stacked,
    dot,
    alt,
    size
  });
  pop();
}
function Popper($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "activeContent",
    "arrow",
    "offset",
    "placement",
    "trigger",
    "triggeredBy",
    "reference",
    "strategy",
    "open",
    "yOnly",
    "middlewares"
  ]);
  push();
  let middleware;
  let activeContent = fallback($$props["activeContent"], false);
  let arrow = fallback($$props["arrow"], true);
  let offset = fallback($$props["offset"], 8);
  let placement = fallback($$props["placement"], "top");
  let trigger = fallback($$props["trigger"], "hover");
  let triggeredBy = fallback($$props["triggeredBy"], () => void 0, true);
  let reference = fallback($$props["reference"], () => void 0, true);
  let strategy = fallback($$props["strategy"], "absolute");
  let open = fallback($$props["open"], false);
  let yOnly = fallback($$props["yOnly"], false);
  let middlewares = fallback($$props["middlewares"], () => [dom.flip(), dom.shift()], true);
  let referenceEl;
  let floatingEl;
  let arrowEl;
  const px = (n) => n ? `${n}px` : "";
  let arrowSide;
  const oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function updatePosition() {
    dom.computePosition(referenceEl, floatingEl, { placement, strategy, middleware }).then(({
      x,
      y,
      middlewareData,
      placement: placement2,
      strategy: strategy2
    }) => {
      floatingEl.style.position = strategy2;
      floatingEl.style.left = yOnly ? "0" : px(x);
      floatingEl.style.top = px(y);
      if (middlewareData.arrow && arrowEl instanceof HTMLDivElement) {
        arrowEl.style.left = px(middlewareData.arrow.x);
        arrowEl.style.top = px(middlewareData.arrow.y);
        arrowSide = oppositeSideMap[placement2.split("-")[0]];
        arrowEl.style[arrowSide] = px(-arrowEl.offsetWidth / 2 - ($$sanitized_props.border ? 1 : 0));
      }
    });
  }
  function init(node, _referenceEl) {
    floatingEl = node;
    let cleanup = dom.autoUpdate(_referenceEl, floatingEl, updatePosition);
    return {
      update(_referenceEl2) {
        cleanup();
        cleanup = dom.autoUpdate(_referenceEl2, floatingEl, updatePosition);
      },
      destroy() {
        cleanup();
      }
    };
  }
  let arrowClass;
  placement && (referenceEl = referenceEl);
  middleware = [
    ...middlewares,
    dom.offset(+offset),
    arrowEl
  ];
  arrowClass = twJoin("absolute pointer-events-none block w-[10px] h-[10px] rotate-45 bg-inherit border-inherit", $$sanitized_props.border && arrowSide === "bottom" && "border-b border-e", $$sanitized_props.border && arrowSide === "top" && "border-t border-s ", $$sanitized_props.border && arrowSide === "right" && "border-t border-e ", $$sanitized_props.border && arrowSide === "left" && "border-b border-s ");
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (!referenceEl) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (referenceEl) {
      $$payload2.out += "<!--[-->";
      Frame($$payload2, spread_props([
        {
          use: init,
          options: referenceEl,
          role: "tooltip",
          tabindex: activeContent ? -1 : void 0
        },
        $$restProps,
        {
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children: ($$payload3) => {
            $$payload3.out += `<!---->`;
            slot($$payload3, $$props, "default", {}, null);
            $$payload3.out += `<!----> `;
            if (arrow) {
              $$payload3.out += "<!--[-->";
              $$payload3.out += `<div${attr("class", clsx(arrowClass))}></div>`;
            } else {
              $$payload3.out += "<!--[!-->";
            }
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    activeContent,
    arrow,
    offset,
    placement,
    trigger,
    triggeredBy,
    reference,
    strategy,
    open,
    yOnly,
    middlewares
  });
  pop();
}
function Dropdown($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "activeUrl",
    "open",
    "containerClass",
    "classContainer",
    "headerClass",
    "classHeader",
    "footerClass",
    "classFooter",
    "activeClass",
    "classActive",
    "arrow",
    "trigger",
    "placement",
    "color",
    "shadow",
    "rounded"
  ]);
  push();
  let containerCls, headerCls, ulCls, footerCls;
  let activeUrl = fallback($$props["activeUrl"], () => void 0, true);
  let open = fallback($$props["open"], false);
  let containerClass = fallback($$props["containerClass"], "divide-y z-50");
  let classContainer = fallback($$props["classContainer"], () => void 0, true);
  let headerClass = fallback($$props["headerClass"], "py-1 overflow-hidden rounded-t-lg");
  let classHeader = fallback($$props["classHeader"], () => void 0, true);
  let footerClass = fallback($$props["footerClass"], "py-1 overflow-hidden rounded-b-lg");
  let classFooter = fallback($$props["classFooter"], () => void 0, true);
  let activeClass = fallback($$props["activeClass"], "text-primary-700 dark:text-primary-700 hover:text-primary-900 dark:hover:text-primary-900");
  let classActive = fallback($$props["classActive"], () => void 0, true);
  let arrow = fallback($$props["arrow"], false);
  let trigger = fallback($$props["trigger"], "click");
  let placement = fallback($$props["placement"], "bottom");
  let color = fallback($$props["color"], "dropdown");
  let shadow = fallback($$props["shadow"], true);
  let rounded = fallback($$props["rounded"], true);
  const activeUrlStore = writable("");
  let activeCls = twMerge(activeClass, classActive);
  setContext("DropdownType", { activeClass: activeCls });
  setContext("activeUrl", activeUrlStore);
  activeUrlStore.set(activeUrl ?? "");
  containerCls = twMerge(containerClass, classContainer);
  headerCls = twMerge(headerClass, classHeader);
  ulCls = twMerge("py-1", $$sanitized_props.class);
  footerCls = twMerge(footerClass, classFooter);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Popper($$payload2, spread_props([
      { activeContent: true },
      $$restProps,
      {
        trigger,
        arrow,
        placement,
        shadow,
        rounded,
        color,
        class: containerCls,
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          if ($$slots.header) {
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<div${attr("class", clsx(headerCls))}><!---->`;
            slot($$payload3, $$props, "header", {}, null);
            $$payload3.out += `<!----></div>`;
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--> <ul${attr("class", clsx(ulCls))}><!---->`;
          slot($$payload3, $$props, "default", {}, null);
          $$payload3.out += `<!----></ul> `;
          if ($$slots.footer) {
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<div${attr("class", clsx(footerCls))}><!---->`;
            slot($$payload3, $$props, "footer", {}, null);
            $$payload3.out += `<!----></div>`;
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    activeUrl,
    open,
    containerClass,
    classContainer,
    headerClass,
    classHeader,
    footerClass,
    classFooter,
    activeClass,
    classActive,
    arrow,
    trigger,
    placement,
    color,
    shadow,
    rounded
  });
  pop();
}
function DropdownDivider($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["divClass"]);
  push();
  let divClass = fallback($$props["divClass"], "my-1 h-px bg-gray-100 dark:bg-gray-600");
  $$payload.out += `<div${spread_attributes({
    ...$$restProps,
    class: clsx(twMerge(divClass, $$sanitized_props.class))
  })}></div>`;
  bind_props($$props, { divClass });
  pop();
}
function DropdownHeader($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["divClass", "divider"]);
  push();
  let divClass = fallback($$props["divClass"], "py-2 px-4 text-gray-700 dark:text-white");
  let divider = fallback($$props["divider"], true);
  $$payload.out += `<div${spread_attributes({
    ...$$restProps,
    class: clsx(twMerge(divClass, $$sanitized_props.class))
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div> `;
  if (divider) {
    $$payload.out += "<!--[-->";
    DropdownDivider($$payload, {});
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { divClass, divider });
  pop();
}
function Wrapper($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["tag", "show", "use"]);
  let tag = fallback($$props["tag"], "div");
  let show = $$props["show"];
  let use = fallback($$props["use"], () => {
  });
  if (show) {
    $$payload.out += "<!--[-->";
    element(
      $$payload,
      tag,
      () => {
        $$payload.out += `${spread_attributes({ ...$$restProps })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", {}, null);
        $$payload.out += `<!---->`;
      }
    );
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { tag, show, use });
}
function DropdownItem($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["defaultClass", "href", "activeClass"]);
  push();
  let active, liClass;
  let defaultClass = fallback($$props["defaultClass"], "font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600");
  let href = fallback($$props["href"], () => void 0, true);
  let activeClass = fallback($$props["activeClass"], () => void 0, true);
  const context = getContext("DropdownType") ?? {};
  const activeUrlStore = getContext("activeUrl");
  let sidebarUrl = "";
  activeUrlStore.subscribe((value) => {
    sidebarUrl = value;
  });
  let wrap = true;
  function init(node) {
    wrap = node.parentElement?.tagName === "UL";
  }
  active = sidebarUrl ? href === sidebarUrl : false;
  liClass = twMerge(defaultClass, href ? "block" : "w-full text-left", active && (activeClass ?? context.activeClass), $$sanitized_props.class);
  Wrapper($$payload, {
    tag: "li",
    show: wrap,
    use: init,
    children: ($$payload2) => {
      element(
        $$payload2,
        href ? "a" : "button",
        () => {
          $$payload2.out += `${spread_attributes({
            href,
            type: href ? void 0 : "button",
            role: href ? "link" : "button",
            ...$$restProps,
            class: clsx(liClass)
          })}`;
        },
        () => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {}, null);
          $$payload2.out += `<!---->`;
        }
      );
    },
    $$slots: { default: true }
  });
  bind_props($$props, { defaultClass, href, activeClass });
  pop();
}
function clampSize(s) {
  return s && s === "xs" ? "sm" : s === "xl" ? "lg" : s;
}
function Input($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "type",
    "value",
    "size",
    "clearable",
    "defaultClass",
    "color",
    "floatClass",
    "classLeft",
    "classRight",
    "wrapperClass"
  ]);
  push();
  let _size;
  let type = fallback($$props["type"], "text");
  let value = fallback($$props["value"], () => void 0, true);
  let size = fallback($$props["size"], () => void 0, true);
  let clearable = fallback($$props["clearable"], false);
  let defaultClass = fallback($$props["defaultClass"], "block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right");
  let color = fallback($$props["color"], "base");
  let floatClass = fallback($$props["floatClass"], "flex absolute inset-y-0 items-center text-gray-500 dark:text-gray-400");
  let classLeft = fallback($$props["classLeft"], "");
  let classRight = fallback($$props["classRight"], "");
  let wrapperClass = fallback($$props["wrapperClass"], "relative w-auto");
  const borderClasses = {
    base: "border border-gray-300 dark:border-gray-600",
    tinted: "border border-gray-300 dark:border-gray-500",
    green: "border border-green-500 dark:border-green-400",
    red: "border border-red-500 dark:border-red-400"
  };
  const ringClasses = {
    base: "focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500",
    green: "focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 dark:focus:ring-green-500",
    red: "focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500"
  };
  const colorClasses = {
    base: "bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400",
    tinted: "bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400",
    green: "bg-green-50 text-green-900 placeholder-green-700 dark:text-green-400 dark:placeholder-green-500 dark:bg-gray-700",
    red: "bg-red-50 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:bg-gray-700"
  };
  let background = getContext("background");
  let group = getContext("group");
  const textSizes = {
    sm: "sm:text-xs",
    md: "text-sm",
    lg: "sm:text-base"
  };
  const leftPadding = { sm: "ps-9", md: "ps-10", lg: "ps-11" };
  const rightPadding = { sm: "pe-9", md: "pe-10", lg: "pe-11" };
  const inputPadding = { sm: "p-2", md: "p-2.5", lg: "p-3" };
  let inputClass;
  _size = size || clampSize(group?.size) || "md";
  {
    const _color = color === "base" && background ? "tinted" : color;
    inputClass = twMerge([
      defaultClass,
      inputPadding[_size],
      $$slots.left && leftPadding[_size] || (clearable || $$slots.right) && rightPadding[_size],
      ringClasses[color],
      colorClasses[_color],
      borderClasses[_color],
      textSizes[_size],
      group || "rounded-lg",
      group && "first:rounded-s-lg last:rounded-e-lg",
      group && "not-first:-ms-px",
      $$sanitized_props.class
    ]);
  }
  Wrapper($$payload, {
    class: wrapperClass,
    show: $$slots.left || $$slots.right || !!clearable,
    children: ($$payload2) => {
      if ($$slots.left) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div${attr("class", `${stringify(twMerge(floatClass, classLeft))} start-0 ps-2.5 pointer-events-none`)}><!---->`;
        slot($$payload2, $$props, "left", {}, null);
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> <!---->`;
      slot($$payload2, $$props, "default", { props: { ...$$restProps, class: inputClass } }, () => {
        $$payload2.out += `<input${spread_attributes({
          ...$$restProps,
          value,
          ...{ type },
          class: clsx(inputClass)
        })}>`;
      });
      $$payload2.out += `<!----> `;
      if ($$slots.right) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div${attr("class", `${stringify(twMerge(floatClass, classRight))} end-0 pe-2.5`)}><!---->`;
        slot($$payload2, $$props, "right", {}, null);
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      if (clearable && value && `${value}`.length > 0) {
        $$payload2.out += "<!--[-->";
        CloseButton($$payload2, {
          size,
          color: "none",
          class: `${stringify(twMerge(floatClass, classRight))} focus:ring-0 end-1`,
          tabindex: -1
        });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, {
    type,
    value,
    size,
    clearable,
    defaultClass,
    color,
    floatClass,
    classLeft,
    classRight,
    wrapperClass
  });
  pop();
}
function NavContainer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["fluid"]);
  push();
  let fluid = fallback($$props["fluid"], false);
  $$payload.out += `<div${spread_attributes({
    ...$$restProps,
    class: clsx(twMerge("mx-auto flex flex-wrap justify-between items-center ", fluid ? "w-full" : "container", $$sanitized_props.class))
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { fluid });
  pop();
}
function Navbar($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["fluid", "navContainerClass"]);
  push();
  var $$store_subs;
  let fluid = fallback($$props["fluid"], false);
  let navContainerClass = fallback($$props["navContainerClass"], "");
  let hidden = writable(true);
  setContext("navHidden", hidden);
  let toggle = () => hidden.update((hidden2) => !hidden2);
  {
    $$restProps.color = $$restProps.color ?? "navbar";
  }
  Frame($$payload, spread_props([
    { tag: "nav" },
    $$restProps,
    {
      class: twMerge("px-2 sm:px-4 py-2.5 w-full", $$sanitized_props.class),
      children: ($$payload2) => {
        NavContainer($$payload2, {
          fluid,
          class: navContainerClass,
          children: ($$payload3) => {
            $$payload3.out += `<!---->`;
            slot(
              $$payload3,
              $$props,
              "default",
              {
                hidden: store_get($$store_subs ??= {}, "$hidden", hidden),
                toggle,
                NavContainer
              },
              null
            );
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
      },
      $$slots: { default: true }
    }
  ]));
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { fluid, navContainerClass });
  pop();
}
function NavBrand($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["href"]);
  push();
  let href = fallback($$props["href"], "");
  $$payload.out += `<a${spread_attributes({
    href,
    ...$$restProps,
    class: clsx(twMerge("flex items-center", $$sanitized_props.class))
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></a>`;
  bind_props($$props, { href });
  pop();
}
function Menu($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "color", "variation", "ariaLabel"]);
  push();
  let size = fallback($$props["size"], "24");
  let color = fallback($$props["color"], "currentColor");
  let variation = fallback($$props["variation"], "outline");
  let ariaLabel = fallback($$props["ariaLabel"], "bars 3");
  let viewBox;
  let svgpath;
  let svgoutline = `<path stroke="${color}" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path> `;
  let svgsolid = `<path fill="${color}" clip-rule="evenodd" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path> `;
  switch (variation) {
    case "outline":
      svgpath = svgoutline;
      viewBox = "0 0 24 24";
      break;
    case "solid":
      svgpath = svgsolid;
      viewBox = "0 0 24 24";
      break;
    default:
      svgpath = svgoutline;
      viewBox = "0 0 24 24";
  }
  $$payload.out += `<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      role: "button",
      tabindex: "0",
      width: size,
      height: size,
      class: clsx($$sanitized_props.class),
      ...$$restProps,
      "aria-label": ariaLabel,
      fill: "none",
      viewBox,
      "stroke-width": "2"
    },
    void 0,
    void 0,
    3
  )}>${html(svgpath)}</svg>`;
  bind_props($$props, { size, color, variation, ariaLabel });
  pop();
}
function NavHamburger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "menuClass",
    "onClick",
    "classMenu",
    "title"
  ]);
  push();
  let menuClass = fallback($$props["menuClass"], "h-6 w-6 shrink-0");
  let onClick = fallback($$props["onClick"], () => void 0, true);
  let classMenu = fallback($$props["classMenu"], "");
  let title = fallback($$props["title"], "Open main menu");
  let btnClass = "ms-3 md:hidden";
  getContext("navHidden") ?? writable(true);
  ToolbarButton($$payload, spread_props([
    { name: title },
    $$restProps,
    {
      class: twMerge(btnClass, $$sanitized_props.class),
      children: ($$payload2) => {
        Menu($$payload2, { class: twMerge(menuClass, classMenu) });
      },
      $$slots: { default: true }
    }
  ]));
  bind_props($$props, { menuClass, onClick, classMenu, title });
  pop();
}
function NavLi($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["href", "activeClass", "nonActiveClass"]);
  push();
  let active, liClass;
  let href = fallback($$props["href"], "");
  let activeClass = fallback($$props["activeClass"], () => void 0, true);
  let nonActiveClass = fallback($$props["nonActiveClass"], () => void 0, true);
  const context = getContext("navbarContext") ?? {};
  const activeUrlStore = getContext("activeUrl");
  let navUrl = "";
  activeUrlStore.subscribe((value) => {
    navUrl = value;
  });
  active = navUrl ? href === navUrl : false;
  liClass = twMerge("block py-2 pe-4 ps-3 md:p-0 rounded-sm md:border-0", active ? activeClass ?? context.activeClass : nonActiveClass ?? context.nonActiveClass, $$sanitized_props.class);
  $$payload.out += `<li>`;
  element(
    $$payload,
    href ? "a" : "div",
    () => {
      $$payload.out += `${spread_attributes({
        role: href ? "link" : "presentation",
        href,
        ...$$restProps,
        class: clsx(liClass)
      })}`;
    },
    () => {
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "default", {}, null);
      $$payload.out += `<!---->`;
    }
  );
  $$payload.out += `</li>`;
  bind_props($$props, { href, activeClass, nonActiveClass });
  pop();
}
function NavUl($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "activeUrl",
    "divClass",
    "ulClass",
    "hidden",
    "slideParams",
    "activeClass",
    "nonActiveClass",
    "classUl"
  ]);
  push();
  var $$store_subs;
  let activeUrl = fallback($$props["activeUrl"], "");
  let divClass = fallback($$props["divClass"], "w-full md:block md:w-auto");
  let ulClass = fallback($$props["ulClass"], "flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium");
  let hidden = fallback($$props["hidden"], () => void 0, true);
  let slideParams = fallback($$props["slideParams"], () => ({ delay: 250, duration: 500, easing: sineIn }), true);
  let activeClass = fallback($$props["activeClass"], "text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent");
  let nonActiveClass = fallback($$props["nonActiveClass"], "text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent");
  let classUl = fallback($$props["classUl"], "");
  const activeUrlStore = writable("");
  setContext("navbarContext", { activeClass, nonActiveClass });
  setContext("activeUrl", activeUrlStore);
  let hiddenStore = getContext("navHidden");
  let _hidden;
  let _divClass;
  let _ulClass;
  {
    activeUrlStore.set(activeUrl);
  }
  _hidden = hidden ?? store_get($$store_subs ??= {}, "$hiddenStore", hiddenStore) ?? true;
  _divClass = twMerge(divClass, $$sanitized_props.class);
  _ulClass = twMerge(ulClass, classUl);
  if (!_hidden) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${spread_attributes({
      ...$$restProps,
      class: clsx(_divClass),
      role: "button",
      tabindex: "0"
    })}>`;
    Frame($$payload, {
      tag: "ul",
      border: true,
      rounded: true,
      color: "navbarUl",
      class: _ulClass,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...$$restProps, class: clsx(_divClass) }, { hidden: _hidden })}><ul${attr("class", clsx(_ulClass))}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></ul></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    activeUrl,
    divClass,
    ulClass,
    hidden,
    slideParams,
    activeClass,
    nonActiveClass,
    classUl
  });
  pop();
}
function SearchOutline($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
    "strokeWidth",
    "desc",
    "ariaLabel"
  ]);
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let size = fallback($$props["size"], () => ctx.size || "md", true);
  let role = fallback($$props["role"], () => ctx.role || "img", true);
  let color = fallback($$props["color"], () => ctx.color || "currentColor", true);
  let withEvents = fallback($$props["withEvents"], () => ctx.withEvents || false, true);
  let title = fallback($$props["title"], () => ({}), true);
  let strokeWidth = fallback($$props["strokeWidth"], () => ctx.strokeWidth || "2", true);
  let desc = fallback($$props["desc"], () => ({}), true);
  let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
  let hasDescription = false;
  let ariaLabel = fallback($$props["ariaLabel"], "search outline");
  if (title.id || desc.id) {
    hasDescription = true;
  } else {
    hasDescription = false;
  }
  if (withEvents) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg${spread_attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        color,
        ...$$restProps,
        class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
        role,
        "aria-label": ariaLabel,
        "aria-describedby": hasDescription ? ariaDescribedby : void 0,
        viewBox: "0 0 24 24"
      },
      void 0,
      void 0,
      3
    )}>`;
    if (title.id && title.title) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<title${attr("id", title.id)}>${escape_html(title.title)}</title>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
    if (desc.id && desc.desc) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--><path stroke="currentColor" stroke-linecap="round"${attr("stroke-width", strokeWidth)} d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"></path></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg${spread_attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        color,
        ...$$restProps,
        class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
        role,
        "aria-label": ariaLabel,
        "aria-describedby": hasDescription ? ariaDescribedby : void 0,
        viewBox: "0 0 24 24"
      },
      void 0,
      void 0,
      3
    )}>`;
    if (title.id && title.title) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<title${attr("id", title.id)}>${escape_html(title.title)}</title>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
    if (desc.id && desc.desc) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--><path stroke="currentColor" stroke-linecap="round"${attr("stroke-width", strokeWidth)} d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"></path></svg>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    size,
    role,
    color,
    withEvents,
    title,
    strokeWidth,
    desc,
    ariaLabel
  });
  pop();
}
function Navbar_1($$payload, $$props) {
  push();
  var $$store_subs;
  const cartCount = writable(0);
  const user = writable(null);
  let searchInput = "";
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/Register" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/Register/promax") {
      $$payload2.out += "<!--[-->";
      Navbar($$payload2, {
        color: "form",
        class: "mx-auto flex flex-wrap justify-between items-center w-full bg-blue-900 text-white py-4 shadow-lg relative z-50",
        children: ($$payload3) => {
          NavBrand($$payload3, {
            href: "/main",
            children: ($$payload4) => {
              $$payload4.out += `<span class="self-center whitespace-nowrap font-semibold text-sm md:text-base">ร้านหนังสือของป้าแพรวา</span><br><br>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <div class="flex items-center md:order-2 gap-5"><div class="hidden relative md:block"><div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">`;
          SearchOutline($$payload3, { class: "w-4 h-4 text-blue-900" });
          $$payload3.out += `<!----></div> `;
          Input($$payload3, {
            id: "search-navbar",
            class: "ps-10",
            placeholder: "Search...",
            get value() {
              return searchInput;
            },
            set value($$value) {
              searchInput = $$value;
              $$settled = false;
            }
          });
          $$payload3.out += `<!----></div> <div class="ms-auto flex items-center gap-5">`;
          Button($$payload3, {
            color: "none",
            "data-collapse-toggle": "mobile-menu-3",
            "aria-controls": "mobile-menu-3",
            "aria-expanded": "false",
            class: "md:hidden text-gray-500 focus:outline-hidden focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5 me-1",
            children: ($$payload4) => {
              SearchOutline($$payload4, { class: "w-5 h-5" });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Button($$payload3, {
            color: "blue",
            href: "/cart",
            class: "flex items-center text-white relative",
            children: ($$payload4) => {
              $$payload4.out += `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> `;
              if (store_get($$store_subs ??= {}, "$cartCount", cartCount) > 0) {
                $$payload4.out += "<!--[-->";
                $$payload4.out += `<span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount))}</span>`;
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Avatar($$payload3, {
            id: "avatar-menu",
            src: store_get($$store_subs ??= {}, "$user", user)?.user_image || "/placeholder-profile.png"
          });
          $$payload3.out += `<!----></div></div> `;
          NavHamburger($$payload3, { class1: "w-full md:flex md:w-auto md:order-1" });
          $$payload3.out += `<!----> `;
          Dropdown($$payload3, {
            placement: "bottom",
            triggeredBy: "#avatar-menu",
            children: ($$payload4) => {
              DropdownHeader($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<span class="block text-sm">${escape_html(store_get($$store_subs ??= {}, "$user", user)?.user_name || "Username")}</span> <span class="block truncate text-sm font-medium">${escape_html(store_get($$store_subs ??= {}, "$user", user)?.user_email)}</span>`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              DropdownItem($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->โปรไฟล์`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              if (store_get($$store_subs ??= {}, "$user", user).user_permission === "Manager") {
                $$payload4.out += "<!--[-->";
                DropdownItem($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->จัดการ`;
                  },
                  $$slots: { default: true }
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]--> `;
              DropdownDivider($$payload4, {});
              $$payload4.out += `<!----> `;
              DropdownItem($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->ออกจากระบบ`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          NavUl($$payload3, {
            class: "order-1",
            children: ($$payload4) => {
              NavLi($$payload4, {
                href: "/main",
                class: "hover:underline md:text-white",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->หน้าหลัก`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              NavLi($$payload4, {
                href: "/all",
                class: "hover:underline md:text-white",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->หนังสือทั้งหมด`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              NavLi($$payload4, {
                href: "/marketplace",
                class: "hover:underline md:text-white",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->ร้านค้าชุมชน`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              if (store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$user", user).user_permission === "Publisher") {
                $$payload4.out += "<!--[-->";
                NavLi($$payload4, {
                  href: "/managebook",
                  class: "hover:underline md:text-white",
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->จัดการหนังสือ`;
                  },
                  $$slots: { default: true }
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]--> `;
              if (store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$user", user).user_permission === "Seller") {
                $$payload4.out += "<!--[-->";
                NavLi($$payload4, {
                  href: "/managesellerbook",
                  class: "hover:underline md:text-white",
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->จัดการหนังสือ`;
                  },
                  $$slots: { default: true }
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]--> `;
              if (store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$user", user).user_permission === "Manager") {
                $$payload4.out += "<!--[-->";
                NavLi($$payload4, {
                  href: "/managebook",
                  class: "hover:underline md:text-white",
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->จัดการหนังสือของสำนักพิมพ์`;
                  },
                  $$slots: { default: true }
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]--> `;
              if (store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$user", user).user_permission === "Manager") {
                $$payload4.out += "<!--[-->";
                NavLi($$payload4, {
                  href: "/managesellerbook",
                  class: "hover:underline md:text-white",
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->จัดการหนังสือของผู้ขาย`;
                  },
                  $$slots: { default: true }
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  Navbar_1 as N
};
