<script lang="ts">
  import { _ } from "$lib/i18n/i18n";

  import StatusTitle from "$lib/components/StatusTitle.svelte";

  import { stateStore, webAppStore } from "$lib/webapp/store";
  import { createEventDispatcher } from "svelte";
  import { getNumber, updateBackButton } from "$lib/webapp/utils";
  import Selector from "$lib/components/Selector.svelte";
  import ListCard from "$lib/components/ListCard.svelte";
  import { ripple } from "svelte-ripple-action";

  let group = $stateStore.group as Group;
  let paymentInformation = $stateStore.paymentInformation as PaymentInformation;

  const dispatch = createEventDispatcher();

  let splitMode: SplitMode = $stateStore.splitInformation?.mode || "equally";
  let membersSplit = group.members.map((m) => {
    const splitDataUser = $stateStore.splitInformation?.splits.find((u) => u.id === m.id);
    return { ...m, ...splitDataUser };
  }) as UserSplit[];

  updateBackButton();

  function mainClick() {
    let selectedMembers = membersSplit.filter((m) => m.selected);

    if (selectedMembers.length <= 0) return $webAppStore.showAlert($_("app.error.members_empty"));

    const sum = selectedMembers.reduce((s, m) => (s += getNumber(m.amount)), 0);

    if (splitMode === "unequally" && sum !== paymentInformation.amount) return $webAppStore.showAlert($_("app.error.sum_not_match"));
    if (splitMode === "percentages" && sum !== 100) return $webAppStore.showAlert($_("app.error.percentages_not_full"));

    selectedMembers = selectedMembers.map((m) => ({ ...m, amount: splitMode !== "equally" ? getNumber(m.amount) : null }));

    stateStore.set({
      ...$stateStore,
      phase: $stateStore.paymentInformation?.id ? 4 : 3,
      splitInformation: {
        mode: splitMode,
        splits: selectedMembers,
      },
    });

    dispatch("next");
  }
</script>

<StatusTitle title={group.title} icon="fluent-emoji:classical-building" />
<StatusTitle title={paymentInformation.amount + " ¤"} subtitle={`${paymentInformation.from.first_name || ""} ${paymentInformation.from.last_name || ""}`} icon="fluent-emoji:money-bag" />

<div class="flex flex-col gap-3">
  <p class="hint">{$_("app.set_split_mode")}</p>

  <Selector
    bind:value={splitMode}
    options={[
      { key: "equally", text: $_("app.split_mode.equally") },
      { key: "unequally", text: $_("app.split_mode.unequally") },
      { key: "percentages", text: $_("app.split_mode.percentages") },
      { key: "shares", text: $_("app.split_mode.shares") },
    ]}
  />

  <p class="hint">{$_("app.among")}</p>

  <div class="flex flex-col gap-2">
    {#each membersSplit as member}
      <ListCard
        selectable={true}
        selected={member.selected}
        hasValue={splitMode !== "equally" && member.selected}
        bind:value={member.amount}
        type="number"
        placeholder={"__ " + (splitMode === "percentages" ? "%" : splitMode === "unequally" ? "¤" : splitMode === "shares" ? $_("shares") : "")}
        name={`${member.first_name} ${member.last_name || ""}`}
        on:click={() => (member.selected = !member.selected)}
      />
    {/each}
  </div>

  {#if splitMode === "unequally" || splitMode === "percentages" || splitMode === "shares"}
    <p class="hint">
      {$_("total")}: {splitMode === "unequally" ? "¤" : ""}
      {membersSplit.reduce((s, m) => (s += m.selected ? getNumber(m.amount) : 0), 0)}{splitMode === "percentages" ? "%" : ""}
    </p>
  {/if}

  <button class="mt-3" use:ripple on:click={mainClick}>{$_("save")}</button>
</div>
