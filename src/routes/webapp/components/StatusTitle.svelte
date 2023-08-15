<script lang="ts">
  import { _ } from "$lib/i18n/i18n";
  import Icon from "@iconify/svelte";

  export let title: string | undefined;
  export let icon: string;
</script>

{#if title}
  <div class="flex items-center gap-2 border-b border-neutral-500 dark:border-neutral-700 py-2 px-3 mb-3 -mt-3 -mx-3">
    <Icon {icon} class="text-lg" />
    <span class="text-sm font-semibold">{title}</span>
  </div>
{/if}
