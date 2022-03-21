computed, import { ref } from 'vue';
<template>
  <div class="converter">
    <!-- "Inputs" -->
    <CConverterInput
      v-model:select="fromAddress"
      :input="fromAmount"
      :options="tokens"
      :disabled-option-address="toAddress"
      @update:input="(isFromAmountInputting = true), updateAmountsWithBase($event)"
    />

    <button type="button" class="button button--circular converter__swap-button" @click="swap()">
      <i-mdi-arrow-down />
    </button>

    <CConverterInput
      v-model:select="toAddress"
      :input="toAmount"
      :options="tokens"
      :disabled-option-address="fromAddress"
      @update:input="(isFromAmountInputting = false), updateAmountsWithBase($event)"
    />
    <!-- END "Inputs" -->

    <!-- "Price" -->
    <div class="converter__price-wrapper">
      <span class="converter__price-left">Price</span>

      <div class="converter__price-right">
        <p>
          <span>{{ `${removeScientific(price.toString())}` }}</span
          >&nbsp;<span class="converter__price-token">{{ fromToken?.symbol }}</span
          >&nbsp;<span>per</span>&nbsp;<span class="converter__price-token">{{ toToken?.symbol }}</span>
        </p>

        <button
          type="button"
          class="button button--circular converter__refresh-price-button"
          :class="{ loading: getTokensLoading }"
          @click="refresh()"
        >
          <i-mdi-autorenew />
        </button>
      </div>
    </div>
    <!-- END "Price" -->
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import axios from 'axios';
  import { removeScientific, toDecimal } from '~/helpers';
  import { type ConverterSelectOption } from '~/components/CConverterInput.vue';

  /* ----------------------------------------------------------------
  Helpers
  ---------------------------------------------------------------- */
  function getTokenByAddress(address: string, options: ConverterSelectOption[]) {
    const index = options.findIndex((opt) => opt.address === address);

    if (index !== -1) {
      return options[index];
    }
  }

  function getRandomToken(tokens: ConverterSelectOption[]) {
    if (tokens.length > 0) {
      return tokens[Math.floor(Math.random() * tokens.length)];
    }
  }

  /* ----------------------------------------------------------------
  Tokens
  ---------------------------------------------------------------- */
  const tokens = ref<ConverterSelectOption[]>([]);
  const getTokensLoading = ref(false);

  async function getTokens() {
    try {
      getTokensLoading.value = true;

      const res = (await axios.get<PancakeSwapTokenResponse>('https://api.pancakeswap.info/api/v2/tokens')).data;

      tokens.value = Object.entries(res.data)
        .map(([key, value]) => ({
          address: key,
          symbol: value.symbol,
          price: parseFloat(value.price),
        }))
        .sort((a, b) => (a.symbol < b.symbol ? -1 : 1));
    } catch (error) {
      console.error(error);
    } finally {
      getTokensLoading.value = false;
    }
  }

  await getTokens();

  /* ----------------------------------------------------------------
  From & To
  ---------------------------------------------------------------- */
  const fromAddress = ref<string | undefined>(getRandomToken(tokens.value)?.address);
  const fromToken = computed(() =>
    fromAddress.value ? getTokenByAddress(fromAddress.value, tokens.value) : undefined
  );
  const toAddress = ref<string | undefined>(getRandomToken(tokens.value)?.address);
  const toToken = computed(() => (toAddress.value ? getTokenByAddress(toAddress.value, tokens.value) : undefined));

  const fromAmount = ref('');
  const toAmount = ref('');

  /* ----------------------------------------------------------------
  Price
  ---------------------------------------------------------------- */
  const price = computed(() => {
    if (fromToken.value && toToken.value) {
      return toToken.value.price / fromToken.value.price;
    }

    return 0;
  });

  /* ----------------------------------------------------------------
  Handlers
  ---------------------------------------------------------------- */
  const isFromAmountInputting = ref(true);

  function updateAmountsWithBase(baseAmount?: string) {
    if (!baseAmount) {
      fromAmount.value = '';
      toAmount.value = '';

      return;
    }

    if (isFromAmountInputting.value) {
      fromAmount.value = baseAmount;
      toAmount.value = toDecimal(parseFloat(baseAmount) / price.value).toString();
    } else {
      toAmount.value = baseAmount;
      fromAmount.value = toDecimal(parseFloat(baseAmount) * price.value).toString();
    }
  }

  function swap() {
    const tempAddress = fromAddress.value;
    fromAddress.value = toAddress.value;
    toAddress.value = tempAddress;

    // Move inputting amount to the other one and re-calculate.
    isFromAmountInputting.value = !isFromAmountInputting.value;
    if (isFromAmountInputting.value) {
      updateAmountsWithBase(toAmount.value);
    } else {
      updateAmountsWithBase(fromAmount.value);
    }
  }

  async function refresh() {
    await getTokens();

    isFromAmountInputting.value = true;
    updateAmountsWithBase(fromAmount.value);
  }
</script>

<style lang="scss">
  .converter {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 6px 1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    &__swap-button {
      margin: 0.5rem 0;
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
              font-weight: 700;
            }

            &__refresh-price-button {
              margin-left: 0.5rem;
              background-color: rgb(37 99 235);
              color: rgb(243 244 246);

              &:hover {
                background-color: rgb(59 130 246);
              }

              &.loading {
                animation: spin 1s linear infinite;
              }
            }
          }
        }
      }
    }
  }
</style>
