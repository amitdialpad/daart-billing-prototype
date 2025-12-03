<template>
  <aside class="left-sidebar">
    <div class="sidebar-header">
      <div class="company-selector">
        <span class="company-name">San Francisco HQ</span>
        <svg class="chevron-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 11L3 6h10l-5 5z"/>
        </svg>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div v-for="item in navItems" :key="item.label" class="nav-item">
        <div
          class="nav-item-label"
          :class="{ 'active': item.active }"
          @click="item.onClick"
        >
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.expandable" class="expand-icon" :class="{ 'expanded': item.expanded }">›</span>
          <span v-if="item.hasAdd" class="add-icon">+</span>
        </div>

        <div v-if="item.expanded && item.subItems" class="sub-items">
          <router-link
            v-for="subItem in item.subItems"
            :key="subItem.label"
            :to="subItem.path"
            class="sub-item"
            active-class="active-sub"
          >
            {{ subItem.label }}
          </router-link>
        </div>
      </div>

      <div class="sidebar-footer">
        <router-link to="/notes" class="notes-link" active-class="notes-active">
          Notes
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const billingExpanded = ref(true)

const navItems = ref([
  {
    label: 'Billing',
    expandable: true,
    expanded: billingExpanded.value,
    onClick: () => { billingExpanded.value = !billingExpanded.value },
    subItems: [
      { label: 'Scenario A', path: '/scenario-a' },
      { label: 'Scenario B', path: '/scenario-b' }
    ]
  },
  { label: 'Launchpad', active: false },
  { label: 'Agent Builder' },
  { label: 'Conversation History' },
  { label: 'Credit Analytics' },
  { label: 'RBAC Permissions' }
])
</script>

<style scoped>
.left-sidebar {
  width: 240px;
  background-color: #FFFFFF;
  border-right: 1px solid #E5E5E5;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  border-bottom: 1px solid #E5E5E5;
  padding: 16px;
}

.company-selector {
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.company-selector:hover {
  background-color: #EFEFEF;
}

.company-name {
  font-weight: 600;
  font-size: 14px;
}

.chevron-icon {
  width: 16px;
  height: 16px;
}

.sidebar-nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item-label {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.nav-item-label:hover {
  background-color: #F9F9F9;
}

.nav-item-label.active {
  background-color: #F3F3F3;
  font-weight: 600;
}

.expand-icon {
  font-size: 18px;
  transition: transform 0.2s;
  margin-left: auto;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.add-icon {
  margin-left: auto;
  color: #888888;
}

.sub-items {
  margin-left: 24px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-item {
  padding: 6px 12px;
  border-radius: 4px;
  color: #535353;
  font-size: 13px;
  text-decoration: none;
  display: block;
}

.sub-item:hover {
  background-color: #F9F9F9;
}

.sub-item.active-sub {
  background-color: #E5E5F8;
  color: #000000;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px 8px;
  border-top: 1px solid #F0F0F0;
}

.notes-link {
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  color: #AAAAAA;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
}

.notes-link:hover {
  background-color: #F9F9F9;
  color: #888888;
}

.notes-link.notes-active {
  background-color: #E5E5F8;
  color: #000000;
  font-weight: 600;
}
</style>
