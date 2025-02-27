<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Navbar from "$lib/components/navbar.svelte";
    import { writable } from "svelte/store";
    import { generateStars, getUser } from "$lib/utils";
    import iro from '@jaames/iro';

    let book = {}; // Initialize as an empty object
    let quantity = 1;
    let relatedBooks: any[] = [];
    let isLoadingRelatedBooks = true;
    let isLoadingBook = true;
    let errorMessage = "";
    let userToken: string | null;
    let userId: Number;
    let bookId = $page.params.id;
    let newComment = "";
    let newScore = 0;
    let isChecked = false;
    let replyComment = "";
    let replyMode = {};
    let comments = writable([]);

    let custom = false;

    let colorHex = '#ff0000'; // ค่าสีเริ่มต้น
    let colorJson = ''; // เก็บค่าสีในรูปแบบ JSON
    let inputText = 'New Book';

    function customPage() {
        if (!custom) {
            custom = true;
        }
        else {
            custom = false;
        }
        
        console.log(custom);
    }

    function updateColor(event) {
    const newColor = event.target.value;
    colorPicker.color.hexString = newColor;
  }

  // ฟังก์ชันที่ถูกเรียกเมื่อกดปุ่ม "ตกลง"
  function submitColor() {
    // สร้างอ็อบเจ็กต์ที่มีค่าสี
    const colorData = {
        Name: inputText,
        color: colorHex
    };
    // แปลงอ็อบเจ็กต์เป็นสตริง JSON
    colorJson = JSON.stringify(colorData);
    // แสดงผลหรือส่งค่า colorJson ตามต้องการ
    console.log(colorJson);
  }

    $: discountedPrice = book.discount
        ? book.price * (1 - book.discount / 100)
        : book.price;

    function navigateToProduct(id: number) {
        goto(`/details/${id}`);
    }

    // Reactive statement to fetch data
    $: if ($page.params.id) {
        fetchBookData($page.params.id);
        fetchComments();
    }

    async function fetchBookData(bookId: string) {
        isLoadingBook = true;
        isLoadingRelatedBooks = true;
        errorMessage = ""; // Reset error message

        try {
            const response = await fetch(
                `http://localhost:3000/books?id=${bookId}`,
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                book = data;
            } else {
                book = {}; // Handle case where no book is found
                errorMessage = "Book not found";
            }
        } catch (error) {
            console.error("Error fetching main book details:", error);
            errorMessage =
                "Failed to load book details. Please try again later.";
        } finally {
            isLoadingBook = false;
        }

        if (book.serie_id) {
            try {
                const response = await fetch(
                    `http://localhost:3000/books/series/${book.serie_id}`,
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                relatedBooks = data;
            } catch (error) {
                console.error("Error fetching related books:", error);
                errorMessage = "Failed to load related books.";
                relatedBooks = [
                    {
                        image: "https://via.placeholder.com/200",
                        title: "Book 1",
                    },
                    {
                        image: "https://via.placeholder.com/200",
                        title: "Book 2",
                    },
                    {
                        image: "https://via.placeholder.com/200",
                        title: "Book 3",
                    },
                ];
            } finally {
                isLoadingRelatedBooks = false;
            }
        } else {
            relatedBooks = []; // Clear related books if no serie_id
            isLoadingRelatedBooks = false;
        }
    }

    //อันนี้
    function checkAndRedirect(token: string | null, routeId: string | null) {
        const isAuthRoute = routeId === "/" || routeId === "/Register";

        if (!token && !isAuthRoute) {
            goto("/");
        } else {
            isLoading.set(false);
        }
    }
    const isLoading = writable(true);
    onMount(async () => {
        page.subscribe(async ($page) => {
            userToken = localStorage.getItem("userToken");
            checkAndRedirect(userToken, $page.route.id);
            await getUser(userToken).then((user) => {
                userId = user.user_id;
            });
        });

        var colorPicker = new iro.ColorPicker('#picker', {
            
        width: 280,
        color: colorHex,
        borderWidth: 1,
        borderColor: '#fff'
        });

    // ฟังก์ชันที่ถูกเรียกเมื่อสีมีการเปลี่ยนแปลง
        colorPicker.on('color:change', (color) => {
        colorHex = color.hexString;
        });
    });
    //comments

    const API_BASE = "http://localhost:3000";

    async function fetchComments() {
        try {
            const response = await fetch(
                `${API_BASE}/books/${bookId}/comments`,
            );
            const data = await response.json();
            comments.set(organizeComments(data));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }

    function organizeComments(comments: any[]) {
        const commentMap = {};
        const rootComments: any[] = [];

        comments.forEach((comment: { replies: never[]; comment_id: string | number; reply_id: string | number; }) => {
            comment.replies = [];
            commentMap[comment.comment_id] = comment;

            if (comment.reply_id) {
                if (commentMap[comment.reply_id]) {
                    commentMap[comment.reply_id].replies.push(comment);
                }
            } else {
                rootComments.push(comment);
            }
        });
        return rootComments;
    }

    async function deleteComment(commentId: any) {
        if (userId === null) {
            console.error("User ID is not available");
            return;
        }
        try {
            await fetch(`${API_BASE}/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            fetchComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    async function submitComment() {
        console.log(userId);
        if (newComment.trim() && bookId && userId !== null) {
            try {
                await fetch(`${API_BASE}/books/${bookId}/comments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        commentDetail: newComment,
                        userId: userId,
                        score: newScore,
                        spoiler: isChecked,
                    }),
                });
                newComment = "";
                fetchComments();
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        }
    }

    function toggleReply(commentId: string | number) {
        replyMode[commentId] = !replyMode[commentId];
    }

    async function submitReply(commentId: string | number) {
        if (replyComment.trim() && bookId && userId !== null) {
            try {
                await fetch(`${API_BASE}/books/${bookId}/comments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        commentDetail: replyComment,
                        userId,
                        score: newScore,
                        spoiler: isChecked,
                        replyId: commentId,
                    }),
                });
                replyComment = "";
                replyMode[commentId] = false;
                fetchComments();
            } catch (error) {
                console.error("Error submitting reply:", error);
            }
        }
    }
</script>

{#if $isLoading}{:else}
    <Navbar />
    <div class="min-h-screen bg-blue-50">
        <div class="max-w-5xl mx-auto p-6">
            {#if errorMessage}
                <p class="text-red-500">{errorMessage}</p>
            {/if}

            {#if isLoadingBook}
                <div class="animate-pulse">
                    <div class="h-64 bg-gray-300 rounded-lg"></div>
                    <div class="mt-4 space-y-2">
                        <div class="h-6 bg-gray-300 rounded"></div>
                        <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Book Image -->
                    <div class="relative">
                        {#if book.book_image}
                        <div class="max-w-xs">
                        {#if !custom}
                        <img class="w-full rounded-lg object-cover" src={book.book_image} alt={book.book_name_originl}/>
                    {:else}
                        <div class=" h-96 color-display border rounded-lg items-center object-cover">
                            <div class="h-full border rounded shadow-lg flex pt-12 pb-4 justify-center" style="background-color: {colorHex};">
                                <h1 class="text-center text-xl font-bold text-white">{inputText}</h1>
                            </div>
                        </div>
                        {/if}
                        </div>
                    {/if}
                    </div>

                    <!-- Book Details -->
                    <div class="space-y-4">
                        <h1 class="text-3xl font-bold">
                            {book.book_name_originl}
                        </h1>
                        <div class="flex items-center">
                            {@html generateStars(book.book_score)}
                            <span class="text-gray-800 ml-7 text-lg"
                                >({book.book_score})</span
                            >
                        </div>
                        <p class="text-2xl text-red-600 font-semibold">
                            {#if book.discount}
                                <span class="line-through text-gray-600 text-lg"
                                    >{book.book_price} บาท</span
                                >
                                {discountedPrice.toFixed(0)} บาท
                            {:else}
                                {book.book_price} บาท
                            {/if}
                        </p>

                        <div class="flex items-center">
                            <label class="mr-2 text-lg">จำนวน</label>
                            <button
                                class="px-4 py-2 bg-gray-500 rounded text-xl"
                                on:click={() =>
                                    (quantity = Math.max(1, quantity - 1))}
                                >-</button
                            >
                            <span class="px-4 text-xl">{quantity}</span>
                            <button
                                class="px-4 py-2 bg-gray-300 rounded text-xl"
                                on:click={() => quantity++}>+</button
                            >
                        </div>

                        <div class="flex gap-4">
                            <button
                                class="px-8 py-3 border border-orange-500 text-orange-500 rounded text-lg"
                                >ใส่รถเข็น</button
                            >
                            <button
                                class="px-8 py-3 bg-orange-500 text-white rounded text-lg"
                                >ซื้อ</button
                            >
                            
                        </div>
                        <button
                            class="px-8 py-3 bg-orange-500 text-white rounded text-lg"
                            on:click={() => customPage(book.book_id)}>
                            แก้ไข
                        </button>
                        {#if custom}
                    <div class="w-full md:w-1/2 space-y-4">
                        <!-- อินพุตสำหรับเปลี่ยนข้อความใน h1 -->
                        <input type="text" bind:value={inputText} placeholder="ชื่อหนังสื่อ" class="border p-2 w-full"/>

                        <!-- Container สำหรับ iro.js color picker -->
                        <div id="picker"></div>

                        <!-- อินพุตสำหรับแก้ไขค่าสี HEX -->
                        <input type="text" bind:value={colorHex} on:input={updateColor} placeholder="#ffffff" class="border p-2 w-full"/>

                        <!-- ปุ่มตกลงส่งค่าสีเป็น JSON -->
                        <button on:click={submitColor} class="px-4 py-2 bg-blue-500 text-white rounded border border-slate-300 hover:border-slate-400 hover:bg-blue-400">ตกลง</button>

                        <!-- แสดงค่าสีในรูปแบบ JSON -->
                        {#if colorJson}
                            <div class="p-4 bg-white border rounded shadow">
                            <h2 class="text-lg font-semibold mb-2">ค่าสีในรูปแบบ JSON:</h2>
                            <pre class="text-sm whitespace-pre-wrap">{colorJson}</pre>
                            </div>
                        {/if}
                    </div>
                    {/if}
                    </div>
                </div>

                <!-- Description -->
                <div class="mt-8">
                    <h2 class="text-xl font-semibold">รายละเอียด :</h2>
                    <p class="text-gray-600 mt-2">{book.book_descriptions}</p>
                </div>

                <!-- Reviews -->
                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <p class="text-3xl font-bold">
                            {Math.round(book.book_score * 10) / 10}
                        </p>
                        <div class="mt-2">
                            {@html generateStars(book.book_score)}
                        </div>
                    </div>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <h3 class="font-semibold">รีวิวจากลูกค้า</h3>
                        <p class="text-gray-600 mt-2">{book.reviewText}</p>
                    </div>
                </div>
                <h2>Comments</h2>
                <ul>
                    {#each $comments as comment}
                        <li>
                            <p>{comment.comment_detail} ({comment.score} ⭐)</p>
                            <button
                                on:click={() =>
                                    deleteComment(comment.comment_id)}
                                >🗑️</button
                            >
                            <button
                                on:click={() => toggleReply(comment.comment_id)}
                                >Reply</button
                            >
                            {#if replyMode[comment.comment_id]}
                                <input bind:value={replyComment} />
                                <button
                                    on:click={() =>
                                        submitReply(comment.comment_id)}
                                    >Submit</button
                                >
                            {/if}
                            <ul>
                                {#each comment.replies as reply}
                                    <li>{reply.comment_detail}</li>
                                {/each}
                            </ul>
                        </li>
                    {/each}
                </ul>
                <input bind:value={newComment} />
                <button on:click={submitComment}>Submit Comment</button>
            {/if}

            <!-- Related Books -->
            <div class="mt-8">
                <h2 class="text-xl font-semibold">หนังสือที่เกี่ยวข้อง</h2>
                {#if isLoadingRelatedBooks}
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {#each Array(4) as _}
                            <div
                                class="bg-gray-200 h-40 rounded-lg animate-pulse"
                            ></div>
                        {/each}
                    </div>
                {:else}
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {#each relatedBooks as related}
                            <div
                                class="bg-gray-200 h-40 rounded-lg overflow-hidden"
                                on:click={() =>
                                    navigateToProduct(related.book_id)}
                            >
                                {#if related.book_image}
                                    <img
                                        class="h-full w-full object-cover"
                                        src={related.book_image}
                                        alt={related.book_name_originl ||
                                            "Related Book"}
                                        loading="lazy"
                                    />
                                {/if}
                            </div>
                        {:else}
                            <p>No related books found.</p>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .container {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
    }
</style>