<script>
    import WalletLink from '../Components/Data/WalletLink.svelte';
    import { AXOLITTLE_TRAITS, RARITIES} from '../stores';
    import {onMount} from 'svelte';
    import DefaultHero from "../Components/DefaultHero.svelte";

    export let params;
    let axoData = $AXOLITTLE_TRAITS.filter(a => a.id == params.id)[0];
    let tokenHistory = [];
    onMount(async () => {
      // API doesn't work, removing
        // tokenHistory = await fetch(`https://axo-api.allate.co.uk/token/0xf36446105fF682999a442b003f2224BcB3D82067/history/${params.id}`, {
        //     headers: {
        //         'X-Api-Key': '7TwM2TcXpZXZatQgruxQQjxi4uqk7AGw'
        //     }
        // });
        // tokenHistory = await tokenHistory.json();
        // tokenHistory = tokenHistory.reverse();
    })

    let date = +new Date();

    function timeSince(ts) {
        ts *= 1000;
        var seconds = Math.floor((date - ts) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }
</script>

<DefaultHero />
<section class="section lookup-section">
	<div class="container">
		<div class="columns is-multiline is-mobile">
			<div class="column is-half-desktop">
				<figure class="image is-square">
					<img src="https://storage.googleapis.com/axolittles-cdn/images/{params.id}.gif" alt="Preview image of Axolittle #{params.id}" />
				</figure>
			</div>
			<div class="column is-half-desktop">
				<h2 class="title">
					Axolittle #{params.id}
					<span class="tag is-success">#{axoData['ranking']}</span>
				</h2>
				<div class="details-container">
					{#each Object.keys(axoData) as key}
						{#if key !== 'id' && key !== 'ranking'}
							<b>{key}:</b>
							({RARITIES[0][key][axoData[key]] / 100}%)
							<br />
						{/if}
					{/each}
				</div>
				{#if tokenHistory.length}
					<h2 class="title">History</h2>
					<table class="table">
						<thead>
						<tr>
							<td>Event</td>
							<td>Price</td>
							<td>From</td>
							<td>To</td>
							<td>Date</td>
						</tr>
						</thead>
						<tbody>
						{#each tokenHistory as item}
							<tr>
								<td>
									{#if item.minted}
										Minted
									{:else if item.cost == 0}
										Transferred
									{:else}
										Sold
									{/if}
								</td>
								<td>
									{#if item.cost != 0 && !item.minted}
										{item.cost}
									{/if}
								</td>
								<td data-id="{item.from}">
									<WalletLink wallet={item.from} />
								</td>
								<td>
									<WalletLink wallet={item.to} />
								</td>
								<td>
									{timeSince(item.timestamp)}
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				<!-- {:else}
				  <span class="title has-text-centered">
						We couldn't find any history for this Axolittle.
					</span> -->
				{/if}
			</div>
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
      height: 400%;
      top: -50%;
      left: -200%;
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

  section.lookup-section {
    background-color: #212121;
  	text-align: left;
  }

  .details-container {
	margin-top: 2rem;
	margin-bottom: 2rem;
  }

  .table {
	background-color: transparent;
	color: #eee;

	thead tr td {
	  color: white;
	}
  }
</style>