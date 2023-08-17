<script lang="ts">
  import { fade } from "svelte/transition";

  import { stateStore } from "$lib/webapp/store";
  import SetPaymentInformation from "../states/SetPaymentInformation.svelte";
  import SelectGroup from "../states/SelectGroup.svelte";
  import { fadeOptions, updateBackButton } from "$lib/webapp/utils";
  import Sending from "../states/Sending.svelte";

  updateBackButton();
</script>

{#if $stateStore.phase === 0}
  <div in:fade={fadeOptions}>
    <SelectGroup on:next={updateBackButton} />
  </div>
{:else if $stateStore.phase === 1}
  <div in:fade={fadeOptions}>
    <SetPaymentInformation on:next={updateBackButton} />
  </div>
{:else if $stateStore.phase === 2}
  <div in:fade={fadeOptions}>
    <Sending type="add-payment" />
  </div>
{/if}
