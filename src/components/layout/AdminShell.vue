<template>
  <div class="admin-shell">
    <LeftSidebar />
    <div class="main-content">
      <TopBar :breadcrumb="breadcrumb" />
      <div class="content-area">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LeftSidebar from './LeftSidebar.vue'
import TopBar from './TopBar.vue'

const route = useRoute()
const breadcrumb = computed(() => route.meta.breadcrumb || 'ADMIN / DIALPADBETA / BILLING')
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 24px;
}
</style>
