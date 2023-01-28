<script>
	import {filters, RARITIES} from "../stores";

    export let onFilter;

    function doAddFilter(selected) {
        let val = selected.split('#');
        $filters = [...$filters, {
            type: val[0],
            value: val[1]
        }];
        onFilter();
    }

    function doRemoveFilter(filter) {
		$filters = $filters.filter(f => JSON.stringify(f) !== JSON.stringify(filter));
        onFilter();
	}

    let selected;
</script>

<div class="filters field is-grouped">
	<div class="control">
		<label class="label">Filters:</label>
		<div class="select">
			<select bind:value={selected} on:change="{doAddFilter(selected)}">
				{#each Object.entries(RARITIES[0]) as [group, items]}
					<optgroup label="{group}">
						{#each Object.entries(items).sort((a, b) => a[1] - b[1]) as [name, count]}
							<option value="{group}#{name}">{name} ({count})</option>
						{/each}
					</optgroup>
				{/each}
			</select>
		</div>
	</div>
	<p class="control active-filters">
		{#each $filters as filter}
			<span class="tag is-success">
				{filter.type}: {filter.value}
				<button class="delete is-small" on:click={doRemoveFilter(filter)}></button>
			</span>
		{/each}
	</p>
</div>

<style lang="scss">
	.tag {
	  height: 40px;
	  margin-top: 32px;

	  &:not(:first-child) {
		margin-left: 0.5rem;
	  }

	  button {
		margin-left: 0.5rem;
		margin-right: -0.125rem;
	  }
	}
</style>