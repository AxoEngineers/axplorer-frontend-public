<script>
	let mobileNavOpen = false;

	function toggleMobileNav() {
	    mobileNavOpen = !mobileNavOpen;
	}
</script>

<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
			<slot name="icon"></slot>
		</a>

		<a role="button" class="navbar-burger" on:click={() => toggleMobileNav()} aria-label="menu" aria-expanded={mobileNavOpen} data-target="navbar">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>
	<div id="navbar" class="navbar-menu" class:is-active={mobileNavOpen}>
		<div class="navbar-end">
			<slot name="items"></slot>
		</div>
	</div>
</nav>

<style lang="scss">

</style>