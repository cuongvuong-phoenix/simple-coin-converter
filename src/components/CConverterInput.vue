<template>
  <div class="converter-input">
    <input
      :id="id ? `${id}__input` : undefined"
      :value="input"
      type="text"
      inputmode="decimal"
      :pattern="INPUT_REGEX_STR"
      spellcheck="false"
      autocomplete="false"
      placeholder="0.0"
      class="converter-input__input"
      @input="event => emit('update:input', (event.target as HTMLInputElement).value)"
      @keydown="onKeyDown($event)"
      @paste="onPaste($event)"
    />

    <div class="converter-input__select-wrapper">
      <select
        :id="id ? `${id}__select` : undefined"
        class="converter-input__select"
        :value="select"
        @change="event => emit('update:select', (event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in options"
          :key="option.address"
          :value="option.address"
          :disabled="option.address === disabledOptionAddress"
        >
          {{ option.symbol }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  export interface ConverterSelectOption {
    address: string;
    symbol: string;
    price: number;
  }
</script>

<script setup lang="ts">
  const { options = [] } = defineProps<{
    // Attributes.
    id?: string;

    input?: string;
    select?: string;
    options?: ConverterSelectOption[];
    disabledOptionAddress?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:input', value?: string): void;
    (e: 'update:select', value?: string): void;
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
  .converter-input {
    display: flex;
    align-items: center;
    min-width: 10rem;
    max-width: 20rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #6b7280;

    &:focus-within {
      border-color: transparent;
      box-shadow: 0 0 0 2px rgb(37 99 235 / 0.5);
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
        $padding-x: 0.5rem;

        &__select {
          background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"%2F%3E%3C%2Fsvg%3E')
              no-repeat right $padding-x center / 1rem,
            #d1d5db;
          min-width: 3ch;
          max-width: 12ch;
          padding: 0.25rem $padding-x;
          padding-right: $padding-x * 2 + 1rem;
          border-radius: 0.25rem;
          cursor: pointer;

          &:focus-visible {
            border-color: transparent;
            box-shadow: 0 0 0 2px rgb(37 99 235 / 0.5);
          }
        }
      }
    }
  }
</style>
