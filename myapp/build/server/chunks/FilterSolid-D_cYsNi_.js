import { aa as rest_props, p as push, ab as fallback, a5 as attr, ah as clsx, ag as spread_attributes, af as slot, ad as bind_props, t as pop, ak as sanitize_props, aj as getContext, a4 as escape_html } from './exports-awn_jp61.js';
import { t as twMerge } from './bundle-mjs-DQTJBhGO.js';

function Drawer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "activateClickOutside",
    "hidden",
    "position",
    "leftOffset",
    "rightOffset",
    "topOffset",
    "bottomOffset",
    "width",
    "backdrop",
    "backdropClass",
    "bgColor",
    "bgOpacity",
    "placement",
    "id",
    "divClass",
    "transitionParams",
    "transitionType"
  ]);
  push();
  let activateClickOutside = fallback($$props["activateClickOutside"], true);
  let hidden = fallback($$props["hidden"], true);
  let position = fallback($$props["position"], "fixed");
  let leftOffset = fallback($$props["leftOffset"], "inset-y-0 start-0");
  let rightOffset = fallback($$props["rightOffset"], "inset-y-0 end-0");
  let topOffset = fallback($$props["topOffset"], "inset-x-0 top-0");
  let bottomOffset = fallback($$props["bottomOffset"], "inset-x-0 bottom-0");
  let width = fallback($$props["width"], "w-80");
  let backdrop = fallback($$props["backdrop"], true);
  let backdropClass = fallback($$props["backdropClass"], "");
  let bgColor = fallback($$props["bgColor"], "bg-gray-900");
  let bgOpacity = fallback($$props["bgOpacity"], "bg-black/75");
  let placement = fallback($$props["placement"], "left");
  let id = fallback($$props["id"], "drawer-example");
  let divClass = fallback($$props["divClass"], "overflow-y-auto z-50 p-4 bg-white dark:bg-gray-800");
  let transitionParams = fallback($$props["transitionParams"], () => ({}), true);
  let transitionType = fallback($$props["transitionType"], "fly");
  const placements = {
    left: leftOffset,
    right: rightOffset,
    top: topOffset,
    bottom: bottomOffset
  };
  let backdropDivClass = twMerge("fixed top-0 start-0 z-50 w-full h-full", backdrop && bgColor, backdrop && bgOpacity, backdropClass);
  if (!hidden) {
    $$payload.out += "<!--[-->";
    if (backdrop && activateClickOutside) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div role="presentation"${attr("class", clsx(backdropDivClass))}></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (backdrop && !activateClickOutside) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div role="presentation"${attr("class", clsx(backdropDivClass))}></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--> <div${spread_attributes({
      id,
      ...$$restProps,
      class: clsx(twMerge(divClass, width, position, placements[placement], $$sanitized_props.class)),
      tabindex: "-1",
      "aria-controls": id,
      "aria-labelledby": id
    })}><!---->`;
    slot($$payload, $$props, "default", { hidden }, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    activateClickOutside,
    hidden,
    position,
    leftOffset,
    rightOffset,
    topOffset,
    bottomOffset,
    width,
    backdrop,
    backdropClass,
    bgColor,
    bgOpacity,
    placement,
    id,
    divClass,
    transitionParams,
    transitionType
  });
  pop();
}
function FilterSolid($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
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
  let desc = fallback($$props["desc"], () => ({}), true);
  let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
  let hasDescription = false;
  let ariaLabel = fallback($$props["ariaLabel"], "filter solid");
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
        fill: color,
        ...$$restProps,
        class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
        role,
        "aria-label": ariaLabel,
        "aria-describedby": hasDescription ? ariaDescribedby : undefined,
        viewBox: "0 0 24 24"
      },
      undefined,
      undefined,
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
    $$payload.out += `<!--]--><path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z"></path></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg${spread_attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: color,
        ...$$restProps,
        class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
        role,
        "aria-label": ariaLabel,
        "aria-describedby": hasDescription ? ariaDescribedby : undefined,
        viewBox: "0 0 24 24"
      },
      undefined,
      undefined,
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
    $$payload.out += `<!--]--><path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z"></path></svg>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    size,
    role,
    color,
    withEvents,
    title,
    desc,
    ariaLabel
  });
  pop();
}

export { Drawer as D, FilterSolid as F };
//# sourceMappingURL=FilterSolid-D_cYsNi_.js.map
