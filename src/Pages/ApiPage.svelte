<script>
    import DefaultHero from "../Components/DefaultHero.svelte";
    import AccordionItem from '../Components/Generic/AccordionItem.svelte';
</script>

<DefaultHero />

<section class="section about-section">
	<div class="container">
		<h2 class="title has-text-centered">Axplorer API</h2>
		<p>
			So, you want to be able to get some Axolittles data? The API is <strong>free to use</strong> and authenticated
			via an API key and list of origins. This is to ensure fair usage.
		</p>
		<h3 class="title has-text-centered">Contact Us</h3>
		<ul>
			<li>Message <a href="https://twitter.com/AxolittlesNFT" target="_blank">@AxolittlesNFT</a> on Twitter, or reach out to us on Discord.</li>
			<li>Tell us what you plan to use the API for and how frequently you expect to use it.</li>
			<li>If all checks out, we'll send you an API key!</li>
		</ul>
	</div>
</section>
<!-- REMOVED
<section class="section">
	<div class="container">
		<h2 class="title has-text-centered">API Reference</h2>
		<p>
			The API is hosted on <code>https://axo-api.allate.co.uk/</code>. For Axolittles, any <code>:token</code>
			parameter should be replaced with <code>0xf36446105fF682999a442b003f2224BcB3D82067</code>.<br /><br />
		</p>
		<AccordionItem title="GET /token/:token/history/:id" id="get-token-history">
			<p>
				Retrieve the token history of <code>:id</code>, in reverse chronological* order.
			</p>
			Parameters:
			<ul>
				<li><code>:token</code> - see above</li>
				<li><code>:id</code> - the numeric ID of the token you wish to query</li>
			</ul>
			Example response:
			<pre>
				[
				{'{'}
                    "_id": "613fe65c8e9eeb206b38cc1d",
                    "from": "0x0000000000000000000000000000000000000000",
                    "to": "0x7cb6f5a5596652cb6539bc4d2552699345fd0daa",
                    "tokenId": 251,
                    "tx": "0x3c987d60bbecea4af38ad274a720c520be686bdd1e2e7c51394c3516affa73a1",
                    "block": 13173133,
                    "minted": true,
                    "token": "0xf36446105ff682999a442b003f2224bcb3d82067",
                    "timestamp": 1630944014,
                    "cost": 0.07
				{'}'},
				{'{'}
                    "_id": "613fe65c8e9eeb206b390277",
                    "from": "0x7cb6f5a5596652cb6539bc4d2552699345fd0daa",
                    "to": "0x6340ad78c79b6b5b9efb7d7f0ed40b500253804e",
                    "tokenId": 251,
                    "tx": "0x6668444ca6c112b4edecc6777d5eea57cf99a035fc3ce53c60eded6cc957d918",
                    "block": 13209954,
                    "minted": false,
                    "token": "0xf36446105ff682999a442b003f2224bcb3d82067",
                    "timestamp": 1631436481,
                    "cost": 0.029
				{'}'}
				]
			</pre>
			<p>
				<strong>NOTE:</strong> history is not guaranteed to be in reverse chronological order, but it should be.
				It is safe to assume it will be.
			</p>
		</AccordionItem>
		<AccordionItem title="GET /token/:token/ownedBy/:address" id="get-wallet-information">
			<p>
				Retrieve the currently owned Axolittles for <code>:address</code>, including historical data and price data
				where available.
			</p>
			Parameters:
			<ul>
				<li><code>:token</code> - see above</li>
				<li><code>:address</code> - the wallet address to query for</li>
			</ul>
			Example response:
			<pre>
				{'{'}
                    "tokens": [
						{'{'}
                    "tokenId": 2659,
                    "cost": 0.07,
                    "timestamp": 1630944129,
                    "from": "0x0000000000000000000000000000000000000000",
                    "to": "0x6340ad78c79b6b5b9efb7d7f0ed40b500253804e"
						{'}'},
				{'{'}
                    "tokenId": 9478,
                    "cost": 0.07,
                    "timestamp": 1630950832,
                    "from": "0x0000000000000000000000000000000000000000",
                    "to": "0x6340ad78c79b6b5b9efb7d7f0ed40b500253804e"
						{'}'}
                    ],
                    "history": [
				{'{'}
                    "_id": "613fe65c8e9eeb206b38d585",
                    "from": "0x0000000000000000000000000000000000000000",
                    "to": "0x6340ad78c79b6b5b9efb7d7f0ed40b500253804e",
                    "tokenId": 2659,
                    "tx": "0x53e95c5ee74dd8d19b1f6e1a3caa7e32854fa31404f975ea0aa49ed5b46c1c52",
                    "block": 13173141,
                    "minted": true,
                    "token": "0xf36446105ff682999a442b003f2224bcb3d82067",
                    "timestamp": 1630944129,
                    "cost": 0.07
						{'}'},
				{'{'}
                    "_id": "613fe65c8e9eeb206b38f1ec",
                    "from": "0x0000000000000000000000000000000000000000",
                    "to": "0x6340ad78c79b6b5b9efb7d7f0ed40b500253804e",
                    "tokenId": 9478,
                    "tx": "0xd67b038fbd468ed17417f15f0aea89bbd9a0af35ee022b968813c98730a90b0d",
                    "block": 13173634,
                    "minted": true,
                    "token": "0xf36446105ff682999a442b003f2224bcb3d82067",
                    "timestamp": 1630950832,
                    "cost": 0.07
						{'}'}
                    ]
						{'}'}
			</pre>
		</AccordionItem>
		<AccordionItem title="GET /token/:token/analytics" id="get-token-analytics">
			<p>
				<strong>NOTE:</strong> please use this sparingly. This route runs expensive database queries and only updates every ~30 minutes.<br />
				Retrieve some analytics for <code>:token</code>
			</p>
			Parameters:
			<ul>
				<li><code>:token</code> - see above</li>
			</ul>
			Example Response:
			<pre>
				{'{'}
				"interestingTransactions": [
				{'{'}
				"_id": "6154e1e339274b646df70008",
      "from": "0x1a98347250498531758446ac22e605dceb46005c",
      "to": "0xea7efb51326900fdb5961b0bbc305145583549ff",
      "tokenId": 7295,
      "tx": "0x4a904ec776c2fa339775385a68fe264a9cae4c537d85ff9a2f44151fdd91372c",
      "block": 13323134,
      "minted": false,
      "token": "0xf36446105ff682999a442b003f2224bcb3d82067",
      "timestamp": 1632951544,
      "cost": 0.179,
      "from_wallet": [
				{'{'}
				"_id": "0x1a98347250498531758446ac22e605dceb46005c",
          "ethBalance": 1.0914448561330512,
          "totalEthBalance": 82.77645116674722,
          "tokens": {'{'}
				"GU:S1:RT": {'{'}
				"balance": 5000,
              "eth": 0.0000119672373,
              "usd": 0.034108634404185004
				{'}'},
            "akSwap.io": {'{'}
				"balance": 250000,
              "eth": 45.421903271564254,
              "usd": 129460.0461070523
				{'}'},
            "FF9.io": {'{'}
				"balance": 300000,
              "eth": 35.7634410932775,
              "usd": 101931.80821159156
				{'}'},
            "WETH": {'{'}
				"balance": 0.5,
              "eth": 0.4996499785351243,
              "usd": 1424.3126491203004
				{'}'}
				{'}'},
          "nftCount": 334,
          "updated": "2021-09-28T19:35:36.612Z"
				{'}'}
				],
      "to_wallet": [
				{'{'}
				"_id": "0xea7efb51326900fdb5961b0bbc305145583549ff",
          "ethBalance": 3.181656755777655,
          "totalEthBalance": 40.053867514425754,
          "tokens": {'{'}
				"ASTRO": {'{'}
				"balance": 0.000034389784145703,
              "eth": 2.5361934699293034e-9,
              "usd": 0.0000071525783596711405
				{'}'},
            "FF9.io": {'{'}
				"balance": 300000,
              "eth": 35.7634410932775,
              "usd": 100861.49533226078
				{'}'},
            "HOGE": {'{'}
				"balance": 2779155.938215985,
              "eth": 0.09124373667528218,
              "usd": 257.3257853329666
				{'}'},
            "SALE": {'{'}
				"balance": 3005.326275158157,
              "eth": 1.017525926159131,
              "usd": 2869.6675519583805
				{'}'}
				{'}'},
          "nftCount": 79,
          "updated": "2021-09-29T22:05:24.166Z"
				{'}'}
				]
				{'}'}
				]
				{'}'}
			</pre>
		</AccordionItem>
	</div>
</section> -->

<style lang="scss">
  img.is-inline-block {
	height: 32px;
  }
  .about-section {
	background-color: #212121;
  }
	.container {
	  p {
		&:not(:first-child) {
		  margin-top: 1rem;
		}
	  }

	  h3.title {
		margin-top: 2rem;
		font-size: 1.7rem;
	  }
	}

	a {
	  color: #0582ff;
	}

	code, pre {
	  background-color: #212121;
	  color: #da1039;
	}
</style>