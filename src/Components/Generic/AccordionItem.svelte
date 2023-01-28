<script>
	export let title;
	export let id = false;
</script>

<div class="accordion-item">
	<div class="accordion-title">
		{#if id}
			<h3 class="title" id="{id}">{title}</h3>
		{:else}
			<h3 class="title">{title}</h3>
		{/if}

	</div>
	<div class="accordion-content open">
		<slot></slot>
	</div>
</div>

<style lang="scss">
	.title {
	  font-size: 1.7rem;
	}
	.accordion-content {
	  padding-bottom: 2rem;
	}
</style>