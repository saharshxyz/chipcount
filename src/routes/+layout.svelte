<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<Toaster richColors expand={false} position="bottom-center" />

<div class="p-5">
	{@render children()}
</div>
