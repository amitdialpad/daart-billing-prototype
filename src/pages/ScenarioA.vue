<template>
  <AdminShell>
    <div class="scenario-page">
      <div class="page-header">
        <h1>Credits and Usage</h1>
        <p class="subtitle">Scenario A: Upfront Credits + Budget Allocation</p>
      </div>

      <!-- Credits Overview with Usage Breakdown -->
      <div class="card">
        <div class="card-row">
          <div class="credits-main">
            <div class="credits-large">${{ data.expiration.nonExpiring.toLocaleString() }}</div>
            <div class="credits-label">Available credits (non-expiring) from ${{ data.totalCredits.toLocaleString() }} total • Renews {{ data.package.renewalDate }} (${{ data.package.totalCost.toLocaleString() }})</div>
          </div>
          <div class="credits-actions">
            <template v-if="isEditingBudget">
              <button class="btn-secondary" @click="cancelBudgetEdit">Cancel</button>
              <button class="btn-primary" @click="saveBudgetChanges" :disabled="hasValidationError">Save Changes</button>
            </template>
            <template v-else>
              <button class="btn-secondary" @click="openBudgetSettings">Settings</button>
              <button class="btn-primary">Add Credits</button>
            </template>
          </div>
        </div>


        <div v-if="!isEditingBudget && data.expiration.expiringPercent > 0" class="expiring-warning">
          <span class="warning-icon">⚠️</span>
          <span class="warning-text">
            <strong>${{ data.expiration.expiring.toLocaleString() }}</strong> expires {{ data.expiration.expirationDate }} — use or lose
            <span class="info-icon-wrapper">
              <DtIconInfo class="info-icon" />
              <span class="info-tooltip">Expired credits are lost and cannot be recovered. Use them before expiration or contact your Account Manager to request an extension.</span>
            </span>
          </span>
        </div>

        <div v-if="!isEditingBudget" class="forecast-warning">
          <span class="forecast-text">
            At current usage, credits deplete by <strong>{{ data.forecast.projectedRunOutDate }}</strong> ({{ data.forecast.daysRemaining }} days)
            <span class="info-icon-wrapper">
              <DtIconInfo class="info-icon" />
              <span class="info-tooltip">When credits run out, AI Agent services will stop until you add more credits. You'll receive email alerts at 80% usage.</span>
            </span>
          </span>
        </div>

        <div v-if="!isEditingBudget" class="usage-list">
          <div v-for="(item, key) in data.budgetAllocation" :key="key" class="usage-item">
            <div class="usage-header">
              <span class="usage-label">{{ item.label }}</span>
              <span class="usage-value">{{ item.used.toLocaleString() }}/{{ item.allocated.toLocaleString() }} {{ item.unit }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min((item.used / item.allocated) * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div v-else class="allocation-grid">
          <div v-for="(item, key) in editableBudget" :key="key" class="allocation-row">
            <div class="allocation-service">{{ item.label }}</div>
            <div class="allocation-input-cell">
              <input
                type="number"
                v-model.number="item.allocated"
                class="allocation-input-field"
                :class="{ 'input-error': item.allocated < item.used }"
                :min="item.used"
              />
              <span class="allocation-unit">{{ item.unit }}</span>
            </div>
            <div class="allocation-used">
              <span class="used-text">Used: <strong>{{ item.used.toLocaleString() }} {{ item.unit }}</strong></span>
            </div>
            <div v-if="item.allocated < item.used" class="allocation-error">
              Cannot allocate less than current usage
            </div>
          </div>
        </div>

        <div v-if="isEditingBudget" class="edit-summary">
          <div class="summary-line">
            <span class="summary-label">Total Allocated:</span>
            <span class="summary-value">
              {{ totalAllocated.toLocaleString() }} / {{ data.totalCredits.toLocaleString() }}
            </span>
          </div>
          <div class="summary-line">
            <span class="summary-label">Remaining Unallocated:</span>
            <span class="summary-value" :class="{ 'error-text': remainingUnallocated < 0 }">
              {{ remainingUnallocated.toLocaleString() }} credits
            </span>
          </div>
          <div v-if="remainingUnallocated < 0" class="summary-warning">
            ⚠️ You're over-allocated by {{ Math.abs(remainingUnallocated).toLocaleString() }} credits
          </div>
        </div>
      </div>

      <!-- Usage History -->
      <div v-if="!isEditingBudget" class="card">
        <h2>Usage History</h2>

        <div class="history-controls">
          <div class="history-filters">
            <select v-model="selectedType" class="filter-select">
              <option value="all">All Types</option>
              <option value="digital">AI Agent Digital</option>
              <option value="voice">AI Agent Voice</option>
              <option value="sms">SMS/MMS</option>
              <option value="international">International</option>
            </select>
            <select v-model="selectedUserGroup" class="filter-select">
              <option value="all">All Users/Groups</option>
              <option v-for="group in uniqueUserGroups" :key="group" :value="group">{{ group }}</option>
            </select>
            <select v-model="selectedMonth" class="filter-select">
              <option value="all">All Months</option>
              <option value="Dec">Dec 2025</option>
              <option value="Nov">Nov 2025</option>
              <option value="Oct">Oct 2025</option>
            </select>
          </div>
          <button class="btn-export">↓ Export .csv</button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>User/Group</th>
              <th>Agent</th>
              <th>Contact</th>
              <th>Channel</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th class="text-right">List Price</th>
              <th class="text-right">Discount / Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in filteredUsageHistory" :key="entry.id">
              <td class="text-secondary">{{ entry.userGroup }}</td>
              <td>
                <span v-if="entry.agentName">{{ entry.agentName }}</span>
                <span v-else class="rate-dash">—</span>
              </td>
              <td class="text-secondary">{{ entry.contact }}</td>
              <td>{{ entry.type }}</td>
              <td>
                {{ entry.date }}<br>
                <span class="small-text">{{ entry.time }}</span>
              </td>
              <td class="text-secondary">
                {{ entry.duration }}
                <span v-if="entry.rechargeApplied" class="recharge-badge" :title="entry.rechargeReason">2×</span>
              </td>
              <td class="text-right">
                <span v-if="entry.listPrice">${{ entry.listPrice }}</span>
                <span v-else class="rate-dash">—</span>
              </td>
              <td class="text-right">
                <span v-if="entry.isFree" class="free-badge" :title="entry.freeReason">Free</span>
                <template v-else>
                  <span v-if="entry.discountApplied > 0" class="discount-text">-${{ entry.discountApplied.toFixed(2) }}</span>
                  <span class="cost-value">${{ entry.effectiveRate }}</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Team Consumption Summary -->
      <div v-if="!isEditingBudget" class="card">
        <div class="summary-header-row">
          <div>
            <h2>Agent Consumption</h2>
            <div class="header-controls">
              <select class="filter-select-small">
                <option>Dec 2025</option>
                <option>Nov 2025</option>
                <option>Oct 2025</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Alert for biggest spike -->
        <div v-if="biggestSpike" class="consumption-alert">
          <span class="alert-icon">⚠️</span>
          <span class="alert-text">
            <strong>{{ biggestSpike.name }}</strong> costs increased <strong>{{ biggestSpike.change }}%</strong> this month
          </span>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Agent</th>
              <th class="text-right">Spend</th>
              <th class="text-right">Change</th>
              <th class="text-right">Conversations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in topFiveMembers" :key="member.name">
              <td>
                <span class="trend-indicator" :class="member.trend">●</span>
                {{ member.name }}
              </td>
              <td class="text-right">${{ member.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
              <td class="text-right">
                <span class="trend-value" :class="member.trend">
                  {{ getTrendSymbol(member) }}{{ Math.abs(getTrendPercent(member)) }}%
                </span>
              </td>
              <td class="text-right">{{ member.conversations.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Usage Alerts -->
      <div v-if="!isEditingBudget" class="card">
        <h2>Usage Alerts</h2>
        <p class="section-subtitle">Email alerts at first threshold • Services stop at second threshold</p>

        <div class="alerts-list">
          <div v-for="(limit, key) in data.limits" :key="key" class="alert-item">
            <div class="alert-checkbox" :class="{ 'checked': limit.enabled }">
              <svg v-if="limit.enabled" width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M13.5 4L6 11.5L2.5 8" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="alert-content">
              <div class="alert-title">
                {{ limit.label }}: {{ limit.softAlertPercent }}% /
                <span v-if="limit.hardStopPercent">{{ limit.hardStopPercent }}%</span>
                <span v-else class="no-limit">No limit</span>
              </div>
            </div>
          </div>
        </div>

        <div class="guardrails-note">
          Account guardrails: 120% triggers true-up discussion • 200% requires AM meeting
        </div>
      </div>

      <!-- FAQ -->
      <div v-if="!isEditingBudget" class="card">
        <h2>Frequently Asked Questions</h2>

        <div class="faq-list">
          <!-- FAQ 1: Draw-down Priority -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.drawdown = !faqExpanded.drawdown">
              <span>What is credit draw-down priority?</span>
              <span class="expand-toggle">{{ faqExpanded.drawdown ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.drawdown" class="faq-answer">
              <p>Credits are drawn in this order:</p>
              <ol>
                <li v-for="(pool, key) in ['committed', 'recurring', 'oneTime']" :key="key">
                  {{ data.drawDownPriority[pool].label }} — ${{ data.drawDownPriority[pool].balance.toLocaleString() }}
                </li>
              </ol>
            </div>
          </div>

          <!-- FAQ 2: Billable Criteria -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.billable = !faqExpanded.billable">
              <span>What makes a conversation billable?</span>
              <span class="expand-toggle">{{ faqExpanded.billable ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.billable" class="faq-answer">
              <p><strong>Requirements:</strong></p>
              <ol>
                <li v-for="(req, index) in data.billableCriteria.requirements" :key="index">{{ req }}</li>
              </ol>

              <p><strong>Key Requirement:</strong> {{ data.billableCriteria.skillRequirement }}</p>

              <p><strong>Free Conversations:</strong></p>
              <ul>
                <li v-for="example in data.billableCriteria.freeExamples" :key="example">{{ example }}</li>
              </ul>
            </div>
          </div>

          <!-- FAQ 3: Re-charge Rules -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.recharge = !faqExpanded.recharge">
              <span>What are the re-charge rules?</span>
              <span class="expand-toggle">{{ faqExpanded.recharge ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.recharge" class="faq-answer">
              <p><strong>Voice:</strong> Calls exceeding 5 minutes or 10 actions = 2× charge</p>
              <p><strong>Digital:</strong> Conversations exceeding 10 actions = 2× charge</p>
            </div>
          </div>

          <!-- FAQ 4: Enterprise Pricing -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.pricing = !faqExpanded.pricing">
              <span>What is the enterprise pricing structure?</span>
              <span class="expand-toggle">{{ faqExpanded.pricing ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.pricing" class="faq-answer">
              <p>{{ data.minimumCommitment.toLocaleString() }} credits minimum commitment</p>
              <p>{{ data.discountPercent }}% upfront discount applied</p>
              <p v-if="data.rateLock.locked"><strong>Rate Lock:</strong> {{ data.rateLock.message }}</p>
            </div>
          </div>

          <!-- FAQ 5: Permissions -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.permissions = !faqExpanded.permissions">
              <span>How do permissions work?</span>
              <span class="expand-toggle">{{ faqExpanded.permissions ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.permissions" class="faq-answer">
              <p>Your view is based on your role. Billing admins see all data. Contact your admin to adjust permissions.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminShell from '../components/layout/AdminShell.vue'
import { mockData } from '../data/mockData'
import { DtIconInfo } from '@dialpad/dialtone-icons/vue3'

const data = ref(mockData.scenarioA)

// Budget allocation editing
const isEditingBudget = ref(false)
const editableBudget = ref({})

const openBudgetSettings = () => {
  // Create a deep copy of current allocations for editing
  editableBudget.value = JSON.parse(JSON.stringify(data.value.budgetAllocation))
  isEditingBudget.value = true
}

const cancelBudgetEdit = () => {
  isEditingBudget.value = false
  editableBudget.value = {}
}

const saveBudgetChanges = () => {
  // Update the actual data
  data.value.budgetAllocation = JSON.parse(JSON.stringify(editableBudget.value))
  isEditingBudget.value = false
}

// Validation
const totalAllocated = computed(() => {
  if (!isEditingBudget.value) return 0
  return Object.values(editableBudget.value).reduce((sum, item) => {
    const allocated = Number(item.allocated) || 0
    return sum + allocated
  }, 0)
})

const remainingUnallocated = computed(() => {
  return data.value.totalCredits - totalAllocated.value
})

const hasValidationError = computed(() => {
  if (!isEditingBudget.value) return false

  // Check if total exceeds available credits
  if (totalAllocated.value > data.value.totalCredits) return true

  // Check if any allocation is less than current usage
  for (const key in editableBudget.value) {
    const item = editableBudget.value[key]
    const allocated = Number(item.allocated) || 0
    if (allocated < item.used) return true
  }

  return false
})

// Top 5 members for billing page summary (using realistic mock data)
const topFiveMembers = computed(() => {
  return data.value.topAgentsSummary.slice(0, 5)
})

// Calculate trend percentage
const getTrendPercent = (member) => {
  if (!member.previousCost || member.previousCost === 0) return 0
  return Math.round(((member.cost - member.previousCost) / member.previousCost) * 100)
}

// Get trend symbol
const getTrendSymbol = (member) => {
  const percent = getTrendPercent(member)
  if (percent > 5) return '↑ '
  if (percent < -5) return '↓ '
  return ''
}

// Find biggest spike for alert
const biggestSpike = computed(() => {
  const spikes = data.value.topAgentsSummary
    .map(agent => ({
      name: agent.name,
      change: getTrendPercent(agent)
    }))
    .filter(agent => agent.change > 20) // Only show if > 20% increase
    .sort((a, b) => b.change - a.change)

  return spikes.length > 0 ? spikes[0] : null
})

// Usage History filters
const selectedType = ref('all')
const selectedUserGroup = ref('all')
const selectedMonth = ref('Dec')

// Get unique user/group names from usage history
const uniqueUserGroups = computed(() => {
  const groups = new Set()
  data.value.usageHistory.forEach(entry => {
    if (entry.userGroup) {
      groups.add(entry.userGroup)
    }
  })
  return Array.from(groups).sort()
})

// Filter usage history based on selected filters
const filteredUsageHistory = computed(() => {
  return data.value.usageHistory.filter(entry => {
    // Filter by type
    if (selectedType.value !== 'all') {
      const entryType = entry.type.toLowerCase()
      const filterType = selectedType.value.toLowerCase()
      if (!entryType.includes(filterType)) {
        return false
      }
    }

    // Filter by user/group
    if (selectedUserGroup.value !== 'all') {
      if (entry.userGroup !== selectedUserGroup.value) {
        return false
      }
    }

    // Filter by month
    if (selectedMonth.value !== 'all') {
      // Map month names to numbers for ISO date format (YYYY-MM-DD)
      const monthMap = {
        'Dec': '2025-12',
        'Nov': '2025-11',
        'Oct': '2025-10'
      }
      const monthPrefix = monthMap[selectedMonth.value]
      if (monthPrefix && !entry.date.startsWith(monthPrefix)) {
        return false
      }
    }

    return true
  })
})

// FAQ expanded states
const faqExpanded = ref({
  drawdown: false,
  billable: false,
  recharge: false,
  pricing: false,
  permissions: false
})
</script>

<style scoped>
.scenario-page {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 24px;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.subtitle {
  color: #666666;
  font-size: 14px;
  margin-bottom: 8px;
}

.description {
  color: #666666;
  font-size: 14px;
  line-height: 1.5;
}

.card {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.credits-main {
  flex: 1;
}

.credits-large {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 4px;
}

.credits-label {
  font-size: 14px;
  color: #888888;
  margin-bottom: 8px;
}

.expiration-badge {
  color: #00C48C;
  font-size: 13px;
}

.expiration-badge.warning {
  color: #CC8800;
}

.expiring-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #FFF8E1;
  border-left: 4px solid #FFB020;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.warning-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.warning-text {
  font-size: 14px;
  color: #666666;
}

/* Info Icon & Tooltip */
.info-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 6px;
  vertical-align: middle;
}

.info-icon {
  width: 16px;
  height: 16px;
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  color: #666666;
}

.info-icon:hover {
  opacity: 1;
}

.info-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background-color: #1C1C1C;
  color: #FFFFFF;
  text-align: left;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  z-index: 1000;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #1C1C1C transparent transparent transparent;
}

.info-icon-wrapper:hover .info-tooltip {
  visibility: visible;
  opacity: 1;
}

.forecast-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #F3F3FF;
  border-left: 4px solid #6B46EE;
  border-radius: 4px;
  margin-top: 12px;
  margin-bottom: 16px;
}

.forecast-warning .forecast-text {
  font-size: 14px;
  color: #1C1C1C;
}

.credits-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  padding: 8px 16px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #F9F9F9;
}

.btn-primary {
  padding: 8px 16px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary:disabled:hover {
  background-color: #CCCCCC;
}

.package-info-line {
  padding: 12px 0;
  border-top: 1px solid #E5E5E5;
  margin-top: 16px;
  font-size: 13px;
  color: #666666;
  text-align: center;
}

.progress-bar-large {
  height: 12px;
  background-color: #E5E5E5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill-large {
  height: 100%;;
  background-color: #000000;
  transition: width 0.3s ease;
}

.expiration-legend {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
  font-size: 13px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.active {
  background-color: #000000;
}

.legend-dot.inactive {
  background-color: #E5E5E5;
}

.expiration-policy {
  font-size: 12px;
  color: #888888;
  margin-top: 8px;
}

.info {
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
  margin-bottom: 24px;
}

.notice-card {
  background-color: #F9F9F9;
  border: 1px solid #CCCCCC;
}

.warning-card {
  background-color: #FFF8E1;
  border: 1px solid #CCCCCC;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notice-title {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.notice-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
}

.affected-surfaces {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
}

.affected-surfaces ul {
  margin: 4px 0 0 20px;
}

.usage-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.usage-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.usage-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.usage-label {
  font-weight: 600;
}

.usage-value {
  color: #666666;
}

.allocation-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.allocation-row {
  display: grid;
  grid-template-columns: 240px 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
}

.allocation-row:last-child {
  border-bottom: none;
}

.allocation-service {
  font-size: 15px;
  font-weight: 600;
  color: #1C1C1C;
}

.allocation-input-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.allocation-input-field {
  width: 160px;
  padding: 10px 14px;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.2s;
  background-color: #FFFFFF;
}

.allocation-input-field:hover {
  border-color: #999999;
}

.allocation-input-field:focus {
  outline: none;
  border-color: #6B46EE;
  box-shadow: 0 0 0 3px rgba(107, 70, 238, 0.08);
}

.allocation-input-field.input-error {
  border-color: #E52C2C;
  background-color: #FFF8F8;
}

.allocation-unit {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
}

.allocation-used {
  text-align: right;
  min-width: 250px;
}

.used-text {
  font-size: 14px;
  color: #666666;
}

.used-text strong {
  color: #1C1C1C;
  font-weight: 600;
}

.allocation-error {
  grid-column: 2 / -1;
  font-size: 13px;
  color: #E52C2C;
  padding: 8px 12px;
  background-color: #FFF5F5;
  border-left: 3px solid #E52C2C;
  border-radius: 4px;
  margin-top: 8px;
}

.validation-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #FFF8E1;
  border-left: 4px solid #FFB020;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.edit-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  margin-bottom: 8px;
}

.summary-line:last-of-type {
  margin-bottom: 0;
}

.summary-label {
  font-weight: 600;
  color: #666666;
}

.summary-value {
  font-weight: 600;
  color: #1C1C1C;
}

.summary-value.error-text {
  color: #E52C2C;
}

.summary-warning {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: #FFF5F5;
  border-left: 3px solid #E52C2C;
  color: #E52C2C;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
}

.progress-bar {
  height: 8px;
  background-color: #E5E5E5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #000000;
  transition: width 0.3s ease;
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.limit-card {
  background-color: #F9F9F9;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 16px;
}

.limit-name {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
}

.limit-detail {
  font-size: 13px;
  color: #666666;
  margin-bottom: 4px;
}

.limit-status {
  margin-top: 12px;
  display: inline-block;
  padding: 4px 8px;
  background-color: #E5E5E5;
  border-radius: 4px;
  font-size: 12px;
  color: #888888;
}

.limit-status.status-active {
  background-color: #000000;
  color: #FFFFFF;
}

.limit-behavior {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
}

.behavior-section {
  margin-bottom: 12px;
}

.behavior-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.behavior-action {
  font-size: 12px;
  color: #666666;
  margin-bottom: 4px;
}

.behavior-locations {
  font-size: 11px;
  color: #888888;
}

.behavior-locations ul {
  margin: 2px 0 0 16px;
  list-style-type: disc;
}

.behavior-override {
  font-size: 12px;
  color: #666666;
}

.history-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 14px;
  background-color: #FFFFFF;
}

.btn-export {
  padding: 6px 12px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-export:hover {
  background-color: #F9F9F9;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  border-bottom: 2px solid #E5E5E5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #F5F5F5;
}

.data-table .text-right {
  text-align: right;
}

.text-secondary {
  color: #666666;
}

.value {
  font-weight: 600;
}

.small-text {
  font-size: 12px;
  color: #888888;
}

.recharge-badge {
  display: inline-block;
  padding: 2px 4px;
  background-color: #000000;
  color: #FFFFFF;
  border-radius: 3px;
  font-size: 10px;
  margin-left: 4px;
  cursor: help;
}

.history-note {
  margin-top: 16px;
  padding: 12px;
  background-color: #F9F9F9;
  border-radius: 4px;
  font-size: 13px;
  color: #666666;
}

.mockup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.mockup-card {
  background-color: #F9F9F9;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 16px;
}

.mockup-title {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
}

.mockup-placeholder {
  padding: 24px;
  background-color: #EFEFEF;
  border: 1px dashed #CCCCCC;
  border-radius: 4px;
  text-align: center;
  color: #666666;
  font-size: 13px;
  line-height: 1.6;
}

/* Draw-down Priority Styles */
.drawdown-visual {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.drawdown-pool {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #F9F9F9;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
}

.pool-order {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #6B46EE;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.pool-info {
  flex: 1;
}

.pool-label {
  font-size: 12px;
  color: #666666;
  margin-bottom: 4px;
}

.pool-balance {
  font-size: 18px;
  font-weight: 700;
  color: #1C1C1C;
}

/* Forecast Card Styles */
.forecast-card {
  background: linear-gradient(135deg, #F3F3FF 0%, #FFFFFF 100%);
  border-left: 4px solid #6B46EE;
}

.forecast-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.forecast-item {
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
}

.forecast-label {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.forecast-value {
  font-size: 20px;
  font-weight: 700;
  color: #1C1C1C;
}

/* Guardrails Styles */
.guardrails-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.guardrail-card {
  padding: 20px;
  background-color: #F9F9F9;
  border-radius: 8px;
  border: 2px solid #E5E5E5;
  text-align: center;
}

.guardrail-card.warning {
  background-color: #FFF9F0;
  border-color: #FFB020;
}

.guardrail-threshold {
  font-size: 32px;
  font-weight: 700;
  color: #6B46EE;
  margin-bottom: 8px;
}

.guardrail-card.warning .guardrail-threshold {
  color: #CC8800;
}

.guardrail-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1C1C1C;
}

.guardrail-action {
  font-size: 14px;
  color: #535353;
  margin-bottom: 12px;
  font-weight: 500;
}

.guardrail-desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.5;
}

/* Billable Criteria Styles */
.criteria-card {
  border-left: 4px solid #00C48C;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: #F9F9F9;
  border-radius: 6px;
}

.req-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #00C48C;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.req-text {
  flex: 1;
  font-size: 14px;
  color: #1C1C1C;
  line-height: 1.5;
}

.skill-requirement-callout {
  margin-top: 16px;
  padding: 16px;
  background-color: #FFF9F0;
  border-left: 4px solid #FFB020;
  border-radius: 4px;
  font-size: 14px;
  color: #1C1C1C;
  line-height: 1.6;
}

.free-examples {
  margin-top: 16px;
  padding: 16px;
  background-color: #F0FFF8;
  border-radius: 8px;
  border: 1px solid #C0F0E0;
}

.free-title {
  font-weight: 600;
  font-size: 14px;
  color: #1C1C1C;
  margin-bottom: 8px;
}

.free-examples ul {
  margin: 0;
  padding-left: 20px;
}

.free-examples li {
  font-size: 13px;
  color: #535353;
  line-height: 1.6;
  margin-bottom: 4px;
}

/* Collapsible Section Styles */
.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.collapsible-header:hover h2 {
  color: #6B46EE;
}

.expand-toggle {
  font-size: 24px;
  font-weight: 300;
  color: #666666;
  margin-left: 12px;
  transition: color 0.2s;
}

.collapsible-header:hover .expand-toggle {
  color: #6B46EE;
}

.criteria-summary,
.history-summary {
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
  font-style: italic;
}

.collapsible-content {
  margin-top: 16px;
}

/* Forecast Alert Styles */
.forecast-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #F3F3FF;
  border-left: 4px solid #6B46EE;
}

.forecast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.forecast-text {
  font-size: 14px;
  color: #1C1C1C;
}

/* Plan Details Grid */
.plan-details-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #1C1C1C;
}

.detail-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.6;
}

/* Discount/Cost Column Styles */
.discount-text {
  color: #00C48C;
  font-size: 12px;
  margin-right: 8px;
}

.free-badge {
  color: #1C1C1C;
  font-size: 14px;
  font-weight: 600;
  cursor: help;
}

.rate-dash {
  color: #CCCCCC;
  font-size: 14px;
}

.cost-value {
  font-weight: 600;
  color: #1C1C1C;
}

/* Usage Alerts Styles */
.section-subtitle {
  color: #666666;
  font-size: 14px;
  margin-top: -8px;
  margin-bottom: 20px;
}

.alerts-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #F9F9F9;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
}

.alert-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #CCCCCC;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.alert-checkbox.checked {
  background-color: #6B46EE;
  border-color: #6B46EE;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 500;
  color: #1C1C1C;
}

.alert-title .no-limit {
  color: #888888;
  font-style: italic;
}

.guardrails-note {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
  font-size: 13px;
  color: #888888;
  line-height: 1.5;
}

/* FAQ Styles */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  background-color: #FAFAFA;
  font-size: 14px;
  font-weight: 500;
  color: #1C1C1C;
  user-select: none;
}

.faq-question:hover {
  background-color: #F5F5F5;
}

.faq-answer {
  padding: 16px;
  background-color: #FFFFFF;
  font-size: 14px;
  color: #535353;
  line-height: 1.6;
  border-top: 1px solid #E5E5E5;
}

.faq-answer p {
  margin: 0 0 12px 0;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

.faq-answer ol,
.faq-answer ul {
  margin: 8px 0 12px 20px;
  padding: 0;
}

.faq-answer li {
  margin-bottom: 6px;
  line-height: 1.5;
}

/* Team Consumption Summary */
.summary-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.filter-select-small {
  padding: 6px 10px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 13px;
  background-color: #FFFFFF;
  cursor: pointer;
  min-width: 120px;
}

.filter-select-small:hover {
  border-color: #999999;
}

.view-all-link-header {
  color: #1C1C1C;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 12px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  transition: all 0.2s;
}

.view-all-link-header:hover {
  background-color: #F9F9F9;
  border-color: #CCCCCC;
}

.view-all-link-header.disabled {
  color: #999999;
  cursor: default;
  pointer-events: none;
}

/* Consumption Alert */
.consumption-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #FFF8E1;
  border-left: 4px solid #FFB020;
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 16px;
  font-size: 14px;
}

.consumption-alert .alert-icon {
  font-size: 16px;
  line-height: 1;
}

.consumption-alert .alert-text {
  color: #1C1C1C;
}

/* Trend Indicators */
.trend-indicator {
  display: inline-block;
  margin-right: 8px;
  font-size: 10px;
  line-height: 1;
}

.trend-indicator.up {
  color: #666666;
}

.trend-indicator.down {
  color: #666666;
}

.trend-indicator.flat {
  color: #666666;
}

.trend-value {
  font-weight: 600;
  font-size: 13px;
}

.trend-value.up {
  color: #666666;
}

.trend-value.down {
  color: #666666;
}

.trend-value.flat {
  color: #666666;
}
</style>
