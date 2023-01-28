<script>
    import DefaultHero from "../Components/DefaultHero.svelte";
    import AccordionItem from '../Components/Generic/AccordionItem.svelte';
</script>

<DefaultHero />

<section class="section about-section">
	<div class="container">
		<h2 class="title has-text-centered">About Axplorer</h2>
		<p>
			The Axplorer was originally created by <a href="https://twitter.com/0xMLN" target="_blank">@0xMLN</a> as an explorer for the
			<a href="https://axolittles.io/" target="_blank">Axolittles</a> NFT project.
			On the projects' minting day, everyone wanted to find out what traits their Axolittles had and what rarities they were. Due to a delayed
			reveal and lack of third-party tools, a script was created to download an Axolittles' metadata from the blockchain. As more and more people asked
			to know their traits and rarity, it was obvious that <i>just a script</i> wasn't going to cut it.
		</p>
		<p>
			And thus, the first version of the Axplorer was created - a simple, static site containing
			<strong>all the metadata</strong> for every Axolittle. You could enter your ID and find out what traits it had, and even
			see an image of it in most cases! In our first few hours of launching, Axplorer received over <strong>5,000 requests</strong> for people
			wanting to see their traits.
		</p>
		<h3 class="title has-text-centered">And Then it Grew...</h3>
		<p>
			With more people having access to their traits, the next step was obvious: calculate rarity. The first approach used was
			to create a "rarity score", which was effectively the product of all traits an Axolittle has. This produced ugly and difficult
			to understand numbers, so eventually a rarity ranking was created instead using the same data. This is the rarity ranking that's still used here today!
		</p>
		<h3 class="title has-text-centered">Official Adoption</h3>
		<p>
			In January 2022, the Axplorer was adopted as the official explorer by the AxolittlesNFT Team. It has since grown to be the entry to the entire Axolittles
			ecosystem and all its utility. The Axplorer continues to be maintained by the AxolittlesNFT Team with support of
			<a href="https://twitter.com/0xMLN" target="_blank">@0xMLN</a>.
		</p>
	</div>
</section>
<section class="section">
	<div class="container">
		<h2 class="title has-text-centered">FAQ</h2>
		<AccordionItem title="Who created Axplorer?" id="who-created-axplorer">
			<p>
				Axplorer was created by <a href="https://twitter.com/0xMLN" target="_blank">@0xMLN</a> on Twitter.
			</p>
		</AccordionItem>
		<AccordionItem title="Is the rarity ranking accurate?" id="is-rarity-ranking-accurate">
			<p>
				<strong>The rarity rankings are accurate</strong>. There will be some differing results between Axplorer's rankings and
				Rarity Sniper/Rarity Tools due to how robot Axolittles work. Robot Axolittles have unique faces which aren't combined on any other Axolittles,
				so Axplorer ranks them higher than other tools might. However, they are still accurate because the ranking algorithm is consistent between each Axolittle.
			</p>
		</AccordionItem>
		<AccordionItem title="Will you make one for <insert project name here>?">
			<p>
				Maybe! Please reach out to <a href="https://twitter.com/0xMLN" target="_blank">@0xMLN</a>.
			</p>
		</AccordionItem>
		<AccordionItem title="What is Axplorer built in?" id="axplorer-tech">
			<p>
				Axplorer is built on the <a href="https://svelte.dev/" target="_blank">Svelte</a> framework, which is a fast component-driven framework similar to React.
				The transaction history, wallet lookups, and data pages are all powered by a bespoke backend written in NodeJS with MongoDB.
				The frontend uses <a href="https://bulma.io/" target="_blank">Bulma</a> for its customisability and ease of use.
			</p>
		</AccordionItem>
		<AccordionItem title="Can I use your API?" id="api-usage">
			<p>
				If you'd like to use the API for a project of your own, send us a message on Discord or Twitter with your use case.
			</p>
		</AccordionItem>
		<AccordionItem title="Will your API work for <insert project name here>?">
			<p>
				At the moment, no. There are lots of on-boarding steps to onboard a project with the backend.
				If you <i>really really really</i> want a project on there, please message us on Discord or Twitter.
				Currently, the API only works for Ethereum-based projects.
			</p>
		</AccordionItem>
	</div>
</section>

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
</style>