<script>
    import Axolittle from "../Axolittle.svelte";
	export let params = {};

    let steps;
    $: {
        steps = params.steps;
	}
    let isStaking = params.isStaking;
    let axos = params.axos;
</script>

<div class="container">
	You are about to {isStaking ? 'stake' : 'unstake'} {axos.length} Axolittle{axos.length > 1 ? 's' : ''}.
	<div class="columns is-multiline is-mobile is-centered">
		{#each axos as axo}
			<div class="column is-one-quarter-desktop is-2-mobile">
				<Axolittle id={axo} short=true />
			</div>
		{/each}
	</div>
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