<script>
    // State variables for form inputs
    let firstName = "";
    let lastName = "";
    let email = "";
    let phone = "";
    let address = "";
    let city = "";
    let province = "";
    let postalCode = "";
    let taxOption = "no-tax"; // Default to no tax invoice.  Options: "no-tax", "paper", "e-tax"

    // Example data for provinces (replace with your actual data source)
    const provinces = [
        "กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี",
        "ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง",
        "ตราด","ตาก","นครนายก","นครปฐม","นครพนม","นครราชสีมา","นครศรีธรรมราช",
        "นครสวรรค์","นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์",
        "ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก",
        "เพชรบุรี","เพชรบูรณ์","แพร่","ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร",
        "ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย",
        "ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร",
        "สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์","หนองคาย",
        "หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี",
    ];
    // Function to handle form submission (replace with your actual submission logic)
    const handleSubmit = () => {
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !province ||
            !postalCode
        ) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        // Basic email validation (you should use a more robust validation in production)
        if (!email.includes("@")) {
            alert("อีเมลไม่ถูกต้อง");
            return;
        }
        // Basic Phone validation
        const phoneRegex = /^[0-9]{9,10}$/; //  9 or 10 digits
        if (!phoneRegex.test(phone)) {
            alert("เบอร์โทรศัพท์ไม่ถูกต้อง");
            return;
        }
        // Basic postal code validation
        const postalCodeRegex = /^[0-9]{5}$/; // Exactly 5 digits
        if (!postalCodeRegex.test(postalCode)) {
            alert("รหัสไปรษณีย์ไม่ถูกต้อง");
            return;
        }

        // Construct the shipping data object
        const shippingData = {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            province,
            postalCode,
            taxOption,
        };

        //  Log to console (replace with your actual API call)
        console.log("Shipping Data:", shippingData);
        alert("บันทึกข้อมูลการจัดส่งเรียบร้อยแล้ว"); // Replace with a success message/modal

        //  Reset form (optional)
        firstName = "";
        lastName = "";
        email = "";
        phone = "";
        address = "";
        city = "";
        province = "";
        postalCode = "";
        taxOption = "no-tax";
    };
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">ข้อมูลการจัดส่ง</h1>

    <form
        on:submit|preventDefault={handleSubmit}
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
        <div>
            <label
                for="firstName"
                class="block text-sm font-medium text-gray-700">ชื่อ</label
            >
            <input
                type="text"
                id="firstName"
                bind:value={firstName}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>

        <div>
            <label
                for="lastName"
                class="block text-sm font-medium text-gray-700">นามสกุล</label
            >
            <input
                type="text"
                id="lastName"
                bind:value={lastName}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
                >อีเมล</label
            >
            <input
                type="email"
                id="email"
                bind:value={email}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>

        <div>
            <label for="phone" class="block text-sm font-medium text-gray-700"
                >เบอร์โทรศัพท์</label
            >
            <input
                type="tel"
                id="phone"
                bind:value={phone}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>

        <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-700"
                >ที่อยู่</label
            >
            <input
                type="text"
                id="address"
                bind:value={address}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>

        <div>
            <label for="city" class="block text-sm font-medium text-gray-700"
                >ตำบล/แขวง</label
            >
            <input
                type="text"
                id="city"
                bind:value={city}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>
        <div>
            <label
                for="province"
                class="block text-sm font-medium text-gray-700">จังหวัด</label
            >
            <select
                id="province"
                bind:value={province}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            >
                <option value="" disabled selected>เลือกจังหวัด</option>
                {#each provinces as provinceOption}
                    <option value={provinceOption}>{provinceOption}</option>
                {/each}
            </select>
        </div>
        <div>
            <label
                for="postalCode"
                class="block text-sm font-medium text-gray-700"
                >รหัสไปรษณีย์</label
            >
            <input
                type="text"
                id="postalCode"
                bind:value={postalCode}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
            />
        </div>

        <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700"
                >ใบกำกับภาษี</label
            >
            <div class="mt-2 space-y-2">
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={taxOption}
                        value="no-tax"
                        class="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span class="ml-2">ไม่ต้องการใบกำกับภาษี</span>
                </label>
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={taxOption}
                        value="paper"
                        class="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span class="ml-2">แบบกระดาษ</span>
                </label>
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={taxOption}
                        value="e-tax"
                        class="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span class="ml-2">แบบ E-Tax</span>
                </label>
            </div>
        </div>

        <div class="md:col-span-2">
            <button
                type="submit"
                class="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                บันทึกข้อมูลการจัดส่ง
            </button>
        </div>
    </form>
</div>
