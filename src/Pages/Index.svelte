<script>

    import Axolitle from '../Components/Axolittle.svelte';
    import Loader from '../Components/Loader.svelte';
    import Filters from '../Components/Filters.svelte';
    import Sorters from '../Components/Sorters.svelte';
    import { AXOLITTLE_TRAITS, AXOLITTLE_COLLECTION, filters, sorts, tokenFilters } from "../stores";
    import { onMount } from 'svelte';

    let id = +new Date();

    let selectedAxo = false;

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
        //Backwards compatibility: rewrite old #123 URLs to /view/123
        if (window.location.hash) {
            searchAxo(window.location.hash);
        }

        //Remove any sorts & filters on page load
		$filters = [];
        $sorts = {};
        $tokenFilters = [];
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

    function searchAxo(id) {
        if ('#explore' === id) return;

        id = parseInt(id.replace('#', ''));
        let axos = $AXOLITTLE_TRAITS.filter(a => a.id === id);
        if (axos.length) {
            window.location = `/view/${id}`;
        }
        else {
            alert('Please enter a valid, numerical ID');
        }
    }

    let searchedAxo;

</script>

<svelte:head>
	<title>{selectedAxo ? `Axplorer | Axolittle #${selectedAxo.id}` : `Axplorer | Axolittles Explorer`}</title>
	<meta property="og:title" content="Axplorer | Axolittles Explorer" />
	<meta property="og:url" content="https://explorer.axolittles.io/" />
	<meta property="og:image" content="https://explorer.axolittles.io/media/og.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Axplorer is your entry to the Axolittles ecosystem and all its utility." />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@AxolittlesNFT" />
</svelte:head>

<section class="hero is-fullheight-with-navbar">
	<div class="hero-background"></div>
	<div class="hero-body">
		<div class="container">
			<h1 class="title">Axplorer | Axolittles Explorer</h1>
			<p class="subtitle">Axplorer is your entry to the Axolittles ecosystem and all its utility.</p>

			<div class="has-text-centered is-justify-content-center columns">
				<div class="column is-narrow">
					<p>
						You can look up an Axolittle below by entering its corresponding ID number.
					</p>
					<div class="field has-addons is-justify-content-center">
						<div class="control">
							<input class="input search-input" id="searchInput" type="text" placeholder="1234" bind:value={searchedAxo} />
						</div>
						<div class="control">
							<button class="button is-primary" on:click={() => searchAxo(searchedAxo)}>Lookup</button>
						</div>
					</div>
				</div>

			</div>

		</div>
	</div>
	<div class="hero-foot">
		<div class="container has-text-centered">
			<a href="#explore">
				<p class="title">Explore</p>
				<span class="icon">
					<i class="fa fa-chevron-down"></i>
				</span>
			</a>

		</div>
	</div>
</section>
<section class="section has-text-centered" id="explore">
	<div class="container">
		<h2 class="subtitle">Explore all Axolittles</h2>
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
					<Axolitle id="{item.id}" />
				</div>
			{/each}
			<Loader callback={infiniteHandler} />
		</div>
	</div>
</section>

<style lang="scss">

  .hero {
	position: relative;
	overflow: hidden;
    &:before {
	  content: '';
	  position: absolute;
	  width: 200%;
	  height: 200%;
	  top: -50%;
	  left: -50%;
	  z-index: 0;
      background-image: url('/media/backdrop.png');
	  background-repeat: repeat;
	  transform: rotate(30deg);
	  opacity: 0.5;
    }

	.hero-body {
	  z-index: 1;

	  .columns {
		margin-top: 2.5rem;
	  }
	}

	.hero-foot {
	  a {
		color: white;

		.title {
		  margin-bottom: 0.25rem;
		}

		&:hover, &:visited {
		  color: white;
		  text-decoration: none;
		}
	  }

	  margin-bottom: 2rem;
	}
  }
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

  section.rarity-section {
    background-color: #212121;
  }

  h2.subtitle {
    margin-bottom: 0.25rem;
  }
</style>