<template>
  <AdminShell>
    <div class="agent-consumption-page">
      <!-- Back Button -->
      <div class="page-header">
        <router-link to="/scenario-a" class="back-link">← Back to Billing</router-link>
        <h1>Team Consumption Report</h1>
        <p class="subtitle">View detailed consumption breakdown by team</p>
      </div>

      <!-- Filters -->
      <div class="card filters-card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Month</label>
            <select v-model="selectedMonth" class="filter-select">
              <option value="2025-11">November 2025</option>
              <option value="2025-10">October 2025</option>
              <option value="2025-09">September 2025</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Service Type</label>
            <select v-model="selectedService" class="filter-select">
              <option value="all">All Services</option>
              <option value="digital">AI Agent Digital</option>
              <option value="voice">AI Agent Voice</option>
              <option value="sms">SMS/MMS</option>
              <option value="international">International</option>
            </select>
          </div>
          <button class="btn-export" @click="exportCSV">↓ Export CSV</button>
        </div>
      </div>

      <!-- Simple Table -->
      <div class="card">
        <h2>Members</h2>

        <table class="data-table">
          <thead>
            <tr>
              <th>Members</th>
              <th class="text-right">Spend this month ↓</th>
              <th class="text-right">Conversations this month</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in allMembers" :key="member.name">
              <td>{{ member.name }}</td>
              <td class="text-right">${{ member.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
              <td class="text-right">{{ member.conversations.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminShell from '../components/layout/AdminShell.vue'
import { mockData } from '../data/mockData'

const router = useRouter()

// State
const selectedMonth = ref('2025-11')
const selectedService = ref('all')

// Combine data from both scenarios (in real app, would come from API)
const allUsageHistory = ref([
  ...mockData.scenarioA.usageHistory,
  ...mockData.scenarioB.usageHistory
])

// Compute all members (individual AI agents/users) with their spend
const allMembers = computed(() => {
  const members = {}

  allUsageHistory.value.forEach(entry => {
    // Apply filters
    if (selectedService.value !== 'all') {
      const serviceType = entry.type.toLowerCase()
      if (!serviceType.includes(selectedService.value)) return
    }

    const memberName = entry.agentName || entry.userGroup || 'Unknown'

    if (!members[memberName]) {
      members[memberName] = {
        name: memberName,
        conversations: 0,
        cost: 0
      }
    }

    members[memberName].conversations++
    members[memberName].cost += entry.effectiveRate || entry.cost || 0
  })

  // Convert to array and sort by cost descending
  return Object.values(members).sort((a, b) => b.cost - a.cost)
})

// Export to CSV
const exportCSV = () => {
  let csv = 'Members,Spend this month,Conversations this month\n'
  allMembers.value.forEach((member) => {
    csv += `${member.name},${member.cost.toFixed(2)},${member.conversations}\n`
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `team-consumption-${selectedMonth.value}.csv`
  a.click()
}
</script>

<style scoped>
.agent-consumption-page {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #6B46EE;
  text-decoration: none;
  margin-bottom: 12px;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #666666;
  font-size: 16px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.info {
  color: #666666;
  font-size: 14px;
  margin-bottom: 16px;
}

.card {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.filters-card {
  padding: 16px 24px;
}

.filters-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
  color: #535353;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  font-size: 14px;
  background-color: #FFFFFF;
  cursor: pointer;
  min-width: 180px;
}

.filter-select:hover {
  border-color: #999999;
}

.btn-export {
  padding: 8px 16px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}

.btn-export:hover {
  background-color: #F9F9F9;
  border-color: #999999;
}

.stats-card {
  background-color: #F9F9F9;
  border: 1px solid #E5E5E5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1C1C1C;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background-color: #F9F9F9;
  border-bottom: 2px solid #E5E5E5;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #535353;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #F0F0F0;
}

.agent-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.agent-row:hover {
  background-color: #F9F9F9;
}

.expand-cell {
  text-align: center;
  vertical-align: middle;
}

.expand-icon {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: #666666;
  transition: transform 0.2s;
  line-height: 1;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.rank {
  color: #999999;
  font-weight: 600;
}

.agent-name {
  font-weight: 600;
  color: #1C1C1C;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.details-header {
  background-color: #FAFAFA;
}

.details-header td {
  padding: 0;
  border-bottom: 1px solid #E5E5E5;
}

.details-table-wrapper {
  padding: 16px 24px;
  background-color: #FAFAFA;
}

.details-table {
  width: 100%;
  font-size: 13px;
  border-collapse: collapse;
}

.details-table th {
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: #666666;
  background-color: #F0F0F0;
  border-bottom: 1px solid #E5E5E5;
}

.details-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #F5F5F5;
}

.detail-row:hover {
  background-color: #F5F5F5;
}

.small-text {
  font-size: 12px;
  color: #999999;
}

.recharge-badge {
  display: inline-block;
  background-color: #FFE5E5;
  color: #E52C2C;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 4px;
}

.free-badge {
  display: inline-block;
  background-color: #E8F5E9;
  color: #2E7D32;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
}
</style>
