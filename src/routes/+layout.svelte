<script lang="ts">
  import "../app.css";

  import Loading from "$lib/components/Loading.svelte";
  import { fade } from "svelte/transition";
  import { _, locale } from "$lib/i18n/i18n";
  import { onMount } from "svelte";
  import { stateStore, webAppStore } from "$lib/webapp/store";
  import { fadeOptions, resetBackButton, updateBackButton } from "$lib/webapp/utils";
  import Icon from "@iconify/svelte";

  let loaded = false;
  let error = false;

  onMount(async () => {
    if (!$webAppStore) {
      webAppStore.set(window.Telegram.WebApp);
      locale.set($webAppStore?.initDataUnsafe?.user?.language_code);
      document.body.classList.add($webAppStore?.colorScheme);
    }

    if (!$stateStore.user) {
      const checkLogin = await fetch("/webapp/api/login?" + new URLSearchParams({ login: $webAppStore.initData }));

      error = checkLogin.status !== 200;

      if (!error) stateStore.set({ ...$stateStore, user: (await checkLogin.json()).user });
    }

    $webAppStore?.ready();

    updateBackButton();

    $webAppStore?.enableClosingConfirmation();

    resetBackButton();
    $webAppStore?.BackButton.onClick(() => {
      $webAppStore?.MainButton.offClick();
      $webAppStore?.MainButton.hide();

      stateStore.set({ ...$stateStore, phase: $stateStore.phase >= 4 ? 1 : Math.max(0, $stateStore.phase - 1) });

      updateBackButton();
    });

    loaded = true;

    stateStore.set({ ...$stateStore, phase: 0 });
  });
</script>

{#if !loaded}
  <div class="flex flex-col items-center" in:fade={fadeOptions}>
    <Loading text={$_("app.loading_login")} />
  </div>
{/if}

{#if loaded && error}
  <div in:fade={fadeOptions} class="flex flex-col p-5 items-center text-center gap-5">
    <span class="text-9xl"><Icon icon="fluent-emoji:face-with-raised-eyebrow" /></span>
    {$_("app.login_error")}
  </div>
{/if}

{#if loaded && !error}
  <div class="max-w-screen-md p-3">
    <slot />
  </div>
{/if}
