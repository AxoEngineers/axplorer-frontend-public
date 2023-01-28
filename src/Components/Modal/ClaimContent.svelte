<script>
	export let params = {};

    let steps;
    $: {
        steps = params.steps;
	}
    let isAirdrop = params.isAirdrop;
    let amount = params.amount;
</script>

<div class="container">
	You are about to claim <strong>{amount.toFixed(4)} {isAirdrop ? 'airdropped $BUBBLE' : '$BUBBLE'}</strong>.
	<div class="columns is-mobile is-centered mt-5">
		{#each steps as step}
		<div class="column is-one-quarter-tablet is-half-mobile">
			<span class="icon" class:has-text-success={step.success} class:has-text-danger={step.error}>
				<i class="fas fa-3x" class:fa-check={step.success} class:fa-times={step.error} class:fa-spinner={step.pending} class:fa-spin={step.pending}></i>
			</span>
			<h3 class="subtitle">{step.name}</h3>
		</div>
		{/each}
	</div>
</div>