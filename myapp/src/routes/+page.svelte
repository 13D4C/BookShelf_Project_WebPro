<script lang="ts">
    import { goto } from '$app/navigation';
    let errors = "";
  async function login(event: SubmitEvent) {
        event.preventDefault();
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_name: usernameInput.value, user_pass: passwordInput.value }),
            });
            
            const data = await response.json();

            if (response.ok && data.message === "Login successful") {
                localStorage.setItem("userToken", data.userToken); 
                goto("/main");
            }
            else{
                errors = data.error;
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    }
</script>

<main class="flex h-screen">
    <div
        class="flex-1 bg-cover bg-center"
        style="background-image: url('https://static1.srcdn.com/wordpress/wp-content/uploads/2017/04/Family-Guy-the-Griffin-House.jpg');"
    ></div>

    <div class="flex items-center justify-center w-1/3 bg-white shadow-lg">
        <div class="w-full max-w-md p-8 space-y-6">
            <div class="text-center">
                <img
                    src="https://i.imgflip.com/6362lr.png"
                    alt="Logo"
                    class="w-24 h-24 mx-auto mb-4"
                />
                <h1 class="text-2xl font-semibold text-gray-800">Login ดิ</h1>
            </div>
            <form class="space-y-4" on:submit={login}>
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your password"
                    />
                </div>

                <div class="flex items-center justify-between">
                    <a href='/'
                        class="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </a>

                    <a
                        href="/Register"
                        class="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Register
                    </a>
                </div>
                <p>{errors}</p>
                <div>
                    <button
                        type="submit"
                        class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>

<style>
</style>
