import{w as E,x as Y,L as G,P as g,y as U,g as f,b as j,z as A,A as z,B as H,R as $,C as T,D as y,F as J,G as Q,H as V,S as F,I as N,J as D,e as Z,K as W,M as L,N as d,O as B,Q as X,T as k}from"./BkNIMPUX.js";import{p as ee}from"./Biio4a8v.js";import{c as re}from"./Cu0EAYA7.js";const ne={get(e,r){if(!e.exclude.includes(r))return f(e.version),r in e.special?e.special[r]():e.props[r]},set(e,r,n){return r in e.special||(e.special[r]=ie({get[r](){return e.props[r]}},r,g)),e.special[r](n),L(e.version),!0},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},deleteProperty(e,r){return e.exclude.includes(r)||(e.exclude.push(r),L(e.version)),!0},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function le(e,r){return new Proxy({props:e,exclude:r,special:{},version:z(0)},ne)}const se={get(e,r){let n=e.props.length;for(;n--;){let s=e.props[n];if(d(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s)return s[r]}},set(e,r,n){let s=e.props.length;for(;s--;){let u=e.props[s];d(u)&&(u=u());const a=E(u,r);if(a&&a.set)return a.set(n),!0}return!1},getOwnPropertyDescriptor(e,r){let n=e.props.length;for(;n--;){let s=e.props[n];if(d(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s){const u=E(s,r);return u&&!u.configurable&&(u.configurable=!0),u}}},has(e,r){if(r===F||r===N)return!1;for(let n of e.props)if(d(n)&&(n=n()),n!=null&&r in n)return!0;return!1},ownKeys(e){const r=[];for(let n of e.props){d(n)&&(n=n());for(const s in n)r.includes(s)||r.push(s)}return r}};function fe(...e){return new Proxy({props:e},se)}function C(e){for(var r=B,n=B;r!==null&&!(r.f&(H|$));)r=r.parent;try{return T(r),e()}finally{T(n)}}function ie(e,r,n,s){var x;var u=(n&y)!==0,a=!J||(n&Q)!==0,h=(n&V)!==0,q=(n&X)!==0,O=!1,o;h?[o,O]=re(()=>e[r]):o=e[r];var K=F in e||N in e,p=h&&(((x=E(e,r))==null?void 0:x.set)??(K&&r in e&&(i=>e[r]=i)))||void 0,t=s,b=!0,w=!1,R=()=>(w=!0,b&&(b=!1,q?t=A(s):t=s),t);o===void 0&&s!==void 0&&(p&&a&&Y(),o=R(),p&&p(o));var l;if(a)l=()=>{var i=e[r];return i===void 0?R():(b=!0,w=!1,i)};else{var I=C(()=>(u?D:Z)(()=>e[r]));I.f|=G,l=()=>{var i=f(I);return i!==void 0&&(t=void 0),i===void 0?t:i}}if(!(n&g))return l;if(p){var M=e.$$legacy;return function(i,c){return arguments.length>0?((!a||!c||M||O)&&p(c?l():i),i):l()}}var v=!1,S=!1,P=W(o),_=C(()=>D(()=>{var i=l(),c=f(P);return v?(v=!1,S=!0,c):(S=!1,P.v=i)}));return u||(_.equals=U),function(i,c){if(k!==null&&(v=S,l(),f(P)),arguments.length>0){const m=c?f(_):a&&h?ee(i):i;return _.equals(m)||(v=!0,j(P,m),w&&t!==void 0&&(t=m),A(()=>f(_))),i}return f(_)}}export{le as l,ie as p,fe as s};
