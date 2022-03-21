import { ref } from 'vue';
<template>
  <div class="converter">
    <CConverterInput v-model:input="fromInput" v-model:select="fromSelect" :options="fromOptions" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { type ConverterSelectOption } from '~/components/CConverterInput.vue';

  const fromOptions = ref<ConverterSelectOption[]>([
    {
      id: '1',
      text: 'BUSD',
    },
    {
      id: '2',
      text: 'BNB',
    },
    {
      id: '3',
      text: 'CAKE',
    },
  ]);

  const fromInput = ref<string>();
  const fromSelect = ref<string>(fromOptions.value[0].id);
</script>

<style lang="scss">
  .converter {
    min-width: 10rem;
    max-width: 20rem;
    padding: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 6px 1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
</style>
