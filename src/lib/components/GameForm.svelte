<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { gameSchema } from '$lib/schemas';
	import { formattedDateTime } from '$lib/utils';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import X from '@lucide/svelte/icons/X';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const form = superForm(
		{
			description: `${formattedDateTime()} Game`,
			players: [
				{ name: '', cashIn: 0, cashOut: 0 },
				{ name: '', cashIn: 0, cashOut: 0 }
			]
		},
		{
			validators: zodClient(gameSchema),
			onUpdated: ({ form }) => {
				if (form.valid) console.log('Form Submitted Successfully:', form.data);
			}
		}
	);

	const { form: formData, enhance, submitting } = form;

	function addPlayer() {
		// To add a player, we just update the players array in the form store
		$formData.players = [...$formData.players, { name: '', cashIn: 0, cashOut: 0 }];
	}

	function removePlayer(index: number) {
		// To remove a player, we filter the players array
		$formData.players = $formData.players.filter((_, i) => i !== index);
	}
</script>

<form method="POST" use:enhance class="space-y-5">
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Input placeholder="Game description" {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="players">
		<div class="space-y-2">
			<Form.Label>Players</Form.Label>

			<!-- Loop through each player in the form data store -->
			{#each $formData.players as _, index (index)}
				<div class="flex items-start space-x-2">
					<Form.Field {form} name={`players[${index}].name`} class="grow">
						<Form.Control>
							{#snippet children({ props })}
								<Input
									{...props}
									placeholder={`Player ${index + 1}`}
									bind:value={$formData.players[index].name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`players[${index}].cashIn`} class="w-32 sm:w-24">
						<Form.Control>
							{#snippet children({ props })}
								<Input
									type="number"
									placeholder="In"
									{...props}
									bind:value={$formData.players[index].cashIn}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`players[${index}].cashOut`} class="w-32 sm:w-24">
						<Form.Control>
							{#snippet children({ props })}
								<Input
									type="number"
									placeholder="Out"
									{...props}
									bind:value={$formData.players[index].cashOut}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Button
						type="button"
						variant="destructive"
						size="icon"
						onclick={() => removePlayer(index)}
						disabled={$formData.players.length <= 2}
					>
						<X class="h-4 w-4" />
					</Button>
				</div>
			{/each}

			<Button type="button" variant="outline" onclick={addPlayer} class="w-full">Add Player</Button>
		</div>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="w-full">
		{#if $submitting}
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		Submit
	</Form.Button>
</form>
