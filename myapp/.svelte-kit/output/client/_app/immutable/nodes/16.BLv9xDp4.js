import{a as N,t as R}from"../chunks/BpdS5ozQ.js";import"../chunks/ak-IiZ70.js";import{p as V,t as z,a as F,e as G,g as f,b as g,c as t,s as r,r as s,m as B}from"../chunks/BkNIMPUX.js";import{s as H}from"../chunks/8GdiTE-D.js";import{r as K}from"../chunks/H21sVsVO.js";import{t as d}from"../chunks/20z5p9mC.js";import{e as E}from"../chunks/BpZ3buzO.js";import{b as M}from"../chunks/BzbwHmVE.js";import{i as Q}from"../chunks/CPaK9zB5.js";import{g as U}from"../chunks/CPiIr9-y.js";var W=R(`<main class="flex h-screen relative"><button class="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-lg">ลงชื่อเข้าใช้</button> <div class="hidden md:flex flex-1 bg-cover bg-center" style="background-image: url('https://y.yarn.co/3ba26216-6da9-4e33-a71a-17968dbaa03d_screenshot.jpg');"></div> <div class="flex items-center justify-center w-full md:w-1/3 bg-white shadow-lg"><div class="w-full max-w-md p-8 space-y-6"><div class="text-center"><img src="https://i.imgflip.com/6362lr.png" alt="Logo" class="w-24 h-24 mx-auto mb-4"> <h1 class="text-2xl font-semibold text-gray-800">สมัคร ดิ๊</h1></div> <form class="space-y-4"><div><label for="username" class="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label> <input type="text" id="username" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่ชื่อผู้ใช้"></div> <div><label for="email" class="block text-sm font-medium text-gray-700">อีเมล</label> <input type="text" id="email" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่อีเมล"></div> <div><label for="phone" class="block text-sm font-medium text-gray-700">โทรศัพท์</label> <input type="text" id="phone" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่เบอร์โทรศัพท์"></div> <div><label for="username" class="block text-sm font-medium text-gray-700">ชื่อจริง</label> <input type="text" id="firstname" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่ชื่อจริง"></div> <div><label for="username" class="block text-sm font-medium text-gray-700">นามสกุล</label> <input type="text" id="lastname" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่นามสกุล"></div> <div><label for="password" class="block text-sm font-medium text-gray-700">รหัสผ่าน</label> <input type="password" id="password" class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="โปรดใส่รหัสผ่าน"></div> <p> </p> <div><button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">ลงชื่อเข้าใช้</button></div></form></div></div></main>`);function le(I,j){V(j,!1);let m=B(""),n=B("");function D(){history.back()}function y(){return f(m).includes("@")}async function O(e){e.preventDefault();let o="",k={};const S=document.getElementById("email"),T=document.getElementById("username"),q=document.getElementById("password"),A=document.getElementById("phone"),C=document.getElementById("firstname"),J=document.getElementById("lastname"),L={user_email:S.value,user_name:T.value,user_pass:q.value,user_phone:A.value,user_firstname:C.value,user_lastname:J.value};try{const l=await fetch("http://localhost:3000/user/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(L)}),b=await l.json();l.ok?(o=b.message,U("/")):(g(n,b.error),k=b.details||{},console.log(k))}catch(l){g(n,"An unexpected error occurred. Please try again."),console.error("Registration error:",l)}}Q();var i=W(),v=t(i),x=r(v,4),h=t(x),u=r(t(h),2),c=r(t(u),2),w=r(t(c),2);K(w),s(c);var p=r(c,10),P=t(p,!0);s(p);var _=r(p,2),a=t(_);s(_),s(u),s(h),s(x),s(i),z((e,o)=>{H(P,f(n)),a.disabled=e,d(a,"bg-blue-600",o),d(a,"hover:bg-blue-700",o),d(a,"bg-gray-400",e),d(a,"cursor-not-allowed",e)},[()=>!y(),y],G),E("click",v,D),M(w,()=>f(m),e=>g(m,e)),E("submit",u,O),N(I,i),F()}export{le as component};
