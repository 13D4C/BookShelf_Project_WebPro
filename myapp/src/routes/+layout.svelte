<script lang="ts">
	import "../app.css";
	import { onNavigate } from "$app/navigation";
	let { children } = $props();
	import { goto } from "$app/navigation";
	import Navbar from "$lib/components/navbar.svelte";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const isLoading = writable(true);
	let userToken = null;
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
	function checkAndRedirect(token, routeId) {
    const isAuthRoute = routeId === "/" || routeId === "/register";
    if (!token && !isAuthRoute) {
      goto("/");
    } else {
      isLoading.set(false);
    }
  }
  onMount(() => {
    userToken = localStorage.getItem("userToken");
    checkAndRedirect(userToken, window.location.pathname);
  });
</script>

{#if $isLoading}
{:else}
  <Navbar />
  {@render children()} <!-- This renders the child page content -->
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