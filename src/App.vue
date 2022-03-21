<template>
  <main class="main">
    <Suspense>
      <CConverter />

      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </main>
</template>

<style lang="scss">
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
</style>
