<script>
	export let id;
    export let version = 1;
    export let isStaked = false;
	export let chainId = 1;

	import { ETH_CHAIN_ID, AXOLITTLE_TRAITS } from '../stores';

	let staticImageUrl, animatedImageUrl;

	let axoData;
	$: {
        staticImageUrl = `https://storage.googleapis.com/axolittles/staticimages/${id}.png`;
        animatedImageUrl = `https://storage.googleapis.com/axolittles-cdn/images/${id}.gif`;
        axoData = $AXOLITTLE_TRAITS.filter(a => a.id == id)[0];
	}

	let modalImageUrl = staticImageUrl;

    let selected = false;

    export let doOnClick = () => {};
    function doClick() {
        selected = !selected;
        console.log(selected);
        doOnClick();
	}
</script>

<div class="axolittle card pb-2" data-animated-url="{animatedImageUrl}" class:selected={selected} on:click={doClick}>
	<div class="card-image">
		<figure class="image is-square">
			<img src="{staticImageUrl}" alt="Preview image of Axolittle #{id}" />
		</figure>
	</div>
	<h2 class="subtitle mt-2">
		Axolittle #{id}
		<span class="tag is-success">#{axoData['ranking']}</span>
	</h2>
	<div>
		{#if isStaked && (chainId === ETH_CHAIN_ID)}
			{#if version === 1}
				<span class="tag is-info">Old Contract</span>
			{:else}
				<span class="tag is-success">New Contract</span>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	.axolittle {
	  cursor: pointer;
	  display: block;

	  &:hover, &:visited {
		text-decoration: none;
	  }

	  &.selected {
		border: 2px solid red;
	  }

	  .subtitle {
		margin-bottom: 0;
	  }

	  .tag {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
	  }
	}
</style>