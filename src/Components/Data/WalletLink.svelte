<script>
	let nullWallet = '0x0000000000000000000000000000000000000000';

	export let wallet;
	export let shortFormat = true;
	export let link = true;

	let formattedWallet = '';
	$: {
	    if (nullWallet === wallet) {
	        formattedWallet = 'Null Address';
		}
	    else {
            formattedWallet = shortFormat ? wallet.substr(2, 6).toUpperCase() : wallet;
		}
	}
</script>

{#if link && '0x0000000000000000000000000000000000000000' !== wallet}
	<a href="/lookup/{wallet}">{formattedWallet}</a>
{:else}
	{formattedWallet}
{/if}

<style lang="scss">

</style>