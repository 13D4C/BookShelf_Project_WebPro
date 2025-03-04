// src/routes/+layout.js
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export async function load({ route, url, fetch }) { // <--- Add fetch here
    if (browser && !(route.id === "/" || route.id === "/Register" || route.id === "/Register/promax")) {
        const userToken = localStorage.getItem("userToken");
        let userData;

        try {
            const response = await fetch("http://localhost:3000/user/getUserProfile", { // <--- Use the provided fetch
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: userToken,
                }),
            });

            if (response.ok) { // Important: Check for successful response
              userData = await response.json();
            } else {
              // Handle errors (e.g., 401 Unauthorized, 404 Not Found, 500 Internal Server Error)
              console.error("Error fetching user profile:", response.status, response.statusText);
              // Optionally redirect or show an error message to the user
              if (response.status === 401) {
                localStorage.removeItem("userToken"); // Clear potentially invalid token
                throw redirect(307, "/");
              }
            }

        }
        catch(error) {
            console.error("Network error:", error); // More descriptive error message
            // Handle network errors, server unreachable, etc.
        }

        return { userToken, userData }; // Return userData too
    }
  return {}; // If not in the browser, return empty object.
}