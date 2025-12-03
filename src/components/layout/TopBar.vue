<template>
  <div class="top-bar">
    <div class="breadcrumb">
      {{ breadcrumb }}
    </div>

    <div class="search-box">
      <svg class="search-icon" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
      <span class="search-text">Search Help Center</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  breadcrumb: {
    type: String,
    default: 'ADMIN / DIALPADBETA / BILLING'
  }
})
</script>

<style scoped>
.top-bar {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E5E5;
  min-height: 60px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  color: #888888;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.search-box {
  padding: 8px 16px;
  background-color: #F5F5F5;
  border-radius: 20px;
  min-width: 250px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box:hover {
  background-color: #EFEFEF;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: #888888;
}

.search-text {
  color: #888888;
  font-size: 14px;
}
</style>
