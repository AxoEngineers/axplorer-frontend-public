import { writable, derived } from 'svelte/store';
//import json from "@rollup/plugin-json";

export const ETH_CHAIN_ID = 1;
export const ARB_CHAIN_ID = 42161;
export let currentChainId = writable(ETH_CHAIN_ID);

import rarities from './ABI/rarities.json';
export const RARITIES = rarities;

import legacystaking from './ABI/legacyStaking.json';
export const LEGACY_STAKING_ABI = legacystaking;
export const LEGACY_STAKING_CONTRACT = '0x1ca6e4643062e67ccd555fb4f64bee603340e0ea';

import axolittles from './ABI/axolittles.json';
export const AXO_ABI = axolittles;
export const AXO_CONTRACT = '0xf36446105fF682999a442b003f2224BcB3D82067';

import stakingeth from "./ABI/stakingEth.json";
export const STAKING_ABI_ETH = stakingeth;
export const STAKING_CONTRACT_ETH = '0xbfcA4318f4d47f8A8e49e16c0f2B466c46EAC184';

import airdrop from './ABI/airdrop.json';
export const AIRDROP_ABI = airdrop;
export const AIRDROP_CONTRACT = '0x184FAe65b0D0bBbA559326FEb7D9FCC6e8f31df7';

export const AXOBRIDGE_CONTRACT = '0x49dC480b512BB675A6F0e8bBab39e47096902e4D';
import axobridge from './ABI/axobridge.json';
export const AXOBRIDGE_ABI = axobridge;

export const AXOARB_CONTRACT = '0xcC737e05A6B5d94caFA523E55C5689631C8e97A4';
import axoarb from './ABI/axoArb.json';
export const AXOARB_ABI = axoarb;

export const STAKING_CONTRACT_ARB = "0xDb4736eE9Cf22d79501e4C079ac8ca090694274b";
import stakingarb from './ABI/stakingArb.json';
export const STAKING_ABI_ARB = stakingarb;

export const BUBBLE_CONTRACT_ARB = "0xBB113ad1B7C4615CcF59A5D8A4062335038D6ee5";
import bubblearb from './ABI/bubbleArb.json';
export const BUBBLE_ABI_ARB = bubblearb;

export const BUBBLE_CONTRACT_ETH = "0x58f46f627c88a3b217abc80563b9a726abb873ba";
import bubbleeth from './ABI/bubbleEth.json';
export const BUBBLE_ABI_ETH = bubbleeth;


export const BUBBLE_BRIDGE_CONTRACT_ETH = "0x67e82738f07d9063Cacf69f853a0e6151014620B"; // update me
import bubblebridgeeth from './ABI/bubbleBridgeEth.json';
export const BUBBLE_BRIDGE_ABI_ETH = bubblebridgeeth;

export const BUBBLE_BRIDGE_CONTRACT_ARB = "0x23f8dA239084247d564c912c5A0372B901985DAe"; // update me
import bubblebridgearb from './ABI/bubbleBridgeArb.json';
export const BUBBLE_BRIDGE_ABI_ARB = bubblebridgearb;

export const sorts = writable({});

export const setSort = (by, type) => {
    $sorts = {
        by: by,
        type: type
    };
};

export const removeSort = (by, type) => {

}

export let filters = writable([]);
export let tokenFilters = writable([]);

import axolittletraits from "./ABI/axotraits.json";
import { component_subscribe } from 'svelte/internal';
export const AXOLITTLE_TRAITS = writable(axolittletraits);
export const AXOLITTLE_COLLECTION = derived(
    [sorts, filters, tokenFilters, AXOLITTLE_TRAITS],
    ([$sorts, $filters, $tokenFilters, $AXOLITTLE_TRAITS]) => $AXOLITTLE_TRAITS.sort((a, b) => {
        let equal = a[$sorts.by] === b[$sorts.by];
        let lessThan = a[$sorts.by] < b[$sorts.by];
        if (equal) return 0;

        if ($sorts.type === 'asc') {
            if (lessThan) return -1;
            return 1;
        }

        if (lessThan) return 1;
        return -1;

    }).filter(x => {
        let passesAllFilters = true;
        $filters.forEach(filter => {
            if (x[filter.type] !== filter.value) {
                passesAllFilters = false;
            }
        });
        return passesAllFilters;
    }).filter(x => {
        if ($tokenFilters.length) {
            return $tokenFilters.includes(x.id);
        }
        return true;
    })
)

