var Je=e=>{throw TypeError(e)};var $t=(e,t,n)=>t.has(e)||Je("Cannot "+n);var A=(e,t,n)=>($t(e,t,"read from private field"),n?n.call(e):t.get(e)),P=(e,t,n)=>t.has(e)?Je("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,n);import{w as Ne,o as Te}from"./BrBxsZ45.js";import{aX as C,g as N,b as O,aW as Dt}from"./BkNIMPUX.js";new URL("sveltekit-internal://");function Ft(e,t){return e==="/"||t==="ignore"?e:t==="never"?e.endsWith("/")?e.slice(0,-1):e:t==="always"&&!e.endsWith("/")?e+"/":e}function Vt(e){return e.split("%25").map(decodeURI).join("%25")}function Bt(e){for(const t in e)e[t]=decodeURIComponent(e[t]);return e}function Re({href:e}){return e.split("#")[0]}function Gt(e,t,n,r=!1){const a=new URL(e);Object.defineProperty(a,"searchParams",{value:new Proxy(a.searchParams,{get(i,o){if(o==="get"||o==="getAll"||o==="has")return f=>(n(f),i[o](f));t();const c=Reflect.get(i,o);return typeof c=="function"?c.bind(i):c}}),enumerable:!0,configurable:!0});const s=["href","pathname","search","toString","toJSON"];r&&s.push("hash");for(const i of s)Object.defineProperty(a,i,{get(){return t(),e[i]},enumerable:!0,configurable:!0});return a}const Mt="/__data.json",qt=".html__data.json";function Ht(e){return e.endsWith(".html")?e.replace(/\.html$/,qt):e.replace(/\/$/,"")+Mt}function Kt(...e){let t=5381;for(const n of e)if(typeof n=="string"){let r=n.length;for(;r;)t=t*33^n.charCodeAt(--r)}else if(ArrayBuffer.isView(n)){const r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength);let a=r.length;for(;a;)t=t*33^r[--a]}else throw new TypeError("value must be a string or TypedArray");return(t>>>0).toString(36)}function Wt(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n.buffer}const Yt=window.fetch;window.fetch=(e,t)=>((e instanceof Request?e.method:(t==null?void 0:t.method)||"GET")!=="GET"&&W.delete(Oe(e)),Yt(e,t));const W=new Map;function Jt(e,t){const n=Oe(e,t),r=document.querySelector(n);if(r!=null&&r.textContent){let{body:a,...s}=JSON.parse(r.textContent);const i=r.getAttribute("data-ttl");return i&&W.set(n,{body:a,init:s,ttl:1e3*Number(i)}),r.getAttribute("data-b64")!==null&&(a=Wt(a)),Promise.resolve(new Response(a,s))}return window.fetch(e,t)}function zt(e,t,n){if(W.size>0){const r=Oe(e,n),a=W.get(r);if(a){if(performance.now()<a.ttl&&["default","force-cache","only-if-cached",void 0].includes(n==null?void 0:n.cache))return new Response(a.body,a.init);W.delete(r)}}return window.fetch(t,n)}function Oe(e,t){let r=`script[data-sveltekit-fetched][data-url=${JSON.stringify(e instanceof Request?e.url:e)}]`;if(t!=null&&t.headers||t!=null&&t.body){const a=[];t.headers&&a.push([...new Headers(t.headers)].join(",")),t.body&&(typeof t.body=="string"||ArrayBuffer.isView(t.body))&&a.push(t.body),r+=`[data-hash="${Kt(...a)}"]`}return r}const Xt=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function Zt(e){const t=[];return{pattern:e==="/"?/^\/$/:new RegExp(`^${en(e).map(r=>{const a=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(r);if(a)return t.push({name:a[1],matcher:a[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const s=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(r);if(s)return t.push({name:s[1],matcher:s[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!r)return;const i=r.split(/\[(.+?)\](?!\])/);return"/"+i.map((c,f)=>{if(f%2){if(c.startsWith("x+"))return Ie(String.fromCharCode(parseInt(c.slice(2),16)));if(c.startsWith("u+"))return Ie(String.fromCharCode(...c.slice(2).split("-").map(l=>parseInt(l,16))));const h=Xt.exec(c),[,u,y,d,m]=h;return t.push({name:d,matcher:m,optional:!!u,rest:!!y,chained:y?f===1&&i[0]==="":!1}),y?"(.*?)":u?"([^/]*)?":"([^/]+?)"}return Ie(c)}).join("")}).join("")}/?$`),params:t}}function Qt(e){return!/^\([^)]+\)$/.test(e)}function en(e){return e.slice(1).split("/").filter(Qt)}function tn(e,t,n){const r={},a=e.slice(1),s=a.filter(o=>o!==void 0);let i=0;for(let o=0;o<t.length;o+=1){const c=t[o];let f=a[o-i];if(c.chained&&c.rest&&i&&(f=a.slice(o-i,o+1).filter(h=>h).join("/"),i=0),f===void 0){c.rest&&(r[c.name]="");continue}if(!c.matcher||n[c.matcher](f)){r[c.name]=f;const h=t[o+1],u=a[o+1];h&&!h.rest&&h.optional&&u&&c.chained&&(i=0),!h&&!u&&Object.keys(r).length===s.length&&(i=0);continue}if(c.optional&&c.chained){i++;continue}return}if(!i)return r}function Ie(e){return e.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function nn({nodes:e,server_loads:t,dictionary:n,matchers:r}){const a=new Set(t);return Object.entries(n).map(([o,[c,f,h]])=>{const{pattern:u,params:y}=Zt(o),d={id:o,exec:m=>{const l=u.exec(m);if(l)return tn(l,y,r)},errors:[1,...h||[]].map(m=>e[m]),layouts:[0,...f||[]].map(i),leaf:s(c)};return d.errors.length=d.layouts.length=Math.max(d.errors.length,d.layouts.length),d});function s(o){const c=o<0;return c&&(o=~o),[c,e[o]]}function i(o){return o===void 0?o:[a.has(o),e[o]]}}function ft(e,t=JSON.parse){try{return t(sessionStorage[e])}catch{}}function ze(e,t,n=JSON.stringify){const r=n(t);try{sessionStorage[e]=r}catch{}}var ot;const x=((ot=globalThis.__sveltekit_1c2lv94)==null?void 0:ot.base)??"";var st;const rn=((st=globalThis.__sveltekit_1c2lv94)==null?void 0:st.assets)??x,an="1741282774406",ut="sveltekit:snapshot",dt="sveltekit:scroll",ht="sveltekit:states",on="sveltekit:pageurl",B="sveltekit:history",J="sveltekit:navigation",fe={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},le=location.origin;function pt(e){if(e instanceof URL)return e;let t=document.baseURI;if(!t){const n=document.getElementsByTagName("base");t=n.length?n[0].href:document.URL}return new URL(e,t)}function je(){return{x:pageXOffset,y:pageYOffset}}function V(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const Xe={...fe,"":fe.hover};function gt(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function mt(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=gt(e)}}function xe(e,t,n){let r;try{if(r=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI),n&&r.hash.match(/^#[^/]/)){const o=location.hash.split("#")[1]||"/";r.hash=`#${o}${r.hash}`}}catch{}const a=e instanceof SVGAElement?e.target.baseVal:e.target,s=!r||!!a||ve(r,t,n)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),i=(r==null?void 0:r.origin)===le&&e.hasAttribute("download");return{url:r,external:s,target:a,download:i}}function ue(e){let t=null,n=null,r=null,a=null,s=null,i=null,o=e;for(;o&&o!==document.documentElement;)r===null&&(r=V(o,"preload-code")),a===null&&(a=V(o,"preload-data")),t===null&&(t=V(o,"keepfocus")),n===null&&(n=V(o,"noscroll")),s===null&&(s=V(o,"reload")),i===null&&(i=V(o,"replacestate")),o=gt(o);function c(f){switch(f){case"":case"true":return!0;case"off":case"false":return!1;default:return}}return{preload_code:Xe[r??"off"],preload_data:Xe[a??"off"],keepfocus:c(t),noscroll:c(n),reload:c(s),replace_state:c(i)}}function Ze(e){const t=Ne(e);let n=!0;function r(){n=!0,t.update(i=>i)}function a(i){n=!1,t.set(i)}function s(i){let o;return t.subscribe(c=>{(o===void 0||n&&c!==o)&&i(o=c)})}return{notify:r,set:a,subscribe:s}}const yt={v:()=>{}};function sn(){const{set:e,subscribe:t}=Ne(!1);let n;async function r(){clearTimeout(n);try{const a=await fetch(`${rn}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!a.ok)return!1;const i=(await a.json()).version!==an;return i&&(e(!0),yt.v(),clearTimeout(n)),i}catch{return!1}}return{subscribe:t,check:r}}function ve(e,t,n){return e.origin!==le||!e.pathname.startsWith(t)?!0:n?!(e.pathname===t+"/"||e.pathname===t+"/index.html"||e.protocol==="file:"&&e.pathname.replace(/\/[^/]+\.html?$/,"")===t):!1}function Qe(e){const t=ln(e),n=new ArrayBuffer(t.length),r=new DataView(n);for(let a=0;a<n.byteLength;a++)r.setUint8(a,t.charCodeAt(a));return n}const cn="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function ln(e){e.length%4===0&&(e=e.replace(/==?$/,""));let t="",n=0,r=0;for(let a=0;a<e.length;a++)n<<=6,n|=cn.indexOf(e[a]),r+=6,r===24&&(t+=String.fromCharCode((n&16711680)>>16),t+=String.fromCharCode((n&65280)>>8),t+=String.fromCharCode(n&255),n=r=0);return r===12?(n>>=4,t+=String.fromCharCode(n)):r===18&&(n>>=2,t+=String.fromCharCode((n&65280)>>8),t+=String.fromCharCode(n&255)),t}const fn=-1,un=-2,dn=-3,hn=-4,pn=-5,gn=-6;function mn(e,t){if(typeof e=="number")return a(e,!0);if(!Array.isArray(e)||e.length===0)throw new Error("Invalid input");const n=e,r=Array(n.length);function a(s,i=!1){if(s===fn)return;if(s===dn)return NaN;if(s===hn)return 1/0;if(s===pn)return-1/0;if(s===gn)return-0;if(i)throw new Error("Invalid input");if(s in r)return r[s];const o=n[s];if(!o||typeof o!="object")r[s]=o;else if(Array.isArray(o))if(typeof o[0]=="string"){const c=o[0],f=t==null?void 0:t[c];if(f)return r[s]=f(a(o[1]));switch(c){case"Date":r[s]=new Date(o[1]);break;case"Set":const h=new Set;r[s]=h;for(let d=1;d<o.length;d+=1)h.add(a(o[d]));break;case"Map":const u=new Map;r[s]=u;for(let d=1;d<o.length;d+=2)u.set(a(o[d]),a(o[d+1]));break;case"RegExp":r[s]=new RegExp(o[1],o[2]);break;case"Object":r[s]=Object(o[1]);break;case"BigInt":r[s]=BigInt(o[1]);break;case"null":const y=Object.create(null);r[s]=y;for(let d=1;d<o.length;d+=2)y[o[d]]=a(o[d+1]);break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":{const d=globalThis[c],m=o[1],l=Qe(m),g=new d(l);r[s]=g;break}case"ArrayBuffer":{const d=o[1],m=Qe(d);r[s]=m;break}default:throw new Error(`Unknown type ${c}`)}}else{const c=new Array(o.length);r[s]=c;for(let f=0;f<o.length;f+=1){const h=o[f];h!==un&&(c[f]=a(h))}}else{const c={};r[s]=c;for(const f in o){const h=o[f];c[f]=a(h)}}return r[s]}return a(0)}const wt=new Set(["load","prerender","csr","ssr","trailingSlash","config"]);[...wt];const yn=new Set([...wt]);[...yn];function wn(e){return e.filter(t=>t!=null)}class be{constructor(t,n){this.status=t,typeof n=="string"?this.body={message:n}:n?this.body=n:this.body={message:`Error: ${t}`}}toString(){return JSON.stringify(this.body)}}class $e{constructor(t,n){this.status=t,this.location=n}}class De extends Error{constructor(t,n,r){super(r),this.status=t,this.text=n}}const _n="x-sveltekit-invalidated",vn="x-sveltekit-trailing-slash";function de(e){return e instanceof be||e instanceof De?e.status:500}function bn(e){return e instanceof De?e.text:"Internal Error"}let U,z,Ue;const An=Te.toString().includes("$$")||/function \w+\(\) \{\}/.test(Te.toString());var Q,ee,te,ne,re,ae,oe,se,it,ie,ct,ce,lt;An?(U={data:{},form:null,error:null,params:{},route:{id:null},state:{},status:-1,url:new URL("https://example.com")},z={current:null},Ue={current:!1}):(U=new(it=class{constructor(){P(this,Q,C({}));P(this,ee,C(null));P(this,te,C(null));P(this,ne,C({}));P(this,re,C({id:null}));P(this,ae,C({}));P(this,oe,C(-1));P(this,se,C(new URL("https://example.com")))}get data(){return N(A(this,Q))}set data(t){O(A(this,Q),t)}get form(){return N(A(this,ee))}set form(t){O(A(this,ee),t)}get error(){return N(A(this,te))}set error(t){O(A(this,te),t)}get params(){return N(A(this,ne))}set params(t){O(A(this,ne),t)}get route(){return N(A(this,re))}set route(t){O(A(this,re),t)}get state(){return N(A(this,ae))}set state(t){O(A(this,ae),t)}get status(){return N(A(this,oe))}set status(t){O(A(this,oe),t)}get url(){return N(A(this,se))}set url(t){O(A(this,se),t)}},Q=new WeakMap,ee=new WeakMap,te=new WeakMap,ne=new WeakMap,re=new WeakMap,ae=new WeakMap,oe=new WeakMap,se=new WeakMap,it),z=new(ct=class{constructor(){P(this,ie,C(null))}get current(){return N(A(this,ie))}set current(t){O(A(this,ie),t)}},ie=new WeakMap,ct),Ue=new(lt=class{constructor(){P(this,ce,C(!1))}get current(){return N(A(this,ce))}set current(t){O(A(this,ce),t)}},ce=new WeakMap,lt),yt.v=()=>Ue.current=!0);function Sn(e){Object.assign(U,e)}const kn=new Set(["icon","shortcut icon","apple-touch-icon"]),F=ft(dt)??{},X=ft(ut)??{},$={url:Ze({}),page:Ze({}),navigating:Ne(null),updated:sn()};function Fe(e){F[e]=je()}function En(e,t){let n=e+1;for(;F[n];)delete F[n],n+=1;for(n=t+1;X[n];)delete X[n],n+=1}function q(e){return location.href=e.href,new Promise(()=>{})}async function _t(){if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistration(x||"/");e&&await e.update()}}function et(){}let Ae,Pe,he,j,Ce,S;const pe=[],ge=[];let L=null;const vt=new Set,bt=new Set,G=new Set;let _={branch:[],error:null,url:null},Ve=!1,me=!1,tt=!0,Z=!1,H=!1,At=!1,Be=!1,St,I,T,ye;const Y=new Set;async function Gn(e,t,n){var a,s,i,o;document.URL!==location.href&&(location.href=location.href),S=e,await((s=(a=e.hooks).init)==null?void 0:s.call(a)),Ae=nn(e),j=document.documentElement,Ce=t,Pe=e.nodes[0],he=e.nodes[1],Pe(),he(),I=(i=history.state)==null?void 0:i[B],T=(o=history.state)==null?void 0:o[J],I||(I=T=Date.now(),history.replaceState({...history.state,[B]:I,[J]:T},""));const r=F[I];r&&(history.scrollRestoration="manual",scrollTo(r.x,r.y)),n?await Nn(Ce,n):xn(S.hash?jt(new URL(location.href)):location.href,{replaceState:!0}),Cn()}function Rn(){pe.length=0,Be=!1}function kt(e){ge.some(t=>t==null?void 0:t.snapshot)&&(X[e]=ge.map(t=>{var n;return(n=t==null?void 0:t.snapshot)==null?void 0:n.capture()}))}function Et(e){var t;(t=X[e])==null||t.forEach((n,r)=>{var a,s;(s=(a=ge[r])==null?void 0:a.snapshot)==null||s.restore(n)})}function nt(){Fe(I),ze(dt,F),kt(T),ze(ut,X)}async function Ge(e,t,n,r){return K({type:"goto",url:pt(e),keepfocus:t.keepFocus,noscroll:t.noScroll,replace_state:t.replaceState,state:t.state,redirect_count:n,nav_token:r,accept:()=>{t.invalidateAll&&(Be=!0),t.invalidate&&t.invalidate.forEach(Pn)}})}async function In(e){if(e.id!==(L==null?void 0:L.id)){const t={};Y.add(t),L={id:e.id,token:t,promise:It({...e,preload:t}).then(n=>(Y.delete(t),n.type==="loaded"&&n.state.error&&(L=null),n))}}return L.promise}async function Le(e){const t=Ut(e);if(!t)return;const n=Ae.find(r=>r.exec(Lt(t)));n&&await Promise.all([...n.layouts,n.leaf].map(r=>r==null?void 0:r[1]()))}function Rt(e,t,n){var s;_=e.state;const r=document.querySelector("style[data-sveltekit]");r&&r.remove(),Object.assign(U,e.props.page),St=new S.root({target:t,props:{...e.props,stores:$,components:ge},hydrate:n,sync:!1}),Et(T);const a={from:null,to:{params:_.params,route:{id:((s=_.route)==null?void 0:s.id)??null},url:new URL(location.href)},willUnload:!1,type:"enter",complete:Promise.resolve()};G.forEach(i=>i(a)),me=!0}function we({url:e,params:t,branch:n,status:r,error:a,route:s,form:i}){let o="never";if(x&&(e.pathname===x||e.pathname===x+"/"))o="always";else for(const d of n)(d==null?void 0:d.slash)!==void 0&&(o=d.slash);e.pathname=Ft(e.pathname,o),e.search=e.search;const c={type:"loaded",state:{url:e,params:t,branch:n,error:a,route:s},props:{constructors:wn(n).map(d=>d.node.component),page:Ke(U)}};i!==void 0&&(c.props.form=i);let f={},h=!U,u=0;for(let d=0;d<Math.max(n.length,_.branch.length);d+=1){const m=n[d],l=_.branch[d];(m==null?void 0:m.data)!==(l==null?void 0:l.data)&&(h=!0),m&&(f={...f,...m.data},h&&(c.props[`data_${u}`]=f),u+=1)}return(!_.url||e.href!==_.url.href||_.error!==a||i!==void 0&&i!==U.form||h)&&(c.props.page={error:a,params:t,route:{id:(s==null?void 0:s.id)??null},state:{},status:r,url:new URL(e),form:i??null,data:h?f:U.data}),c}async function Me({loader:e,parent:t,url:n,params:r,route:a,server_data_node:s}){var h,u,y;let i=null,o=!0;const c={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1,search_params:new Set},f=await e();if((h=f.universal)!=null&&h.load){let d=function(...l){for(const g of l){const{href:w}=new URL(g,n);c.dependencies.add(w)}};const m={route:new Proxy(a,{get:(l,g)=>(o&&(c.route=!0),l[g])}),params:new Proxy(r,{get:(l,g)=>(o&&c.params.add(g),l[g])}),data:(s==null?void 0:s.data)??null,url:Gt(n,()=>{o&&(c.url=!0)},l=>{o&&c.search_params.add(l)},S.hash),async fetch(l,g){let w;l instanceof Request?(w=l.url,g={body:l.method==="GET"||l.method==="HEAD"?void 0:await l.blob(),cache:l.cache,credentials:l.credentials,headers:[...l.headers].length?l.headers:void 0,integrity:l.integrity,keepalive:l.keepalive,method:l.method,mode:l.mode,redirect:l.redirect,referrer:l.referrer,referrerPolicy:l.referrerPolicy,signal:l.signal,...g}):w=l;const R=new URL(w,n);return o&&d(R.href),R.origin===n.origin&&(w=R.href.slice(n.origin.length)),me?zt(w,R.href,g):Jt(w,g)},setHeaders:()=>{},depends:d,parent(){return o&&(c.parent=!0),t()},untrack(l){o=!1;try{return l()}finally{o=!0}}};i=await f.universal.load.call(null,m)??null}return{node:f,loader:e,server:s,universal:(u=f.universal)!=null&&u.load?{type:"data",data:i,uses:c}:null,data:i??(s==null?void 0:s.data)??null,slash:((y=f.universal)==null?void 0:y.trailingSlash)??(s==null?void 0:s.slash)}}function rt(e,t,n,r,a,s){if(Be)return!0;if(!a)return!1;if(a.parent&&e||a.route&&t||a.url&&n)return!0;for(const i of a.search_params)if(r.has(i))return!0;for(const i of a.params)if(s[i]!==_.params[i])return!0;for(const i of a.dependencies)if(pe.some(o=>o(new URL(i))))return!0;return!1}function qe(e,t){return(e==null?void 0:e.type)==="data"?e:(e==null?void 0:e.type)==="skip"?t??null:null}function Un(e,t){if(!e)return new Set(t.searchParams.keys());const n=new Set([...e.searchParams.keys(),...t.searchParams.keys()]);for(const r of n){const a=e.searchParams.getAll(r),s=t.searchParams.getAll(r);a.every(i=>s.includes(i))&&s.every(i=>a.includes(i))&&n.delete(r)}return n}function at({error:e,url:t,route:n,params:r}){return{type:"loaded",state:{error:e,url:t,route:n,params:r,branch:[]},props:{page:Ke(U),constructors:[]}}}async function It({id:e,invalidating:t,url:n,params:r,route:a,preload:s}){if((L==null?void 0:L.id)===e)return Y.delete(L.token),L.promise;const{errors:i,layouts:o,leaf:c}=a,f=[...o,c];i.forEach(p=>p==null?void 0:p().catch(()=>{})),f.forEach(p=>p==null?void 0:p[1]().catch(()=>{}));let h=null;const u=_.url?e!==_e(_.url):!1,y=_.route?a.id!==_.route.id:!1,d=Un(_.url,n);let m=!1;const l=f.map((p,v)=>{var D;const k=_.branch[v],E=!!(p!=null&&p[0])&&((k==null?void 0:k.loader)!==p[1]||rt(m,y,u,d,(D=k.server)==null?void 0:D.uses,r));return E&&(m=!0),E});if(l.some(Boolean)){try{h=await Ct(n,l)}catch(p){const v=await M(p,{url:n,params:r,route:{id:e}});return Y.has(s)?at({error:v,url:n,params:r,route:a}):Se({status:de(p),error:v,url:n,route:a})}if(h.type==="redirect")return h}const g=h==null?void 0:h.nodes;let w=!1;const R=f.map(async(p,v)=>{var ke;if(!p)return;const k=_.branch[v],E=g==null?void 0:g[v];if((!E||E.type==="skip")&&p[1]===(k==null?void 0:k.loader)&&!rt(w,y,u,d,(ke=k.universal)==null?void 0:ke.uses,r))return k;if(w=!0,(E==null?void 0:E.type)==="error")throw E;return Me({loader:p[1],url:n,params:r,route:a,parent:async()=>{var Ye;const We={};for(let Ee=0;Ee<v;Ee+=1)Object.assign(We,(Ye=await R[Ee])==null?void 0:Ye.data);return We},server_data_node:qe(E===void 0&&p[0]?{type:"skip"}:E??null,p[0]?k==null?void 0:k.server:void 0)})});for(const p of R)p.catch(()=>{});const b=[];for(let p=0;p<f.length;p+=1)if(f[p])try{b.push(await R[p])}catch(v){if(v instanceof $e)return{type:"redirect",location:v.location};if(Y.has(s))return at({error:await M(v,{params:r,url:n,route:{id:a.id}}),url:n,params:r,route:a});let k=de(v),E;if(g!=null&&g.includes(v))k=v.status??k,E=v.error;else if(v instanceof be)E=v.body;else{if(await $.updated.check())return await _t(),await q(n);E=await M(v,{params:r,url:n,route:{id:a.id}})}const D=await Ln(p,b,i);return D?we({url:n,params:r,branch:b.slice(0,D.idx).concat(D.node),status:k,error:E,route:a}):await xt(n,{id:a.id},E,k)}else b.push(void 0);return we({url:n,params:r,branch:b,status:200,error:null,route:a,form:t?void 0:null})}async function Ln(e,t,n){for(;e--;)if(n[e]){let r=e;for(;!t[r];)r-=1;try{return{idx:r+1,node:{node:await n[e](),loader:n[e],data:{},server:null,universal:null}}}catch{continue}}}async function Se({status:e,error:t,url:n,route:r}){const a={};let s=null;if(S.server_loads[0]===0)try{const o=await Ct(n,[!0]);if(o.type!=="data"||o.nodes[0]&&o.nodes[0].type!=="data")throw 0;s=o.nodes[0]??null}catch{(n.origin!==le||n.pathname!==location.pathname||Ve)&&await q(n)}try{const o=await Me({loader:Pe,url:n,params:a,route:r,parent:()=>Promise.resolve({}),server_data_node:qe(s)}),c={node:await he(),loader:he,universal:null,server:null,data:null};return we({url:n,params:a,branch:[o,c],status:e,error:t,route:null})}catch(o){if(o instanceof $e)return Ge(new URL(o.location,location.href),{},0);throw o}}function Ut(e){let t;try{if(t=S.hooks.reroute({url:new URL(e)})??e,typeof t=="string"){const n=new URL(e);S.hash?n.hash=t:n.pathname=t,t=n}}catch{return}return t}function He(e,t){if(!e||ve(e,x,S.hash))return;const n=Ut(e);if(!n)return;const r=Lt(n);for(const a of Ae){const s=a.exec(r);if(s)return{id:_e(e),invalidating:t,route:a,params:Bt(s),url:e}}}function Lt(e){return Vt(S.hash?e.hash.replace(/^#/,"").replace(/[?#].+/,""):e.pathname.slice(x.length))||"/"}function _e(e){return(S.hash?e.hash.replace(/^#/,""):e.pathname)+e.search}function Tt({url:e,type:t,intent:n,delta:r}){let a=!1;const s=Ot(_,n,e,t);r!==void 0&&(s.navigation.delta=r);const i={...s.navigation,cancel:()=>{a=!0,s.reject(new Error("navigation cancelled"))}};return Z||vt.forEach(o=>o(i)),a?null:s}async function K({type:e,url:t,popped:n,keepfocus:r,noscroll:a,replace_state:s,state:i={},redirect_count:o=0,nav_token:c={},accept:f=et,block:h=et}){const u=He(t,!1),y=Tt({url:t,type:e,delta:n==null?void 0:n.delta,intent:u});if(!y){h();return}const d=I,m=T;f(),Z=!0,me&&$.navigating.set(z.current=y.navigation),ye=c;let l=u&&await It(u);if(!l){if(ve(t,x,S.hash))return await q(t);l=await xt(t,{id:null},await M(new De(404,"Not Found",`Not found: ${t.pathname}`),{url:t,params:{},route:{id:null}}),404)}if(t=(u==null?void 0:u.url)||t,ye!==c)return y.reject(new Error("navigation aborted")),!1;if(l.type==="redirect")if(o>=20)l=await Se({status:500,error:await M(new Error("Redirect loop"),{url:t,params:{},route:{id:null}}),url:t,route:{id:null}});else return Ge(new URL(l.location,t).href,{},o+1,c),!1;else l.props.page.status>=400&&await $.updated.check()&&(await _t(),await q(t));if(Rn(),Fe(d),kt(m),l.props.page.url.pathname!==t.pathname&&(t.pathname=l.props.page.url.pathname),i=n?n.state:i,!n){const b=s?0:1,p={[B]:I+=b,[J]:T+=b,[ht]:i};(s?history.replaceState:history.pushState).call(history,p,"",t),s||En(I,T)}if(L=null,l.props.page.state=i,me){_=l.state,l.props.page&&(l.props.page.url=t);const b=(await Promise.all(Array.from(bt,p=>p(y.navigation)))).filter(p=>typeof p=="function");if(b.length>0){let p=function(){b.forEach(v=>{G.delete(v)})};b.push(p),b.forEach(v=>{G.add(v)})}St.$set(l.props),Sn(l.props.page),At=!0}else Rt(l,Ce,!1);const{activeElement:g}=document;await Dt();const w=n?n.scroll:a?je():null;if(tt){const b=t.hash&&document.getElementById(decodeURIComponent(S.hash?t.hash.split("#")[2]??"":t.hash.slice(1)));w?scrollTo(w.x,w.y):b?b.scrollIntoView():scrollTo(0,0)}const R=document.activeElement!==g&&document.activeElement!==document.body;!r&&!R&&On(),tt=!0,l.props.page&&Object.assign(U,l.props.page),Z=!1,e==="popstate"&&Et(T),y.fulfil(void 0),G.forEach(b=>b(y.navigation)),$.navigating.set(z.current=null)}async function xt(e,t,n,r){return e.origin===le&&e.pathname===location.pathname&&!Ve?await Se({status:r,error:n,url:e,route:t}):await q(e)}function Tn(){let e;j.addEventListener("mousemove",s=>{const i=s.target;clearTimeout(e),e=setTimeout(()=>{r(i,2)},20)});function t(s){s.defaultPrevented||r(s.composedPath()[0],1)}j.addEventListener("mousedown",t),j.addEventListener("touchstart",t,{passive:!0});const n=new IntersectionObserver(s=>{for(const i of s)i.isIntersecting&&(Le(new URL(i.target.href)),n.unobserve(i.target))},{threshold:0});function r(s,i){const o=mt(s,j);if(!o)return;const{url:c,external:f,download:h}=xe(o,x,S.hash);if(f||h)return;const u=ue(o),y=c&&_e(_.url)===_e(c);if(!u.reload&&!y)if(i<=u.preload_data){const d=He(c,!1);d&&In(d)}else i<=u.preload_code&&Le(c)}function a(){n.disconnect();for(const s of j.querySelectorAll("a")){const{url:i,external:o,download:c}=xe(s,x,S.hash);if(o||c)continue;const f=ue(s);f.reload||(f.preload_code===fe.viewport&&n.observe(s),f.preload_code===fe.eager&&Le(i))}}G.add(a),a()}function M(e,t){if(e instanceof be)return e.body;const n=de(e),r=bn(e);return S.hooks.handleError({error:e,event:t,status:n,message:r})??{message:r}}function Pt(e,t){Te(()=>(e.add(t),()=>{e.delete(t)}))}function Mn(e){Pt(G,e)}function qn(e){Pt(bt,e)}function xn(e,t={}){return e=new URL(pt(e)),e.origin!==le?Promise.reject(new Error("goto: invalid URL")):Ge(e,t,0)}function Pn(e){if(typeof e=="function")pe.push(e);else{const{href:t}=new URL(e,location.href);pe.push(n=>n.href===t)}}function Cn(){var t;history.scrollRestoration="manual",addEventListener("beforeunload",n=>{let r=!1;if(nt(),!Z){const a=Ot(_,void 0,null,"leave"),s={...a.navigation,cancel:()=>{r=!0,a.reject(new Error("navigation cancelled"))}};vt.forEach(i=>i(s))}r?(n.preventDefault(),n.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&nt()}),(t=navigator.connection)!=null&&t.saveData||Tn(),j.addEventListener("click",async n=>{if(n.button||n.which!==1||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey||n.defaultPrevented)return;const r=mt(n.composedPath()[0],j);if(!r)return;const{url:a,external:s,target:i,download:o}=xe(r,x,S.hash);if(!a)return;if(i==="_parent"||i==="_top"){if(window.parent!==window)return}else if(i&&i!=="_self")return;const c=ue(r);if(!(r instanceof SVGAElement)&&a.protocol!==location.protocol&&!(a.protocol==="https:"||a.protocol==="http:")||o)return;const[h,u]=(S.hash?a.hash.replace(/^#/,""):a.href).split("#"),y=h===Re(location);if(s||c.reload&&(!y||!u)){Tt({url:a,type:"link"})?Z=!0:n.preventDefault();return}if(u!==void 0&&y){const[,d]=_.url.href.split("#");if(d===u){if(n.preventDefault(),u===""||u==="top"&&r.ownerDocument.getElementById("top")===null)window.scrollTo({top:0});else{const m=r.ownerDocument.getElementById(decodeURIComponent(u));m&&(m.scrollIntoView(),m.focus())}return}if(H=!0,Fe(I),e(a),!c.replace_state)return;H=!1}n.preventDefault(),await new Promise(d=>{requestAnimationFrame(()=>{setTimeout(d,0)}),setTimeout(d,100)}),K({type:"link",url:a,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??a.href===location.href})}),j.addEventListener("submit",n=>{if(n.defaultPrevented)return;const r=HTMLFormElement.prototype.cloneNode.call(n.target),a=n.submitter;if(((a==null?void 0:a.formTarget)||r.target)==="_blank"||((a==null?void 0:a.formMethod)||r.method)!=="get")return;const o=new URL((a==null?void 0:a.hasAttribute("formaction"))&&(a==null?void 0:a.formAction)||r.action);if(ve(o,x,!1))return;const c=n.target,f=ue(c);if(f.reload)return;n.preventDefault(),n.stopPropagation();const h=new FormData(c),u=a==null?void 0:a.getAttribute("name");u&&h.append(u,(a==null?void 0:a.getAttribute("value"))??""),o.search=new URLSearchParams(h).toString(),K({type:"form",url:o,keepfocus:f.keepfocus,noscroll:f.noscroll,replace_state:f.replace_state??o.href===location.href})}),addEventListener("popstate",async n=>{var r;if((r=n.state)!=null&&r[B]){const a=n.state[B];if(ye={},a===I)return;const s=F[a],i=n.state[ht]??{},o=new URL(n.state[on]??location.href),c=n.state[J],f=_.url?Re(location)===Re(_.url):!1;if(c===T&&(At||f)){i!==U.state&&(U.state=i),e(o),F[I]=je(),s&&scrollTo(s.x,s.y),I=a;return}const u=a-I;await K({type:"popstate",url:o,popped:{state:i,scroll:s,delta:u},accept:()=>{I=a,T=c},block:()=>{history.go(-u)},nav_token:ye})}else if(!H){const a=new URL(location.href);e(a)}}),addEventListener("hashchange",()=>{H?(H=!1,history.replaceState({...history.state,[B]:++I,[J]:T},"",location.href)):S.hash&&_.url.hash===location.hash&&K({type:"goto",url:jt(_.url)})});for(const n of document.querySelectorAll("link"))kn.has(n.rel)&&(n.href=n.href);addEventListener("pageshow",n=>{n.persisted&&$.navigating.set(z.current=null)});function e(n){_.url=U.url=n,$.page.set(Ke(U)),$.page.notify()}}async function Nn(e,{status:t=200,error:n,node_ids:r,params:a,route:s,data:i,form:o}){Ve=!0;const c=new URL(location.href);({params:a={},route:s={id:null}}=He(c,!1)||{});let f,h=!0;try{const u=r.map(async(m,l)=>{const g=i[l];return g!=null&&g.uses&&(g.uses=Nt(g.uses)),Me({loader:S.nodes[m],url:c,params:a,route:s,parent:async()=>{const w={};for(let R=0;R<l;R+=1)Object.assign(w,(await u[R]).data);return w},server_data_node:qe(g)})}),y=await Promise.all(u),d=Ae.find(({id:m})=>m===s.id);if(d){const m=d.layouts;for(let l=0;l<m.length;l++)m[l]||y.splice(l,0,void 0)}f=we({url:c,params:a,branch:y,status:t,error:n,form:o,route:d??null})}catch(u){if(u instanceof $e){await q(new URL(u.location,location.href));return}f=await Se({status:de(u),error:await M(u,{url:c,params:a,route:s}),url:c,route:s}),e.textContent="",h=!1}f.props.page&&(f.props.page.state={}),Rt(f,e,h)}async function Ct(e,t){var s;const n=new URL(e);n.pathname=Ht(e.pathname),e.pathname.endsWith("/")&&n.searchParams.append(vn,"1"),n.searchParams.append(_n,t.map(i=>i?"1":"0").join(""));const r=window.fetch,a=await r(n.href,{});if(!a.ok){let i;throw(s=a.headers.get("content-type"))!=null&&s.includes("application/json")?i=await a.json():a.status===404?i="Not Found":a.status===500&&(i="Internal Error"),new be(a.status,i)}return new Promise(async i=>{var y;const o=new Map,c=a.body.getReader(),f=new TextDecoder;function h(d){return mn(d,{...S.decoders,Promise:m=>new Promise((l,g)=>{o.set(m,{fulfil:l,reject:g})})})}let u="";for(;;){const{done:d,value:m}=await c.read();if(d&&!u)break;for(u+=!m&&u?`
`:f.decode(m,{stream:!0});;){const l=u.indexOf(`
`);if(l===-1)break;const g=JSON.parse(u.slice(0,l));if(u=u.slice(l+1),g.type==="redirect")return i(g);if(g.type==="data")(y=g.nodes)==null||y.forEach(w=>{(w==null?void 0:w.type)==="data"&&(w.uses=Nt(w.uses),w.data=h(w.data))}),i(g);else if(g.type==="chunk"){const{id:w,data:R,error:b}=g,p=o.get(w);o.delete(w),b?p.reject(h(b)):p.fulfil(h(R))}}}})}function Nt(e){return{dependencies:new Set((e==null?void 0:e.dependencies)??[]),params:new Set((e==null?void 0:e.params)??[]),parent:!!(e!=null&&e.parent),route:!!(e!=null&&e.route),url:!!(e!=null&&e.url),search_params:new Set((e==null?void 0:e.search_params)??[])}}function On(){const e=document.querySelector("[autofocus]");if(e)e.focus();else{const t=document.body,n=t.getAttribute("tabindex");t.tabIndex=-1,t.focus({preventScroll:!0,focusVisible:!1}),n!==null?t.setAttribute("tabindex",n):t.removeAttribute("tabindex");const r=getSelection();if(r&&r.type!=="None"){const a=[];for(let s=0;s<r.rangeCount;s+=1)a.push(r.getRangeAt(s));setTimeout(()=>{if(r.rangeCount===a.length){for(let s=0;s<r.rangeCount;s+=1){const i=a[s],o=r.getRangeAt(s);if(i.commonAncestorContainer!==o.commonAncestorContainer||i.startContainer!==o.startContainer||i.endContainer!==o.endContainer||i.startOffset!==o.startOffset||i.endOffset!==o.endOffset)return}r.removeAllRanges()}})}}}function Ot(e,t,n,r){var c,f;let a,s;const i=new Promise((h,u)=>{a=h,s=u});return i.catch(()=>{}),{navigation:{from:{params:e.params,route:{id:((c=e.route)==null?void 0:c.id)??null},url:e.url},to:n&&{params:(t==null?void 0:t.params)??null,route:{id:((f=t==null?void 0:t.route)==null?void 0:f.id)??null},url:n},willUnload:!t,type:r,complete:i},fulfil:a,reject:s}}function Ke(e){return{data:e.data,error:e.error,form:e.form,params:e.params,route:e.route,state:e.state,status:e.status,url:e.url}}function jt(e){const t=new URL(e);return t.hash=decodeURIComponent(e.hash),t}export{Mn as a,Gn as b,xn as g,qn as o,$ as s};
