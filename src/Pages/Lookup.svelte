<script>

    import Axolitle from '../Components/Axolittle.svelte';
    import Loader from '../Components/Loader.svelte';
    import Filters from '../Components/Filters.svelte';
    import Sorters from '../Components/Sorters.svelte';
    import {tokenFilters, AXOLITTLE_COLLECTION, filters, sorts} from '../stores';
    import {onMount} from 'svelte';
    import DefaultHero from "../Components/DefaultHero.svelte";

    let walletAddress;
    let walletLookedUp = false;

    async function lookupWallet(walletAddress) {
        let resp = await fetch(`https://axo-api.allate.co.uk/token/0xf36446105fF682999a442b003f2224BcB3D82067/ownedBy/${walletAddress}`, {
            headers: {
                'X-Api-Key': '7TwM2TcXpZXZatQgruxQQjxi4uqk7AGw'
            }
        });
        resp = await resp.json();
        $tokenFilters = [];
        if (resp.tokens.length) {
            resp.tokens.forEach(tok => {
                $tokenFilters = [...$tokenFilters, tok.tokenId];
            });
            walletLookedUp = true;
        } else {
            walletLookedUp = false;
        }

        reset();
    }

    let id = +new Date();

    let selectedAxo = false;

    export let params;

    let list = [];
    let page = 0;
    let pageSize = 4;

    function infiniteHandler() {
        console.log('calling infinite handler' + $AXOLITTLE_COLLECTION.length + ' ' + list.length);
        if (list.length < $AXOLITTLE_COLLECTION.length) {
            list = [...list, ...$AXOLITTLE_COLLECTION.slice(page * 20, (page + 1) * 20)];
            page++;
        }
    }

    onMount(() => {
        if (window.location.hash) {
            walletAddress = window.location.hash.replace('#', '');
            if ('0x' === walletAddress.substr(0, 2)) {
                window.location = `/lookup/${walletAddress}`;
            }
        }

        //Remove any sorts & filters on page load
        $filters = [];
        $sorts = {};

        walletAddress = params.wallet;
        lookupWallet(params.wallet);
    })


    function reset() {
        list = [];
        page = 0;
        infiniteHandler();
    }

    function selectAxolittle(item) {
        if (item.id) {
            window.location = `/view/${item.id}`;
        }
    }

    function searchWallet(walletAddress) {
        window.location = `/lookup/${walletAddress}`;
    }
</script>

<DefaultHero />
<section class="section lookup-section">
	<div class="columns is-centered">
		<div class="column is-narrow">
			<h2 class="subtitle">Lookup a Wallet</h2>
			Here you can check what Axolittles a specific wallet has.<br />
			<strong>NOTE:</strong> This data updates every 5-10 minutes. It is <strong>not</strong> instant.
		</div>
	</div>
	<div class="columns is-centered">
		<div class="column is-narrow">
			<div class="field search-field">
				<label class="label" for="searchInput">Lookup a wallet:</label>
				<input class="input search-input" id="searchInput" type="text" placeholder="1234" bind:value={walletAddress} />
				<button class="button is-primary" on:click={() => searchWallet(walletAddress)}>Check</button>
			</div>
		</div>
	</div>
</section>
<section class="section" class:is-hidden={walletLookedUp}>
	<div class="container">
		<h2 class="subtitle">No Axolittles Found</h2>
		<p>Please enter a valid Ethereum wallet address above.</p>
	</div>
</section>
<section class="section has-text-centered" class:is-hidden={!walletLookedUp}>
	<div class="container">
		<h2 class="subtitle">Explore Axolittles</h2>
		<p>viewing {$AXOLITTLE_COLLECTION.length} out of 9,999</p>
		<div class="columns is-mobile is-multiline">
			<div class="column is-full-mobile is-half-desktop">
				<Filters onFilter="{reset}" />
			</div>
			<div class="column is-full-mobile is-half-desktop">
				<Sorters onSort="{reset}" />
			</div>
		</div>

		<div class="columns is-multiline is-mobile">
			{#each list as item}
				<div class="column is-one-quarter-tablet is-half-mobile">
					<Axolitle id="{item.id}" onClick={() => selectAxolittle(item)} />
				</div>
			{/each}
			<Loader callback={infiniteHandler} />
		</div>
	</div>
</section>

<style lang="scss">
  main {
    text-align: center;
    padding: 0;
    margin: 0 auto;
  }

  .field.search-field {
    text-align: left;

    input.search-input {
      width: 200px;
    }
  }

  section.lookup-section {
    background-color: #212121;
  }

  h1.title, h2.subtitle {
    margin-bottom: 0.25rem;
  }
</style>