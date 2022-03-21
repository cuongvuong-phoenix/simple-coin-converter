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
          width: 4rem;
          height: 4rem;
          color: rgb(37 99 235);
        }
      }
    }

    &__title {
      margin-top: 1rem;
      text-align: center;
      font-weight: 700;
      font-size: 1.875rem;
      line-height: 2.25rem;
      color: rgb(37 99 235);
    }
  }
</style>
