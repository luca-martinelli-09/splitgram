<script lang="ts">
  import { CardClickable } from "m3-svelte";
  import { _ } from "$lib/i18n/i18n";
  import Icon from "@iconify/svelte";

  export let groups: Group[];

  function openGroup(group: Group) {}
</script>

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
