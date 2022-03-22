<template>
  <header class="header">
    <div class="header__icon-wrapper">
      <IArcticonsPriceConverter class="header__icon" />
    </div>

    <h1 class="header__title">SIMPLE COIN CONVERTER</h1>
  </header>
</template>

<style lang="scss">
  .header {
    &__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      .header {
        &__icon {
          width: 6rem;
          height: 6rem;
          color: $color--primary;
        }
      }
    }

    &__title {
      margin-top: 1rem;
      font-size: 1.875rem;
      line-height: 2.25rem;
      font-weight: 700;
      color: $color--primary;
      text-align: center;
    }
  }
</style>
