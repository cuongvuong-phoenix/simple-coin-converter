<template>
  <CHeader />

  <main class="flex items-center justify-center mt-8">
    <Suspense>
      <CConverter />

      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </main>

  <CFooter class="mt-8" />
</template>
