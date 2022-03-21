<template>
  <div class="converter__input-wrapper">
    <input
      type="text"
      inputmode="decimal"
      :pattern="INPUT_REGEX_STR"
      spellcheck="false"
      autocomplete="false"
      placeholder="0.0"
      class="converter__input-wrapper__input"
      @keydown="onKeyDown($event)"
      @paste="onPaste($event)"
    />
  </div>
</template>

<script setup lang="ts">
  const { modelValue } = defineProps<{
    modelValue?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value?: string): void;
  }>();

  /* ----------------------------------------------------------------
  Handlers
  ---------------------------------------------------------------- */
  const INPUT_REGEX_STR = '^[0-9]*[.]?[0-9]*$';
  const INPUT_REGEX = new RegExp(INPUT_REGEX_STR);

  function onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      // Whitespace keys.
      'Tab',
      // Navigation keys.
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      // Editing keys.
      'Backspace',
      'Clear',
      'Copy',
      'Cut',
      'Delete',
      'Paste',
      'Redo',
      'Undo',
    ];
    if (
      allowedKeys.includes(event.key) ||
      // Ctrl + a.
      (event.ctrlKey && event.key === 'a') ||
      // Ctrl + c.
      (event.ctrlKey && event.key === 'c') ||
      // Ctrl + x.
      (event.ctrlKey && event.key === 'x') ||
      // Ctrl + v.
      (event.ctrlKey && event.key === 'v') ||
      // Ctrl + Shift + v.
      (event.ctrlKey && event.shiftKey && event.key === 'v')
    ) {
      return;
    }

    const maybeValue = (event.target as HTMLInputElement).value + event.key;

    if (INPUT_REGEX.test(maybeValue)) {
      return;
    }

    event.preventDefault();
  }

  function onPaste(event: ClipboardEvent) {
    const data = event.clipboardData?.getData('text');

    if (data !== undefined && !INPUT_REGEX.test(data)) {
      event.preventDefault();
    }
  }
</script>

<style lang="scss">
  .converter__input-wrapper {
    display: flex;
    border-radius: 0.25rem;
    border: 1px solid #6b7280;
    padding: 0.5rem;

    &:focus-within {
      border-color: transparent;
      box-shadow: 0 0 0 2px rgb(249 115 22 / 0.5);
    }

    &__input {
      display: block;
      width: 100%;
      border: none;
    }
  }
</style>
