import{a as p,t as f,c as G}from"../chunks/BpdS5ozQ.js";import"../chunks/ak-IiZ70.js";import{p as be,a as ye,b as x,g as e,s as u,c as l,f as R,r as s,m as T,t as b,e as H}from"../chunks/BkNIMPUX.js";import{s as y}from"../chunks/8GdiTE-D.js";import{i as k}from"../chunks/BO1fjogy.js";import{e as K,i as we}from"../chunks/DCYGmzsl.js";import{s as A}from"../chunks/H21sVsVO.js";import{e as V}from"../chunks/BpZ3buzO.js";import{i as $e}from"../chunks/CPaK9zB5.js";import{s as ke,a as Ie}from"../chunks/Cu0EAYA7.js";import{o as Pe}from"../chunks/BrBxsZ45.js";import{g as De}from"../chunks/CPiIr9-y.js";import{p as Se}from"../chunks/BQ7FjgTO.js";var Fe=f('<p class="text-center">Loading...</p>'),Ce=f('<p class="text-red-500 text-center"> </p>'),je=f('<p class="text-sm text-gray-600"> </p>'),qe=f("<li> </li>"),Ee=f("<li> </li>"),Ne=f('<img alt="Slip Preview" class="slip-preview svelte-6p7but">'),Ue=f('<input type="file" accept="image/*" class="mt-2 p-2 border rounded">'),Oe=f('<div class="bg-white p-4 shadow-lg rounded-lg mb-4"><h2 class="text-lg font-semibold text-blue-700"> </h2> <!> <div class="mt-2"><h3 class="text-md font-semibold">Items:</h3> <ul></ul></div> <div class="flex flex-col md:flex-row items-center justify-between"><div class="mb-4 md:mb-0"><img class="mx-auto w-32 h-32"> <p class="text-center text-blue-600 font-bold mt-2"> </p></div> <div class="flex flex-col items-center"><p class="text-gray-500">อัปโหลดสลิป:</p> <!></div></div></div>'),Re=f('<div class="text-center mt-4"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">ดำเนินการต่อ</button></div>'),Te=f('<!> <div class="mt-8 p-4 bg-gray-200 rounded-lg"><p class="text-xl font-bold text-center"> </p></div> <!>',1),Ae=f('<div class="container mx-auto p-4"><h1 class="text-2xl font-bold text-blue-900 text-center mb-4">ชำระเงิน</h1> <!></div>');function Ze(W,X){be(X,!1);const[Y,Z]=ke(),I=()=>Ie(Se,"$page",Y);let h=T([]),D=T(!0),S=T(null);async function ee(){try{for(const r of e(h)){if(!r.slip){console.warn(`No slip uploaded for store ID ${r.id}`);continue}let o,v;I().url.searchParams.get("type")==="seller"?o="http://localhost:3000/shop/seller/payment/upload-proof":o="http://localhost:3000/shop/publisher/payment/upload-proof";const c=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:r.id,seller_order_id:r.id,payment_slip:r.slip})});if(!c.ok){const m=await c.json();throw new Error(m.error||`Failed to upload slip for store ${r.id}`)}}De("/thx")}catch(r){console.error(r),alert(r.message)}}async function re(r){let o;try{const v=[];for(const c of r){I().url.searchParams.get("type")==="seller"?o=`http://localhost:3000/shop/seller/order/get/${c}`:o=`http://localhost:3000/shop/publisher/order/get/${c}`,console.log(I().url.searchParams.get("type")),console.log(I().url.searchParams.get("order_ids")),console.log(o);const m=await fetch(o);if(!m.ok)if(m.status===204){console.warn(`No order found for ID ${c}`);continue}else throw new Error(`Failed to fetch order ${c}: ${m.status}`);const t=await m.json();if(console.log(t),t&&t.order_info&&t.order_info[0]&&t.shop&&t.shop[0]){const i={id:t.order_info[0].order_id??t.order_info[0].seller_order_id,name:t.shop[0].shop_name,qrCode:t.shop[0].qr_code,amount:parseFloat(t.order_info[0].total_price),slip:null,items:t.item,buyer:t.buyer,address:t.order_info[0].address};v.push(i)}else throw console.error("Unexpected data structure:",t),new Error(`Invalid data received for order ID ${c}`)}x(h,v),x(D,!1)}catch(v){x(S,v.message),x(D,!1),console.error(v)}}Pe(async()=>{const r=I().url.searchParams.get("order_ids");if(r){const o=r.split(",");await re(o)}else x(S,"No order IDs provided."),x(D,!1)});function te(r,o){const v=r.target.files[0];if(v){const c=new FileReader;c.onload=m=>{const t=e(h).findIndex(i=>i.id===o);if(t!==-1){const i=[...e(h)];i[t]={...i[t],slip:m.target.result},x(h,i)}},c.readAsDataURL(v)}}function oe(){return e(h).reduce((r,o)=>r+o.amount,0)}function ae(){return e(h).every(r=>r.slip!==null)}$e();var C=Ae(),se=u(l(C),2);{var le=r=>{var o=Fe();p(r,o)},ie=r=>{var o=G(),v=R(o);{var c=t=>{var i=Ce(),F=l(i);s(i),b(()=>y(F,`Error: ${e(S)??""}`)),p(t,i)},m=t=>{var i=Te(),F=R(i);K(F,1,()=>e(h),_=>_.id,(_,d)=>{var P=Oe(),q=l(P),pe=l(q,!0);s(q);var J=u(q,2);{var ve=n=>{var a=je(),w=l(a);s(a),b(()=>y(w,`Address: ${e(d).address??""}`)),p(n,a)};k(J,n=>{e(d).address&&n(ve)})}var E=u(J,2),M=u(l(E),2);K(M,5,()=>e(d).items,we,(n,a)=>{var w=G(),he=R(w);{var ge=$=>{var g=qe(),O=l(g);s(g),b(()=>y(O,`${e(a).book_name_th??""} x ${e(a).amount??""} - ${e(a).book_price??""} (Cover color : ${e(a).cover_color??""} marker : ${e(a).marker??""})`)),p($,g)},xe=$=>{var g=Ee(),O=l(g);s(g),b(()=>y(O,`${e(a).book_name_th??""} x ${e(a).amount??""} - ${e(a).book_price??""}`)),p($,g)};k(he,$=>{e(a).marker?$(ge):$(xe,!1)})}p(n,w)}),s(M),s(E);var Q=u(E,2),N=l(Q),U=l(N),z=u(U,2),fe=l(z);s(z),s(N);var B=u(N,2),me=u(l(B),2);{var ue=n=>{var a=Ne();b(()=>A(a,"src",e(d).slip)),p(n,a)},_e=n=>{var a=Ue();V("change",a,w=>te(w,e(d).id)),p(n,a)};k(me,n=>{e(d).slip?n(ue):n(_e,!1)})}s(B),s(Q),s(P),b(n=>{y(pe,e(d).name),A(U,"src",e(d).qrCode),A(U,"alt",`QR Code ${e(d).name??""}`),y(fe,`ยอดเงิน: ${n??""} บาท`)},[()=>e(d).amount.toFixed(2)],H),p(_,P)});var j=u(F,2),L=l(j),de=l(L);s(L),s(j);var ne=u(j,2);{var ce=_=>{var d=Re(),P=l(d);s(d),V("click",P,ee),p(_,d)};k(ne,_=>{ae()&&_(ce)})}b(_=>y(de,`ยอดรวมทั้งหมด: ${_??""} บาท`),[()=>oe().toFixed(2)],H),p(t,i)};k(v,t=>{e(S)?t(c):t(m,!1)},!0)}p(r,o)};k(se,r=>{e(D)?r(le):r(ie,!1)})}s(C),p(W,C),ye(),Z()}export{Ze as component};
