<script lang="ts">
  import { CircleQuestionMark } from '@lucide/svelte';

  const { children } = $props();

  let modal: HTMLDialogElement | undefined;
</script>

<CircleQuestionMark
  size={12}
  class="hover:text-primary cursor-pointer text-gray-600 transition"
  onclick={() => modal?.showModal()} />

<dialog class="modal modal-bottom sm:modal-middle" bind:this={modal}>
  <div class="modal-box w-dvw max-w-none">
    {@render children?.()}
    <div class="modal-action">
      <form method="dialog" class="flex w-full justify-center">
        <button class="btn btn-sm btn-soft btn-primary btn-wide rounded-full">
          Close
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
