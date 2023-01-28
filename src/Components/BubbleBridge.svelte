<script>
    import {currentChainId, ETH_CHAIN_ID} from '../stores';
    export let bubbleBalance;
    export let bridgeBubbles;

    let amountBubbles, currentNetworkName, targetNetworkName;

    $: {
        currentNetworkName = (ETH_CHAIN_ID == $currentChainId) ? "Ethereum" : "Arbitrum";
        targetNetworkName = (ETH_CHAIN_ID == $currentChainId) ? "Arbitrum" : "Ethereum";
    }

    function setMax() {
        amountBubbles = bubbleBalance;
    }

    function bridgeBubblesInternal() {
        amountBubbles = document.getElementById("inputId").value;
        bridgeBubbles(amountBubbles);
    }

</script>

<div class="columns is-mobile mt-5">
    <div class="column is-offset-one-quarter is-half message is-info">
        <div class="columns message-header">
            <p class="column">From: {currentNetworkName}</p>
            <p class="column"></p>
            <button class="balanceButton column button is-light" on:click={() => setMax()}>Balance: {bubbleBalance}</button>
        </div>
        <div class="field has-addons">
            <div class="control">
                <input id="inputId" class="input is-normal" placeholder="Enter Amount" type="number" value={amountBubbles} >
            </div>
            <div class="control">
                <button class="button" on:click={() => bridgeBubblesInternal()}>
                    Bridge to {targetNetworkName}
                </button>
            </div>
        </div>
    </div>
</div>


<style lang="scss">
    $message-header-padding: 0.1em .1em !default;

    .balanceButton {
        padding: 0px
    }

    .message-header {
        padding: $message-header-padding;
    }

    .input {
        width: 100%;
    }
    .field {
        justify-content: center;
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
    }

</style>