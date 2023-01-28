<script>
    import { currentChainId, ETH_CHAIN_ID, ARB_CHAIN_ID } from '../stores';

    // eth mainnet = 0x01
    async function switchToChain(chainId) {
        console.log("Trying to switch to network: ", chainId);
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: '0x' + chainId.toString(16)
                    }
                ]
            });

            setTimeout(() => {
                //$currentChainId = chainId;
                window.location.reload()
            }, 1000);
        }
        catch (error) {
            if (4902 === error.code) {
                try {
                    if (chainId === ARB_CHAIN_ID) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: chainId,
                                    rpcUrl: 'https://arb1.arbitrum.io/rpc'
                                }
                            ]
                        });

                        setTimeout(() => {
                            window.location.reload()
                            //$currentChainId = chainId;
                        }, 1000);
                    } else {
                        console.log("error, trying to add unexpected chain")
                    }

                }
                catch (addError) {
                    console.log(addError);
                }
            }
            console.log(error);
        }
	}

</script>

<div class="columns mt-3">
    <div class="column">
        {#if ETH_CHAIN_ID === $currentChainId}
            <button class="button is-info" on:click={() => switchToChain(ARB_CHAIN_ID)}>Switch to Arbitrum</button>
        {:else}
            <button class="button is-info" on:click={() => switchToChain(ETH_CHAIN_ID)}>Switch to Ethereum</button>
        {/if}
    </div>
</div>