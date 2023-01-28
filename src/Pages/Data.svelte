<script>
    import DefaultHero from "../Components/DefaultHero.svelte";
    import WalletLink from '../Components/Data/WalletLink.svelte';
	import { onMount } from 'svelte';

    let loading = true;
    let error = false;
    let data = {};

    let buys = [];
    let sells = [];
    onMount(async() => {
        data = await fetch(`https://axo-api.allate.co.uk/token/0xf36446105fF682999a442b003f2224BcB3D82067/analytics`, {
            headers: {
                'X-Api-Key': '7TwM2TcXpZXZatQgruxQQjxi4uqk7AGw'
			}
		});
        if (200 === data.status) {
            data = await data.json();
            let interestingTransactions = data.interestingTransactions;
            for (const tx of interestingTransactions) {
                let isBuyer = (tx.to_wallet[0].ethBalance || 0) >= 5 ||  (tx.to_wallet[0].nftCount || 0) > 20;
                tx.from_wallet[0].classification = getWalletClassification(tx.from_wallet[0]);
                tx.to_wallet[0].classification = getWalletClassification(tx.to_wallet[0]);
                if (isBuyer) {
				    buys.push(tx);
				}
				else {
				    sells.push(tx);
				}
            }
		}
        else {
            error = true;
		}
        loading = false;
	});

    function getWalletClassification(wallet) {
        if (wallet.ethBalance > 10) {
            return 'Big Money';
		}

        if (wallet.ethBalance >= 5) {
            return 'Smart Money';
		}

        if (wallet.nftCount >= 20) {
            return 'NFT Collector';
		}

        return 'Unknown';
	}

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

<section class="section" class:has-text-centered={loading || error}>
	<div class="container">
		{#if loading}
			<h1 class="title">
			<span class="icon">
				<i class="fas fa-spinner fa-spin"></i>
			</span>
			</h1>
		{:else if error}
			<h1 class="title">oh god oh fuck there was an error</h1>
			<p>Sadge</p>
		{:else}
			<h2 class="title">Interesting Transactions</h2>
			<div class="columns is-mobile">
				<div class="column is-half-desktop">
					<h3 class="title">Purchases</h3>
					<table class="table">
						<thead>
						<tr>
							<td>Event</td>
							<td>Price</td>
							<td>From</td>
							<td>To</td>
							<td>Token</td>
							<td>Date</td>
						</tr>
						</thead>
						<tbody>
						{#each buys as item}
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
									({item.from_wallet[0].classification})
								</td>
								<td>
									<WalletLink wallet={item.to} />
									({item.to_wallet[0].classification})
								</td>
								<td>
									<a href="/view/{item.tokenId}">
										#{item.tokenId}
									</a>
								</td>
								<td>
									{timeSince(item.timestamp)}
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
				<div class="column is-half-desktop">
					<h3 class="title">Sells</h3>
					<table class="table">
						<thead>
							<tr>
								<td>Event</td>
								<td>Price</td>
								<td>From</td>
								<td>To</td>
								<td>Token</td>
								<td>Date</td>
							</tr>
						</thead>
						<tbody>
						{#each sells as item}
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
									({item.from_wallet[0].classification})
								</td>
								<td>
									<WalletLink wallet={item.to} />
									({item.to_wallet[0].classification})
								</td>
								<td>
									<a href="/view/{item.tokenId}">
										#{item.tokenId}
									</a>
								</td>
								<td>
									{timeSince(item.timestamp)}
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>

</section>

<style lang="scss">
  .table {
    background-color: transparent;
    color: #eee;

    thead tr td {
      color: white;
    }
  }
</style>