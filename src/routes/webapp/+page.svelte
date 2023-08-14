<script lang="ts">
  import { fade } from "svelte/transition";

  import { StyleFromScheme, LinearProgressIndeterminate, Button, Card, CardClickable } from "m3-svelte";
  import { onMount } from "svelte";
  import { updateWebAppStore, webAppStore } from "$lib/webapp/store";
  import { defaultTheme, getSchemes } from "$lib/webapp/theme";
  import type TelegramBot from "node-telegram-bot-api";
  import { _, locale } from "$lib/i18n/i18n";
  import Icon from "@iconify/svelte";

  let theme = defaultTheme;
  let loaded = false;
  let error = false;
  let groups: TelegramBot.Chat[] = [];

  onMount(async () => {
    updateWebAppStore();
    locale.set($webAppStore?.initDataUnsafe?.user?.language_code);

    document.body.classList.add($webAppStore?.colorScheme);
    if ($webAppStore?.themeParams?.button_color) theme = getSchemes($webAppStore?.themeParams.button_color, $webAppStore?.colorScheme === "dark");

    const response = await fetch("/webapp/api", {
      method: "POST",
      body: JSON.stringify({
        data: $webAppStore.initData,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();

      groups = data.groups || [];
    } else {
      error = true;
    }

    loaded = true;
  });
</script>

<StyleFromScheme lightScheme={theme.lightScheme} darkScheme={theme.darkScheme} />

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

<div class="flex flex-col gap-2">
  {#each groups as group}
    <CardClickable type="outlined">
      <div class="flex items-center gap-3">
        <Icon class="text-3xl" icon="fluent-emoji:money-bag" />
        <span class="font-bold">{group.title}</span>
      </div>
    </CardClickable>
  {/each}
</div>
