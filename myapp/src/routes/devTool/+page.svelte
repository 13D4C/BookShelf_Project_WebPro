<script lang="ts">
    import flook from "$lib/components/Flook.png";
    import inz from "$lib/components/inz.png";
    import khaow from "$lib/components/Khaow.png";
    import kong from "$lib/components/Kong.png";
    import d from "$lib/components/D.png";
	interface TeamMember {
		name: string;
		role: string;
		imageUrl: string;
		bio: string;
		socialLinks: {
			github?: string;
			linkedin?: string;
			twitter?: string;
			// เพิ่ม social media อื่น ๆ ได้
		};
	}

	const teamMembers: TeamMember[] = [
		{
			name: "นายเพชรแพรทอง อินอุทัย",
			role: "Project Manager",
			imageUrl: khaow, 
			socialLinks: {
				github: "https://github.com/Tonkhaow77546",
			},
		},
		{
			name: "นายภัทรพล เยาวราช",
			role: "Full stack developer",
			imageUrl: inz, 
			socialLinks: {
				github: "https://github.com/Pyaowara",
			},
		},
		{
			name: "นายอธิบดี คุ่ยประเสริฐ",
			role: "Frontend developer",
			imageUrl: d, 
			socialLinks: {
				github: "https://github.com/13D4C",
			},
		},
		{
			name: "นายพิสิษฐ์ งามเลิศพัฒนสิริ",
			role: "Frontend developer",
			imageUrl: kong, 
			socialLinks: {
				github: "https://github.com/KoniPN",
			},
		},
		{
			name: " นายพงศ์พิสุทธิ์ ทัพวงษ์",
			role: "Backend developer",
			imageUrl: flook, 
			socialLinks: {
				github: "https://github.com/flookpt",
			},
		},
	];

  function getSocialIcon(platform: string) {
    switch (platform) {
      case 'github': return 'fab fa-github';
      case 'linkedin': return 'fab fa-linkedin';
      case 'twitter': return 'fab fa-twitter';
      default: return '';
    }
  }

</script>

<div class="container mx-auto py-12">
	<h1 class="text-4xl font-bold text-center mb-8">ทีมงานผู้สร้าง</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each teamMembers as member}
			<div class="bg-white rounded-lg shadow-md p-6">
				<img
					src={member.imageUrl}
					alt={member.name}
					class="w-32 h-32 rounded-full mx-auto mb-4"
				/>
				<h2 class="text-2xl font-semibold text-center">{member.name}</h2>
				<p class="text-gray-600 text-center mb-4">{member.role}</p>
        <div class="flex justify-center mt-4">
          {#each Object.entries(member.socialLinks) as [platform, link]}
            {#if link}
              <a href={link} target="_blank" rel="noopener noreferrer" class="mx-2 text-blue-500 hover:text-blue-700">
                <i class={getSocialIcon(platform) + " text-2xl"}></i>

              </a>
            {/if}
          {/each}
        </div>
			</div>
		{/each}
	</div>
</div>

<style>
/*  Font Awesome  */
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

</style>