// src/routes/+layout.js
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment'; // Import browser

export async function load({ route, url }) {
    if (browser) {  // ✅  Only run this on the client!
        const userToken = localStorage.getItem("userToken");
        const isAuthRoute = route.id === "/" || route.id === "/Register" || route.id === "/Register/promax";

        if (!userToken && !isAuthRoute) {
            throw redirect(307, '/');
        }
        // Make userToken available, even if it's null.
        return { userToken };
    }
  return {}; // If not in the browser, return empty object.
}