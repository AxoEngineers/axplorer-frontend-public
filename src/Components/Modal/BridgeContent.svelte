<script>
    import Axolittle from "../Axolittle.svelte";
	export let params = {};

    let steps;
    $: {
        steps = params.steps;
	}
    let isStaking = params.isStaking;
    let gasAmount = params.gasAmount;
    let axos = params.axos;
</script>

<div class="container">
	You are about to bridge {axos.length} Axolittle{axos.length > 1 ? 's' : ''}.<br />
	Please note that it may take up to 10 minutes for your Axolittles to show up on the destination chain.
	{#if gasAmount > 20000000000000000}
		<div class="message is-warning mt-5">
			<div class="message-header">

			</div>
			<div class="message-body">
				<strong>Gas is high right now!</strong> Bridging currently costs <strong>{(gasAmount / 1e18).toFixed(3)} ETH</strong> per Axolittle.<br />
				Consider waiting until gas is less than <strong>0.02 ETH</strong> per Axolittle.
			</div>
		</div>
	{/if}
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