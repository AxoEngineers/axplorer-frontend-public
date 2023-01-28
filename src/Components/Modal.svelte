<script context="module">
	const modals = {};
	export function getModal(id = '') {
	    return modals[id];
	}
</script>
<script>
	import { onDestroy } from 'svelte';

	export let id = '';

	let content;

	let closeCallback;
	let visible = false;
	function keyPress(ev) {
	    if (ev.key === 'Escape') close();
	}

	function open(cb) {
	    if (visible) return;
        cb();
	    window.addEventListener('keydown', keyPress);
	    document.body.style.overflow = 'hidden';
	    visible = true;
	    document.body.appendChild(content);
	}

	function close() {
	    if (!visible) return;
	    window.removeEventListener('keydown', keyPress);
        document.body.style.overflow = 'visible';
	    visible = false;
	}

	modals[id] = { open, close };

	onDestroy(() => {
	    delete modals[id];
		window.removeEventListener('keydown', keyPress);
	});

	export let title;
	export let rank;
	export let modalImageUrl;
	export let axoData;
</script>

<div class="modal" class:is-active={visible} bind:this={content}>
	<div class="modal-background" on:click={() => close()}></div>
	<div class="modal-card">
		<header class="modal-card-head">

			<p class="modal-card-title">
				{title}
				<span class="tag is-success">Rank #{rank}</span>
			</p>
			<button class="delete" aria-label="Close Modal" on:click={() => close()}></button>
		</header>
		<section class="modal-card-body">
			<figure class="image is-square">
				<img src="{modalImageUrl}" />
			</figure>
			<h3 class="subtitle">Attributes</h3>
			{#each Object.keys(axoData) as key}
				{#if key !== 'id' && key !== 'ranking'}
					<b>{key}</b>: {axoData[key]}<br />
				{/if}
			{/each}
		</section>
		<footer class="modal-card-foot">
			<button class="button" on:click={() => close()}>OK</button>
		</footer>
	</div>
</div>