<script>
    import StakeableAxolittle from '../Components/StakeableAxolittle.svelte';
    import { defaultEvmStores, web3, selectedAccount } from 'svelte-web3';
    import { onMount } from 'svelte';
    import Loader from '../Components/Loader.svelte';
    import getAxoData from '../Helpers/GetAxoData';

    import { ETH_CHAIN_ID,
        ARB_CHAIN_ID,
        tokenFilters,
        AXOLITTLE_COLLECTION,
        filters,
        sorts,
        STAKING_ABI_ETH,
        STAKING_CONTRACT_ETH,
        LEGACY_STAKING_CONTRACT,
        LEGACY_STAKING_ABI,
        AXO_ABI,
        AXO_CONTRACT,
        AIRDROP_ABI,
        AIRDROP_CONTRACT,
        STAKING_ABI_ARB,
        STAKING_CONTRACT_ARB,
        AXOBRIDGE_ABI,
        AXOBRIDGE_CONTRACT,
        BUBBLE_CONTRACT_ETH,
        BUBBLE_CONTRACT_ARB,
AXOARB_ABI,
AXOARB_CONTRACT,
currentChainId } from '../stores';

    let list = [];
    let page = 0;

    let stakeContract = false;
    let coreContract = false;
    let legacyContract = false;
    let airdropContract = false;

    function infiniteHandler() {
        console.log('calling infinite handler' + $AXOLITTLE_COLLECTION.length + ' ' + list.length);
        if (list.length < $AXOLITTLE_COLLECTION.length) {
            list = [...list, ...$AXOLITTLE_COLLECTION.slice(page * 20, (page + 1) * 20)];
            page++;
        }
    }

    let ownedTokens = [];
    let stakedTokens = [];

    let isApproved = false;
    let isApprovedForLegacy = false;
    let loading = true;
    let onMainnet = true;

    //default state
    let userAirdrop = { hasClaimed: true };

    let unclaimedBubbles = 0;

    let totalStaked = -1;
    let baseRate = 0.015;
    let totalStakedByUser = 0;
    let chainId;

    onMount(async () => {
        $filters = [];
        $sorts = {};

        defaultEvmStores.setProvider().then(async () => {
            if ($selectedAccount) {
                let walletAddress = $selectedAccount;
                chainId = await $web3.eth.getChainId();
                $currentChainId = chainId;

                // AxoData
                let axoData = await getAxoData(walletAddress);
                let heldTokens = (ETH_CHAIN_ID === chainId) ? axoData.axoHolder.axosHeld : axoData.axoHolder.arbiAxosHeld;

                if (heldTokens)
                {
                    heldTokens.forEach(it => {
                        $tokenFilters = [ ...$tokenFilters, parseInt(it.id) ];
                        ownedTokens = [ ...ownedTokens, parseInt(it.id) ];
                    });
                }
                let stakedTokensV1, stakedTokensV2, stakedTokensArb;
                if (ETH_CHAIN_ID === chainId ) {
                    stakedTokensV1 = axoData.axoHolder.axosStakedV1;
                    stakedTokensV2 = axoData.axoHolder.axosStakedV2;
                    if (stakedTokensV1) {
                        stakedTokensV1.forEach(it => {
                            stakedTokens = [ ...stakedTokens, { version: 1, id: parseInt(it.id) } ];
                        });
                    }

                    if (stakedTokensV2) {
                        stakedTokensV2.forEach(it => {
                            stakedTokens = [ ...stakedTokens, { version: 2, id: parseInt(it.id) } ];
                        });
                        totalStakedByUser = stakedTokensV2.length;
                    }

                }
                else if (ARB_CHAIN_ID === chainId) {
                    stakedTokensArb = axoData.axoHolder.arbiAxosStaked;
                    if (stakedTokensArb) {
                        stakedTokensArb.forEach(it => {
                            stakedTokens = [ ...stakedTokens, { id: parseInt(it.id) } ];
                        });
                        totalStakedByUser = stakedTokensArb.length;
                    }

                }

                // Bubble Airdrop // going away soon
                let airdropCall = await fetch(`https://axo-backend-pvj2l.ondigitalocean.app/airdrop?address=${walletAddress}`);
                userAirdrop = await airdropCall.json();
                if (userAirdrop.balance > 0) {
                    let airdropBn = new $web3.utils.BN(userAirdrop.balance);
                    userAirdrop.balanceBn = userAirdrop.balance;
                    userAirdrop.balance = parseFloat($web3.utils.fromWei(airdropBn));
                }
                airdropContract = new $web3.eth.Contract(AIRDROP_ABI, AIRDROP_CONTRACT);

                // Contracts
                if (ETH_CHAIN_ID == chainId) {
                    stakeContract = new $web3.eth.Contract(STAKING_ABI_ETH, STAKING_CONTRACT_ETH);
                    coreContract = new $web3.eth.Contract(AXO_ABI, AXO_CONTRACT);
                    legacyContract = new $web3.eth.Contract(LEGACY_STAKING_ABI, LEGACY_STAKING_CONTRACT);

                    isApprovedForLegacy = await coreContract.methods.isApprovedForAll(walletAddress, LEGACY_STAKING_CONTRACT).call();
                    totalStaked = parseInt(await coreContract.methods.balanceOf(LEGACY_STAKING_CONTRACT).call());
                }
                else if (ARB_CHAIN_ID == chainId) {
                    stakeContract = new $web3.eth.Contract(STAKING_ABI_ARB, STAKING_CONTRACT_ARB);
                    coreContract = new $web3.eth.Contract(AXOARB_ABI, AXOARB_CONTRACT);

                    totalStaked = 0;
                }

                isApproved = await coreContract.methods.isApprovedForAll(walletAddress, stakeContract.options.address).call();
                totalStaked += parseInt(await coreContract.methods.balanceOf(stakeContract.options.address).call());
                console.log(`${totalStaked} staked axos`);

                stakeContract.methods.checkReward(walletAddress).call().then(resp => {
                    let bn = new $web3.utils.BN(resp ?? 0);
                    unclaimedBubbles = parseFloat($web3.utils.fromWei(bn));

                    if (unclaimedBubbles > 0) {
                        setInterval(() => {
                            // baserate / 30s per block * # staked
                            unclaimedBubbles += ((baseRate / 30) * totalStakedByUser);
                        }, 1000);
                    }
                })

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

    let selectedStakedV1 = [];
    let selectedStaked = [];
    let selectedUnstaked = [];

    function selectAxo(staked, id) {
        if (staked) {
            if (id.version === 1) {
                selectLegacyStakedAxo(id.id);
			}
            else {
                if (selectedStaked.includes(id.id)) {
                    selectedStaked = selectedStaked.filter(i => i !== id.id);
                }
                else {
                    selectedStaked = [...selectedStaked, id.id];
                }
			}
		}
        else {
            if (selectedUnstaked.includes(id)) {
                selectedUnstaked = selectedUnstaked.filter(i => i !== id);
            }
            else {
                selectedUnstaked = [...selectedUnstaked, id];
            }
		}
	}

    function selectLegacyStakedAxo(id) {
        if (selectedStakedV1.includes(id)) {
            selectedStakedV1 = selectedStakedV1.filter(i => i !== id);
		}
        else {
            selectedStakedV1 = [...selectedStakedV1, id];
		}
	}

    async function stakeAll() {
        let steps = [
            {
                name: 'Approval',
				success: isApproved,
				error: false,
				pending: !isApproved
			},
            {
                name: 'Stake',
				success: false,
				error: false,
				pending: true
			}
		];
        modalInstance.openModal(StakeOrUnstakeContent, {
            isStaking: true,
            steps: steps,
			axos: selectedUnstaked
		});

        await setApproval().then(() => {
            steps[0].pending = false;
            steps[0].success = true;
		}).catch(err => {
            console.log(err);
            steps[0].pending = false;
            steps[0].error = true;
		});

        modalInstance.updateParams({ steps: steps });
        await stakeContract.methods.stake(selectedUnstaked).send({
			from: $selectedAccount
		}).then(val => {
            console.log(val);
			steps[1].success = true;
            steps[1].pending = false;
            modalInstance.updateParams({ steps: steps });
		}).catch(err => {
            console.log(err);
            steps[1].error = true;
            steps[1].pending = false;
            modalInstance.updateParams({ steps: steps });
		});
	}

    async function unstakeAllLegacy() {
        let steps = [
            {
                name: 'Approval',
                success: isApprovedForLegacy,
                error: false,
                pending: !isApprovedForLegacy
            },
            {
                name: 'Unstake',
                success: false,
                error: false,
                pending: true
            }
        ];
        modalInstance.openModal(StakeOrUnstakeContent, {
            isStaking: false,
            steps: steps,
            axos: selectedStakedV1
        });
        await setApprovalForLegacy().then(() => {
            steps[0].pending = false;
            steps[0].success = true;
        }).catch(err => {
            console.log(err);
            steps[0].pending = false;
            steps[0].error = true;
        });

        modalInstance.updateParams({ steps: steps });
        if (steps[0].error) return;
        await legacyContract.methods.unstake(selectedStakedV1).send({
            from: $selectedAccount
        }).then(val => {
            console.log(val);
            steps[1].success = true;
            steps[1].pending = false;
            modalInstance.updateParams({ steps: steps });
        }).catch(err => {
            console.log(err);
            steps[1].error = true;
            steps[1].pending = false;
            modalInstance.updateParams({ steps: steps });
        });
	}

    async function unstakeAll() {
        let steps = [
            {
                name: 'Approval',
                success: isApproved,
                error: false,
                pending: !isApproved
            },
            {
                name: 'Unstake',
                success: false,
                error: false,
                pending: true
            }
        ];
        modalInstance.openModal(StakeOrUnstakeContent, {
            isStaking: false,
            steps: steps,
            axos: selectedStaked
        });

        await setApproval().then(() => {
            steps[0].pending = false;
            steps[0].success = true;
        }).catch(err => {
            console.log(err);
            steps[0].pending = false;
            steps[0].error = true;
        });

        modalInstance.updateParams({ steps: steps });
        if (steps[0].error) return;
        await stakeContract.methods.unstake(selectedStaked).send({
            from: $selectedAccount
        }).then(val => {
            console.log(val);
            steps[1].success = true;
            steps[1].pending = false;
            modalInstance.updateParams({ steps: steps });
        }).catch(err => {
            console.log(err);
            steps[1].error = true;
            steps[1].pending = false;
            modalInstance.updateParams({ steps: steps });
        });
    }

    async function setApproval() {
        if (isApproved) return;
        await coreContract.methods.setApprovalForAll(stakeContract.options.address, true).send({
			from: $selectedAccount
		}).then(val => {
            console.log(val);
            isApproved = true;
		}).catch(err => {
            console.log(err);
            throw err;
		});
	}

    async function setApprovalForLegacy() {
        if (isApprovedForLegacy) return;
        await coreContract.methods.setApprovalForAll(LEGACY_STAKING_CONTRACT, true).send({
            from: $selectedAccount
        }).then(val => {
            console.log(val);
            isApprovedForLegacy = true;
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }

    async function claimBubbles() {
        let steps = [
            {
				success: false,
				pending: true,
				error: false,
				name: 'Claim'
			}
		];
        modalInstance.openModal(ClaimContent, {
            isAirdrop: false,
			amount: unclaimedBubbles,
            steps: steps
        });
        await stakeContract.methods.claim().send({
			from: $selectedAccount
		}).then(val => {
            console.log(val);
            steps[0].success = true;
            steps[0].pending = false;
            modalInstance.updateParams({ steps: steps });
            unclaimedBubbles = 0;
		}).catch(err => {
            console.log(err);
            steps[0].error = true;
            steps[0].pending = false;
            modalInstance.updateParams({ steps: steps });
		});
	}

    async function claimLegacyBubbles() {
        let steps = [
            {
                success: false,
                pending: true,
                error: false,
                name: 'Claim'
            }
        ];
        modalInstance.openModal(ClaimContent, {
            isAirdrop: true,
            amount: userAirdrop.balance,
            steps: steps
        });
		await airdropContract.methods.claimAirdrop(userAirdrop.balanceBn, userAirdrop.proof).send({
			from: $selectedAccount
		}).then(val => {
            console.log(val);
            steps[0].success = true;
            steps[0].pending = false;
            modalInstance.updateParams({ steps: steps });
            userAirdrop.hasClaimed = true;
		}).catch(err => {
            console.log(err);
            steps[0].error = true;
            steps[0].pending = false;
            modalInstance.updateParams({ steps: steps });
		})
	}
    import GenericModal from '../Components/Modal/GenericModal.svelte';
    import StakeOrUnstakeContent from '../Components/Modal/StakeOrUnstakeContent.svelte';
    import ClaimContent from '../Components/Modal/ClaimContent.svelte';
    import NetworkSwitcher from '../Components/NetworkSwitcher.svelte';

    let modalInstance = false;

    async function addToMetamask() {
        if ((typeof window.ethereum) !== 'undefined') {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: (ETH_CHAIN_ID == chainId) ? BUBBLE_CONTRACT_ETH : BUBBLE_CONTRACT_ARB,
                        symbol: 'BUBBLE',
                        decimals: 18,
                        image: `https://storage.googleapis.com/axolittles-uswest/icons/Icon_BubblesToken_512px.png`
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }
</script>
<section class="section is-medium has-text-centered" class:is-hidden={onMainnet}>
	<div class="container">
		<h2 class="subtitle"><span class="tag is-danger">ERROR</span> You are not on Ethereum Mainnet</h2>
		<p>Please swap to Ethereum Mainnet to view this page.</p>
	</div>
</section>
<section class="section is-medium has-text-centered" class:is-hidden={!loading || !onMainnet}>
	<div class="container">
		<h2 class="subtitle">Loading Wallet</h2>
		<p>Please connect your wallet to view this page.</p>
	</div>
</section>
<section class="section is-medium has-text-centered" class:is-hidden={loading}>
	<!-- <div class="container" style="margin-bottom: 3em;">
		<div class="message is-success">
			<div class="message-header">

			</div>
			<div class="message-body">
				Staking version 2 has been released! <a href="https://medium.com/@axolittles/staking-airdrops-and-l2-roadmap-ee43d6dd204f" target="_blank">Click here to learn more</a>.
			</div>
		</div>
	</div> -->

	<GenericModal bind:this={modalInstance} />

    <NetworkSwitcher/>

	{#if totalStaked > 0}
	<div class="container" style="margin-bottom: 5em;">
		<div class="columns is-centered">
			<div class="column is-full-mobile is-half-desktop">
				<h2 class="subtitle">Staking Progress</h2>
				<p>
					<strong>{totalStaked} / 10,000</strong>
					<progress class="progress is-success" value={totalStaked} max="10000"></progress>
				</p>
			</div>
		</div>
	</div>
	{/if}
	<div class="container">
		<h2 class="subtitle">Axolittle Staking</h2>
		<p>
			Please note that changes may not reflect immediately. If you have successfully staked or unstaked an Axolittle and it shows incorrectly, it should correct itself within a few minutes.
		</p>
		<div class="columns mt-3">
			{#if unclaimedBubbles > 0}
				<div class="column">
					<h2 class="subtitle">Unclaimed $BUBBLE</h2>
					<p>
						You currently have <strong>{unclaimedBubbles.toFixed(4)}</strong> $BUBBLE to claim.
					</p>
					<p class="buttons has-text-centered">
						<button class="button is-primary" on:click={claimBubbles}>Claim $BUBBLE</button>
						<button class="button is-primary is-outlined" on:click={addToMetamask}>
							<span class="icon">
								<i class="fas fa-wallet"></i>
							</span>
							Add to MetaMask
						</button>
					</p>
				</div>
			{/if}
			{#if !userAirdrop.hasClaimed && userAirdrop.balance > 0 && ETH_CHAIN_ID == chainId}
				<div class="column">
					<h2 class="subtitle">Airdropped $BUBBLE</h2>
					<p>
						You have an airdrop of <strong>{userAirdrop.balance.toFixed(4)}</strong> $BUBBLE to claim from the legacy staking contract.
					</p>
					<p class="buttons has-text-centered">
						<button class="button is-primary" on:click={claimLegacyBubbles}>Claim $BUBBLE</button>
						<button class="button is-primary is-outlined" on:click={addToMetamask}>
							<span class="icon">
								<i class="fas fa-wallet"></i>
							</span>
							Add to MetaMask
						</button>
					</p>

				</div>
			{/if}
		</div>

		<p style="margin-top: 5em;">viewing {$AXOLITTLE_COLLECTION.length + stakedTokens.length} out of 9,999</p>

		{#if stakedTokens.length}
			<h2 class="subtitle">Staked Axolittles</h2>
		<div class="columns is-multiline is-mobile">
			{#each stakedTokens as item}
				<div class="column is-one-quarter-tablet is-half-mobile selected">
					<StakeableAxolittle isStaked={true} id={item.id} version={item.version} chainId={chainId} doOnClick={() => selectAxo(true, item)} />
				</div>
			{/each}
		</div>
		{/if}

		{#if stakedTokens.length}
			<h2 class="subtitle">Unstaked Axolittles</h2>
		{/if}
		<div class="columns is-multiline is-mobile">
			{#each list as item}
				<div class="column is-one-quarter-tablet is-half-mobile">
					<StakeableAxolittle isStaked={false} id="{item.id}" doOnClick={() => selectAxo(false, item.id)} />
				</div>
			{/each}
			<Loader callback={infiniteHandler} />
		</div>
	</div>
	{#if selectedStaked.length || selectedUnstaked.length || selectedStakedV1.length}
	<div class="sticky-footer">
		<div class="details">
			<p>
				You are selecting...
			</p>
			{#if selectedStaked.length}
				<p>
					<strong>{selectedStaked.length}</strong> staked Axolittles
				</p>
			{/if}
			{#if selectedStakedV1.length}
				<p>
					<strong>{selectedStakedV1.length} legacy</strong> staked Axolittles
				</p>
			{/if}
			{#if selectedUnstaked.length}
				<p>
					<strong>{selectedUnstaked.length}</strong> unstaked Axolittles
				</p>
			{/if}
		</div>
		<div class="buttons">
			{#if selectedStaked.length}
				<button class="button is-warning" on:click={unstakeAll}>Unstake {selectedStaked.length}</button>
			{/if}
			{#if selectedStakedV1.length}
				<button class="button is-warning" on:click={unstakeAllLegacy}>Unstake {selectedStakedV1.length} legacy</button>
			{/if}
			{#if selectedUnstaked.length}
				<button class="button is-warning" on:click={stakeAll}>Stake {selectedUnstaked.length}</button>
			{/if}
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