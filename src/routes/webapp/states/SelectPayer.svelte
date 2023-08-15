<script lang="ts">
  import { _ } from "$lib/i18n/i18n";
  import { CardClickable } from "m3-svelte";
  import Icon from "@iconify/svelte";
  import StatusTitle from "../components/StatusTitle.svelte";

  export let group: Group;
</script>

<StatusTitle title={group.title} icon="fluent-emoji:classical-building" />

{$_("app.select_group")}

<div class="flex flex-col gap-2 mt-3">
  {#each group.members as member}
    <CardClickable type="outlined">
      <div class="flex gap-2 text-sm items-center">
        <Icon icon="fluent-emoji:man-mage" class="text-2xl" />
        {member.first_name}
      </div>
    </CardClickable>
  {/each}
</div>
