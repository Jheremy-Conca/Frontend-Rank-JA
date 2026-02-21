<template>
  <div class="app-layout">
    <Header />

    <main class="flex-grow-1 p-4">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
