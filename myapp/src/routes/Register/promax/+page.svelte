<script lang='ts'>
    import { goto } from '$app/navigation';
    let email = "";
    let error = "";

    function goBack() {
        history.back();
    }

    function isValidEmail() {
        return email.includes("@");
    }

    async function register(event: SubmitEvent) {
        event.preventDefault();
        let message = "";
        let details = {};
        const email = document.getElementById('email') as HTMLInputElement;
        const username = document.getElementById('username') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const phone = document.getElementById('phone') as HTMLInputElement;
        const firstname = document.getElementById('firstname') as HTMLInputElement;
        const lastname = document.getElementById('lastname') as HTMLInputElement;
        

        const userData = {
            user_email: email.value,
            user_name: username.value,
            user_pass: password.value,
            user_phone: phone.value,
            user_firstname: firstname.value,
            user_lastname: lastname.value,
        };

        try {
            const response = await fetch("http://localhost:3000/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                message = data.message;
                goto("/main");
            } else {
                error = data.error;
                details = data.details || {};
                console.log(details);
            }
        } catch (err) {
            error = "An unexpected error occurred. Please try again.";
            console.error("Registration error:", err);
        }
    }
</script>

<main class="flex h-screen relative">
    <button
        on:click={goBack}
        class="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-lg"
    >
    ลงชื่อเข้าใช้
    </button>

    <div
        class="hidden md:flex flex-1 bg-cover bg-center"
        style="background-image: url('https://y.yarn.co/3ba26216-6da9-4e33-a71a-17968dbaa03d_screenshot.jpg');"
    ></div>

    <div class="flex items-center justify-center w-full md:w-1/3 bg-white shadow-lg">
        <div class="w-full max-w-md p-8 space-y-6">
            <div class="text-center">
                <img
                    src="https://i.imgflip.com/6362lr.png"
                    alt="Logo"
                    class="w-24 h-24 mx-auto mb-4"
                />
                <h1 class="text-2xl font-semibold text-gray-800">
                    ถ้าลืมก็แค่สมัครใหม่
                </h1>
            </div>
            <form class="space-y-4" on:submit={register}>
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
                        placeholder="โปรดใส่ชื่อผู้ใช้"
                    />
                </div>
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                    >
                        อีเมล
                    </label>
                    <input
                        type="text"
                        id="email"
                        bind:value={email}
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="โปรดใส่อีเมล"
                    />
                </div>
                <div>
                    <label
                        for="phone"
                        class="block text-sm font-medium text-gray-700"
                    >
                        โทรศัพท์
                    </label>
                    <input
                        type="text"
                        id="phone"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="โปรดใส่เบอร์โทรศัพท์"
                    />
                </div>
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                    >
                        ชื่อจริง
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="โปรดใส่ชื่อจริง"
                    />
                </div>
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                    >
                        นามสกุล
                    </label>
                    <input
                        type="text"
                        id="lastname"
                        class="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="โปรดใส่นามสกุล"
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
                        placeholder="โปรดใส่รหัสผ่าน"
                    />
                </div>
                <p>{error}</p>
                <div>
                    <button
                        type="submit"
                        class="w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                        class:bg-blue-600={isValidEmail()}
                        class:hover:bg-blue-700={isValidEmail()}
                        class:bg-gray-400={!isValidEmail()}
                        class:cursor-not-allowed={!isValidEmail()}
                        disabled={!isValidEmail()}
                    >
                        ลงชื่อเข้าใช้
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>
