<template>
  <AdminShell>
    <div class="scenario-page">
      <div class="page-header">
        <h1>Credits and Usage</h1>
        <p class="subtitle">Scenario A: Upfront Credits + Budget Allocation</p>
      </div>

      <!-- Trend / Prediction Card - Small, separate, above hero cards -->
      <div v-if="!isEditingBudget" class="trend-card">
        Used <strong>${{ data.used.toLocaleString() }}</strong> by day 10 (expected <strong>~$5,000</strong>) · Depletes by <strong>{{ data.forecast.projectedRunOutDate }}</strong> ({{ data.forecast.daysRemaining }} days)
      </div>

      <!-- Hero Cards - One Money View (State) -->
      <div class="card">
        <div v-if="!isEditingBudget && !isEditingRollover" class="hero-cards-grid">
          <!-- 1. Total Remaining -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">REMAINING CAPACITY</span>
              <span class="status-badge status-on-track">On track</span>
            </div>
            <div class="hero-number">${{ data.available.toLocaleString() }}</div>
            <div class="hero-interpretation">Credits left before buffer activates</div>
            <div class="hero-commit">Of ${{ data.totalCredits.toLocaleString() }} monthly commit · Renews {{ data.package.renewalDate }}</div>
            <button class="hero-action-btn" @click="handleAddCredits">Add credits</button>
          </div>

          <!-- 2. Current Spend -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">CURRENT SPEND</span>
              <span class="status-badge status-warning">Trending high</span>
            </div>
            <div class="hero-number">${{ data.used.toLocaleString() }}</div>
            <div class="hero-micro-trend">↑ $4,000 over expected pace</div>
            <div class="hero-interpretation">Ahead of expected for day 10</div>
            <div class="hero-commit">Month-to-date across all usage</div>
          </div>

          <!-- 3. Primary Category Budget -->
          <div class="hero-card">
            <div class="hero-header">
              <span class="hero-label">AGENTIC BUDGET</span>
              <span class="status-badge status-on-track">On track</span>
            </div>
            <div class="hero-number">{{ data.budgetAllocation.aiAgentDigital.remaining.toLocaleString() }}</div>
            <div class="hero-interpretation">Locked rate: 80¢/conversation · ≈ {{ data.budgetAllocation.aiAgentDigital.remaining.toLocaleString() }} conversations remaining</div>
            <div class="hero-commit">Of {{ data.budgetAllocation.aiAgentDigital.allocated.toLocaleString() }} allocated · On track for month-end</div>
          </div>

          <!-- 4. Expiring Credits Alert -->
          <div class="hero-card" v-if="data.expiration.expiring > 0">
            <div class="hero-header">
              <span class="hero-label">EXPIRING CREDITS</span>
              <span class="status-badge status-alert">Expires soon</span>
            </div>
            <div class="hero-number">${{ data.expiration.expiring.toLocaleString() }}</div>
            <div class="hero-interpretation">One-time credits · <strong>27 days</strong> remaining</div>
            <div class="hero-sequencing">Used only after monthly credits run out.</div>
            <div class="hero-commit">
              Expires {{ data.expiration.expirationDate }}
              <span class="info-icon-wrapper">
                <DtIconInfo class="info-icon" />
                <span class="info-tooltip">Expired credits are lost and cannot be recovered. Use them before expiration or contact your Account Manager to request an extension.</span>
              </span>
            </div>
            <button class="hero-action-btn" @click="openRolloverSettings">Manage rollover</button>
          </div>
        </div>

        <!-- Budget Snapshot - Full Width -->
        <div v-if="!isEditingBudget && !isEditingRollover" class="budget-snapshot-full">
          <div class="budget-snapshot-header">
            <div class="budget-header-left">
              <h3>Budget snapshot</h3>
              <span class="overall-trend">Overall pace: ↑ High usage trend</span>
            </div>
            <button class="btn-export" @click="openBudgetSettings">Adjust allocation</button>
          </div>

          <table class="budget-table-ledger">
            <thead>
              <tr>
                <th class="th-category">Category</th>
                <th class="th-alloc-used">Alloc/Used</th>
                <th class="th-remaining">Remaining</th>
                <th class="th-trend">Trend</th>
                <th class="th-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in data.budgetAllocation" :key="key" class="budget-row">
                <td class="td-category">{{ item.label }}</td>
                <td class="td-alloc-used">{{ item.allocated.toLocaleString() }} · {{ item.used.toLocaleString() }} used</td>
                <td class="td-remaining">${{ item.remaining.toLocaleString() }}</td>
                <td class="td-trend">
                  <span class="sparkline">▂▃▅▇</span> {{ getShortVariance(item, key) }}
                </td>
                <td class="td-status">
                  <span class="status-dot" :class="getStatusClass(item)">●</span> {{ getStatusText(item) }}
                </td>
              </tr>
            </tbody>
          </table>
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

        <div v-if="isEditingBudget" class="edit-actions">
          <button class="btn-secondary" @click="cancelBudgetEdit">Cancel</button>
          <button class="btn-primary" @click="saveBudgetChanges" :disabled="hasValidationError">Save Changes</button>
        </div>

        <!-- Rollover Settings Panel -->
        <div v-if="isEditingRollover" class="rollover-settings-panel">
          <div class="rollover-header">
            <h2>Manage rollover</h2>
            <p class="rollover-subtitle">Control how renewing credits, one-time credits, and auto-top-ups behave</p>
          </div>

          <!-- Section 1: Consumption Order -->
          <div class="rollover-section">
            <h3 class="rollover-section-title">Consumption order</h3>
            <div class="rollover-radio-group">
              <label class="rollover-radio-label">
                <input type="radio" v-model="editableRollover.consumptionOrder" value="renewing-first" />
                <span>Use renewing credits first</span>
              </label>
              <label class="rollover-radio-label">
                <input type="radio" v-model="editableRollover.consumptionOrder" value="onetime-first" />
                <span>Use one-time credits first</span>
              </label>
            </div>
            <p class="rollover-help-text">One-time credits are used only after your monthly renewing pool is exhausted.</p>
          </div>

          <!-- Section 2: Auto-Renew -->
          <div class="rollover-section">
            <h3 class="rollover-section-title">Auto-renew (optional)</h3>
            <div class="rollover-input-row">
              <label class="rollover-input-label">
                Auto top-up when renewing credits fall below:
                <input
                  type="number"
                  v-model.number="editableRollover.autoRenew.threshold"
                  :disabled="!editableRollover.autoRenew.enabled"
                  class="rollover-input"
                  placeholder="500"
                />
              </label>
              <label class="rollover-input-label">
                Top-up amount:
                <input
                  type="number"
                  v-model.number="editableRollover.autoRenew.topUpAmount"
                  :disabled="!editableRollover.autoRenew.enabled"
                  class="rollover-input"
                  placeholder="5000"
                />
              </label>
            </div>
            <div class="rollover-radio-group">
              <label class="rollover-checkbox-label">
                <input type="checkbox" v-model="editableRollover.autoRenew.enabled" />
                <span>Enable auto-renew</span>
              </label>
              <label class="rollover-radio-label">
                <input
                  type="radio"
                  v-model="editableRollover.autoRenew.alertBeforeRenew"
                  :value="true"
                  :disabled="!editableRollover.autoRenew.enabled"
                />
                <span>Send alert before auto-renew</span>
              </label>
              <label class="rollover-radio-label">
                <input
                  type="radio"
                  v-model="editableRollover.autoRenew.alertBeforeRenew"
                  :value="false"
                  :disabled="!editableRollover.autoRenew.enabled"
                />
                <span>Auto-renew silently</span>
              </label>
            </div>
          </div>

          <!-- Section 3: One-Time Credit Expiration -->
          <div class="rollover-section">
            <h3 class="rollover-section-title">One-time credit expiration</h3>
            <div class="rollover-info-row">
              <div class="rollover-info-item">
                <span class="rollover-info-label">Current one-time balance:</span>
                <span class="rollover-info-value">${{ data.expiration.expiring.toLocaleString() }}</span>
              </div>
              <div class="rollover-info-item">
                <span class="rollover-info-label">Expiration date:</span>
                <span class="rollover-info-value">{{ data.expiration.expirationDate }} ({{ data.forecast.daysRemaining }} days left)</span>
              </div>
            </div>
            <p class="rollover-subsection-label">Expiration alerts:</p>
            <div class="rollover-checkbox-group">
              <label class="rollover-checkbox-label">
                <input type="checkbox" v-model="editableRollover.expirationAlerts.thirtyDays" />
                <span>30 days before</span>
              </label>
              <label class="rollover-checkbox-label">
                <input type="checkbox" v-model="editableRollover.expirationAlerts.sevenDays" />
                <span>7 days before</span>
              </label>
              <label class="rollover-checkbox-label">
                <input type="checkbox" v-model="editableRollover.expirationAlerts.dayOf" />
                <span>Day of expiration</span>
              </label>
            </div>
            <button class="rollover-learn-link" @click="showPoolExplanation = !showPoolExplanation">
              {{ showPoolExplanation ? '− Hide explanation' : '+ Learn how credit pools work' }}
            </button>
            <div v-if="showPoolExplanation" class="rollover-explanation">
              <p>Renewing credits refill monthly and are used first.</p>
              <p>One-time credits are a backup pool that expire after 30 days.</p>
              <p>Your auto-renew and fallback settings control how they interact.</p>
            </div>
          </div>

          <!-- Section 4: Exhaustion Fallback -->
          <div class="rollover-section">
            <h3 class="rollover-section-title">Exhaustion fallback</h3>
            <p class="rollover-subsection-label">When both pools reach zero:</p>
            <div class="rollover-radio-group">
              <label class="rollover-radio-label">
                <input type="radio" v-model="editableRollover.exhaustionFallback" value="block" />
                <span>Block usage</span>
              </label>
              <label class="rollover-radio-label">
                <input type="radio" v-model="editableRollover.exhaustionFallback" value="overage" />
                <span>Allow usage and bill at overage rates (if supported)</span>
              </label>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="rolloverValidationErrors.length > 0" class="rollover-errors">
            <div v-for="(error, index) in rolloverValidationErrors" :key="index" class="rollover-error">
              {{ error }}
            </div>
          </div>

          <!-- Actions -->
          <div class="edit-actions">
            <button class="btn-secondary" @click="cancelRolloverEdit">Cancel</button>
            <button class="btn-primary" @click="saveRolloverChanges" :disabled="hasRolloverValidationError">Save changes</button>
          </div>
        </div>
      </div>

      <!-- Usage History -->
      <div v-if="!isEditingBudget && !isEditingRollover" class="card">
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
                <span v-if="entry.rechargeApplied" class="recharge-badge-wrapper">
                  <span class="recharge-badge">2×</span>
                  <span class="recharge-tooltip">{{ entry.rechargeReason }}</span>
                </span>
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
      <div v-if="!isEditingBudget && !isEditingRollover" class="card">
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
      <div v-if="!isEditingBudget && !isEditingRollover" class="card">
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
      <div v-if="!isEditingBudget && !isEditingRollover" class="card">
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

