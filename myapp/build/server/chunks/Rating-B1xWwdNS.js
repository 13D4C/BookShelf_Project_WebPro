import { ai as sanitize_slots, ab as fallback, a5 as attr, ah as clsx, a4 as escape_html, af as slot, a6 as ensure_array_like, ad as bind_props, t as pop, ak as sanitize_props, p as push, aa as rest_props, ag as spread_attributes, a7 as stringify } from './exports-awn_jp61.js';
import { t as twMerge } from './bundle-mjs-DQTJBhGO.js';

let n = Date.now();
function generateId() {
  return (++n).toString(36);
}
function Star($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "fillPercent",
    "fillColor",
    "strokeColor",
    "size",
    "ariaLabel",
    "id",
    "role"
  ]);
  push();
  let fillPercent = fallback($$props["fillPercent"], 100);
  let fillColor = fallback($$props["fillColor"], "#F5CA14");
  let strokeColor = fallback($$props["strokeColor"], "#F5CA14");
  let size = fallback($$props["size"], 24);
  let ariaLabel = fallback($$props["ariaLabel"], "star");
  let id = fallback($$props["id"], generateId, true);
  let role = fallback($$props["role"], "img");
  $$payload.out += `<svg${spread_attributes(
    {
      width: size,
      height: size,
      ...$$restProps,
      class: clsx($$sanitized_props.class),
      "aria-label": ariaLabel,
      viewBox: "100 100 120 120",
      role
    },
    undefined,
    undefined,
    3
  )}><defs><linearGradient${attr("id", id)}>`;
  if (fillPercent !== 100) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<stop offset="0%"${attr("stop-color", fillColor)}></stop><stop${attr("offset", `${stringify(fillPercent)}%`)}${attr("stop-color", fillColor)}></stop><stop${attr("offset", `${stringify(fillPercent)}%`)} stop-color="transparent"></stop><stop offset="100%" stop-color="transparent"></stop>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<stop offset="0%"${attr("stop-color", fillColor)}></stop><stop offset="100%"${attr("stop-color", fillColor)}></stop>`;
  }
  $$payload.out += `<!--]--></linearGradient></defs><g${attr("fill", `url(#${stringify(id)})`)}${attr("stroke", strokeColor)} stroke-width="2"><polygon points="165.000, 185.000, 188.511, 197.361, 184.021, 171.180, 
    203.042, 152.639, 176.756, 148.820, 165.000, 125.000, 
    153.244, 148.820, 126.958, 152.639, 145.979, 171.180,
    141.489, 197.361, 165.000, 185.000"></polygon></g></svg>`;
  bind_props($$props, {
    fillPercent,
    fillColor,
    strokeColor,
    size,
    ariaLabel,
    id,
    role
  });
  pop();
}
function Rating($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  push();
  let fullStars, rateDiffence, percentRating, grayStars;
  let divClass = fallback($$props["divClass"], "flex items-center");
  let size = fallback($$props["size"], 24);
  let total = fallback($$props["total"], 5);
  let rating = fallback($$props["rating"], 4);
  let partialId = fallback($$props["partialId"], () => "partialStar" + generateId(), true);
  let icon = fallback($$props["icon"], Star);
  let count = fallback($$props["count"], false);
  let iconFillColor = fallback($$props["iconFillColor"], "#F5CA14");
  let iconStrokeColor = fallback($$props["iconStrokeColor"], "#F5CA14");
  const fullStarId = generateId();
  const grayStarId = generateId();
  fullStars = Math.floor(rating);
  rateDiffence = rating - fullStars;
  percentRating = Math.round(rateDiffence * 100);
  grayStars = total - (fullStars + Math.ceil(rateDiffence));
  $$payload.out += `<div${attr("class", clsx(twMerge(divClass, $$sanitized_props.class)))}>`;
  if (count) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    icon?.($$payload, {
      fillColor: iconFillColor,
      strokeColor: iconStrokeColor,
      fillPercent: 100,
      size
    });
    $$payload.out += `<!----> <p class="ms-2 text-sm font-bold text-gray-900 dark:text-white">${escape_html(rating)}</p> <!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(Array(fullStars));
    const each_array_1 = ensure_array_like(Array(grayStars));
    $$payload.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      each_array[$$index];
      $$payload.out += `<!---->`;
      icon?.($$payload, {
        fillColor: iconFillColor,
        strokeColor: iconStrokeColor,
        size,
        fillPercent: 100,
        id: fullStarId
      });
      $$payload.out += `<!---->`;
    }
    $$payload.out += `<!--]--> `;
    if (percentRating) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<!---->`;
      icon?.($$payload, {
        fillColor: iconFillColor,
        strokeColor: iconStrokeColor,
        size,
        fillPercent: percentRating,
        id: partialId
      });
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      each_array_1[$$index_1];
      $$payload.out += `<!---->`;
      icon?.($$payload, {
        fillColor: iconFillColor,
        strokeColor: iconStrokeColor,
        size,
        fillPercent: 0,
        id: grayStarId
      });
      $$payload.out += `<!---->`;
    }
    $$payload.out += `<!--]--> `;
    if ($$slots.text) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "text", {}, null);
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, {
    divClass,
    size,
    total,
    rating,
    partialId,
    icon,
    count,
    iconFillColor,
    iconStrokeColor
  });
  pop();
}

export { Rating as R };
//# sourceMappingURL=Rating-B1xWwdNS.js.map
