<script lang="ts">
  import Icon from "@iconify/svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { _ } from "$lib/i18n/i18n";
  import { resetBackButton, updateBackButton } from "$lib/webapp/utils";
  import { onMount } from "svelte";
  import { stateStore, webAppStore } from "$lib/webapp/store";

  let loading = true;
  let error = false;

  export let type: "add-split" | "edit-split" | "add-payment" | "edit-payment" | "delete-payment" | "delete-split" = "add-split";

  updateBackButton();

  onMount(async () => {
    let response;

    response = await fetch(
      "/webapp/api/" +
        (type === "add-split" || type === "edit-split" || type === "delete-split" ? "splits" : "payments") +
        (type === "edit-payment" || type === "edit-split" || type === "delete-payment" || type === "delete-split" ? "/" + $stateStore.paymentInformation?.id : "") +
        "?" +
        new URLSearchParams({ login: $webAppStore.initData, delete: type === "delete-payment" || type === "delete-split" ? "true" : "false" }),
      {
        method: "POST",
        body: JSON.stringify({
          group: $stateStore.group,
          ...$stateStore.paymentInformation,
          ...$stateStore.splitInformation,
        }),
      }
    );

    error = response?.status !== 200;
    loading = false;

    if (!error && (type === "add-payment" || type === "add-split")) {
      resetBackButton();
      $webAppStore?.disableClosingConfirmation();
    } else {
      stateStore.set({
        ...$stateStore,
        paymentInformation: null,
        splitInformation: null,
        transactions: null,
      });
    }
  });
</script>

<div class="flex flex-col items-center text-center gap-5">
  <Icon icon={loading ? "fluent-emoji:money-with-wings" : error ? "fluent-emoji:face-with-spiral-eyes" : "fluent-emoji:partying-face"} class="text-9xl" />
  {#if loading}
    <Loading text={$_("sending")} />
  {/if}
  {#if !loading && error}
    {$_("app.error")}
  {/if}
</div>