// Rollover settings editing
const isEditingRollover = ref(false)
const editableRollover = ref({})
const showPoolExplanation = ref(false)

const openRolloverSettings = () => {
  // Create a deep copy of current rollover settings for editing
  editableRollover.value = JSON.parse(JSON.stringify(data.value.rolloverSettings))
  isEditingRollover.value = true
}

const cancelRolloverEdit = () => {
  isEditingRollover.value = false
  editableRollover.value = {}
  showPoolExplanation.value = false
}

const saveRolloverChanges = () => {
  // Update the actual data
  data.value.rolloverSettings = JSON.parse(JSON.stringify(editableRollover.value))
  isEditingRollover.value = false
  showPoolExplanation.value = false
}

const handleAddCredits = () => {
  // Placeholder for Add Credits functionality
  console.log('Add credits clicked')
  // TODO: Implement add credits flow
}

// Rollover validation
const rolloverValidationErrors = computed(() => {
  if (!isEditingRollover.value) return []

  const errors = []
  const settings = editableRollover.value

  // Validate threshold
  if (settings.autoRenew.enabled) {
    if (settings.autoRenew.threshold >= data.value.available) {
      errors.push('Threshold must be lower than your monthly credit pool')
    }
    if (settings.autoRenew.threshold < 0) {
      errors.push('Threshold must be $0 or greater')
    }

    // Validate top-up amount
    if (settings.autoRenew.topUpAmount <= 0) {
      errors.push('Top-up amount must be greater than $0')
    }
  }

  return errors
})

