<script>
    import StakeableAxolittle from '../Components/StakeableAxolittle.svelte';
    import {defaultEvmStores, web3, selectedAccount} from 'svelte-web3';
    import {onMount} from 'svelte';
    import Loader from '../Components/Loader.svelte';
    import getAxoData from '../Helpers/GetAxoData';
    import {
        ETH_CHAIN_ID,
        ARB_CHAIN_ID,
        tokenFilters,
        AXOLITTLE_COLLECTION,
        filters,
        sorts,
        AXO_ABI,
        AXO_CONTRACT,
        AXOBRIDGE_CONTRACT,
        AXOBRIDGE_ABI,
        AXOARB_CONTRACT,
        AXOARB_ABI,
        BUBBLE_CONTRACT_ARB,
        BUBBLE_ABI_ARB,
        BUBBLE_CONTRACT_ETH,
        BUBBLE_ABI_ETH,
        BUBBLE_BRIDGE_CONTRACT_ETH,
        BUBBLE_BRIDGE_ABI_ETH,
        BUBBLE_BRIDGE_CONTRACT_ARB,
        BUBBLE_BRIDGE_ABI_ARB,
        currentChainId,
    } from '../stores';

    let list = [];
    let page = 0;
    let axolittleContract;
    let bridgeContract;
    let bubbleContract;
    let bubbleBridgeContract;
    let bubbleBalance;

    function infiniteHandler() {
        console.log('calling infinite handler' + $AXOLITTLE_COLLECTION.length + ' ' + list.length);
        if (list.length < $AXOLITTLE_COLLECTION.length) {
            list = [...list, ...$AXOLITTLE_COLLECTION.slice(page * 20, (page + 1) * 20)];
            page++;
        }
    }

    let ownedTokens = [];
    let isApproved = false;
    let loading = true;
    let chainId = 1;
    onMount(async () => {
        $filters = [];
        $sorts = {};

        defaultEvmStores.setProvider().then(async () => {
			if ($selectedAccount) {
                let walletAddress = $selectedAccount;

                chainId = await $web3.eth.getChainId();
                $currentChainId = chainId;
                console.log("chainId: ", chainId);

                let axoData = await getAxoData(walletAddress);

                let heldTokens = (ETH_CHAIN_ID === chainId) ? axoData.axoHolder.axosHeld : axoData.axoHolder.arbiAxosHeld;

                if (heldTokens) {
                    heldTokens.forEach(it => {
                        $tokenFilters = [...$tokenFilters, parseInt(it.id)];
                        ownedTokens = [...ownedTokens, parseInt(it.id)];
                    });
                }

                let bridgeAddress, bridgeAbi, bubbleAddress, bubbleAbi, bubbleBridgeAddress, bubbleBridgeAbi;
                if (ETH_CHAIN_ID === chainId) {
                    bridgeAddress = AXOBRIDGE_CONTRACT;
                    bridgeAbi = AXOBRIDGE_ABI;
                    axolittleContract = new $web3.eth.Contract(AXO_ABI, AXO_CONTRACT);

                    bubbleAddress = BUBBLE_CONTRACT_ETH
                    bubbleAbi = BUBBLE_ABI_ETH;
                    bubbleBridgeAddress = BUBBLE_BRIDGE_CONTRACT_ETH;
                    bubbleBridgeAbi = BUBBLE_BRIDGE_ABI_ETH;

                    isApproved = await axolittleContract.methods.isApprovedForAll(walletAddress, bridgeAddress).call();
                }
                else if (ARB_CHAIN_ID === chainId) {
                    bridgeAddress = AXOARB_CONTRACT;
                    bridgeAbi = AXOARB_ABI;
                    axolittleContract = null; // bridgeContract is AxoContract for Arbitrum
                    bubbleAddress = BUBBLE_CONTRACT_ARB
                    bubbleAbi = BUBBLE_ABI_ARB;
                    bubbleBridgeAddress = BUBBLE_BRIDGE_CONTRACT_ARB;
                    bubbleBridgeAbi = BUBBLE_BRIDGE_ABI_ARB;

                    isApproved = true;
                }

                console.log(bridgeAbi)
                bridgeContract = new $web3.eth.Contract(bridgeAbi, bridgeAddress);
                bubbleContract = new $web3.eth.Contract(bubbleAbi, bubbleAddress);
                bubbleBridgeContract = new $web3.eth.Contract(bubbleBridgeAbi, bubbleBridgeAddress);
                bubbleBalance = parseFloat($web3.utils.fromWei(await bubbleContract.methods.balanceOf(walletAddress).call()));

                //fix for when all of your axos are staked
                if (!ownedTokens.length) {
                    $tokenFilters = [
                        -1
                    ];
                }

                loading = false;
            }
        })
    });

    let selected = [];

    function selectAxo(id) {
        if (selected.includes(id)) {
            selected = selected.filter(i => i !== id);
        } else {
            selected = [...selected, id];
        }
    }

    async function bridgeBubbles(amount) {
        if (amount <= 0 || isNaN(amount)) {
            return;
        }
        let amountWei = $web3.utils.toWei(amount);
        console.log("bridging bubbles: " + amountWei + " to network: " + chainId);
        let bubbleBridgeAddress = bubbleBridgeContract.options.address;
        let allowance = await bubbleContract.methods.allowance($selectedAccount, bubbleBridgeAddress).call();

        allowance = parseFloat($web3.utils.fromWei(allowance));
        if (allowance < amount) {
            await bubbleContract.methods.approve(bubbleBridgeAddress, $web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))
                .send({from:$selectedAccount})
                .then(val => {
                    console.log("approved bubbleBridge:", val);
                }).catch(err => {
                    console.log(err);
                });
        }

        let gasEstimation = await bubbleBridgeContract.methods.estimateSendFee(
            (ETH_CHAIN_ID === chainId) ? 110 : 101,
            $selectedAccount,
            amountWei,
            false,
            '0x'
        ).call();
        console.log("gas estimation: ", gasEstimation);

        await bubbleBridgeContract.methods.sendFrom(
            (ETH_CHAIN_ID === chainId) ? 110 : 101,
            $selectedAccount,
			amountWei,
			$selectedAccount,
			$selectedAccount,
			'0x'
        ).send({
            from: $selectedAccount,
			value: Math.round(1.03 * gasEstimation.nativeFee)
        }).then(val => {
            console.log(val);
        }).catch(err => {
            console.log(err);
        });

    }


    async function bridge() {
        let steps = [
            {
                name: 'Approval',
                success: isApproved,
                error: false,
                pending: !isApproved
            },
            {
                name: 'Bridge',
                success: false,
                error: false,
                pending: true
            }
        ];

        let adapterParams = (selected.length < 6) ? '0x' : '0x0001' + $web3.eth.abi.encodeParameters(
            ['uint256'],
            [200000 + (75000 * (selected.length - 5))]
        ).replace('0x', '');

        let gasEstimation = await bridgeContract.methods.estimateSendFee(
            (ETH_CHAIN_ID === chainId) ? 110 : 101,
            $selectedAccount,
            selected,
            false,
            adapterParams
        ).call();

        let perTokenEstimation = await bridgeContract.methods.estimateSendFee(
            (ETH_CHAIN_ID === chainId) ? 110 : 101,
            $selectedAccount,
            [selected[0]],
            false,
            '0x'
        ).call();

        modalInstance.openModal(BridgeContent, {
            isStaking: true,
            steps: steps,
            axos: selected,
			gasAmount: perTokenEstimation.nativeFee
        });

        await setApproval().then(() => {
            steps[0].pending = false;
            steps[0].success = true;
        }).catch(err => {
            console.log(err);
            steps[0].pending = false;
            steps[0].error = true;
        });

        modalInstance.updateParams({steps: steps});

        console.log(`Bridging will cost ${gasEstimation.nativeFee} wei`);

        await bridgeContract.methods.sendFrom(
            (ETH_CHAIN_ID === chainId) ? 110 : 101,
			$selectedAccount,
			selected,
			$selectedAccount,
			$selectedAccount,
			adapterParams
		).send({
            from: $selectedAccount,
			value: Math.round(1.03 * gasEstimation.nativeFee)
        }).then(val => {
            console.log(val);
            steps[1].success = true;
            steps[1].pending = false;
            modalInstance.updateParams({steps: steps});
        }).catch(err => {
            console.log(err);
            steps[1].error = true;
            steps[1].pending = false;
            modalInstance.updateParams({steps: steps});
        });
	}

    async function setApproval() {
        if (isApproved) return;
        if (ARB_CHAIN_ID === chainId) {
            isApproved = true;
            return;
		}
        await axolittleContract.methods.setApprovalForAll(bridgeContract.options.address, true).send({
            from: $selectedAccount
        }).then(val => {
            console.log(val);
            isApproved = true;
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }

    import GenericModal from '../Components/Modal/GenericModal.svelte';
    import BridgeContent from '../Components/Modal/BridgeContent.svelte';
    import NetworkSwitcher from '../Components/NetworkSwitcher.svelte';
    import BubbleBridge from '../Components/BubbleBridge.svelte';

    let modalInstance = false;

</script>
<section class="section is-medium has-text-centered" class:is-hidden={!loading}>
	<div class="container">
		<h2 class="subtitle">Loading Wallet</h2>
		<p>Please connect your wallet to view this page.</p>
	</div>
</section>
<section class="section is-medium has-text-centered" class:is-hidden={loading}>
	<GenericModal bind:this={modalInstance} />
	<div class="container">
        <NetworkSwitcher/>

        <h2 class="subtitle">Bubble Bridging</h2>
        <div class="columns mt-3">
            <div class="column">
                <p>
                    Enter amount of Bubbles to bridge to
                    {#if ETH_CHAIN_ID === chainId}
                        <strong>Arbitrum</strong>
                    {:else if ARB_CHAIN_ID === chainId}
                        <strong>Ethereum</strong>
                    {:else}
                        <strong>Unknown network (please change network in MetaMask)</strong>
                    {/if}
                </p>
            </div>
        </div>
        <BubbleBridge bubbleBalance={bubbleBalance} bridgeBubbles={bridgeBubbles}/>

        <h2 class="subtitle">Axolittle Bridging</h2>
        {#if ARB_CHAIN_ID === chainId}
            <div class="container" style="margin-bottom: 3em;">
                <div class="message is-success">
                    <div class="message-header">

                    </div>
                    <div class="message-body">
                        Ensure all listings on Trove are canceled before bridging back to Ethereum. <a href="https://trove.treasure.lol/collection/axolittles" target="_blank">Cancel here</a>
                    </div>
                </div>
            </div>
	    {/if}

        <p>
			Only Axolittles that are <strong>unstaked</strong> are eligible to bridge.
		</p>
        <div class="columns mt-3">
            <div class="column">
                <p>
                    Select Axolittles to bridge to
                    {#if ETH_CHAIN_ID === chainId}
                        <strong>Arbitrum</strong>
                    {:else if ARB_CHAIN_ID === chainId}
                        <strong>Ethereum</strong>
                    {:else}
                        <strong>Unknown network (please change network in MetaMask)</strong>
                    {/if}
                </p>
            </div>
        </div>

		<p style="margin-top: 1em;">viewing {$AXOLITTLE_COLLECTION.length} out of 9,999</p>

		{#if ownedTokens.length}
			<h2 class="subtitle">Eligible Axolittles</h2>
		{/if}
		<div class="columns is-multiline is-mobile">
			{#each list as item}
				<div class="column is-one-quarter-tablet is-half-mobile">
					<StakeableAxolittle isStaked={false} id="{item.id}" doOnClick={() => selectAxo(item.id)} />
				</div>
			{/each}
			<Loader callback={infiniteHandler} />
		</div>
	</div>
	{#if selected.length}
		<div class="sticky-footer">
			<div class="details">
				<p>
					You are selecting...
				</p>
				<p>
					<strong>{selected.length}</strong> Axolittles to bridge
				</p>
			</div>
			<div class="buttons">
				<button class="button is-warning" on:click={bridge}>Bridge {selected.length}</button>
			</div>
		</div>
	{/if}
</section>


<style lang="scss">

  .buttons {
    &.has-text-centered {
      justify-content: center;
    }

    .button {
      .icon {
        margin-right: 0.25em;
      }
    }
  }

  .sticky-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    padding: 20px;
    background: #212121;
    display: flex;

    .details {
      display: flex;
      flex-basis: 66.66%;

      p {
        display: block;
      }
    }

    .buttons {
      display: flex;
      flex-basis: 33.33%;
    }
  }
</style>