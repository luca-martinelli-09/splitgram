<script lang="ts">
  import { _ } from "$lib/i18n/i18n";

  import StatusTitle from "$lib/components/StatusTitle.svelte";

  import type TelegramBot from "node-telegram-bot-api";
  import { webAppStore, stateStore } from "$lib/webapp/store";
  import FieldText from "$lib/components/FieldText.svelte";
  import { createEventDispatcher } from "svelte";
  import { getNumber, updateBackButton } from "$lib/webapp/utils";
  import { ripple } from "svelte-ripple-action";
  import Selector from "$lib/components/Selector.svelte";

  let group = $stateStore.group as Group;

  const dispatch = createEventDispatcher();

  let amount = $stateStore.paymentInformation?.amount.toString() || "";
  let selectedFrom = group?.members.findIndex((m) => m.id === ($stateStore.paymentInformation?.from.id || $stateStore.user?.id));
  let selectedTo = group?.members.findIndex((m) => m.id === $stateStore.paymentInformation?.to?.id);

  updateBackButton();

  const mainClick = () => {
    if (selectedFrom >= 0 && selectedFrom < group.members.length && selectedTo >= 0 && selectedTo < group.members.length) setPaymentInformation(group.members[selectedFrom], group.members[selectedTo]);
    else $webAppStore?.showAlert($_("app.error.payment_members_empty"));
  };

  function setPaymentInformation(memberFrom: TelegramBot.User, memberTo: TelegramBot.User) {
    let numAmount = getNumber(amount, true);

    if (isNaN(numAmount)) return $webAppStore?.showAlert($_("app.error.amount_nan"));
    if (numAmount <= 0) return $webAppStore?.showAlert($_("app.error.amount_negative"));

    stateStore.set({
      ...$stateStore,
      paymentInformation: {
        ...$stateStore.paymentInformation,
        amount: numAmount,
        from: memberFrom,
        to: memberTo,
      },
      phase: $stateStore.paymentInformation?.id ? 4 : 2,
    });

    dispatch("next");
  }

  function deleteTransaction() {
    $webAppStore.showConfirm($_("app.sure"), (sure: boolean) => {
      if (!sure) return;

      stateStore.set({
        ...$stateStore,
        phase: 5,
      });
      dispatch("next");
    });
  }
</script>

<StatusTitle title={group.title} icon="fluent-emoji:classical-building" />

<div class="flex flex-col gap-3">
  <p class="hint">{$_("amount")}</p>
  <FieldText name={$_("amount")} type="number" bind:value={amount} icon="tabler:currency" />

  <p class="hint">{$_("from")}</p>
  <Selector bind:value={selectedFrom} options={group.members.map((m, i) => ({ key: i, text: `${m.first_name} ${m.last_name || ""}`.trim() }))} />

  <p class="hint">{$_("to")}</p>
  <Selector bind:value={selectedTo} options={group.members.map((m, i) => ({ key: i, text: `${m.first_name} ${m.last_name || ""}`.trim() }))} />

  <button class="mt-3" use:ripple on:click={mainClick}>{$_("continue")}</button>

  {#if $stateStore.paymentInformation?.id}
    <button class="-mt-1 delete" use:ripple on:click={deleteTransaction}>{$_("delete")}</button>
  {/if}
</div>
