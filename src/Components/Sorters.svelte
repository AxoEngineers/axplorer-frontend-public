<script>
	import {sorts, RARITIES} from "../stores";

	let sortTypes = {
        "Lowest ID to Highest ID": {
            by: 'id',
            type: 'asc'
        },
        "Highest ID to Lowest ID": {
            by: 'id',
            type: 'desc'
        },
	    "Least Rare to Most Rare": {
	        by: 'ranking',
			type: 'desc'
		},
		"Most Rare to Least Rare": {
	        by: 'ranking',
			type: 'asc'
		}
	}

    export let onSort;

	let sort, sorted;

    function doSetSort(selected) {
        if (selected === '') return;

        $sorts = sortTypes[selected];
        sort = selected;
        onSort();
    }

    function doRemoveSort() {
        $sorts = {};
        sort = '';
        onSort();
	}

	$: {
        sorted = $sorts.length > 0;
	}

    let selected;
</script>

<div class="sorts field is-grouped">
	<div class="control">
		<label class="label">Sort By:</label>
		<div class="select">
			<select bind:value={selected} on:change="{doSetSort(selected)}">
				{#each Object.entries(sortTypes) as [displayName, sortObject]}
					<option value="{displayName}">{displayName}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style lang="scss">

</style>