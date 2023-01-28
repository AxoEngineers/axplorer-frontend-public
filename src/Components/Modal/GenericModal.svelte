<script>
    let show = false;
    export let params = {};
	let component;
    let title = false;

    export function closeModal() {
        component = null;
        params = {};
        show = false;
    }

	export function openModal(comp, props) {
        component = comp;
        params = props;
        show = true;
	}

    export function updateParams(props) {
        params = {
            ...params,
			...props
        };
	}
</script>

<div class="modal" class:is-active={show}>
	<div class="modal-background" on:click={closeModal}></div>
	<div class="modal-card">
		<header class="modal-card-head" class:notitle={title === false}>
			{#if title}
				<p class="modal-card-title">{title}</p>
			{/if}
			<button class="delete" aria-label="close" on:click={closeModal}></button>
		</header>
		<section class="modal-card-body">
			<svelte:component this={component} params={params} />
		</section>
	</div>
</div>