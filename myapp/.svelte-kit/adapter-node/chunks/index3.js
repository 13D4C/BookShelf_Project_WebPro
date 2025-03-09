import { $ as rest_props, a0 as fallback, ab as getContext, a5 as spread_attributes, a6 as clsx, X as escape_html, a4 as slot, a2 as bind_props, T as pop, a3 as sanitize_props, Q as push, a8 as spread_props, ad as invalid_default_snippet, Y as attr, a1 as element } from "./index.js";
import { twMerge } from "tailwind-merge";
function ToolbarButton($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "color",
    "name",
    "ariaLabel",
    "size",
    "href"
  ]);
  push();
  let color = fallback($$props["color"], "default");
  let name = fallback($$props["name"], () => void 0, true);
  let ariaLabel = fallback($$props["ariaLabel"], () => void 0, true);
  let size = fallback($$props["size"], "md");
  let href = fallback($$props["href"], () => void 0, true);
  const background = getContext("background");
  const colors = {
    dark: "text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600",
    gray: "text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300",
    red: "text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-red-300",
    yellow: "text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 dark:hover:text-yellow-300",
    green: "text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-green-800 dark:hover:text-green-300",
    indigo: "text-indigo-500 focus:ring-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 dark:hover:text-indigo-300",
    purple: "text-purple-500 focus:ring-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 dark:hover:text-purple-300",
    pink: "text-pink-500 focus:ring-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800 dark:hover:text-pink-300",
    blue: "text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 dark:hover:text-blue-300",
    primary: "text-primary-500 focus:ring-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 dark:hover:text-primary-300",
    default: "focus:ring-gray-400 hover:bg-gray-100"
  };
  const sizing = {
    xs: "m-0.5 rounded-xs focus:ring-1 p-0.5",
    sm: "m-0.5 rounded-sm focus:ring-1 p-0.5",
    md: "m-0.5 rounded-lg focus:ring-2 p-1.5",
    lg: "m-0.5 rounded-lg focus:ring-2 p-2.5"
  };
  let buttonClass;
  const svgSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-5 h-5"
  };
  buttonClass = twMerge("focus:outline-hidden whitespace-normal", sizing[size], colors[color], color === "default" && (background ? "dark:hover:bg-gray-600" : "dark:hover:bg-gray-700"), $$sanitized_props.class);
  if (href) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${spread_attributes({
      href,
      ...$$restProps,
      class: clsx(buttonClass),
      "aria-label": ariaLabel ?? name
    })}>`;
    if (name) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="sr-only">${escape_html(name)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <!---->`;
    slot($$payload, $$props, "default", { svgSize: svgSizes[size] }, null);
    $$payload.out += `<!----></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({
      type: "button",
      ...$$restProps,
      class: clsx(buttonClass),
      "aria-label": ariaLabel ?? name
    })}>`;
    if (name) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="sr-only">${escape_html(name)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <!---->`;
    slot($$payload, $$props, "default", { svgSize: svgSizes[size] }, null);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { color, name, ariaLabel, size, href });
  pop();
}
function CloseButton($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["name"]);
  push();
  let name = fallback($$props["name"], "Close");
  ToolbarButton($$payload, spread_props([
    { name },
    $$restProps,
    {
      class: twMerge("ms-auto", $$sanitized_props.class),
      children: invalid_default_snippet,
      $$slots: {
        default: ($$payload2, { svgSize }) => {
          $$payload2.out += `<svg${attr("class", clsx(svgSize))} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
        }
      }
    }
  ]));
  bind_props($$props, { name });
  pop();
}
function Button($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "pill",
    "outline",
    "size",
    "href",
    "type",
    "color",
    "shadow",
    "tag",
    "checked",
    "disabled"
  ]);
  push();
  const group = getContext("group");
  let pill = fallback($$props["pill"], false);
  let outline = fallback($$props["outline"], false);
  let size = fallback($$props["size"], group ? "sm" : "md");
  let href = fallback($$props["href"], () => void 0, true);
  let type = fallback($$props["type"], "button");
  let color = fallback($$props["color"], group ? outline ? "dark" : "alternative" : "primary");
  let shadow = fallback($$props["shadow"], false);
  let tag = fallback($$props["tag"], "button");
  let checked = fallback($$props["checked"], () => void 0, true);
  let disabled = fallback($$props["disabled"], false);
  const colorClasses = {
    alternative: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:hover:bg-gray-700",
    blue: "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
    dark: "text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
    green: "text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
    light: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600",
    primary: "text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
    purple: "text-white bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
    red: "text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
    yellow: "text-white bg-yellow-400 hover:bg-yellow-500 ",
    none: ""
  };
  const colorCheckedClasses = {
    alternative: "text-primary-700 border dark:text-primary-500 bg-gray-100 dark:bg-gray-700 border-gray-300 shadow-gray-300 dark:shadow-gray-800 shadow-inner",
    blue: "text-blue-900 bg-blue-400 dark:bg-blue-500 shadow-blue-700 dark:shadow-blue-800 shadow-inner",
    dark: "text-white bg-gray-500 dark:bg-gray-600 shadow-gray-800 dark:shadow-gray-900 shadow-inner",
    green: "text-green-900 bg-green-400 dark:bg-green-500 shadow-green-700 dark:shadow-green-800 shadow-inner",
    light: "text-gray-900 bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:text-gray-900 dark:border-gray-700 shadow-gray-300 dark:shadow-gray-700 shadow-inner",
    primary: "text-primary-900 bg-primary-400 dark:bg-primary-500 shadow-primary-700 dark:shadow-primary-800 shadow-inner",
    purple: "text-purple-900 bg-purple-400 dark:bg-purple-500 shadow-purple-700 dark:shadow-purple-800 shadow-inner",
    red: "text-red-900 bg-red-400 dark:bg-red-500 shadow-red-700 dark:shadow-red-800 shadow-inner",
    yellow: "text-yellow-900 bg-yellow-300 dark:bg-yellow-400 shadow-yellow-500 dark:shadow-yellow-700 shadow-inner",
    none: ""
  };
  const coloredFocusClasses = {
    alternative: "focus-within:ring-gray-200 dark:focus-within:ring-gray-700",
    blue: "focus-within:ring-blue-300 dark:focus-within:ring-blue-800",
    dark: "focus-within:ring-gray-300 dark:focus-within:ring-gray-700",
    green: "focus-within:ring-green-300 dark:focus-within:ring-green-800",
    light: "focus-within:ring-gray-200 dark:focus-within:ring-gray-700",
    primary: "focus-within:ring-primary-300 dark:focus-within:ring-primary-800",
    purple: "focus-within:ring-purple-300 dark:focus-within:ring-purple-900",
    red: "focus-within:ring-red-300 dark:focus-within:ring-red-900",
    yellow: "focus-within:ring-yellow-300 dark:focus-within:ring-yellow-900",
    none: ""
  };
  const coloredShadowClasses = {
    alternative: "shadow-gray-500/50 dark:shadow-gray-800/80",
    blue: "shadow-blue-500/50 dark:shadow-blue-800/80",
    dark: "shadow-gray-500/50 dark:shadow-gray-800/80",
    green: "shadow-green-500/50 dark:shadow-green-800/80",
    light: "shadow-gray-500/50 dark:shadow-gray-800/80",
    primary: "shadow-primary-500/50 dark:shadow-primary-800/80",
    purple: "shadow-purple-500/50 dark:shadow-purple-800/80",
    red: "shadow-red-500/50 dark:shadow-red-800/80 ",
    yellow: "shadow-yellow-500/50 dark:shadow-yellow-800/80 ",
    none: ""
  };
  const outlineClasses = {
    alternative: "text-gray-900 dark:text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 focus-within:text-white focus-within:ring-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 dark:focus-within:ring-gray-800",
    blue: "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600",
    dark: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 focus-within:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600",
    green: "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600",
    light: "text-gray-500 hover:text-gray-900 bg-white border border-gray-200 dark:border-gray-600 dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600",
    primary: "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600",
    purple: "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500",
    red: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600",
    yellow: "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400",
    none: ""
  };
  const sizeClasses = {
    xs: "px-3 py-2 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    xl: "px-6 py-3.5 text-base"
  };
  const hasBorder = () => outline || color === "alternative" || color === "light";
  let buttonClass;
  buttonClass = twMerge("text-center font-medium", group ? "focus-within:ring-2" : "focus-within:ring-4", group && "focus-within:z-10", group || "focus-within:outline-hidden", "inline-flex items-center justify-center " + sizeClasses[size], outline && checked && "border dark:border-gray-900", outline && checked && colorCheckedClasses[color], outline && !checked && outlineClasses[color], !outline && checked && colorCheckedClasses[color], !outline && !checked && colorClasses[color], color === "alternative" && (group && !checked ? "dark:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600" : "dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-600"), outline && color === "dark" && (group ? checked ? "bg-gray-900 border-gray-800 dark:border-white dark:bg-gray-600" : "dark:text-white border-gray-800 dark:border-white" : "dark:text-gray-400 dark:border-gray-700"), coloredFocusClasses[color], hasBorder() && group && "not-first:-ms-px", group ? pill && "first:rounded-s-full last:rounded-e-full" || "first:rounded-s-lg last:rounded-e-lg" : pill && "rounded-full" || "rounded-lg", shadow && "shadow-lg", shadow && coloredShadowClasses[color], disabled && "cursor-not-allowed opacity-50", $$sanitized_props.class);
  if (href && !disabled) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${spread_attributes({
      href,
      ...$$restProps,
      class: clsx(buttonClass),
      role: "button"
    })}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (tag === "label") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<label${spread_attributes({
        ...$$restProps,
        class: clsx(buttonClass)
      })}><!---->`;
      slot($$payload, $$props, "default", {}, null);
      $$payload.out += `<!----></label>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (tag === "button") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<button${spread_attributes({
          type,
          ...$$restProps,
          disabled,
          class: clsx(buttonClass)
        })}><!---->`;
        slot($$payload, $$props, "default", {}, null);
        $$payload.out += `<!----></button>`;
      } else {
        $$payload.out += "<!--[!-->";
        element(
          $$payload,
          tag,
          () => {
            $$payload.out += `${spread_attributes({
              ...$$restProps,
              class: clsx(buttonClass)
            })}`;
          },
          () => {
            $$payload.out += `<!---->`;
            slot($$payload, $$props, "default", {}, null);
            $$payload.out += `<!---->`;
          }
        );
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    pill,
    outline,
    size,
    href,
    type,
    color,
    shadow,
    tag,
    checked,
    disabled
  });
  pop();
}
function sineIn(t) {
  const v = Math.cos(t * Math.PI * 0.5);
  if (Math.abs(v) < 1e-14) return 1;
  else return 1 - v;
}
export {
  Button as B,
  CloseButton as C,
  ToolbarButton as T,
  sineIn as s
};
