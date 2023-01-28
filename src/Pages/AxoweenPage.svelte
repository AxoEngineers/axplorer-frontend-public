<script>
    import AxoweenCard from "../Components/AxoweenCard.svelte";
    import GenericModal from '../Components/Modal/GenericModal.svelte';
	import ClaimAxoweenContent from '../Components/Modal/ClaimAxoweenContent.svelte';
    import { defaultEvmStores, connected, web3, selectedAccount } from 'svelte-web3';
    import { onMount } from 'svelte';

	let modalInstance = false;
	let walletConnected = false;
	let hasClaimed = false;
	let numAxosHeld = 0;
	let walletAddress = false;
	let axoweenCallFailed = false;

	let TEST_SKIP_API = false;
	async function getAxoweenData() {
		if (TEST_SKIP_API)
		{
			hasClaimed=false;
			numAxosHeld=5;
		}
		else {
			let axoweenCall = await fetch(`https://axo-backend-pvj2l.ondigitalocean.app/check_axomass?address=${walletAddress}`);
			if (!axoweenCall.ok)
			{
				axoweenCallFailed = true;
			}
			else {
				let axoweenJson = await axoweenCall.json();

				hasClaimed = axoweenJson.has_claimed;
				numAxosHeld = axoweenJson.n_axos;
			}
		}
	}

	onMount(async () => {
		defaultEvmStores.setProvider().then(async () => {
			if ($selectedAccount) {
				walletAddress = $selectedAccount;
				walletConnected = true;
				await getAxoweenData();
			}
		});
	});

	function connect() {
		defaultEvmStores.setProvider().then(async () => {
			if ($selectedAccount) {
				walletAddress = $selectedAccount;
				walletConnected = true;
				await getAxoweenData();
			}
		});
	}

	async function signMessage() {
		return $web3.eth.requestAccounts()
		.then((accounts) =>
			$web3.eth.personal.sign("Reserving Yuletide Axos Airdrop", accounts[0])
		)
		.then(async (signature) => {
			if (!TEST_SKIP_API)
			{
				await fetch(`https://axo-backend-pvj2l.ondigitalocean.app/claim_axomass?address=${walletAddress}`);
			}
			hasClaimed = true;
		})
		.then( () => { return; })
		.catch(err => {
			console.log(err);
            throw err;
		})
	}
	async function claim() {
		let steps = [
            {
                name: 'Reserve',
				success: hasClaimed,
				error: false,
				pending: !hasClaimed
			}
		];
        modalInstance.openModal(ClaimAxoweenContent, {
            steps: steps,
			numAxos: numAxosHeld
		});

        await signMessage().then(() => {
            steps[0].pending = false;
            steps[0].success = true;
            modalInstance.updateParams({ steps: steps });
		}).catch(err => {
            console.log(err);
            steps[0].pending = false;
            steps[0].error = true;
            modalInstance.updateParams({ steps: steps });
		});

	}
</script>

<GenericModal bind:this={modalInstance} />

<div class="axoween-bg-image"></div>
<div class="axoween-page">
	<AxoweenCard isConnected={walletConnected}
					isClaimed={hasClaimed}
					callFailed={axoweenCallFailed}
					claimAirdrop={claim}
					retryConnect={connect}>
	</AxoweenCard>
</div>


<style lang="scss">

.axoween-page {
	overflow:auto
}
.axoween-bg-image {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
	background-image: url('/media/axoween/Background.png');
  }
</style>