const hasRolloverValidationError = computed(() => {
  return rolloverValidationErrors.value.length > 0
})

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

// Calculate ring progress for SVG circle
const getRingProgress = (used, total, radius) => {
  const circumference = 2 * Math.PI * radius // Total circle length
  const percentage = (used / total) * 100
  const progress = (percentage / 100) * circumference

  // Return as "progress remaining" format for stroke-dasharray
  return `${progress} ${circumference}`
}

// Get category color (Apple Watch style)
const getCategoryColor = (key) => {
  const colors = {
    aiAgentDigital: '#FF3B30', // Red
    aiAgentVoice: '#FF6B6B',   // Light Red
    sms: '#34C759',            // Green
    international: '#007AFF',   // Blue
    fax: '#FF9500'             // Orange
  }
  return colors[key] || '#666666'
}

// Calculate status based on usage trend
const getStatusClass = (item) => {
  const percentUsed = (item.used / item.allocated) * 100

  // Simple heuristic: if used > 50% and remaining is low, show warning
  if (percentUsed >= 80) return 'status-over'
  if (percentUsed >= 60) return 'status-warning'
  return 'status-on-track'
}

const getStatusText = (item) => {
  const percentUsed = (item.used / item.allocated) * 100

  if (percentUsed >= 80) return 'Over budget'
  if (percentUsed >= 60) return 'Projected over'
  return 'On track'
}

