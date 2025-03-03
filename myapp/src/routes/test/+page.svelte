<script>
  import { Drawer, Button, CloseButton } from 'flowbite-svelte';
  import {FilterSolid } from 'flowbite-svelte-icons';
  import { sineIn } from 'svelte/easing';
  let hidden1 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn
  };
</script>

<div class="text-center">
  <Button on:click={() => (hidden1 = false)}>Show drawer</Button>
</div>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hidden1} id="sidebar1">
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
      <FilterSolid class="w-5 h-5 me-2.5" />Filter
    </h5>
    <CloseButton on:click={() => (hidden1 = true)} class="mb-4 dark:text-white" />
  </div>
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
</Drawer>