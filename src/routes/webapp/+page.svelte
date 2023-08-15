<script lang="ts">
  import { fade } from "svelte/transition";

  import { StyleFromScheme, LinearProgressIndeterminate, CardClickable } from "m3-svelte";
  import { onMount } from "svelte";
  import { updateWebAppStore, webAppStore, themeStore, updateThemeStore } from "$lib/webapp/store";
  import { _, locale } from "$lib/i18n/i18n";
  import Icon from "@iconify/svelte";
  import SelectPayer from "./states/SelectPayer.svelte";

  let loaded = false;
  let error = false;
  let groups: Group[] = [];

  onMount(async () => {
    updateWebAppStore();
    locale.set($webAppStore?.initDataUnsafe?.user?.language_code);

    document.body.classList.add($webAppStore?.colorScheme);
    updateThemeStore($webAppStore);

    const response = await fetch("/webapp/api", {
      method: "POST",
      body: JSON.stringify({
        data: $webAppStore.initData,
      }),
    });

    if (response.status === 200) {
      const data = (await response.json()) as UserData;

      groups = data.groups;
    } else {
      error = true;
    }

    $webAppStore?.ready();
    $webAppStore?.BackButton.hide();

    $webAppStore?.BackButton.onClick(() => {
      states.pop();
      states = states;

      if (states.length <= 0) $webAppStore?.BackButton.hide();
    });

    loaded = true;
  });

  let states = [] as any[];

  function openGroup(group: Group) {
    states.push(group);
    states = states;

    $webAppStore?.expand();
    $webAppStore?.BackButton.show();
  }
</script>

<StyleFromScheme lightScheme={$themeStore.lightScheme} darkScheme={$themeStore.darkScheme} />

{#if !loaded}
  <div transition:fade class="bg-white dark:bg-neutral-900 fixed inset-0 z-50 flex flex-col">
    <LinearProgressIndeterminate />
  </div>
{/if}

{#if error}
  <div transition:fade class="bg-white dark:bg-neutral-900 fixed inset-0 z-50 flex flex-col p-5 items-center text-center gap-5">
    <span class="text-9xl"><Icon icon="fluent-emoji:thinking-face" /></span>
    {$_("app.error")}
  </div>
{/if}

{#if states.length <= 0}
  <div in:fade>
    <p class="mb-3 text-sm opacity-80 font-semibold">{$_("app.select_group")}</p>

    <div class="flex flex-col gap-2">
      {#each groups as group}
        <CardClickable type="outlined" on:click={() => openGroup(group)}>
          <div class="flex items-center gap-3">
            <Icon class="text-3xl" icon="fluent-emoji:classical-building" />
            <span class="font-bold">{group.title}</span>
          </div>
        </CardClickable>
      {/each}
    </div>
  </div>
{/if}

{#if states.length === 1}
  <div in:fade>
    <SelectPayer group={states[0]} />
  </div>
{/if}
