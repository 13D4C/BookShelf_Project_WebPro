import{S as b,an as D,ao as A,A as v,ap as S,b as l,al as u,w as O,g as m,O as T,aq as E,ar as K,ag as L}from"./BkNIMPUX.js";function y(i,o=null,M){if(typeof i!="object"||i===null||b in i)return i;const P=K(i);if(P!==D&&P!==A)return i;var a=new Map,c=L(i),x=v(0);c&&a.set("length",v(i.length));var g;return new Proxy(i,{defineProperty(f,e,t){(!("value"in t)||t.configurable===!1||t.enumerable===!1||t.writable===!1)&&S();var n=a.get(e);return n===void 0?(n=v(t.value),a.set(e,n)):l(n,y(t.value,g)),!0},deleteProperty(f,e){var t=a.get(e);if(t===void 0)e in f&&a.set(e,v(u));else{if(c&&typeof e=="string"){var n=a.get("length"),r=Number(e);Number.isInteger(r)&&r<n.v&&l(n,r)}l(t,u),R(x)}return!0},get(f,e,t){var d;if(e===b)return i;var n=a.get(e),r=e in f;if(n===void 0&&(!r||(d=O(f,e))!=null&&d.writable)&&(n=v(y(r?f[e]:u,g)),a.set(e,n)),n!==void 0){var s=m(n);return s===u?void 0:s}return Reflect.get(f,e,t)},getOwnPropertyDescriptor(f,e){var t=Reflect.getOwnPropertyDescriptor(f,e);if(t&&"value"in t){var n=a.get(e);n&&(t.value=m(n))}else if(t===void 0){var r=a.get(e),s=r==null?void 0:r.v;if(r!==void 0&&s!==u)return{enumerable:!0,configurable:!0,value:s,writable:!0}}return t},has(f,e){var s;if(e===b)return!0;var t=a.get(e),n=t!==void 0&&t.v!==u||Reflect.has(f,e);if(t!==void 0||T!==null&&(!n||(s=O(f,e))!=null&&s.writable)){t===void 0&&(t=v(n?y(f[e],g):u),a.set(e,t));var r=m(t);if(r===u)return!1}return n},set(f,e,t,n){var N;var r=a.get(e),s=e in f;if(c&&e==="length")for(var d=t;d<r.v;d+=1){var _=a.get(d+"");_!==void 0?l(_,u):d in f&&(_=v(u),a.set(d+"",_))}r===void 0?(!s||(N=O(f,e))!=null&&N.writable)&&(r=v(void 0),l(r,y(t,g)),a.set(e,r)):(s=r.v!==u,l(r,y(t,g)));var w=Reflect.getOwnPropertyDescriptor(f,e);if(w!=null&&w.set&&w.set.call(n,t),!s){if(c&&typeof e=="string"){var I=a.get("length"),h=Number(e);Number.isInteger(h)&&h>=I.v&&l(I,h+1)}R(x)}return!0},ownKeys(f){m(x);var e=Reflect.ownKeys(f).filter(r=>{var s=a.get(r);return s===void 0||s.v!==u});for(var[t,n]of a)n.v!==u&&!(t in f)&&e.push(t);return e},setPrototypeOf(){E()}})}function R(i,o=1){l(i,i.v+o)}function j(i){return i!==null&&typeof i=="object"&&b in i?i[b]:i}function B(i,o){return Object.is(j(i),j(o))}export{B as i,y as p};
