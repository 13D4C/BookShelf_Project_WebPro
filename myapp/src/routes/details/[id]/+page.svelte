<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { generateStars, getUser } from "$lib/utils";
    import iro from '@jaames/iro';
    import { fly } from 'svelte/transition';

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
    let update = true;
    let comments = writable([]);
    let replyComment = "";
    let replyMode = writable({});
    let custom = false;
    let colorHex = '#ff0000'; // ค่าสีเริ่มต้น
    let colorHexText = '#fff'; // ค่าสีเริ่มต้น
    let colorJson = ''; // เก็บค่าสีในรูปแบบ JSON
    let inputText = 'New Book';
    let colorPicker;
    let textSize = 24;
    let isOpen = false;
    let isOpen1 = false;
    let menuElementText: HTMLElement;
    let menuElementCover: HTMLElement;


    function toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    isOpen = !isOpen;
    if (isOpen) {
      isOpen1 = false; // ปิดเมนูอื่น
      // ใช้ timeout เล็กน้อยเพื่อให้ DOM อัปเดตแล้ว
      setTimeout(() => {
        if (document.getElementById('colorPickerText')) {
          // สร้างอินสแตนซ์ใหม่สำหรับ ColorPickerText
          const colorPickerText = new iro.ColorPicker('#colorPickerText', {
            width: 280,
            color: colorHexText,
            borderWidth: 1,
            borderColor: '#fff'
          });
          colorPickerText.on('color:change', (color) => {
            colorHexText = color.hexString;
          });
        }
      }, 50);
    }
  }

  // ฟังก์ชัน toggle สำหรับ ColorCover
  function toggleMenu1(event: MouseEvent) {
    event.stopPropagation();
    isOpen1 = !isOpen1;
    if (isOpen1) {
      isOpen = false; // ปิดเมนูอื่น
      setTimeout(() => {
        if (document.getElementById('colorPicker')) {
          const colorPicker = new iro.ColorPicker('#colorPicker', {
            width: 280,
            color: colorHex,
            borderWidth: 1,
            borderColor: '#fff'
          });
          colorPicker.on('color:change', (color) => {
            colorHex = color.hexString;
          });
        }
      }, 50);
    }
  }
  function handleClickOutside(event: MouseEvent) {
    if (menuElementText && !menuElementText.contains(event.target as Node)) {
      isOpen = false;
    }
    if (menuElementCover && !menuElementCover.contains(event.target as Node)) {
      isOpen1 = false;
    }
  }

    onMount(async () => {
        page.subscribe(async ($page) => {
            userToken = localStorage.getItem("userToken");
            checkAndRedirect(userToken, $page.route.id);
            await getUser(userToken).then((user) => {
                userId = user.user_id;
            });
        });
        document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };

    });

   function customPage() {
    custom = !custom;
    console.log(custom);
}

    function updateColor(event) {
    let newColor = event.target.value;
    colorPicker.color.hexString = newColor;
  }
  function updateColorText(event) {
    let newColor = event.target.value;
    colorPickerText.color.hexString = newColor;
  }

  // ฟังก์ชันที่ถูกเรียกเมื่อกดปุ่ม "ตกลง"
  function submitColor() {
    // let button = document.getElementById('submitComplete');
    // button.innerText = "Custom Complete";
    // สร้างอ็อบเจ็กต์ที่มีค่าสี
    const colorData = {
        Name: inputText,
        font: textSize,
        color: colorHex,
        colorText: colorHexText
    };
    // แปลงอ็อบเจ็กต์เป็นสตริง JSON
    colorJson = JSON.stringify(colorData);
    // แสดงผลหรือส่งค่า colorJson ตามต้องการ
    console.log(colorJson);
    // button.disabled = true;
    //     setTimeout(function() { 
    //       location.reload();
    //     }, 3000);
  }

    $: discountedPrice = book.discount
        ? book.price * (1 - book.discount / 100)
        : book.price;

    function navigateToProduct(id: number) {
        goto(`/details/${id}`);
    }

    // Reactive statement to fetch data
    $: if ($page.params.id || update) {
        quantity = 1;
        bookId = $page.params.id;
        fetchBookData(bookId);
        fetchComments();
        update = false;
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

    function checkAndRedirect(token: string | null, routeId: string | null) {
        const isAuthRoute = routeId === "/" || routeId === "/Register";

        if (!token && !isAuthRoute) {
            goto("/");
        } else {
            isLoading.set(false);
        }
    }
    const isLoading = writable(true);
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

    function organizeComments(comments) {
        const commentMap = {};
        const rootComments = [];

        comments.forEach((comment) => {
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
            await fetch(`${API_BASE}/comments/${commentId}/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            updateBookScore();
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
                        spoiler: false,
                    }),
                });
                newComment = "";
                updateBookScore();
                fetchComments();
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        }
    }

    function toggleReply(commentId) {
        replyMode.update((replies) => ({
            ...replies,
            [commentId]: !replies[commentId],
        }));
    }

    async function submitReply(commentId) {
        if (!replyComment.trim()) return;

        const replyData = {
            book_id: bookId,
            comment_detail: replyComment,
            user_id: userId,
            reply_id: commentId,
        };

        try {
            const res = await fetch(`${API_BASE}/comments/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(replyData),
            });

            if (res.ok) {
                replyComment = "";
                fetchComments();
            }
        } catch (err) {
            console.error("Error posting reply:", err);
        }
    }

    async function updateBookScore() {
    if (bookId) {
        try {
            const response = await fetch(`http://localhost:3000/books/${bookId}/update-score`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            update = true;


        } catch (error) {
            console.error('Error updating book score:', error);
        }
    }
}
async function addToCart(bookId: number, amount: number, custom?: any) {
        try {
            const response = await fetch('http://localhost:3000/shop/publisher/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: bookId, token: userToken, amount, custom })
            });

            if (!response.ok) {
				if(response.status === 404){
					alert('Book not found');
					throw new Error(`Book not found`);
				}
                const errorData = await response.json();
                throw new Error(`Failed to add to cart: ${errorData.error} - ${errorData.details}`);
            }
            goto($page.url);
        } catch (error) {
            console.error('Error adding to cart:', error);
           alert('Add to cart failed');
        }
    }
</script>

{#if $isLoading}{:else}
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
                                <h1 class="text-center text-xl font-bold text-white" style="font-size: {textSize}px; color:{colorHexText};">{inputText}</h1>
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
                                >({(book.book_score).toFixed(2)})</span
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
                                on:click={() => addToCart(book.book_id, quantity, custom)}
                                >ใส่รถเข็น</button>
                            <button
                            class="px-8 py-3 bg-orange-500 text-white rounded text-lg"
                            on:click={() => customPage(book.book_id)}>
                            แก้ไข
                        </button>
                        </div>
                        
                        {#if custom}
    <div class="w-full md:w-1/2 space-y-4">
      <label for="title" class="block">Title:</label>
      <input type="text" bind:value={inputText} placeholder="ชื่อหนังสือ" class="border p-2 w-full" id="title"/>
      <label for="font" class="block">Font size (px):</label>
      <input type="number" bind:value={textSize} min="1" class="border p-2 w-full" id="font"/>
      
      <!-- เมนูสำหรับเลือกสีข้อความ -->
      <div class="relative" bind:this={menuElementText}>
        <button 
          type="button" 
          class="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900" 
          aria-expanded={isOpen} 
          on:click|stopPropagation={toggleMenu}
        >
          <span>Color Text</span>
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        {#if isOpen}
          <div class="mt-5 px-4">
            <div class="w-80 max-w-md mx-auto overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 p-4 " transition:fly={{ y: 5, duration: 200 }}>
              <!-- เนื้อหาของ ColorPickerText -->
              <div id="colorPickerText"></div><br>
                <input type="text" bind:value={colorHexText} placeholder="#000000" class="border p-2 w-full"/>
            </div>
          </div>
        {/if}
      </div>

      <!-- เมนูสำหรับเลือกสี cover -->
      <div class="relative" bind:this={menuElementCover}>
        <button 
          type="button" 
          class="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900" 
          aria-expanded={isOpen1} 
          on:click|stopPropagation={toggleMenu1}
        >
          <span>Color Cover</span>
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        {#if isOpen1}
          <div class="mt-5 px-4">
            <div class="w-80 max-w-md mx-auto overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 p-4" transition:fly={{ y: 5, duration: 200 }}>
              <!-- เนื้อหาของ ColorCover -->
              <div id="colorPicker"></div>
              <br>
                <input type="text" bind:value={colorHex} placeholder="#ffffff" class="border p-2 w-full"/>
            </div>
          </div>
        {/if}
      </div>

      <!-- อินพุตสำหรับแก้ไขค่าสี HEX ของ cover -->

      <!-- ปุ่มตกลงส่งค่าสีเป็น JSON -->
      <button on:click={submitColor} id="submitComplete" class="px-4 py-2 bg-blue-500 text-white rounded border border-slate-300 hover:border-slate-400 hover:bg-blue-400">
        ตกลง
      </button>
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
                            {book.book_score.toFixed(2)}
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
                <div class="comments-section">
                    <h3 class="comments-section-title">Comments</h3>
            
                    <div class="post-comment">
                        <form on:submit|preventDefault={submitComment} class="comment-form">
                            <textarea
                                bind:value={newComment}
                                rows="4"
                                placeholder="Write your comment here..."
                                class="comment-textarea"
                                required
                            ></textarea>
            
                            <div class="comment-form-controls">
                                <div>
                                        <label for="score" class="score-label"
                                            >Score:</label
                                        >
                                        <select
                                            bind:value={newScore}
                                            class="score-select"
                                            required
                                        >
                                            {#each [1, 2, 3, 4, 5] as s}
                                                <option value={s}>{s}</option>
                                            {/each}
                                        </select>
                                    </div>
                                <button type="submit" class="submit-comment-button"
                                    >Submit Comment</button
                                >
                            </div>
                        </form>
                    </div>
            
                    {#if $comments.length > 0}
                        <div class="comments-list">
                            {#each $comments as comment}
                                <div class="comment-card">
                                    <div class="comment-header">
                                            <img
                                                src={comment.user_image}
                                                alt={comment.user_name}
                                                class="user-image"
                                            />
                                        <div class="user-info">
                                            <p class="user-name">{comment.user_name} &ensp; {@html generateStars(comment.score)}</p>
                                            <p class="timestamp">
                                                {new Date(comment.time_stamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
            
                                    <div class="comment-body">
                                        <p>{comment.comment_detail}</p>
                                    </div>
            
                                    <div class="comment-footer">
                                        {#if comment.user_id === userId}
                                            <button
                                                on:click|stopPropagation={() =>
                                                    deleteComment(comment.comment_id)}
                                                class="delete-button"
                                            >
                                                Delete
                                            </button>
                                        {/if}
                                        <button
                                            on:click|stopPropagation={() =>
                                                toggleReply(comment.comment_id)}
                                            class="reply-button"
                                        >
                                            Reply
                                        </button>
            
                                        {#if $replyMode[comment.comment_id]}
                                            <div class="reply-section">
                                                <textarea
                                                    bind:value={replyComment}
                                                    rows="2"
                                                    placeholder="Write your reply here..."
                                                    class="reply-textarea"
                                                    required
                                                ></textarea>
                                                <button
                                                    on:click|stopPropagation={() =>
                                                        submitReply(comment.comment_id)}
                                                    class="submit-reply-button"
                                                >
                                                    Submit Reply
                                                </button>
                                            </div>
                                        {/if}
            
                                        {#if comment.replies.length > 0}
                                            <div class="replies-list">
                                                {#each comment.replies as reply}
                                                    <div class="reply-comment">
                                                        <div class="reply-header">
                                                                <img
                                                                    src={reply.user_image}
                                                                    alt={reply.user_name}
                                                                    class="user-image"
                                                                />
                                                            <div class="user-info">
                                                                <p class="user-name">
                                                                    {reply.user_name}
                                                                </p>
                                                                <p class="timestamp">
                                                                    {new Date(
                                                                        reply.time_stamp,
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div class="reply-body">
                                                            <p>{reply.comment_detail}</p>
                                                        </div>
                                                        {#if reply.user_id === userId}
                                                            <button
                                                                on:click|stopPropagation={() =>
                                                                    deleteComment(reply.comment_id)}
                                                                class="delete-button"
                                                            >
                                                                Delete
                                                            </button>
                                                        {/if}
                                                    </div>
                                                {/each}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-comments">No comments yet.</p>
                    {/if}
                </div>
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
	/* General Styles */
	.container {
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	/* Comments Section */
	.comments-section {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #e2e8f0; /* Light gray border */
		border-radius: 0.5rem;
		background-color: #f8fafc; /* Very light gray background */
	}

	.comments-section-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		color: #2d3748; /* Dark gray for titles */
	}

	/* Post Comment Section */
	.post-comment {
		margin-bottom: 1.5rem;
		padding: 1rem;
		border: 1px solid #cbd5e0; /* Slightly darker gray border */
		border-radius: 0.375rem;
		background-color: #fff; /* White background for input area */
	}

	.post-comment-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: #4a5568; /* Medium gray for subtitles */
	}

	.comment-form {
		display: flex;
		flex-direction: column;
	}

	.comment-textarea {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border: 1px solid #cbd5e0;
		border-radius: 0.25rem;
		resize: vertical; /* Allow vertical resizing */
	}
	.comment-form-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
        justify-content: space-between;
	}
	.score-label {
		margin-right: 0.5rem;
		font-weight: 500;
        align-self: center;
	}

	.score-select {
		padding: 0.25rem 0.5rem;
		border: 1px solid #cbd5e0;
		border-radius: 0.25rem;
        align-self: center;
	}
	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem;

	}

	.submit-comment-button {
		padding: 0.5rem 1rem;
		background-color: #f97316; /* Orange-500 */
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
        align-self: flex-end;
	}

	.submit-comment-button:hover {
		background-color: #ea580c; /* Darker orange on hover */
	}

	/* Comments List */
	.comments-list {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* Spacing between comments */
	}

	.comment-card {
		padding: 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		background-color: #fff;
	}

	/* Comment Header */
	.comment-header {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.user-image {
		width: 2.5rem; /* Slightly larger avatar */
		height: 2.5rem;
		border-radius: 50%; /* Circular avatar */
		margin-right: 0.75rem;
		object-fit: cover; /* Ensure image covers the space */
	}
	.placeholder-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #e2e8f0; /* Light gray background */
		color: #4a5568;
		font-weight: 500;
		text-transform: uppercase;
	}
	.user-info {
		display: flex;
		flex-direction: column;
	}

	.user-name {
		font-weight: 500;
		color: #2d3748;
	}

	.timestamp {
		font-size: 0.75rem;
		color: #718096; /* Gray color for timestamp */
	}

	/* Comment Body */
	.comment-body {
		margin-bottom: 0.5rem;
		color: #4a5568;
		word-wrap: break-word; /* Handle long words */
	}
	.comment-footer {
		display: flex;
		align-items: center;
		justify-content: flex-start; /* Align buttons to the start */
		gap: 0.75rem; /* Spacing between buttons */
	}

	.delete-button,
	.reply-button {
		padding: 0.25rem 0.5rem;
		background-color: transparent;
		color: #718096;
		border: 1px solid #cbd5e0;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.delete-button:hover,
	.reply-button:hover {
		background-color: #e2e8f0;
		color: #2d3748;
	}

	/* Reply Section */
	.reply-section {
		margin-top: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #cbd5e0;
		border-radius: 0.25rem;
		background-color: #f8fafc;
		margin-left: 3rem; /* Indent reply section */
	}

	.reply-textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #cbd5e0;
		border-radius: 0.25rem;
		resize: vertical;
		margin-bottom: 0.5rem;
	}

	.submit-reply-button {
		padding: 0.25rem 0.75rem;
		background-color: #3490dc; /* Blue-500 */
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s ease;
	}

	.submit-reply-button:hover {
		background-color: #2779bd; /* Darker blue on hover */
	}

	/* Replies List */
	.replies-list {
		margin-top: 0.5rem;
		margin-left: 3rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.reply-comment {
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		background-color: #f8fafc;
	}
	.reply-header {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.reply-body {
		margin-bottom: 0.5rem;
		color: #4a5568;
		word-wrap: break-word;
	}
	/* No Comments */
	.no-comments {
		color: #718096;
		font-style: italic;
	}
</style>
