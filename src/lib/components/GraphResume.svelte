<script lang="ts">
  import { _ } from "$lib/i18n/i18n";
  import Icon from "@iconify/svelte";
  import { ripple } from "svelte-ripple-action";

  export let debts: Debt[];

  let expanded = false;

  $: debtsSum = debts.reduce((s, d) => (s += d.amount), 0);
</script>

<div class={"p-3 flex flex-col text-white rounded-xl " + (debtsSum <= 0 ? "bg-green-500" : "bg-red-500")} use:ripple on:click={() => (expanded = !expanded)} role="button" on:keypress tabindex="0">
  <span class="text-sm">{debtsSum < 0 ? $_("app.must_receive") : debtsSum > 0 ? $_("app.must_give") : $_("app.is_pair")}</span>
  {#if debtsSum !== 0}
    <span class="font-bold text-2xl">{Math.abs(debtsSum).toFixed(2)} ¤</span>
    <div class="flex justify-center text-xl">
      <Icon icon={expanded ? "ic:round-keyboard-arrow-up" : "ic:round-keyboard-arrow-down"} />
    </div>

    {#if expanded}
      <div class="flex flex-col mt-2">
        {#each debts as debt}
          {#if debt.amount !== 0}
            <div class="text-xs flex items-center gap-2">
              <span class="font-bold">{Math.abs(debt.amount).toFixed(2)} ¤</span>
              <Icon icon={debt.amount > 0 ? "fluent-emoji:right-arrow" : "fluent-emoji:left-arrow"} class="text-base" />
              <span>{debt.first_name} {debt.last_name || ""}</span>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  {/if}
</div>
