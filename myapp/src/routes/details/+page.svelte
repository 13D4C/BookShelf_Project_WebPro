<script>
	import { goto } from '$app/navigation';
    function ProfilePage() {
    goto('/Profile');
  }

  function MainPage() {
    goto('/main');
  }
	import { onMount } from 'svelte';

	let book = {
		title: 'The Great Adventure',
		image:
			'https://upload.wikimedia.org/wikipedia/th/b/b9/Rent-A-Girlfriend%2C_volume_1_thai_version.jpg',
		price: 300,
		discount: 15,
		reviews: 125,
		rating: 4.5,
		description: 'xxxx',
		details: 'xxxx',
		reviewText: 'xxx',
	};
	let quantity = 1;
	let relatedBooks = [];
	let isLoadingRelatedBooks = true;
    let isLoadingBook = true;
	let errorMessage = '';

	$: discountedPrice = book.discount
		? book.price * (1 - book.discount / 100)
		: book.price;

	function generateStars(rating) {
		const fullStars = Math.floor(rating);
		const halfStar = rating - fullStars >= 0.5;
		const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

		let starsHTML = '';
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

    onMount(async () => {
    // Simulate fetching the main book (replace with your actual fetch)
        try {
            const response = await fetch('/api/book-details.json'); // Hypothetical API
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
            const data = await response.json();
            book = data; // Update the book object with fetched data

        } catch (error) {
                console.error("Error fetching main book details:", error);
                errorMessage = "Failed to load book details. Please try again later.";
        } finally {
            isLoadingBook = false;
        }


		try {
			const response = await fetch('/api/related-books.json');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			relatedBooks = data;
		} catch (error) {
			console.error('Error fetching related books:', error);
			errorMessage = 'Failed to load related books.';
			// Keep placeholder data for related books
			relatedBooks = [
				{ image: 'https://via.placeholder.com/200', title: 'Book 1' },
				{ image: 'https://via.placeholder.com/200', title: 'Book 2' },
				{ image: 'https://via.placeholder.com/200', title: 'Book 3' },
			];
		} finally {
			isLoadingRelatedBooks = false; // Set loading to false after fetch (success or failure)
		}
	});
</script>

<div class="min-h-screen bg-blue-50">
    <header class="bg-blue-900 text-white py-4">
        <div class="container mx-auto flex justify-between items-center">
            <button class="text-xl font-bold" on:click={MainPage}>
				ร้านหนังสือของป้าแพรวา
			  </button>
            <div class="relative ml-auto">
                <input type="text" placeholder="ค้นหา" class="rounded-md p-2 w-64 text-black"  role="search" aria-label="Search"/>
                <button class="absolute right-0 top-1/2 -translate-y-1/2 text-blue-900">
                    🔍
                </button>
            </div>
            <button class="text-2xl ml-6">🛒</button>
            <a href="#" on:click={ProfilePage} class="ml-6 text-2xl">👤</a>
        </div>
    </header>

	<!-- Navigation (same as before) -->
    <nav class="bg-blue-700 text-white py-2">
        <div class="container mx-auto flex space-x-4">
            <a href="#" class="hover:underline">นิยาย</a>
            <a href="#" class="hover:underline">หนังสือ</a>
            <a href="#" class="hover:underline">บันเทิง</a>
            <a href="#" class="hover:underline">การ์ตูน</a>
        </div>
    </nav>

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
                {#if book.image}
                    <div class="max-w-xs">
                        <img class="w-full rounded-lg object-cover" src={book.image} alt={book.title} />
                    </div>
                {/if}
                {#if book.discount}
                <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
                    >-{book.discount}%</span
                >
                {/if}
            </div>

			<!-- Book Details -->
			<div class="space-y-4">
				<h1 class="text-3xl font-bold">{book.title}</h1>
				<div class="flex items-center">
					{@html generateStars(book.rating)}
					<span class="text-gray-800 ml-7 text-lg">({book.reviews})</span>
				</div>
				<p class="text-2xl text-red-600 font-semibold">
					{#if book.discount}
						<span class="line-through text-gray-600 text-lg">{book.price.toFixed(0)} บาท</span>
						{discountedPrice.toFixed(0)} บาท
					{:else}
						{book.price.toFixed(0)} บาท
					{/if}
				</p>

				<div class="flex items-center">
					<label class="mr-2 text-lg">จำนวน</label>
					<button
						class="px-4 py-2 bg-gray-500 rounded text-xl"
						on:click={() => (quantity = Math.max(1, quantity - 1))}>-</button
					>
					<span class="px-4 text-xl">{quantity}</span>
					<button class="px-4 py-2 bg-gray-300 rounded text-xl" on:click={() => quantity++}>+</button>
				</div>

				<div class="flex gap-4">
					<button class="px-8 py-3 border border-orange-500 text-orange-500 rounded text-lg"
						>ใส่รถเข็น</button
					>
					<button class="px-8 py-3 bg-orange-500 text-white rounded text-lg">ซื้อ</button>
				</div>
			</div>
		</div>

		<!-- Description -->
		<div class="mt-8">
			<h2 class="text-xl font-semibold">รายละเอียด : {book.description}</h2>
			<p class="text-gray-600 mt-2">{book.details}</p>
		</div>

		<!-- Reviews -->
		<div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="bg-gray-100 p-4 rounded-lg">
				<p class="text-3xl font-bold">{book.rating}</p>
				<div class="mt-2">{@html generateStars(book.rating)}</div>
			</div>
			<div class="bg-gray-100 p-4 rounded-lg">
				<h3 class="font-semibold">รีวิวจากลูกค้า</h3>
				<p class="text-gray-600 mt-2">{book.reviewText}</p>
			</div>
		</div>
        {/if}

		<!-- Related Books -->
		<div class="mt-8">
			<h2 class="text-xl font-semibold">หนังสือที่เกี่ยวข้อง</h2>
			{#if isLoadingRelatedBooks}
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
					{#each Array(4) as _}
						<div class="bg-gray-200 h-40 rounded-lg animate-pulse"></div>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
					{#each relatedBooks as related}
						<div class="bg-gray-200 h-40 rounded-lg overflow-hidden">
							{#if related.image}
								<img
									class="h-full w-full object-cover"
									src={related.image}
									alt={related.title || 'Related Book'}
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

<style>
	.container {
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
		padding-left: 1rem;
		padding-right: 1rem;
	}
</style>