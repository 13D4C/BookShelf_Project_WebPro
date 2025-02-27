export function generateStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="text-yellow-500">★</span>';
    }
    if (halfStar) {
        starsHTML +=
            '<svg class="text-yellow-500 inline-block h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="text-gray-300">★</span>';
    }
    return starsHTML;
}

export async function getUser(userToken: string): any{
    try {
        const response = await fetch('http://localhost:3000/user/getUserProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: userToken }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
