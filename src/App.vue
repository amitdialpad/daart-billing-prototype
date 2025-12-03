<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Main app component - router-view will render pages
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--dt-color-surface-secondary, #F5F5F5);
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
