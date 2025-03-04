<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { page } from "$app/stores";
    import { browser } from "$app/environment";

    let books: any[] = [];
    let userToken: string | null;
    let uniqueCategories: any[] = [];
    let selectedCategory: any | null = null;
    let userData: any;
    let cards: any[] = [];
    let isFormValid = false;
    let err = false;

    let book_upload: any = {
        book_name: "",
        book_category: [],
        description: "",
        book_price: 0,
        book_image: "",
        stock: 0,
        owner_id: "",
    };

    let book_update: any = {
        book_name: "",
        book_category: [],
        description: "",
        book_price: 0,
        book_image: "",
        stock: 0,
    };

    let DeleteisOpen = false;
    let addisOpen = false;
    let updateisOpen = false;
    let deleteBookId = 0;
    let updateBookId = 0;
    let categoryAll = [
        "Fiction",
        "Fantasy",
        "Science Fiction",
        "Mystery",
        "Horror",
        "Romance",
        "Historical Fiction",
        "Literary Fiction",
        "Young Adult",
        "Children",
        "Graphic Novels",
        "Dystopian",
        "Action",
        "Western",
        "Nonfiction",
        "History",
        "Biography/Autobiography",
        "Self-help",
        "Science & Technology",
        "Health & Wellness",
        "Business & Economics",
        "True Crime",
        "Travel",
        "Cookbooks",
        "Art & Photography",
        "Religion & Spirituality",
        "Philosophy",
        "Humor",
        "Essays",
        "Reference",
        "Girl Love",
        "Boy Love",
        "R18+",
        "Light Novel",
        "Manga",
        "Manwha",
        "manhua",
        "Comic",
        "SuperHero",
        "Drama",
        "Adventure",
    ];
    const isLoading = writable(true);

    function getUniqueCategories(booksData: any) {
        let categories = new Set();

        booksData.forEach((book: any) => {
            if (book.book_category) {
                const individualCategories = book.book_category.split(",");
                individualCategories.forEach((category: any) => {
                    categories.add(category);
                });
            }
        });

        return Array.from(categories);
    }

    async function getBooks() {
        try {
            userData = await getUser();
            let url;

            if (userData) {
                switch (userData.user_permission) {
                    case "Seller":
                        url = `http://localhost:3000/seller/books?ownerId=${userData.user_id}`;
                        break;
                    case "Manager":
                        url = `http://localhost:3000/seller/books?all=true`;
                        break;
                }
            } else {
                return null;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            books = await response.json();
            uniqueCategories = getUniqueCategories(books);
        } catch (error) {
            console.error("Error fetching books:", error);
            books = [];
            uniqueCategories = [];
        } finally {
            isLoading.set(false);
        }
    }

    async function getUser() {
        try {
            if (browser) {
                if (!userToken) {
                    userToken = localStorage.getItem("userToken");
                }
                let user = await fetch(
                    "http://localhost:3000/user/getUserProfile",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: userToken }),
                    },
                );
                return user.json();
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    function filterBooks(category: any) {
        selectedCategory = category;
        equalizeCardHeights();
    }

    // Reactive statement to filter books
    $: filteredBooks = (() => {
        let result = books;

        if (selectedCategory !== null) {
            result = result.filter(
                (book) =>
                    book.book_category &&
                    book.book_category.includes(selectedCategory),
            );
        }
        return result;
    })();

    $: if (books.length > 0) {
        equalizeCardHeights();
    }

    $: if (filteredBooks) {
        equalizeCardHeights();
    }

    // onMount lifecycle hook
    onMount(async () => {
        if (browser) {
            cards = document.querySelectorAll(".book-card");
            userToken = localStorage.getItem("userToken");
        }

        await getBooks();
    });

    function equalizeCardHeights() {
        if (!cards.length) return;
        let maxHeight = 0;
        // Reset heights first (important for responsiveness)
        cards.forEach((card) => {
            card.style.height = "auto";
        });
        // Find the maximum height
        cards.forEach((card) => {
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });
        // Set all cards to the maximum height
        cards.forEach((card) => {
            card.style.height = `${maxHeight}px`;
        });
    }

    $: $page.url && getBooks();

    async function checkAndRedirect(
        token: string | null,
        routeId: string | null,
    ) {
        const isAuthRoute = routeId === "/" || routeId === "/Register";

        if (!token && !isAuthRoute) {
            goto("/");
        }
    }

    async function deleteBook() {
        const response = await fetch(
            `http://localhost:3000/seller/books/delete/${deleteBookId}`,
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        deleteBookId = 0;
        closeDeleteModal();
        await getBooks();
    }

    function openDeleteModal(seller_book_id: any) {
        DeleteisOpen = true;
        deleteBookId = seller_book_id;
    }

    function closeDeleteModal() {
        DeleteisOpen = false;
        deleteBookId = 0;
    }

    function openAddModal() {
        addisOpen = true;
    }

    function closeAddModal() {
        resetUpload();
        addisOpen = false;
        err = false;
    }

    async function openUpdateModal(seller_book_id: any) {
        const response = await fetch(
            `http://localhost:3000/seller/books?id=${seller_book_id}`,
        );
        const data = await response.json();
        book_update.book_name = data.book_name;
        book_update.book_category = data.book_category;
        book_update.book_category = data.book_category.split(",");
        book_update.description = data.description;
        book_update.book_price = data.book_price;
        book_update.book_image = data.book_image;
        book_update.stock = data.stock;
        updateisOpen = true;
        updateBookId = seller_book_id;
    }

    function closeUpdateModal() {
        updateisOpen = false;
        updateBookId = 0;
        err = false;
    }

    async function uploadBook() {
        try {
            book_upload.owner_id = await userData.user_id;
            book_upload.book_category =
                await book_upload.book_category.join(",");

            const response = await fetch(
                "http://localhost:3000/seller/books/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(book_upload),
                },
            );
            if (response.ok) {
                resetUpload();
                closeAddModal();
                getBooks();
            } else {
                err = true;
            }
        } catch (error) {
            err = true;
            console.log(error);
        }
    }

    async function handleFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            try {
                book_upload.book_image = await toBase64(file);
                book_update.book_image = await toBase64(file);
            } catch (error) {
                console.error("Error converting to base64:", error);
            }
        }
    }

    function toBase64(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    function resetUpload() {
        book_upload.book_name = "";
        book_upload.book_category = [];
        book_upload.description = "";
        book_upload.book_price = 0;
        book_upload.book_image = "";
        book_upload.owner_id = "";
        book_update.stock = 0;
    }

    async function updateBook() {
        try {
            book_update.book_category =
                await book_update.book_category.join(",");
            console.log(book_update);
            const response = await fetch(
                `http://localhost:3000/seller/books/update/book/${updateBookId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(book_update),
                },
            );

            if (response.ok) {
                closeUpdateModal();
                getBooks();
                updateBookId = 0;
            } else {
                err = true;
                updateBookId = 0;
            }
        } catch (error) {
            err = true;
            console.log(error);
        }
    }

    function validateForm() {
        isFormValid =
            book_upload.book_name &&
            book_upload.description &&
            book_upload.book_price &&
            book_upload.book_category;
    }
</script>

{#if !$isLoading}
    <div class="min-h-screen bg-white">
        <div class="max-w-6xl mx-auto p-4">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-3xl font-bold text-blue-700">
                    หนังสือทั้งหมดของผู้ขาย
                </h1>
            </div>

            <!-- Main content area with flex layout -->
            <div class="flex gap-4">
                <!-- Sidebar -->
                <aside
                    class="w-[20%] border border-blue-500 p-4 rounded-lg bg-blue-50 h-fit"
                >
                    <h2 class="text-xl font-semibold text-blue-700">
                        หมวดหมู่
                    </h2>
                    <ul class="mt-2 space-y-2">
                        <li
                            class="text-blue-600 cursor-pointer hover:underline"
                            on:click={() => filterBooks(null)}
                        >
                            ทั้งหมด
                        </li>
                        {#each uniqueCategories as category}
                            <li
                                class="text-blue-600 cursor-pointer hover:underline"
                                on:click={() => filterBooks(category)}
                                class:font-bold={selectedCategory === category}
                            >
                                {category}
                            </li>
                        {/each}
                    </ul>
                </aside>

                <!-- Book list and checkbox container -->
                <div class="w-[80%]">
                    <!-- Checkbox (placed above the book grid) -->
                    {#if userData.user_permission != "Manager" && userData.user_permission != "User"}
                        <div class="mb-4">
                            <button
                                class="mt-2 w-full bg-blue-800 text-white py-2 rounded"
                                on:click={openAddModal}
                            >
                                เพิ่มหนังสือ
                            </button>
                        </div>
                    {/if}
                    <!-- Book grid -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {#each filteredBooks as book}
                            <div
                                class="book-card border border-blue-500 rounded-lg shadow-lg bg-white flex flex-col"
                            >
                                <!-- Image container with fixed height -->
                                <div class="p-4">
                                    <img
                                        src={book.book_image}
                                        alt={book.book_name}
                                        class="object-contain w-full h-[200px] rounded"
                                    />
                                </div>

                                <!-- Text and button container -->
                                <div class="px-4 pb-4 flex-grow">
                                    <p
                                        class="font-semibold text-blue-700 truncate"
                                    >
                                        {book.book_name}
                                    </p>
                                    {#if userData.user_permission != "User" && userData.user_permission != "Publisher"}
                                        <button
                                            class="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                                            on:click={() =>
                                                openUpdateModal(
                                                    book.seller_book_id,
                                                )}
                                        >
                                            เเก้ไขหนังสือ
                                        </button>
                                    {/if}
                                    {#if userData.user_permission != "User" && userData.user_permission != "Publisher"}
                                        <button
                                            data-modal-target="popup-modal"
                                            data-modal-toggle="popup-modal"
                                            class="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                                            on:click={() =>
                                                openDeleteModal(
                                                    book.seller_book_id,
                                                )}
                                        >
                                            ลบหนังสือ
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {:else}
                            <p>No books in this category.</p>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- delete book -->
    {#if DeleteisOpen}
        <div
            class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50"
        >
            <div
                class="bg-white p-8 rounded-lg shadow-xl w-96 max-w-sm space-y-6 border"
            >
                <h2 class="text-2xl font-semibold text-gray-800">⚠️ คำเตือน</h2>
                <p class="text-gray-600">
                    การลบจะไม่สามารถย้อนกลับได้
                    คุณต้องการลบหนังสือเล่มนี้หรือไม่?
                </p>

                <div class="flex justify-end space-x-4">
                    <button
                        on:click={closeDeleteModal}
                        class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600"
                        >ยกเลิก</button
                    >

                    <button
                        on:click={deleteBook}
                        class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600"
                        >ยืนยัน</button
                    >
                </div>
            </div>
        </div>
    {/if}

    <!-- Add Book -->
    {#if addisOpen}
        <div
            class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50"
        >
            <div
                class="bg-white p-10 rounded-lg shadow-xl w-[65vw] max-w-3xl max-h-[90vh] space-y-6 border overflow-y-auto"
            >
                <h2 class="text-2xl font-semibold text-gray-800">
                    📖 เพิ่มหนังสือ
                </h2>
                <form>
                    <div class="space-y-4">
                        <div>
                            <label for="bookName" class="block text-gray-600"
                                >ชื่อหนังสือ</label
                            >
                            <input
                                bind:value={book_upload.book_name}
                                id="bookName"
                                type="text"
                                on:input={validateForm}
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <div class="mt-4">
                                <p class="text-gray-600">หมวดหมู่ที่เลือก:</p>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    {#each book_upload.book_category as category}
                                        <span
                                            class="bg-blue-500 text-white px-3 py-1 rounded-full"
                                            >{category}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                            <label for="category" class="block text-gray-600"
                                >หมวดหมู่</label
                            >
                            <select
                                id="categories"
                                on:input={validateForm}
                                bind:value={book_upload.book_category}
                                multiple
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                            >
                                {#each categoryAll as category}
                                    <option value={category}>{category}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <label for="description" class="block text-gray-600"
                                >รายระเอียดหนังสือ</label
                            >
                            <textarea
                                bind:value={book_upload.description}
                                on:input={validateForm}
                                id="description"
                                rows="3"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label for="price" class="block text-gray-600"
                                >ราคาหนังสือ</label
                            >
                            <input
                                id="price"
                                bind:value={book_upload.book_price}
                                on:input={validateForm}
                                type="number"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label for="stock" class="block text-gray-600"
                                >จำนวนสินค้าในคลัง</label
                            >
                            <input
                                id="stock"
                                bind:value={book_upload.stock}
                                on:input={validateForm}
                                type="number"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label for="image" class="block text-gray-600"
                                >รูปภาพ</label
                            >
                            <input
                                on:change={handleFileChange}
                                id="image"
                                type="file"
                                accept="image/*"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                            />
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            on:click={closeAddModal}
                            class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600"
                            >ยกเลิก</button
                        >

                        <button
                            type="submit"
                            on:click={uploadBook}
                            disabled={!isFormValid}
                            class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600"
                            >เพิ่ม</button
                        >
                    </div>
                    {#if err}
                        <p>❌การเพิ่มหนังสือไม่สำเร็จ กรุณาลองใหม่ภายหลัง</p>
                    {/if}
                </form>
            </div>
        </div>
    {/if}

    <!-- updatebook -->
    {#if updateisOpen}
        <div
            class="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50"
        >
            <div
                class="bg-white p-10 rounded-lg shadow-xl w-[65vw] max-w-3xl max-h-[90vh] space-y-6 border overflow-y-auto"
            >
                <h2 class="text-2xl font-semibold text-gray-800">
                    📖 เเก้ไขหนังสือ
                </h2>
                <form>
                    <div class="space-y-4">
                        <div>
                            <label for="bookNameTH" class="block text-gray-600"
                                >ชื่อหนังสือ</label
                            >
                            <input
                                bind:value={book_update.book_name}
                                id="bookNameTH"
                                type="text"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <div class="mt-4">
                                <p class="text-gray-600">หมวดหมู่ที่เลือก:</p>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    {#each book_update.book_category as category}
                                        <span
                                            class="bg-blue-500 text-white px-3 py-1 rounded-full"
                                            >{category}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                            <label for="category" class="block text-gray-600"
                                >หมวดหมู่</label
                            >
                            <select
                                id="categories"
                                bind:value={book_update.book_category}
                                multiple
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                            >
                                {#each categoryAll as category}
                                    <option value={category}>{category}</option>
                                {/each}
                            </select>
                        </div>

                        <div>
                            <label for="description" class="block text-gray-600"
                                >รายระเอียดหนังสือ</label
                            >
                            <textarea
                                bind:value={book_update.description}
                                id="description"
                                rows="3"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label for="price" class="block text-gray-600"
                                >ราคาหนังสือ</label
                            >
                            <input
                                id="price"
                                bind:value={book_update.book_price}
                                type="number"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label for="stock" class="block text-gray-600"
                                >จำนวนสินค้าในคลัง</label
                            >
                            <input
                                bind:value={book_update.stock}
                                id="stock"
                                type="number"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label for="image" class="block text-gray-600"
                                >รูปภาพ</label
                            >
                            <input
                                on:change={handleFileChange}
                                id="image"
                                type="file"
                                accept="image/*"
                                class="w-full px-4 py-2 border rounded-lg shadow-sm"
                            />
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            on:click={closeUpdateModal}
                            class="bg-red-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-red-600"
                            >ยกเลิก</button
                        >

                        <button
                            type="submit"
                            on:click={updateBook}
                            class="bg-green-500 text-white p-2 pl-5 pr-5 rounded-lg hover:bg-green-600"
                            >บันทึก</button
                        >
                    </div>
                    {#if err}
                        <p>❌การเเก้ไขหนังสือไม่สำเร็จ กรุณาลองใหม่ภายหลัง</p>
                    {/if}
                </form>
            </div>
        </div>
    {/if}
{/if}
