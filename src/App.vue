<template>
  <CHeader />

  <main class="main">
    <Suspense>
      <CConverter />

      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </main>

  <CFooter />
</template>

<style lang="scss">
  #app {
    min-height: 100vh;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
  }

  .footer {
    margin-top: 2rem;
  }
</style>
