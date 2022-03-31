<template>
  <button
    class="inline-flex items-center justify-center p-1 rounded-full border"
    :class="{
      'border-primary-default bg-primary-default text-bg-default hover:bg-primary-lighter': variant === 'full',
      'border-current text-primary-default hover:text-primary-lighter': variant === 'outlined',
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts">
  export const buttonVariants = ['full', 'outlined'] as const;
  export type ButtonVariant = typeof buttonVariants[number];
</script>

<script setup lang="ts">
  const { variant = buttonVariants[0] } = defineProps<{
    variant?: ButtonVariant;
  }>();
</script>
