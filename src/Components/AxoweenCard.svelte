<script>
    export let isConnected, isClaimed, callFailed, claimAirdrop, retryConnect;

</script>


<div class="scaling-div">
    <span>
    {#if callFailed}
        <button>
            <img src="/media/axoween/Error-Button.png" alt="Oops" />
        </button>
    {:else}
        {#if isConnected}
            {#if isClaimed}
                <button>
                    <img src="/media/axoween/AlreadyClaimed-Button.png" alt="connect" />
                </button>
            {:else}
                <button on:click={() => claimAirdrop()}>
                    <img src="/media/axoween/Claim-Button.png" alt="connect" />
                </button>
            {/if}
        {:else}
            <button on:click={() => retryConnect()}>
                <img src="/media/axoween/Connect-Button.png" alt="connect" />
            </button>
        {/if}
    {/if}
</span>
</div>

  <style lang="scss">

.scaling-div {
    width:100%;
    position: absolute; /* or absolute */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-bottom:40%;
}
.scaling-div span {
    background:url("/media/axoween/Card.png") no-repeat center center;
    background-size:contain;
    min-width: 400px;
    min-height: 400px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    display:block;
}

.scaling-div button {
    background: transparent;
    border: transparent;
    z-index: 999;
    position: relative;
    top: 89%;
    left: 50%;
    transform: translate(-50%, -50%);
    //padding-bottom:40%;
    width:20%;
    min-width: 200px;
    min-height: 200px;
}


//     .card-header-title {
//         font-size: 4.0vw
//     }

// .content {
//     text-align: center;
//     font-size: 2.0vw
// }
// .card-footer-item {
//     font-size: 2.0vw
// }
// button:disabled,
//     button[disabled] {
//         border: 1px solid #999999;
//         background-color: darkgrey;
//         color: #fff;
//         padding: 10px;
//         cursor: not-allowed;
//     }
  </style>