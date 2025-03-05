<script lang="ts">
	import "../app.css";
	import { onNavigate, goto } from "$app/navigation";
	import Navbar from "$lib/components/navbar.svelte";
	import { onMount, onDestroy } from "svelte";
	import { writable } from "svelte/store";
    import { quintOut } from "svelte/easing";
    import { fade, scale } from "svelte/transition";

	const isLoading = writable(true);
	const shouldRenderContent = writable(false); // New store: controls child rendering
	let userToken: string | null = null;

	onNavigate((navigation) => {
		isLoading.set(true); // ALWAYS set loading to true before navigation
        shouldRenderContent.set(false);
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
                //check token and pathname again because sometime it does child page script first before this one
                userToken = localStorage.getItem("userToken");
				checkAndRedirect(userToken, window.location.pathname); // Recheck after navigation
			});
		});
	});
  onDestroy(() => {
    isLoading.set(true); // Set loading to true on component destruction
  });

	function checkAndRedirect(token: string | null, routeId: string) {
		const isAuthRoute = routeId === "/" || routeId === "/Register" || routeId === "/Register/promax";
        isLoading.set(true);
		if (!token && !isAuthRoute) {
            goto("/");
		} else {
			shouldRenderContent.set(true); // Only allow content rendering if authorized
            isLoading.set(false)
		}
	}

	onMount(() => {
        userToken = localStorage.getItem("userToken");
		checkAndRedirect(userToken, window.location.pathname);
	});

	let { children } = $props();
</script>

{#if $isLoading}
<div 
class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"
transition:fade={{ duration: 300 }}
>
<div 
  class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
  transition:scale={{ duration: 300, easing: quintOut }}
></div>
</div>
{:else}
	<Navbar />
	{#if $shouldRenderContent}
		{@render children()}
	{/if}
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	:root::view-transition-old(root) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
	}

	:root::view-transition-new(root) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
	}
</style>