const getStatusIcon = (item) => {
  const percentUsed = (item.used / item.allocated) * 100

  if (percentUsed >= 80) return '●'
  if (percentUsed >= 60) return '▲'
  return '✓'
}

// Get projection text
const getProjectionText = (item, key) => {
  const percentUsed = (item.used / item.allocated) * 100

  if (percentUsed >= 80) {
    return 'At current pace: will deplete soon'
  } else if (percentUsed >= 60) {
    return 'At current pace: may exceed by month end'
  } else {
    const projectedRemaining = Math.round(item.remaining * 0.7) // Rough estimate
    return `Projected: ${projectedRemaining.toLocaleString()} remaining at month end`
  }
}

// Get context text (what credits mean in real terms)
const getContextText = (item, key) => {
  switch(key) {
    case 'aiAgentDigital':
    case 'aiAgentVoice':
      return `≈ ${item.remaining.toLocaleString()} conversations`
    case 'sms':
      const messagesPerCredit = 20 // Rough estimate
      return `≈ ${(item.remaining * messagesPerCredit).toLocaleString()} messages`
    case 'international':
      const avgCallMinutes = 8
      const callsEstimate = Math.round(item.remaining / avgCallMinutes)
      return `≈ ${callsEstimate} calls (avg ${avgCallMinutes} min)`
    case 'fax':
      return `≈ ${item.remaining.toLocaleString()} pages`
    default:
      return `${item.remaining.toLocaleString()} ${item.unit} remaining`
  }
}

// Get daily trend text for current spend card
const getDailyTrendText = () => {
  // Assume we're on day 10 of a 30-day month for demo
  const currentDay = 10
  const daysInMonth = 30
  const expectedSpendByNow = (data.value.totalCredits / daysInMonth) * currentDay
  const actualSpend = data.value.used

  if (actualSpend > expectedSpendByNow * 1.15) {
    return `You're ahead of expected usage for day ${currentDay} of the cycle.`
  } else if (actualSpend < expectedSpendByNow * 0.85) {
    return `You're below expected usage for day ${currentDay} of the cycle.`
  }
  return `On track with expected usage for day ${currentDay} of the cycle.`
}

// Get expected vs actual comparison text
const getExpectedVsActualText = () => {
  // Assume we're on day 10 of a 30-day month
  const currentDay = 10
  const daysInMonth = 30
  const expectedSpendByNow = Math.round((data.value.totalCredits / daysInMonth) * currentDay)
  const actualSpend = data.value.used

  return `By today you'd ideally have used about $${expectedSpendByNow.toLocaleString()}. You've used $${actualSpend.toLocaleString()}.`
}

