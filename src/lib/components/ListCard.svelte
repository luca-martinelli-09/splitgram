<script lang="ts">
  import Icon from "@iconify/svelte";

  import "svelte-ripple-action/ripple.css";
  import { ripple } from "svelte-ripple-action";

  export let icon: string | null = null;
  export let postIcon: string | null = null;
  export let name: string | undefined;

  export let selectable = false;
  export let selected = false;

  export let value: string | number | null = "";
  export let hasValue = false;
  export let placeholder = "";
  export let type: string = "text";

  export let subtitle: string | null = null;

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }
</script>

<div
  class={"p-3 bg-neutral-500 dark:bg-white bg-opacity-5 dark:bg-opacity-5 border border-tg ripple-effect rounded-xl" + (selectable && selected ? " outline-tg" : "")}
  on:click
  on:keydown
  role="button"
  tabindex="0"
  use:ripple
>
  <div class="flex items-center gap-3">
    {#if icon}
      <Icon class="text-3xl" {icon} />
    {/if}
    <div class="flex-1 flex flex-col">
      <span class="font-bold flex-1">{name || ""}</span>
      {#if subtitle}
        <span class="text-xs opacity-80">{subtitle}</span>
      {/if}
    </div>
    {#if selectable}
      <Icon class={"text-lg" + (selected ? " text-primary" : "")} icon={selected ? "ic:round-check-circle" : "ic:outline-radio-button-unchecked"} />
    {:else if postIcon}
      <Icon class={"text-xl"} icon={postIcon} />
    {/if}
  </div>
  {#if hasValue}
    <div class="mt-2 -mx-3 -mb-3">
      <input
        use:typeAction
        on:click={(e) => e.stopPropagation()}
        on:keypress={() => {}}
        bind:value
        {placeholder}
        class="w-full bg-neutral-500 dark:bg-white bg-opacity-5 dark:bg-opacity-5 border-t border-tg px-3 py-2 outline-none"
      />
    </div>
  {/if}
</div>
