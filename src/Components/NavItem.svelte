<script>
	export let onClick;
	export let href = false;
</script>

{#if href}
<a class="navbar-item" href={href}>
	<slot></slot>
</a>
{:else}
<a class="navbar-item" on:click={onClick}>
	<slot></slot>
</a>
{/if}

<style lang="scss">
	.navbar-item {
	  color: #eee;
	  &:hover, &:visited {
		text-decoration: none;
		color: #fff;
	  }

	  font-family: 'Montserrat', sans-serif;
	  font-weight: 700;
	}
</style>