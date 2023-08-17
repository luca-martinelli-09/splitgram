<script lang="ts">
  import { _ } from "$lib/i18n/i18n";
  import { createEventDispatcher } from "svelte";
  import ListCard from "$lib/components/ListCard.svelte";
  import { webAppStore, stateStore } from "$lib/webapp/store";
  import LoadingCard from "$lib/components/LoadingCard.svelte";
  import { fade } from "svelte/transition";
  import { updateBackButton } from "$lib/webapp/utils";

  const dispatch = createEventDispatcher();

  let loading = true;

  webAppStore.subscribe(async () => {
    updateBackButton();

    if ($stateStore.groups) return (loading = false);

    const response = await fetch("/webapp/api/groups?" + new URLSearchParams({ login: $webAppStore?.initData }));

    loading = false;

    if (response.status === 200) stateStore.set({ ...$stateStore, groups: (await response.json()).groups });
  });

  function selectGroup(group: Group) {
    stateStore.set({ ...$stateStore, group: group, phase: 1 });
    dispatch("next");
  }
</script>

<p class="mb-3 hint">{$_("app.select_group")}</p>

{#if !loading}
  <div class="flex flex-col gap-2" in:fade>
    {#each $stateStore.groups || [] as group}
      <ListCard on:click={() => selectGroup(group)} icon="fluent-emoji:classical-building" name={group.title} />
    {/each}
  </div>
{:else}
  <div in:fade>
    <LoadingCard />
  </div>
{/if}
