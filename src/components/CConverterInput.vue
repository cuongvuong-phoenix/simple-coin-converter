<template>
  <div
    class="flex items-center min-w-[10rem] max-w-[20rem] p-2 rounded border border-bg-darkest focus-within:ring-2 focus-within:ring-primary-default/50 focus-within:border-transparent"
  >
    <input
      :value="amount"
      type="text"
      inputmode="decimal"
      :pattern="INPUT_REGEX_STR"
      spellcheck="false"
      autocomplete="off"
      placeholder="0.0"
      class="block flex-1 min-w-0"
      @input="event => emit('update:amount', (event.target as HTMLInputElement).value)"
      @keydown="onKeyDown($event)"
      @paste="onPaste($event)"
    />

    <div class="ml-4">
      <select
        :value="selectedTokenAddress"
        class="min-w-[3ch] py-1 pl-2 pr-8 rounded select"
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

<style lang="postcss" scoped>
  .select {
    background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"%2F%3E%3C%2Fsvg%3E')
        no-repeat right 0.5rem center / 1rem,
      theme('colors.bg.darker');
  }
</style>
