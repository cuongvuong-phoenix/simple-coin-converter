<template>
  <footer class="footer">
    <p>
      Built using <em><strong>Vue 3</strong></em>
    </p>

    <div class="footer__line-2">
      <a
        href="https://github.com/cuongvuong-phoenix/simple-coin-converter"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
      >
        <i-mdi-github class="footer__icon" />
      </a>
    </div>
  </footer>
</template>

<style lang="scss">
  .footer {
    text-align: center;

    &__line-2 {
      margin-top: 0.5rem;

      .footer {
        &__link {
          display: inline-block;
          line-height: 0;

          &:hover {
            color: rgb(37 99 235);
          }

          .footer {
            &__icon {
              width: 2rem;
              height: 2rem;
            }
          }
        }
      }
    }
  }
</style>
