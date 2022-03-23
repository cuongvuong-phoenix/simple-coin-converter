<template>
  <div class="converter-input">
    <input
      :value="amount"
      type="text"
      inputmode="decimal"
      :pattern="INPUT_REGEX_STR"
      spellcheck="false"
      autocomplete="off"
      placeholder="0.0"
      class="converter-input__input"
      @input="event => emit('update:amount', (event.target as HTMLInputElement).value)"
      @keydown="onKeyDown($event)"
      @paste="onPaste($event)"
    />

    <div class="converter-input__select-wrapper">
      <select
        class="converter-input__select"
        :value="selectedTokenAddress"
        @change="event => emit('update:selectedTokenAddress', (event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in tokens"
          :key="option.address"
          :value="option.address"
          :disabled="option.address === disabledTokenAddress"
        >
          {{ option.symbol }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  export interface ConverterToken {
    address: string;
    symbol: string;
    price: number;
  }
</script>

<script setup lang="ts">
  const { tokens = [] } = defineProps<{
    amount?: string;
    selectedTokenAddress?: string;
    tokens?: ConverterToken[];
    disabledTokenAddress?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:amount', value?: string): void;
    (e: 'update:selectedTokenAddress', value?: string): void;
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

    if (data !== undefined) {
      const maybeValue = (event.target as HTMLInputElement).value + data;

      if (!INPUT_REGEX.test(maybeValue)) {
        event.preventDefault();
      }
    }
  }
</script>

<style lang="scss">
  .converter-input {
    display: flex;
    align-items: center;
    min-width: 10rem;
    max-width: 20rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid $color--bg--darkest;

    &:focus-within {
      border-color: transparent;
      box-shadow: 0 0 0 2px rgba($color--primary, 0.5);
    }

    &__input {
      display: block;
      flex: 1 1 0%;
      min-width: 0;
    }

    &__select-wrapper {
      position: relative;
      margin-left: 1rem;

      .converter-input {
        &__select {
          $padding-x: 0.5rem;

          background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"%2F%3E%3C%2Fsvg%3E')
              no-repeat right $padding-x center / 1rem,
            $color--bg--darker;
          min-width: 3ch;
          padding: 0.25rem $padding-x;
          padding-right: $padding-x * 2 + 1rem;
          border-radius: 0.25rem;
          cursor: pointer;

          &:focus-visible {
            border-color: transparent;
            box-shadow: 0 0 0 2px rgba($color--primary, 0.5);
          }
        }
      }
    }
  }
</style>