// Get sparkline for budget item (tiny inline chart)
// Get percentage for bar chart
const getPercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Get unit interpretation for budget items
const getUnitInterpretation = (item, key) => {
  switch(key) {
    case 'aiAgentDigital':
    case 'aiAgentVoice':
      return `≈ ${item.remaining.toLocaleString()} conversations remaining this month`
    case 'sms':
      const messagesPerCredit = 20 // Rough estimate
      return `≈ ${(item.remaining * messagesPerCredit).toLocaleString()} messages remaining`
    case 'international':
      const avgCallMinutes = 8
      const callsEstimate = Math.round(item.remaining / avgCallMinutes)
      return `≈ ${callsEstimate} calls remaining (avg ${avgCallMinutes} min)`
    case 'fax':
      return `≈ ${item.remaining.toLocaleString()} pages remaining`
    case 'domestic':
      return `Unlimited calling`
    default:
      return `${item.remaining.toLocaleString()} ${item.unit} remaining`
  }
}

// Get variance text (ahead/behind expected)
const getVarianceText = (item, key) => {
  const currentDay = 10
  const daysInMonth = 30
  const expectedUsedByNow = (item.allocated / daysInMonth) * currentDay
  const actualUsed = item.used
  const variance = actualUsed - expectedUsedByNow

  if (Math.abs(variance) < item.allocated * 0.05) {
    // Within 5% - on track
    return `On track with expected usage for day ${currentDay}`
  } else if (variance > 0) {
    // Ahead (using more than expected)
    return `↑ ahead by ${Math.round(variance).toLocaleString()} vs expected for day ${currentDay}`
  } else {
    // Behind (using less than expected)
    return `↓ under by ${Math.abs(Math.round(variance)).toLocaleString()} vs expected for day ${currentDay}`
  }
}

// Get SHORT unit interpretation for compact ledger view
const getShortUnitInterpretation = (item, key) => {
  switch(key) {
    case 'aiAgentDigital':
    case 'aiAgentVoice':
      return `≈ ${item.remaining.toLocaleString()} conv`
    case 'sms':
      const msgs = item.remaining * 20
      return `≈ ${msgs.toLocaleString()} msgs`
    case 'international':
      const calls = Math.round(item.remaining / 8)
      return `≈ ${calls} calls`
    case 'fax':
      return `≈ ${item.remaining.toLocaleString()} pages`
    case 'domestic':
      return `Unlimited`
    default:
      return `${item.remaining.toLocaleString()} ${item.unit}`
  }
}

