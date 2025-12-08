<template>
  <AdminShell>
    <div class="scenario-page">
      <div class="page-header">
        <h1>Credits and Usage</h1>
        <p class="subtitle">Scenario B: Dynamic Tiered Rates</p>
      </div>

      <!-- Trend Card (1-line banner) -->
      <div v-if="!isEditingSpendLimit && !isEditingOtherServices" class="trend-card">
        <span class="status-dot status-warning">●</span> Trending high · Used <strong>${{ data.currentSpend.toLocaleString() }}</strong> by day 10 (expected <strong>~$1,000</strong>) · Forecast: <strong>${{ data.forecast.projectedSpendByMonthEnd.toLocaleString() }}</strong> by {{ data.forecast.projectedDate }}
      </div>

      <!-- Hero Cards Grid (3 cards) -->
      <div v-if="!isEditingSpendLimit && !isEditingOtherServices" class="card">
        <div class="hero-cards-grid">
          <!-- Card 1: Current Spend -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">CURRENT SPEND</span>
            </div>
            <div class="hero-number">${{ data.currentSpend.toLocaleString() }}</div>
            <div class="hero-interpretation" v-if="data.monthlySpendLimit">
              {{ data.spendPercentage }}% of ${{ data.monthlySpendLimit.toLocaleString() }} limit · ${{ data.currentSavings }} saved
            </div>
            <div class="hero-interpretation" v-else>
              Spend to date · ${{ data.currentSavings }} saved
            </div>
            <div class="hero-commit">↑ Faster than expected</div>
            <button class="manage-limit-link" @click="openSpendLimitSettings">
              Manage spend limit
            </button>
          </div>

          <!-- Card 2: Current Tier -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">CURRENT TIER</span>
            </div>
            <div class="hero-tier-name">Tier {{ data.currentTier }} - {{ getCurrentTier().label }}</div>
            <div class="hero-interpretation">Digital: ${{ getCurrentTier().digital }} · Voice: ${{ getCurrentTier().voice }}</div>
            <div class="hero-commit">{{ data.conversationsThisMonth }} conversations this period</div>
          </div>

          <!-- Card 3: Next Tier Progress -->
          <div class="hero-card">
            <div class="hero-header">
              <span class="hero-label">NEXT TIER PROGRESS</span>
            </div>
            <div class="hero-number">{{ data.conversationsToNextTier }}</div>
            <div class="hero-interpretation">conversations to next tier</div>
            <div class="hero-commit">Next rates: Digital ${{ getNextTier().digital }} · Voice ${{ getNextTier().voice }}</div>
          </div>
        </div>

        <!-- Forecast Block (Mechanical) -->
        <div class="forecast-block">
          <div class="forecast-line-compact">
            Forecast ({{ data.forecast.projectedDate }}): ${{ data.forecast.projectedSpendByMonthEnd.toLocaleString() }} · Tier {{ data.forecast.projectedTier }} · ${{ (data.currentSavings + data.forecast.estimatedSavings).toLocaleString() }} savings
          </div>
          <div class="guardrails-compact">
            Guardrail: >120% triggers discussion
          </div>
        </div>
      </div>

      <!-- Spend Limit Editing Mode -->
      <div v-if="isEditingSpendLimit && !isEditingOtherServices" class="card">
        <div class="card-header-with-actions">
          <h2>Spend limit</h2>
          <div class="header-actions-grouped">
            <button class="btn-secondary" @click="cancelSpendLimitEdit">Cancel</button>
            <button class="btn-primary" @click="saveSpendLimitChanges">Save changes</button>
          </div>
        </div>

        <div class="spend-limit-form">
          <div class="form-group">
            <label class="form-label">Monthly spend limit</label>
            <p class="form-helper">Soft limits trigger alerts; hard limits stop usage.</p>
            <div class="input-with-prefix">
              <span class="input-prefix">$</span>
              <input
                type="number"
                v-model.number="editableSpendLimit.amount"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group" v-if="editableSpendLimit.enabled">
            <label class="form-label">Limit behavior</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="editableSpendLimit.type"
                  value="soft"
                />
                <span>Soft limit – alert only</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="editableSpendLimit.type"
                  value="hard"
                />
                <span>Hard limit – stop at limit</span>
              </label>
            </div>
          </div>

          <div class="form-group-remove" v-if="editableSpendLimit.enabled">
            <button class="link-remove-limit" @click="removeSpendLimit">
              Remove limit (switch to unlimited pay-as-you-go)
            </button>
          </div>
        </div>
      </div>

      <!-- Other Services (Credit-Based Billing) -->
      <div v-if="!isEditingOtherServices && !isEditingSpendLimit" class="budget-snapshot-full">
        <div class="budget-snapshot-header">
          <div class="budget-header-left">
            <h3>Other Services (Credit-Based Billing)</h3>
            <span class="overall-trend">Overall pace: ● High usage trend</span>
          </div>
          <div class="header-actions">
            <button class="btn-export" @click="handleAddCredits">Add credits</button>
            <button class="btn-export" @click="openOtherServicesSettings">Settings</button>
          </div>
        </div>

        <table class="budget-table-ledger">
          <thead>
            <tr>
              <th class="th-category">Category</th>
              <th class="th-alloc-used">Alloc/Used</th>
              <th class="th-remaining">Remaining credits</th>
              <th class="th-trend">Trend</th>
              <th class="th-status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(service, key) in data.otherServicesCredits.allocation" :key="key" class="budget-row">
              <td class="td-category">{{ getServiceLabel(key) }}</td>
              <td class="td-alloc-used">{{ service.allocated.toLocaleString() }} · {{ service.used.toLocaleString() }} used</td>
              <td class="td-remaining">{{ (service.allocated - service.used).toLocaleString() }}</td>
              <td class="td-trend">
                <span class="sparkline">▂▃▅▇</span> {{ getOtherServicesTrend(service) }}
              </td>
              <td class="td-status">
                <span class="status-dot" :class="getOtherServicesStatusClass(service)">●</span> {{ getOtherServicesStatusText(service) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Other Services Editing Mode -->
      <div v-if="isEditingOtherServices && !isEditingSpendLimit" class="card">
        <div class="card-header-with-actions">
          <h2>Other Services Settings</h2>
          <div class="header-actions">
            <button class="btn-secondary" @click="cancelOtherServicesEdit">Cancel</button>
            <button class="btn-primary" @click="saveOtherServicesChanges" :disabled="hasOtherServicesError">Save Changes</button>
          </div>
        </div>

        <div class="allocation-grid">
          <div v-for="(service, key) in editableOtherServices" :key="key" class="allocation-row">
            <div class="allocation-service">{{ getServiceLabel(key) }}</div>
            <div class="allocation-input-cell">
              <input
                type="number"
                v-model.number="service.allocated"
                class="allocation-input-field"
                :class="{ 'input-error': service.allocated < service.used }"
                :min="service.used"
              />
              <span class="allocation-unit">credits</span>
            </div>
            <div class="allocation-used">
              <span class="used-text">Used: <strong>{{ service.used.toLocaleString() }} credits</strong></span>
            </div>
            <div v-if="service.allocated < service.used" class="allocation-error">
              Cannot allocate less than current usage
            </div>
          </div>
        </div>

        <!-- Usage Alerts Section -->
        <div class="alerts-section">
          <h3 class="alerts-header">Usage Alerts</h3>
          <p class="alerts-subtitle">Email alerts at first threshold • Services stop at second threshold</p>

          <div class="alerts-list-single-column">
            <div v-for="(limit, key) in data.otherServicesLimits" :key="key" class="alert-item">
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
        </div>

        <div class="edit-summary">
          <div class="summary-line">
            <span class="summary-label">Total Allocated:</span>
            <span class="summary-value">{{ totalOtherServicesAllocated.toLocaleString() }} credits</span>
          </div>
        </div>
      </div>

      <!-- Usage History -->
      <div v-if="!isEditingOtherServices && !isEditingSpendLimit" class="card">
        <h2>Usage History (All Services)</h2>
        <p class="info">Shows both tiered rates (Agentic AI) and credit-based charges (SMS, International, Fax, Domestic)</p>

        <div class="history-controls">
          <div class="history-filters">
            <select v-model="selectedType" class="filter-select">
              <option value="all">All Channels</option>
              <option value="digital">AI Agent Digital</option>
              <option value="voice">AI Agent Voice</option>
              <option value="sms">SMS/MMS</option>
              <option value="international">International</option>
            </select>
            <select v-model="selectedAgent" class="filter-select">
              <option value="all">All Agents</option>
              <option value="Support Bot Alpha">Support Bot Alpha</option>
              <option value="Support Bot Beta">Support Bot Beta</option>
              <option value="Support Bot Gamma">Support Bot Gamma</option>
              <option value="Sales Bot A">Sales Bot A</option>
              <option value="Sales Bot B">Sales Bot B</option>
              <option value="Routing Bot">Routing Bot</option>
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
              <th class="text-center">
                Billing Model
              </th>
              <th class="text-right">Rate/Credits</th>
              <th class="text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in filteredUsageHistory" :key="entry.id" :class="{ 'tier-transition': entry.tierTransition }">
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
              <td class="text-secondary" style="white-space: nowrap;">
                {{ entry.duration }}
                <span v-if="entry.rechargeApplied" class="recharge-badge-wrapper">
                  <span class="recharge-badge">2×</span>
                  <span class="recharge-tooltip">{{ entry.rechargeReason }}</span>
                </span>
              </td>
              <td class="text-center">
                <span v-if="entry.billingModel === 'tiered'" class="billing-model-badge tiered-badge">
                  <span v-if="entry.tierTransition" class="transition-badge">
                    T{{ entry.previousTier }}→T{{ entry.tier }}
                  </span>
                  <span v-else>Tier {{ entry.tier }}</span>
                </span>
                <span v-else-if="entry.billingModel === 'credits'" class="billing-model-badge credits-badge">
                  Credits
                </span>
                <span v-else class="rate-dash">—</span>
              </td>
              <td class="text-right">
                <span v-if="entry.billingModel === 'tiered'">${{ entry.rate }}</span>
                <span v-else-if="entry.billingModel === 'credits'">{{ entry.credits }} cr</span>
                <span v-else class="rate-dash">—</span>
              </td>
              <td class="text-right value">
                <span v-if="entry.isFree" class="free-badge" :title="entry.freeReason">Free</span>
                <span v-else>${{ entry.cost }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Team Consumption Summary -->
      <div v-if="!isEditingOtherServices && !isEditingSpendLimit" class="card">
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

      <!-- FAQ -->
      <div v-if="!isEditingOtherServices && !isEditingSpendLimit" class="card">
        <h2>Frequently Asked Questions</h2>

        <div class="faq-list">
          <!-- FAQ 0: Rate Card -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.rateCard = !faqExpanded.rateCard">
              <span>What are the rates for each tier?</span>
              <span class="expand-toggle">{{ faqExpanded.rateCard ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.rateCard" class="faq-answer">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Volume Range</th>
                    <th class="text-right">Digital Rate</th>
                    <th class="text-right">Voice Rate</th>
                    <th class="text-right">Discount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tier in data.tiers" :key="tier.tier" :class="{ 'current-tier': tier.current }">
                    <td>
                      <span v-if="tier.current" class="current-marker">→ </span>Tier {{ tier.tier }}
                    </td>
                    <td>{{ tier.min }}-{{ tier.max || '∞' }} conversations</td>
                    <td class="text-right">${{ tier.digital }}</td>
                    <td class="text-right">${{ tier.voice }}</td>
                    <td class="text-right">{{ tier.discountPercent }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- FAQ 1: Tier Reset -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.tierReset = !faqExpanded.tierReset">
              <span>How do tier resets work?</span>
              <span class="expand-toggle">{{ faqExpanded.tierReset ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.tierReset" class="faq-answer">
              <p>Tiers reset to Tier 1 at the beginning of each billing cycle. Your conversation count starts fresh each month.</p>
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
              <p><strong>Voice:</strong> Calls exceeding 5 minutes or 10 actions = 2× charge at current tier rate</p>
              <p><strong>Digital:</strong> Conversations exceeding 10 actions = 2× charge at current tier rate</p>
            </div>
          </div>

          <!-- FAQ 4: Enterprise Pricing -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.pricing = !faqExpanded.pricing">
              <span>What is the enterprise pricing structure?</span>
              <span class="expand-toggle">{{ faqExpanded.pricing ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.pricing" class="faq-answer">
              <p>{{ data.minimumCommitment.toLocaleString() }} credits minimum commitment at launch</p>
              <p>Progressive discount model - rates improve automatically as monthly volume increases</p>
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
              <p>Your view is based on your role. Billing admins see all data and can edit spend limits. Contact your admin to adjust permissions.</p>
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

const data = ref(mockData.scenarioB)

// Load saved spend limit from localStorage if it exists
const savedSpendLimit = localStorage.getItem('scenarioB_spendLimit')
if (savedSpendLimit) {
  const saved = JSON.parse(savedSpendLimit)
  // Merge with defaults to ensure all fields exist
  data.value.spendLimitConfig = {
    enabled: saved.enabled !== undefined ? saved.enabled : true,
    amount: saved.amount !== undefined ? saved.amount : 5000,
    type: saved.type || 'soft'
  }
  data.value.monthlySpendLimit = data.value.spendLimitConfig.enabled
    ? data.value.spendLimitConfig.amount
    : null
  if (data.value.monthlySpendLimit) {
    data.value.spendPercentage = Math.round(
      (data.value.currentSpend / data.value.monthlySpendLimit) * 100
    )
  }
}

// Other services credit allocation editing
const isEditingOtherServices = ref(false)
const editableOtherServices = ref({})

// Spend limit editing
const isEditingSpendLimit = ref(false)
const editableSpendLimit = ref({
  enabled: data.value.spendLimitConfig?.enabled !== undefined ? data.value.spendLimitConfig.enabled : true,
  amount: data.value.spendLimitConfig?.amount !== undefined ? data.value.spendLimitConfig.amount : data.value.monthlySpendLimit || 5000,
  type: data.value.spendLimitConfig?.type || 'soft'
})

const openOtherServicesSettings = () => {
  console.log('Opening other services settings, current allocation:', data.value.otherServicesCredits.allocation)
  editableOtherServices.value = JSON.parse(JSON.stringify(data.value.otherServicesCredits.allocation))
  console.log('isEditingOtherServices set to:', true)
  isEditingOtherServices.value = true
  console.log('isEditingOtherServices.value now:', isEditingOtherServices.value)
}

const handleAddCredits = () => {
  // Placeholder for Add Credits functionality
  console.log('Add credits clicked')
  // TODO: Implement add credits flow
}

const cancelOtherServicesEdit = () => {
  isEditingOtherServices.value = false
  editableOtherServices.value = {}
}

const saveOtherServicesChanges = () => {
  console.log('Saving other services, editable data:', editableOtherServices.value)
  data.value.otherServicesCredits.allocation = JSON.parse(JSON.stringify(editableOtherServices.value))
  // Recalculate totals
  const totalUsed = Object.values(editableOtherServices.value).reduce((sum, item) => sum + item.used, 0)
  const totalAllocated = Object.values(editableOtherServices.value).reduce((sum, item) => sum + item.allocated, 0)
  data.value.otherServicesCredits.used = totalUsed
  data.value.otherServicesCredits.available = totalAllocated - totalUsed
  data.value.otherServicesCredits.totalCredits = totalAllocated
  console.log('After save, allocation:', data.value.otherServicesCredits.allocation)
  isEditingOtherServices.value = false
}

// Spend limit management
const openSpendLimitSettings = () => {
  editableSpendLimit.value = {
    enabled: data.value.spendLimitConfig.enabled !== undefined ? data.value.spendLimitConfig.enabled : true,
    amount: data.value.spendLimitConfig.amount !== undefined ? data.value.spendLimitConfig.amount : data.value.monthlySpendLimit || 5000,
    type: data.value.spendLimitConfig.type || 'soft'
  }
  isEditingSpendLimit.value = true
}

const cancelSpendLimitEdit = () => {
  isEditingSpendLimit.value = false
}

const removeSpendLimit = () => {
  editableSpendLimit.value.enabled = false
  editableSpendLimit.value.amount = null
  saveSpendLimitChanges()
}

const saveSpendLimitChanges = () => {
  data.value.spendLimitConfig = {
    enabled: editableSpendLimit.value.enabled,
    amount: editableSpendLimit.value.amount,
    type: editableSpendLimit.value.type
  }

  // Update monthlySpendLimit based on enabled state
  data.value.monthlySpendLimit = editableSpendLimit.value.enabled
    ? editableSpendLimit.value.amount
    : null

  // Recalculate percentage if limit exists
  if (data.value.monthlySpendLimit) {
    data.value.spendPercentage = Math.round(
      (data.value.currentSpend / data.value.monthlySpendLimit) * 100
    )
  } else {
    data.value.spendPercentage = 0
  }

  // Save to localStorage for persistence
  localStorage.setItem('scenarioB_spendLimit', JSON.stringify(data.value.spendLimitConfig))

  isEditingSpendLimit.value = false
}

// Validation for other services
const totalOtherServicesAllocated = computed(() => {
  if (!isEditingOtherServices.value) return 0
  return Object.values(editableOtherServices.value).reduce((sum, item) => sum + (item.allocated || 0), 0)
})

const hasOtherServicesError = computed(() => {
  if (!isEditingOtherServices.value) return false
  // Check if any allocation is less than current usage
  for (const key in editableOtherServices.value) {
    const item = editableOtherServices.value[key]
    if (item.allocated < item.used) return true
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
const selectedAgent = ref('all')
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

    // Filter by agent
    if (selectedAgent.value !== 'all') {
      if (entry.agentName !== selectedAgent.value) {
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
  rateCard: false,
  tierReset: false,
  billable: false,
  recharge: false,
  pricing: false,
  permissions: false
})

const getCurrentTier = () => {
  return data.value.tiers.find(t => t.tier === data.value.currentTier)
}

const getNextTier = () => {
  return data.value.tiers.find(t => t.tier === data.value.currentTier + 1)
}

const getServiceLabel = (key) => {
  const labels = {
    'sms': 'SMS/MMS',
    'international': 'International Calling',
    'fax': 'Fax',
    'domestic': 'Domestic Unlimited Calling'
  }
  return labels[key] || key
}

// Other Services Status & Trend Functions
const getOtherServicesTrend = (service) => {
  // Calculate expected vs actual burn rate
  const dayOfMonth = 10 // Simulated day 10
  const expectedDaily = service.allocated / 30
  const actualDaily = service.used / dayOfMonth
  const variance = actualDaily - expectedDaily

  if (Math.abs(variance) < expectedDaily * 0.1) {
    return 'On track'
  } else if (variance > 0) {
    return `↑${Math.round(Math.abs(variance))}`
  } else {
    return `↓${Math.round(Math.abs(variance))}`
  }
}

const getOtherServicesStatusClass = (service) => {
  const usagePercent = (service.used / service.allocated) * 100
  const dayOfMonth = 10
  const expectedPercent = (dayOfMonth / 30) * 100

  if (usagePercent > expectedPercent * 1.2) {
    return 'status-over'
  } else if (usagePercent > expectedPercent * 1.1) {
    return 'status-warning'
  } else {
    return 'status-on-track'
  }
}

const getOtherServicesStatusText = (service) => {
  const usagePercent = (service.used / service.allocated) * 100
  const dayOfMonth = 10
  const expectedPercent = (dayOfMonth / 30) * 100

  if (usagePercent > expectedPercent * 1.2) {
    return 'Over pace'
  } else if (usagePercent > expectedPercent * 1.1) {
    return 'Trending high'
  } else {
    return 'On track'
  }
}
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

.card:last-child {
  margin-bottom: 48px;
}

/* Hero Section - Spend */
.hero-section {
  text-align: left;
  padding-bottom: 20px;
}

.hero-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.hero-value {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
}

.hero-percentage {
  font-size: 16px;
  font-weight: 500;
  color: #666666;
}

.progress-bar-hero {
  height: 12px;
  background-color: #E5E5E5;
  border-radius: 6px;
  overflow: hidden;
  margin: 0 auto;
  max-width: 100%;
}

/* Section Divider */
.section-divider {
  height: 1px;
  background-color: #E5E5E5;
  margin: 8px 0;
}

/* Context Section - Tier Info */
.context-section {
  padding: 8px 0;
}

.context-line {
  font-size: 16px;
  color: #000000;
  margin-bottom: 6px;
}

.context-separator {
  margin: 0 8px;
  color: #CCCCCC;
}

.context-breakdown {
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
}

.context-detail {
  font-size: 20px;
  font-weight: 600;
  color: #1C1C1C;
  margin-bottom: 8px;
}

/* Tier Progress Section */
.tier-progress-section {
  padding: 8px 0;
}

.tier-progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.progress-bar-tier {
  height: 8px;
  background-color: #E5E5E5;
  border-radius: 4px;
  overflow: hidden;
}

.next-tier-rates {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
  font-weight: 500;
}

/* Forecast Line - Consolidated */
.forecast-line {
  padding: 8px 0;
}

.forecast-label {
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
  font-weight: 500;
}

.forecast-data {
  font-size: 16px;
  color: #000000;
  margin-bottom: 6px;
}

.forecast-detail {
  font-size: 13px;
  color: #888888;
}


.usage-item-simple {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 4px;
}

.usage-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.usage-label {
  font-weight: 600;
  font-size: 13px;
}

.usage-amount {
  font-size: 13px;
  color: #666666;
}

.progress-bar-small {
  height: 6px;
  background-color: #E5E5E5;
  border-radius: 3px;
  overflow: hidden;
}

.info-note {
  margin-top: 16px;
  padding: 12px;
  background-color: #F9F9F9;
  border-radius: 4px;
  font-size: 13px;
  color: #666666;
}

.billing-model-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.tiered-badge {
  background-color: #E5E5F8;
  color: #4A4A9E;
}

.credits-badge {
  background-color: #FFF4E5;
  color: #996600;
}

.credits-status {
}

.info-small {
  font-size: 12px;
  color: #888888;
  margin-top: 4px;
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

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.label {
  font-size: 12px;
  color: #888888;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value-large {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.info {
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
}

.info-small {
  font-size: 13px;
  color: #888888;
  margin-top: 4px;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.text-secondary {
  color: #666666;
}

.tier-badge {
  display: inline-block;
  padding: 8px 16px;
  background-color: #000000;
  color: #FFFFFF;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.progress-section {
  margin-top: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: #666666;
}

.progress-bar {
  height: 8px;
  background-color: #E5E5E5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #000000;
  transition: width 0.3s ease;
}

.progress-note {
  font-size: 13px;
  color: #000000;
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

.column-subtitle {
  font-size: 10px;
  font-weight: 400;
  color: #999999;
  text-transform: none;
  letter-spacing: 0;
  margin-top: 2px;
}

.data-table td {
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #F5F5F5;
}

.data-table .text-right {
  text-align: right;
}

.data-table .text-center {
  text-align: center;
}

.current-tier {
  background-color: #F9F9F9;
  font-weight: 600;
}

.current-marker {
  font-weight: bold;
}

.tier-transition {
  background-color: #F5F5F5;
}

.transition-badge {
  display: inline-block;
  padding: 2px 6px;
  background-color: #000000;
  color: #FFFFFF;
  border-radius: 4px;
  font-size: 11px;
}

.recharge-badge-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 4px;
}

.recharge-badge {
  display: inline-block;
  padding: 2px 4px;
  background-color: #000000;
  color: #FFFFFF;
  border-radius: 3px;
  font-size: 10px;
  cursor: help;
}

.recharge-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
}

.recharge-badge-wrapper:hover .recharge-tooltip {
  visibility: visible;
  opacity: 1;
}

.recharge-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
}

.spend-row {
  display: flex;
  gap: 24px;
}

.spend-card {
  flex: 1;
  background-color: #F9F9F9;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 16px;
}


.history-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
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

.value {
  font-weight: 600;
}

.small-text {
  font-size: 12px;
  color: #888888;
}

.history-note {
  margin-top: 16px;
  padding: 12px;
  background-color: #F9F9F9;
  border-radius: 4px;
  font-size: 13px;
  color: #666666;
}

/* Forecast Card Styles */
.forecast-card {
  background: linear-gradient(135deg, #F3F3FF 0%, #FFFFFF 100%);
  border-left: 4px solid #6B46EE;
}

.forecast-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

/* Spend Section Styles */
.spend-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E5E5E5;
}

.forecast-section {
  margin-top: 24px;
  border-top: 1px solid #E5E5E5;
}

.spend-item {
  margin-bottom: 12px;
}

.spend-label {
  font-size: 12px;
  color: #888888;
  margin-bottom: 4px;
}

.spend-value {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C;
}

.guardrails-note {
  padding-top: 12px;
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

.expand-toggle {
  font-size: 24px;
  font-weight: 300;
  color: #666666;
  margin-left: 12px;
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

/* Editing UI Styles */
.allocation-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.allocation-row {
  display: grid;
  grid-template-columns: 200px 1fr auto;
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
  min-width: 80px;
}

.allocation-used {
  text-align: right;
  min-width: 200px;
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

.usage-list-simple {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
}

.summary-label {
  font-weight: 600;
  color: #666666;
}

/* Usage Alerts Section (inside Other Services Settings) */
.alerts-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #E5E5E5;
}

.alerts-header {
  font-size: 16px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 4px 0;
}

.alerts-subtitle {
  color: #666666;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.alerts-list-single-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 4px;
  border: 1px solid #E5E5E5;
}

.alert-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #CCCCCC;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #FFFFFF;
}

.alert-checkbox.checked {
  background-color: #1C1C1C;
  border-color: #1C1C1C;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  color: #1C1C1C;
  font-weight: 500;
}

.no-limit {
  color: #999999;
}

.summary-value {
  font-weight: 600;
  color: #1C1C1C;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.hero-left {
  flex: 1;
}

.hero-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.hero-edit {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 42px;
  font-weight: 600;
  margin-top: 8px;
}

.hero-spend-current {
  color: #1C1C1C;
}

.hero-slash {
  color: #CCCCCC;
  margin: 0 4px;
}

.hero-dollar {
  color: #1C1C1C;
}

.hero-limit-label {
  font-size: 16px;
  color: #666666;
  margin-left: 4px;
}

.spend-limit-input {
  width: 150px;
  padding: 8px 12px;
  border: 2px solid #CCCCCC;
  border-radius: 4px;
  font-size: 42px;
  font-weight: 600;
  font-family: inherit;
}

.spend-limit-input:focus {
  outline: none;
  border-color: #6B46EE;
}

.spend-limit-input.input-error {
  border-color: #E52C2C;
  background-color: #FFF5F5;
}

.validation-warning-inline {
  font-size: 13px;
  color: #E52C2C;
  margin-top: 8px;
  margin-bottom: 8px;
}

.btn-secondary-small {
  padding: 6px 12px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-secondary-small:hover {
  background-color: #F9F9F9;
}

.btn-primary-small {
  padding: 6px 12px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary-small:hover {
  background-color: #333333;
}

.btn-primary-small:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary-small:disabled:hover {
  background-color: #CCCCCC;
}

.card-header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header-with-actions h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.validation-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #FFF5F5;
  border: 1px solid #FFCCCC;
  border-radius: 4px;
  margin-bottom: 16px;
}

.warning-icon {
  font-size: 16px;
}

.warning-text {
  font-size: 14px;
  color: #E52C2C;
}

.usage-edit-simple {
  display: flex;
  align-items: center;
  gap: 8px;
}

.usage-used-simple {
  font-size: 13px;
  color: #666666;
}

.allocation-input-simple {
  width: 100px;
  padding: 4px 8px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 14px;
}

.allocation-input-simple:focus {
  outline: none;
  border-color: #6B46EE;
}

.allocation-input-simple.input-error {
  border-color: #E52C2C;
  background-color: #FFF5F5;
}

.usage-unit-simple {
  font-size: 13px;
  color: #666666;
}

.validation-error-simple {
  font-size: 12px;
  color: #E52C2C;
  margin-top: 4px;
}

.edit-summary-simple {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.summary-label {
  color: #666666;
}

.summary-value {
  font-weight: 600;
  color: #1C1C1C;
}

/* Agent Consumption Summary Card */
.agent-summary-card {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
}

.agent-summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.agent-summary-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  transition: all 0.2s;
}

.agent-summary-item:hover {
  border-color: #CCCCCC;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.agent-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #F0F0F0;
  color: #535353;
  font-size: 18px;
  font-weight: 700;
  border-radius: 6px;
  flex-shrink: 0;
}

.agent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.agent-name-summary {
  font-size: 16px;
  font-weight: 600;
  color: #1C1C1C;
}

.agent-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  display: inline-block;
  background-color: #F0F0F0;
  color: #535353;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
}

.agent-cost {
  font-size: 20px;
  font-weight: 700;
  color: #1C1C1C;
}

.view-all-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
}

.remaining-count {
  font-size: 14px;
  color: #666666;
}

.view-all-link {
  color: #1C1C1C;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #535353;
  text-decoration: underline;
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

/* ===== SCENARIO B SPECIFIC STYLES ===== */

/* Trend Card (1-line banner) */
.trend-card {
  background-color: #FFFBF0;
  border: 1px solid #FFE0B2;
  border-radius: 6px;
  padding: 16px 20px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 400;
  color: #1C1C1C;
  line-height: 1.4;
}

.trend-card strong {
  font-weight: 700;
  color: #1C1C1C;
}

/* Status Dots */
.status-dot {
  font-size: 14px;
  margin-right: 6px;
}

.status-dot.status-on-track {
  color: #10B981;
}

.status-dot.status-warning {
  color: #F59E0B;
}

.status-dot.status-over {
  color: #EF4444;
}

/* Hero Cards Grid - 3 columns for Scenario B */
.hero-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* Hero Card Base */
.hero-card {
  background-color: #FAFAFA;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.hero-card-primary {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* Hero Card Elements */
.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.hero-label {
  font-size: 11px;
  font-weight: 600;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-number {
  font-size: 36px;
  font-weight: 600;
  color: #1C1C1C;
  line-height: 1.2;
}

.hero-interpretation {
  font-size: 14px;
  color: #666666;
  line-height: 1.4;
}

.hero-commit {
  font-size: 13px;
  color: #888888;
  margin-top: 4px;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-badge.status-on-track {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-badge.status-warning {
  background-color: #FEF3C7;
  color: #92400E;
}

.status-badge.status-over {
  background-color: #FEE2E2;
  color: #991B1B;
}

/* Tier Name - Prominent Display */
.hero-tier-name {
  font-size: 28px;
  font-weight: 600;
  color: #1C1C1C;
  line-height: 1.2;
}

/* Forecast Block */
.forecast-block {
  margin-top: 24px;
  padding: 16px;
  background-color: #FAFAFA;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
}

.forecast-line-compact {
  font-size: 14px;
  color: #1C1C1C;
  line-height: 1.6;
  margin-bottom: 8px;
}

.forecast-line-compact strong {
  font-weight: 600;
}

.guardrails-compact {
  font-size: 11px;
  color: #999999;
  font-weight: 400;
  padding-top: 8px;
  border-top: 1px solid #E5E5E5;
}

/* ===== BUDGET TABLE LEDGER STYLES (Scenario A Style) ===== */

/* Budget Snapshot Full Width */
.budget-snapshot-full {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.budget-snapshot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.budget-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.budget-snapshot-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0;
}

.overall-trend {
  font-size: 12px;
  color: #666666;
  font-weight: 400;
}

.btn-export {
  padding: 6px 12px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-export:hover {
  background-color: #F9F9F9;
  border-color: #999999;
}

/* Budget Table Ledger */
.budget-table-ledger {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.budget-table-ledger thead {
  border-bottom: 1px solid #eee;
}

.budget-table-ledger th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
}

.budget-table-ledger tbody tr {
  border-bottom: 1px solid #eee;
}

.budget-table-ledger td {
  padding: 12px;
  font-size: 14px;
  color: #1C1C1C;
  vertical-align: middle;
}

/* Category column */
.td-category {
  font-weight: 600;
}

/* Alloc/Used column */
.td-alloc-used {
  color: #666666;
}

/* Remaining column - HERO NUMBER */
.td-remaining {
  font-weight: 600;
  font-size: 15px;
}

/* Trend column */
.td-trend {
  color: #666666;
}

.sparkline {
  font-size: 12px;
  margin-right: 4px;
  color: #888888;
}

/* Status column */
.td-status {
  white-space: nowrap;
}

/* ===== SPEND LIMIT MANAGEMENT ===== */

/* Hero action button (matches Scenario A "Add credits" style) */
.hero-action-btn {
  margin-top: 12px;
  padding: 6px 12px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #1C1C1C;
  transition: all 0.2s ease;
}

.hero-action-btn:hover {
  background-color: #F9F9F9;
  border-color: #999999;
}

/* Manage spend limit link - subtle text link */
.manage-limit-link {
  margin-top: 12px;
  font-size: 12px;
  color: #666666;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-family: inherit;
  font-weight: 400;
  display: block;
  text-align: left;
}

.manage-limit-link:hover {
  color: #1C1C1C;
}

/* Spend limit form container */
.spend-limit-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group-remove {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #E5E7EB;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1C1C1C;
  margin-bottom: 8px;
}

.form-helper {
  font-size: 12px;
  color: #666666;
  margin-top: 4px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.input-with-prefix {
  display: flex;
  align-items: center;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  overflow: hidden;
  max-width: 300px;
}

.input-with-prefix:focus-within {
  border-color: #0066FF;
}

.input-prefix {
  padding: 0 12px;
  background-color: #F5F5F5;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  border-right: 1px solid #CCCCCC;
  height: 40px;
  display: flex;
  align-items: center;
}

.form-input {
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-size: 14px;
  color: #1C1C1C;
  outline: none;
  font-family: inherit;
}

.form-input:disabled {
  background-color: #F5F5F5;
  color: #999999;
  cursor: not-allowed;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1C1C1C;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.link-remove-limit {
  font-size: 12px;
  color: #6B7280;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.4;
}

.link-remove-limit:hover {
  color: #1C1C1C;
}

/* Header actions grouped (for Cancel/Save button pair) */
.header-actions-grouped {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
