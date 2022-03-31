<template>
  <div class="flex flex-col items-center p-8 border border-bg-darker rounded shadow-lg">
    <!-- "Inputs" -->
    <CConverterInput
      :amount="fromAmount"
      :selected-token-address="fromAddress"
      :tokens="tokens"
      :disabled-token-address="toAddress"
      @update:amount="(isFromAmountInputting = true), updateAmountsWithBase($event)"
      @update:selected-token-address="
        (fromAddress = $event), (isFromAmountInputting = true), updateAmountsWithBase(fromAmount)
      "
    />

    <CButton variant="outlined" type="button" title="Swap 2 tokens" class="my-2" @click="swap()">
      <i-mdi-arrow-down />
    </CButton>

    <CConverterInput
      :amount="toAmount"
      :selected-token-address="toAddress"
      :tokens="tokens"
      :disabled-token-address="fromAddress"
      @update:amount="(isFromAmountInputting = false), updateAmountsWithBase($event)"
      @update:selected-token-address="
        (toAddress = $event), (isFromAmountInputting = false), updateAmountsWithBase(toAmount)
      "
    />
    <!-- END "Inputs" -->

    <!-- "Price" -->
    <div class="flex items-center self-stretch mt-4">
      <span class="font-bold text-primary-default">Price</span>

      <div class="flex-1 min-w-0 flex items-center justify-end ml-4">
        <p>
          <span>{{ `${removeScientific(price.toString())}` }}</span
          >&nbsp;<span class="italic font-bold">{{ fromToken?.symbol }}</span
          >&nbsp;<span>per</span>&nbsp;<span class="italic font-bold">{{ toToken?.symbol }}</span>
        </p>

        <CButton
          variant="full"
          type="button"
          title="Refresh tokens"
          class="ml-2"
          :class="{ 'animate-spin': getTokensLoading }"
          @click="refresh()"
        >
          <i-mdi-autorenew class="w-4 h-4" />
        </CButton>
      </div>
    </div>
    <!-- END "Price" -->
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, shallowRef } from 'vue';
  import axios from 'axios';
  import { removeScientific, toDecimal } from '~/helpers';
  import { type ConverterToken } from '~/components/CConverterInput.vue';

  /* ----------------------------------------------------------------
  Helpers
  ---------------------------------------------------------------- */
  function getTokenByAddress(address: string, tokens: ConverterToken[]) {
    const index = tokens.findIndex((opt) => opt.address === address);

    if (index !== -1) {
      return tokens[index];
    }
  }

  function getRandomToken(tokens: ConverterToken[], excludedAddresses: string[] = []) {
    const validTokens = tokens.filter((token) => !excludedAddresses.includes(token.address));

    if (validTokens.length > 0) {
      return validTokens[Math.floor(Math.random() * validTokens.length)];
    }
  }

  /* ----------------------------------------------------------------
  Tokens
  ---------------------------------------------------------------- */
  const tokens = shallowRef<ConverterToken[]>([]);
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
  const toAddress = ref<string | undefined>(
    getRandomToken(tokens.value, fromAddress.value ? [fromAddress.value] : [])?.address
  );
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
