<script lang="ts">
    import { goto } from '$app/navigation';
    import img1 from '../routes/img/login1.avif'
    import img2 from '../routes/img/regis2.webp'
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
        class="hidden md:flex flex-1 bg-cover bg-center"
        style="background-image: url({img1});"
    ></div>

    <div class="flex items-center justify-center w-full md:w-1/3 bg-white shadow-lg">
        <div class="w-full max-w-md p-8 space-y-6">
            <div class="text-center">
                <img
                    src={img2}
                    alt="Logo"
                    class="w-24 h-24 mx-auto mb-4"
                />
                <h1 class="text-2xl font-semibold text-gray-800">ลงชื่อเข้าใช้</h1>
            </div>
            <form class="space-y-4" on:submit={login}>
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                    >
                        ชื่อผู้ใช้
                    </label>
                    <input
                        type="text"
                        id="username"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                    >
                        รหัสผ่าน
                    </label>
                    <input
                        type="password"
                        id="password"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div class="flex items-center justify-between">
                    <a href='/Register/promax'
                        class="text-sm font-medium text-blue-600 hover:underline"
                    >
                       ลืมรหัสผ่าน?
                    </a>

                    <a
                        href="/Register"
                        class="text-sm font-medium text-blue-600 hover:underline"
                    >
                        สมัครสมาชิก
                    </a>
                </div>
                <p>{errors}</p>
                <div>
                    <button
                        type="submit"
                        class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                    ลงชื่อเข้าใช้
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>

<style>
</style>
