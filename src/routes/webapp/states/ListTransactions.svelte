<script lang="ts">
  import { _ } from "$lib/i18n/i18n";
  import { createEventDispatcher, onMount } from "svelte";
  import ListCard from "$lib/components/ListCard.svelte";
  import { webAppStore, stateStore } from "$lib/webapp/store";
  import LoadingCard from "$lib/components/LoadingCard.svelte";
  import { fade } from "svelte/transition";
  import { formatDate, updateBackButton } from "$lib/webapp/utils";
  import StatusTitle from "$lib/components/StatusTitle.svelte";
  import GraphResume from "$lib/components/GraphResume.svelte";

  const dispatch = createEventDispatcher();

  let loading = true;

  let myGraph: GraphData | undefined;

  onMount(async () => {
    updateBackButton();

    if ($stateStore.transactions && $stateStore.graph) {
      loading = false;
      setMyGraph();
      return;
    }

    const response = await fetch("/webapp/api/groups/" + $stateStore?.group?.id + "?" + new URLSearchParams({ login: $webAppStore?.initData }));

    loading = false;

    if (response.status === 200) {
      const data = await response.json();
      stateStore.set({ ...$stateStore, transactions: data.transactions, graph: data.graph });

      setMyGraph();
    }
  });

  function setMyGraph() {
    myGraph = $stateStore.graph?.filter((m) => m.id === $stateStore.user?.id).pop();
    console.log(myGraph);
  }

  function editTransaction(transaction: TransactionData) {
    stateStore.set({
      ...$stateStore,
      paymentInformation: {
        id: transaction._id,
        description: transaction.description,
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to,
      },
      splitInformation:
        transaction.mode && transaction.splits
          ? {
              mode: transaction.mode,
              splits: transaction.splits,
            }
          : null,
      phase: 2,
    });

    dispatch("next");
  }
</script>

<StatusTitle title={$stateStore?.group?.title} icon="fluent-emoji:classical-building" />

{#if !loading && myGraph}
  <div class="flex flex-col gap-2" in:fade>
    <GraphResume graph={myGraph} />
  </div>
{:else if loading}
  <div in:fade>
    <LoadingCard />
  </div>
{/if}

<p class="my-3 hint">{$_("app.list.transactions")}</p>

{#if !loading}
  <div class="flex flex-col gap-2" in:fade>
    {#each $stateStore.transactions || [] as transaction}
      {#if transaction.to}
        <ListCard
          icon="fluent-emoji:money-with-wings"
          name=""
          subtitle={$_("app.list.payment_paid", {
            nameFrom: transaction.from?.first_name + " " + (transaction.from?.last_name || ""),
            nameTo: transaction.to?.first_name + " " + (transaction.to?.last_name || ""),
            amount: transaction.amount.toFixed(2),
            date: formatDate(transaction.date),
          })}
          postIcon="ic:round-chevron-right"
          on:click={() => editTransaction(transaction)}
        />
      {:else}
        <ListCard
          icon="fluent-emoji:money-bag"
          name={transaction.description}
          subtitle={$_("app.list.paid_by", {
            name: transaction.from?.first_name + " " + (transaction.from?.last_name || ""),
            amount: transaction.amount.toFixed(2),
            date: formatDate(transaction.date),
          })}
          postIcon="ic:round-chevron-right"
          on:click={() => editTransaction(transaction)}
        />
      {/if}
    {/each}
  </div>
{:else}
  <div in:fade>
    <LoadingCard />
  </div>
{/if}
