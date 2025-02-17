<script>
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import Navbar from "$lib/components/navbar.svelte";
    import { onMount } from 'svelte'; // Import onMount

	let books = [
		{ id: 1, title: "Computer Networking", author: "Kurose & Ross", price: "$50", image: "https://th.bing.com/th/id/R.c71f56030661153492560388db0cca0e?rik=pAOoTviNWOkVFg&riu=http%3a%2f%2fprodimage.images-bn.com%2fpimages%2f9780133594140_p0_v1_s1200x630.jpg&ehk=vlR5LbrmZ1PoZhPJpQcjR21g4FznTMYMNFC38FA%2bDko%3d&risl=&pid=ImgRaw&r=0", category: "หนังสือคอมพิวเตอร์", trusted: true },
		{ id: 2, title: "Introduction to Algorithms", author: "Cormen et al.", price: "$60", image: "https://th.bing.com/th/id/R.2a81950d5466a88f99e713b2a7e793b5?rik=r%2bu%2bSstSoUYgTg&riu=http%3a%2f%2fwww.allendowney.com%2fwp%2fwp-content%2fuploads%2f2015%2f11%2fScreenshot-30.png&ehk=l9P9SM1lEXoJU5X4QEg5XOfadWRM9Bu1K6EimqR2FKY%3d&risl=&pid=ImgRaw&r=0", category: "หนังสือคอมพิวเตอร์", trusted: false },
		{ id: 3, title: "Operating System Concepts", author: "Silberschatz et al.", price: "$55", image: "https://lzd-img-global.slatic.net/g/ff/kf/S3b57ca6aecb64849b22c84893c2deb14f.jpg_720x720q80.jpg", category: "หนังสือคอมพิวเตอร์", trusted: true },
		{ id: 4, title: "Database System Concepts", author: "Silberschatz et al.", price: "$58", image: "https://via.placeholder.com/150", category: "หนังสือคอมพิวเตอร์", trusted: true },
		{ id: 5, title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", price: "$70", image: "https://via.placeholder.com/150", category: "หนังสือวิทยาการ", trusted: false },
		{ id: 6, title: "The Art of Computer Programming", author: "Donald Knuth", price: "$90", image: "https://via.placeholder.com/150", category: "หนังสือคอมพิวเตอร์", trusted: true },
		{ id: 7, title: "Clean Code", author: "Robert C. Martin", price: "$45", image: "https://via.placeholder.com/150", category: "หนังสือทั่วไป", trusted: false },
		{ id: 8, title: "Design Patterns", author: "Gamma et al.", price: "$55", image: "https://via.placeholder.com/150", category: "หนังสือทั่วไป", trusted: true },
		{ id: 9, title: "Structure and Interpretation of Computer Programs", author: "Abelson & Sussman", price: "$50", image: "https://via.placeholder.com/150", category: "หนังสือคอมพิวเตอร์", trusted: true },
		{ id: 10, title: "Computer Organization and Design", author: "David A. Patterson", price: "$65", image: "https://via.placeholder.com/150", category: "หนังสือคอมพิวเตอร์", trusted: false },
		{ id: 11, title: "Computer Organization and Design", author: "David A. Patterson", price: "$65", image: "https://via.placeholder.com/150", category: "ควย", trusted: true }
	];

	// Function to extract unique categories
	function getUniqueCategories(books) {
		let categories = [];
		books.forEach(book => {
			if (!categories.includes(book.category)) {
				categories.push(book.category);
			}
		});
		return categories;
	}

	// Get unique categories from the books data
	let uniqueCategories = getUniqueCategories(books);

	// Add a variable to store the currently selected category
	let selectedCategory = null;  // Initially, no category is selected

    // Add a variable for the trusted filter checkbox
    let showTrustedOnly = false;

	// Function to filter books based on selected category
	function filterBooks(category) {
		selectedCategory = category;
	}

	// Reactive statement to filter books
	$: filteredBooks = (() => {
        let result = books;

        if (selectedCategory !== null) {
            result = result.filter(book => book.category === selectedCategory);
        }

        if (showTrustedOnly) {
            result = result.filter(book => book.trusted);
        }

        return result;
    })();

	// Function to navigate to book detail page
    function goToBookDetail(bookId) {
        goto(`/book/${bookId}`); // Use the goto function
    }

    // onMount lifecycle hook to equalize card heights
    onMount(() => {
        equalizeCardHeights(); // Initial equalization
        // Re-equalize heights after images have loaded (important!)
        const imageLoadPromises = Array.from(document.querySelectorAll('.book-card img')).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve(); // Already loaded
                } else {
                    img.onload = resolve; // Resolve when loaded
                    img.onerror = resolve; // Resolve even if there's an error (don't block)
                }
            });
        });

        Promise.all(imageLoadPromises).then(() => {
            equalizeCardHeights();
        });
    });

    function equalizeCardHeights() {
        const cards = document.querySelectorAll('.book-card');
        let maxHeight = 0;

        // Reset heights first (important for responsiveness)
        cards.forEach(card => {
            card.style.height = 'auto';
        });

        // Find the maximum height
        cards.forEach(card => {
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });

        // Set all cards to the maximum height
        cards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }

//อันนี้
function checkAndRedirect(token: string | null, routeId: string | null) {
        const isAuthRoute = routeId === "/" || routeId === "/Register";

        if (!token && !isAuthRoute) {
            goto("/");
        }
        else {
            isLoading.set(false);
        }
    }
    const isLoading = writable(true);
    onMount(async () => { 
        page.subscribe(($page) => {
            userToken = localStorage.getItem("userToken");
            checkAndRedirect(userToken, $page.route.id);
        });
    });
    //ถึงนี่
</script>

{#if $isLoading}
{:else}

<Navbar />

<div class="min-h-screen bg-white">
	<div class="max-w-6xl mx-auto p-4">
		<div class="flex items-center justify-between mb-4">
			<h1 class="text-3xl font-bold text-blue-700">ร้านหนังสือ</h1>
		</div>

        <!-- Main content area with flex layout -->
        <div class="flex gap-4">
            <!-- Sidebar -->
            <aside class="w-[20%] border border-blue-500 p-4 rounded-lg bg-blue-50 h-fit">
                <h2 class="text-xl font-semibold text-blue-700">หมวดหมู่</h2>
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
                <div class="mb-4">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={showTrustedOnly} class="form-checkbox h-5 w-5 text-blue-600" />
                        <span class="text-sm text-gray-700">แสดงเฉพาะร้านค้าที่น่าเชื่อถือ</span>
                    </label>
                </div>
                <!-- Book grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{#each filteredBooks as book}
						<div class="book-card border border-blue-500 rounded-lg shadow-lg bg-white flex flex-col">
                            <!-- Image container with fixed height -->
                            <div class="p-4">
                                <img src={book.image} alt={book.title} class="object-contain w-full h-[200px] rounded" />
                            </div>

							<!-- Text and button container -->
                            <div class="px-4 pb-4 flex-grow">
                                <p class="font-semibold text-blue-700">{book.title}</p>
                                <p class="text-sm text-gray-600">{book.author}</p>
                                <p class="text-blue-500 font-bold">{book.price}</p>
                                <button class="mt-2 w-full bg-blue-500 text-white py-2 rounded" on:click={() => goToBookDetail(book.id)}>
                                    ซื้อเลย
                                </button>
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