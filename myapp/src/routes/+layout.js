// src/routes/+layout.js
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment'; // Import browser

export async function load({ route, url }) {
    if (browser) {  // ✅  Only run this on the client!
        const userToken = localStorage.getItem("userToken");
        const isAuthRoute = route.id === "/" || route.id === "/Register" || route.id === "/Register/promax";
        let userData;

        try {
            const response = await fetch("http://localhost:3000/user/getUserProfile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: userToken,
                }),
            })
    
            userData = await response.json();
        }
        catch(error) {
            console.log(error)
        }
        

        if (!userToken && !isAuthRoute) {
            throw redirect(307, '/');
        }

        if ( (userData && userData.user_status === "Banned") && !isAuthRoute) {
            throw redirect(307, '/');
        }
        // Make userToken available, even if it's null.
        return { userToken };
    }
  return {}; // If not in the browser, return empty object.
}