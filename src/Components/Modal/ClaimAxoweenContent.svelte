<script>
	export let params = {};

    let steps;
    $: {
        steps = params.steps;
	}
    let axosHeld = params.numAxos;
</script>

<div class="container">
	You are about to reserve <strong>{axosHeld}</strong> Yuletide Axos!
	<div class="columns is-mobile is-centered mt-5">
		{#each steps as step}
		<div class="column column is-one-quarter-tablet is-half-mobile">
			<span class="icon" class:has-text-success={step.success} class:has-text-danger={step.error}>
				<i class="fas fa-3x" class:fa-check={step.success} class:fa-times={step.error} class:fa-spinner={step.pending} class:fa-spin={step.pending}></i>
			</span>
			<h3 class="subtitle">{step.name}</h3>
		</div>
		{/each}
	</div>
</div>

<style lang="scss">
    .icon {
        margin-left: 10px;
    }
</style>