<script lang="ts">
  import Icon from "@iconify/svelte";

  export let type: string = "text";
  export let value: string;
  export let name: string;
  export let icon: string | null = null;

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }
</script>

<div class="flex items-center gap-3" on:click role="textbox" tabindex="0" on:keypress>
  {#if icon}
    <Icon {icon} class="text-2xl opacity-80" />
  {/if}
  <input class="flex-1 bg-neutral-500 dark:bg-white bg-opacity-5 dark:bg-opacity-5 border border-tg px-3 py-2 rounded-lg border-active-primary" use:typeAction bind:value {name} placeholder={name} />
</div>
