<script>
	export let id;
    export let short = false;

	import { AXOLITTLE_TRAITS } from '../stores';

	let staticImageUrl = `https://storage.googleapis.com/axolittles/staticimages/${id}.png`;
    let axoData = $AXOLITTLE_TRAITS.filter(a => a.id === id)[0];

    $: {
        staticImageUrl = `https://storage.googleapis.com/axolittles/staticimages/${id}.png`;
        axoData = $AXOLITTLE_TRAITS.filter(a => a.id === id)[0];
	}

	let modalImageUrl = staticImageUrl;
</script>

{#if short}
	<div class="axolittle card pb-1">
		<div class="card-image">
			<figure class="image is-square">
				<img src="{staticImageUrl}" alt="Preview image of Axolittle #{id}" />
			</figure>
		</div>
		<h4 class="subtitle mb-0 mt-1">
			#{id}
			<span class="tag is-success">#{axoData['ranking']}</span>
		</h4>
	</div>
{:else}
	<a class="axolittle card" href="/view/{id}">
		<div class="card-image">
			<figure class="image is-square">
				<img src="{staticImageUrl}" alt="Preview image of Axolittle #{id}" />
			</figure>
		</div>
		<h2 class="subtitle">
			Axolittle #{id}
			<span class="tag is-success">#{axoData['ranking']}</span>
		</h2>
	</a>
{/if}


<style lang="scss">
  a.axolittle {
    cursor: pointer;
  }
	.axolittle {
	  display: block;

	  &:hover, &:visited {
		text-decoration: none;
	  }
	}
</style>