// Get SHORT variance for compact ledger view
const getShortVariance = (item, key) => {
  const currentDay = 10
  const daysInMonth = 30
  const expectedUsedByNow = (item.allocated / daysInMonth) * currentDay
  const actualUsed = item.used
  const variance = actualUsed - expectedUsedByNow

  if (Math.abs(variance) < item.allocated * 0.05) {
    return `On track`
  } else if (variance > 0) {
    return `↑${Math.round(variance)}`
  } else {
    return `↓${Math.abs(Math.round(variance))}`
  }
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

/* Hero Cards Grid */
.hero-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 1024px) {
  .hero-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.hero-card {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* Primary hero cards - higher visual priority */
.hero-card-primary {
  padding: 24px;
}

.hero-card-primary .hero-label {
  font-size: 12px;
  letter-spacing: 0.6px;
}

.hero-card-primary .hero-number {
  font-size: 44px;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.hero-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666666;
}

.hero-number {
  font-size: 40px;
  font-weight: 600;
  color: #1C1C1C;
  line-height: 1;
  margin-bottom: 4px;
}

.hero-micro-trend {
  font-size: 11px;
  font-weight: 500;
  color: #666666;
  margin-top: 4px;
  margin-bottom: 6px;
  line-height: 1.3;
}

.hero-context {
  font-size: 14px;
  color: #535353;
  font-weight: 500;
}

.hero-helper {
  font-size: 13px;
  color: #888888;
  line-height: 1.4;
}

/* Status Badges */
.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.status-on-track {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-warning {
  background-color: #FFF8E1;
  color: #F57C00;
}

.status-over {
  background-color: #FFEBEE;
  color: #C62828;
}

.status-alert {
  background-color: #E3F2FD;
  color: #1976D2;
}

/* Status Dots (for table) */
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

/* Trend Card - Small, calm, separate */
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

.trend-line-3 strong {
  color: #1C1C1C;
  font-weight: 600;
}

/* Hero Card Interpretation Layers */
.hero-interpretation {
  font-size: 14px;
  font-weight: 500;
  color: #1C1C1C;
  margin-top: 8px;
  line-height: 1.4;
}

.hero-sequencing {
  font-size: 13px;
  font-weight: 400;
  color: #666666;
  margin-top: 4px;
  line-height: 1.4;
}

.hero-commit {
  font-size: 12px;
  color: #888888;
  margin-top: 4px;
  line-height: 1.4;
}

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

/* Budget Snapshot Enhanced - Ledger feel */
.budget-list-enhanced {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Budget Snapshot - Table Ledger */
.budget-table-ledger {
  width: 100%;
  border-collapse: collapse;
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
  margin-bottom: 8px;
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
  font-size: 13px;
  color: #666;
}

.budget-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-text {
  background: none;
  border: none;
  color: #1976D2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-text:hover {
  text-decoration: underline;
}

.budget-snapshot-subtitle {
  font-size: 13px;
  color: #666666;
  margin-bottom: 20px;
  line-height: 1.5;
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

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
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

/* Rollover Settings Panel */
.rollover-settings-panel {
}

.rollover-header {
}

.rollover-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 8px 0;
}

.rollover-subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.rollover-section {
  padding: 24px 0;
  border-bottom: 1px solid #E5E5E5;
}

.rollover-section:last-of-type {
  border-bottom: none;
}

.rollover-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 16px 0;
}

.rollover-subsection-label {
  font-size: 14px;
  font-weight: 500;
  color: #1C1C1C;
  margin: 16px 0 12px 0;
}

.rollover-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rollover-radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1C1C1C;
  cursor: pointer;
}

.rollover-radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.rollover-radio-label input[type="radio"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rollover-radio-label:has(input:disabled) span {
  opacity: 0.5;
}

.rollover-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rollover-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1C1C1C;
  cursor: pointer;
}

.rollover-checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.rollover-help-text {
  font-size: 13px;
  color: #666666;
  margin: 12px 0 0 0;
  line-height: 1.5;
}

.rollover-input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.rollover-input-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #1C1C1C;
  font-weight: 500;
}

.rollover-input {
  padding: 10px 14px;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.2s;
  background-color: #FFFFFF;
}

.rollover-input:hover:not(:disabled) {
  border-color: #999999;
}

.rollover-input:focus {
  outline: none;
  border-color: #6B46EE;
  box-shadow: 0 0 0 3px rgba(107, 70, 238, 0.08);
}

.rollover-input:disabled {
  background-color: #F5F5F5;
  color: #999999;
  cursor: not-allowed;
}

.rollover-info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #F9F9F9;
  border-radius: 6px;
}

.rollover-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rollover-info-label {
  font-size: 12px;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.rollover-info-value {
  font-size: 16px;
  color: #1C1C1C;
  font-weight: 600;
}

.rollover-learn-link {
  margin-top: 16px;
  background: none;
  border: none;
  color: #1976D2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.rollover-learn-link:hover {
  text-decoration: underline;
}

.rollover-explanation {
  margin-top: 12px;
  padding: 16px;
  background-color: #F3F3FF;
  border-left: 4px solid #6B46EE;
  border-radius: 4px;
}

.rollover-explanation p {
  font-size: 13px;
  color: #1C1C1C;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.rollover-explanation p:last-child {
  margin-bottom: 0;
}

.rollover-errors {
  margin-top: 16px;
  padding: 16px;
  background-color: #FFF5F5;
  border-left: 4px solid #E52C2C;
  border-radius: 4px;
}

.rollover-error {
  font-size: 14px;
  color: #E52C2C;
  font-weight: 500;
  margin-bottom: 8px;
}

.rollover-error:last-child {
  margin-bottom: 0;
}
</style>
