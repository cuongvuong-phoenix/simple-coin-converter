computed, import { ref } from 'vue';
<template>
  <div class="converter">
    <!-- "Inputs" -->
    <CConverterInput
      v-model:input="fromInput.input"
      v-model:select="fromInput.select"
      :options="options"
      :disabled-option-address="toInput.select"
    />

    <button type="button" class="button button--circular converter__swap-button" @click="swap()">
      <i-mdi-arrow-down />
    </button>

    <CConverterInput
      v-model:input="toInput.input"
      v-model:select="toInput.select"
      :options="options"
      :disabled-option-address="fromInput.select"
    />
    <!-- END "Inputs" -->

    <!-- "Price" -->
    <div class="converter__price-wrapper">
      <span class="converter__price-left">Price</span>

      <div class="converter__price-right">
        <p>
          <span>{{ `${price}` }}</span
          >&nbsp;<span class="converter__price-token">{{ getOptionById(fromInput.select, options)?.symbol }}</span
          >&nbsp;<span>per</span>&nbsp;<span class="converter__price-token">{{
            getOptionById(toInput.select, options)?.symbol
          }}</span>
        </p>

        <button type="button" class="button button--circular converter__refresh-price-button">
          <i-mdi-autorenew />
        </button>
      </div>
    </div>
    <!-- END "Price" -->
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { type ConverterSelectOption } from '~/components/CConverterInput.vue';

  /* ----------------------------------------------------------------
  Helpers
  ---------------------------------------------------------------- */
  function getOptionById(id: string, options: ConverterSelectOption[]) {
    const index = options.findIndex((opt) => opt.address === id);

    if (index !== -1) {
      return options[index];
    }
  }

  /* ----------------------------------------------------------------
  Inputs
  ---------------------------------------------------------------- */
  const options = ref<ConverterSelectOption[]>([]);

  options.value.push(
    ...[
      {
        address: '1',
        symbol: 'BUSD',
        price: 0.999959589937203804457393434771,
      },
      {
        address: '2',
        symbol: 'BNB',
        price: 394.5470666323749350017044505664,
      },
      {
        address: '3',
        symbol: 'Cake',
        price: 6.57143634311133030104076545695,
      },
    ]
  );

  const fromInput = reactive({
    input: undefined,
    select: options.value[0].address,
  });

  const toInput = reactive({
    input: undefined,
    select: options.value[1].address,
  });

  /* ----------------------------------------------------------------
  Swap
  ---------------------------------------------------------------- */
  function swap() {
    const tempInput = fromInput.input;
    const tempSelect = fromInput.select;

    fromInput.input = toInput.input;
    fromInput.select = toInput.select;

    toInput.input = tempInput;
    toInput.select = tempSelect;
  }

  /* ----------------------------------------------------------------
  Price
  ---------------------------------------------------------------- */
  const price = computed(() => {
    const fromOption = getOptionById(fromInput.select, options.value);
    const toOption = getOptionById(toInput.select, options.value);

    if (fromOption && toOption) {
      return parseFloat((toOption.price / fromOption.price).toFixed(4));
    }

    return 0;
  });
</script>

<style lang="scss">
  .converter {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 6px 1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    &__swap-button {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    &__price-wrapper {
      display: flex;
      align-items: center;
      align-self: stretch;
      margin-top: 1rem;

      .converter {
        &__price-left {
          font-weight: 700;
          color: rgb(37 99 235);
        }

        &__price-right {
          flex: 1 1 0%;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: end;
          margin-left: 1rem;

          .converter {
            &__price-token {
              font-style: italic;
            }

            &__refresh-price-button {
              margin-left: 0.5rem;
              background-color: rgb(37 99 235);
              color: rgb(243 244 246);

              &:hover {
                background-color: rgb(59 130 246);
              }
            }
          }
        }
      }
    }
  }
</style>
