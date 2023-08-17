<script lang="ts">
  import { _ } from "$lib/i18n/i18n";

  export let graph: GraphData;

  $: debtsSum = graph.debts.reduce((s, d) => (s += d.amount), 0);
</script>

<div class={"p-3 flex flex-col text-white rounded-xl " + (debtsSum <= 0 ? "bg-green-500" : "bg-red-500")}>
  <span class="text-sm">{debtsSum < 0 ? $_("app.must_receive") : debtsSum > 0 ? $_("app.must_give") : $_("app.is_pair")}</span>
  {#if debtsSum !== 0}
    <span class="font-bold text-2xl">{Math.abs(debtsSum).toFixed(2)} ¤</span>
  {/if}
</div>
