<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Link from '@lucide/svelte/icons/link';
	import Eraser from '@lucide/svelte/icons/eraser';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';

	function copyLink() {
		navigator.clipboard.writeText(page.url.href).then(
			() => toast.success('Link copied to clipboard'),
			() => toast.error('Failed to copy URL to clipboard.')
		);
	}
</script>

<div class="flex w-full flex-col items-center justify-center">
	<div class="mb-2 flex flex-row justify-center space-x-2">
		<Button href="/" variant="outline" data-sveltekit-reload
			><Eraser class="mr-1" />Clear Form</Button
		>
		<Button class="max-w-full" onclick={copyLink}><Link class="mr-1" />Copy Link</Button>
	</div>
</div>
