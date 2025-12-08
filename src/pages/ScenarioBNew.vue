<template>
  <AdminShell>
    <div class="scenario-page">
      <div class="page-header">
        <div class="mode-indicator">Scenario B · Hybrid</div>
        <h1>Credits and Usage</h1>
        <h2 class="scenario-label">Recurring Credits + Committed Packs</h2>
        <p class="subtitle">Flexible recurring pool + prepaid usage bundles per usage type.</p>
      </div>

      <!-- Combined Pacing Banner -->
      <div class="trend-card">
        Used <strong>${{ currentSpend.toLocaleString() }}</strong> by day {{ trendCardData.currentDay }} (expected <strong>~${{ trendCardData.expectedSpend.toLocaleString() }}</strong>) · Combined capacity depletes by <strong>{{ trendCardData.depletionDate }}</strong> ({{ trendCardData.daysRemaining }} days)
      </div>

      <!-- Hero Cards -->
      <div class="card">
        <div class="hero-cards-grid">
          <!-- 1. Committed Packs Overview -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                COMMITTED PACKS
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Packs are consumed first before recurring credits.</span>
                </span>
              </span>
              <span class="status-badge status-on-track">{{ numberOfActivePacks }} active</span>
            </div>
            <div class="hero-number">{{ Math.round(averagePackUtilization) }}%</div>
            <div class="hero-interpretation">Average utilization across all packs</div>
            <div class="hero-commit">{{ totalPackRemaining.toLocaleString() }} units remaining of {{ totalPackCapacity.toLocaleString() }} total</div>
            <button class="hero-action-btn">Configure packs</button>
          </div>

          <!-- 2. Flexible Credits Pool -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                FLEXIBLE CREDITS
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Used after committed packs are exhausted, or for services without packs.</span>
                </span>
              </span>
              <span class="status-badge status-on-track">On track</span>
            </div>
            <div class="hero-number">${{ data.available.toLocaleString() }}</div>
            <div class="hero-interpretation">Recurring credit pool remaining</div>
            <div class="hero-commit">Of ${{ data.totalCredits.toLocaleString() }} monthly recurring credits</div>
            <button class="hero-action-btn">Add credits</button>
          </div>

          <!-- 3. Current Spend -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                CURRENT SPEND
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">At current pace, your combined pools will deplete by {{ trendCardData.depletionDate }} - {{ trendCardData.daysRemaining }} days remaining. You're spending ${{ Math.abs(spendingVariance).toLocaleString() }} {{ spendingVariance > 0 ? 'more' : 'less' }} than expected at this point in the cycle.</span>
                </span>
              </span>
              <span class="status-badge status-warning">Trending high</span>
            </div>
            <div class="hero-number">${{ currentSpend.toLocaleString() }}</div>
            <div class="hero-interpretation">${{ Math.abs(spendingVariance).toLocaleString() }} {{ spendingVariance > 0 ? 'over' : 'under' }} expected pace</div>
            <div class="hero-commit">Month-to-date: ${{ Math.round(packSpendDollars).toLocaleString() }} (packs) + ${{ data.used.toLocaleString() }} (pool)</div>
            <button class="hero-action-btn">View breakdown</button>
          </div>

          <!-- 4. Expiring Credits -->
          <div class="hero-card hero-card-primary" v-if="data.expiration.expiring > 0">
            <div class="hero-header">
              <span class="hero-label">
                EXPIRING CREDITS
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Used after packs and recurring credits run out.</span>
                </span>
              </span>
              <span class="status-badge status-alert">Expires soon</span>
            </div>
            <div class="hero-number">${{ data.expiration.expiring.toLocaleString() }}</div>
            <div class="hero-interpretation">One-time credits · <strong>27 days</strong> remaining</div>
            <button class="hero-action-btn">Manage rollover</button>
          </div>
        </div>
      </div>

      <!-- Committed Usage Packs - Separate Card -->
      <div class="card">
        <div class="committed-packs-section">
          <div class="packs-header">
            <h3>Committed usage packs</h3>
            <button class="btn-export">Configure packs</button>
          </div>
          <p class="packs-description">Prepaid usage bundles for specific services, consumed before recurring credits. Services without packs (SMS/MMS, Toll-free, International, Fax) draw from the recurring credit pool.</p>

          <table class="packs-table">
            <thead>
              <tr>
                <th>Usage type</th>
                <th class="text-right">Pack size</th>
                <th class="text-right">Used</th>
                <th class="text-right">Remaining</th>
                <th class="text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pack in committedPacks" :key="pack.type" class="pack-row">
                <td><strong>{{ pack.label }}</strong></td>
                <td class="text-right">{{ pack.packSize.toLocaleString() }}</td>
                <td class="text-right">{{ pack.used.toLocaleString() }}</td>
                <td class="text-right"><strong>{{ pack.remaining.toLocaleString() }}</strong></td>
                <td class="text-right">${{ pack.rate }} / {{ pack.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Budget Snapshot - Separate Card -->
      <div class="card">
        <div class="budget-snapshot-full">
          <div class="budget-snapshot-header">
            <div class="budget-header-left">
              <h3>Budget Snapshot (recurring pool only)</h3>
            </div>
            <div class="budget-header-actions">
              <button class="btn-export">Adjust allocation</button>
            </div>
          </div>

          <div class="budget-priority-row">
            <span class="priority-label">Draw-down priority:</span>
            <span class="priority-flow">Committed packs → Recurring credits → One-time credits → Overage</span>
          </div>
          <p class="budget-context-note">Services with packs use them first. Services without packs draw from the recurring credit pool. Budget allocation applies only to the recurring pool.</p>

          <table class="budget-table-ledger">
            <thead>
              <tr>
                <th class="th-category">Category</th>
                <th class="th-packs">Has Pack?</th>
                <th class="th-alloc-used">Alloc/Used (recurring)</th>
                <th class="th-remaining">Remaining</th>
                <th class="th-trend">Trend</th>
                <th class="th-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, key) in data.budgetAllocation" :key="key">
                <tr class="budget-row budget-row-clickable" @click="toggleBudgetRow(key)">
                  <td class="td-category">{{ item.label }}</td>
                  <td class="td-packs">
                    <span v-if="hasPack(key)" class="pack-badge">Yes</span>
                    <span v-else class="no-pack-badge">No</span>
                  </td>
                  <td class="td-alloc-used">{{ item.allocated.toLocaleString() }} · {{ item.used.toLocaleString() }} used</td>
                  <td class="td-remaining">${{ item.remaining.toLocaleString() }}</td>
                  <td class="td-trend">
                    <span class="sparkline">▂▃▅▇</span> {{ getShortVariance(item, key) }}
                  </td>
                  <td class="td-status">
                    <span class="status-dot" :class="getStatusClass(item)">●</span> {{ getStatusText(item) }}
                    <span class="row-chevron" :class="{ 'chevron-expanded': expandedBudgetRow === key }">›</span>
                  </td>
                </tr>

                <!-- Expanded row content -->
                <tr v-if="expandedBudgetRow === key" class="expanded-row">
                  <td colspan="6" class="expanded-content">
                    <div v-if="key === 'aiAgentDigital' || key === 'aiAgentVoice'" class="agent-breakdown">
                      <h4 class="breakdown-title">▼ Agent breakdown</h4>
                      <table class="agent-table">
                        <thead>
                          <tr>
                            <th>Agent</th>
                            <th>Spend</th>
                            <th>Change</th>
                            <th>Conversations</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="agent in data.topAgentsSummary.filter(a => a.type === (key === 'aiAgentDigital' ? 'digital' : 'voice'))" :key="agent.name">
                            <td>{{ agent.name }}</td>
                            <td>${{ agent.cost.toLocaleString() }}</td>
                            <td :class="{ 'change-up': getTrendPercent(agent) > 0, 'change-down': getTrendPercent(agent) < 0 }">
                              {{ getTrendPercent(agent) > 0 ? '↑' : getTrendPercent(agent) < 0 ? '↓' : '' }}{{ Math.abs(getTrendPercent(agent)) }}%
                            </td>
                            <td>{{ agent.conversations.toLocaleString() }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <a href="#" class="drill-down-link">View full agent report →</a>
                    </div>

                    <div v-else class="billing-summary">
                      <h4 class="breakdown-title">▼ Billing summary</h4>
                      <ul class="summary-list">
                        <li v-if="key === 'sms'">{{ item.used }} messages sent</li>
                        <li v-if="key === 'sms'">Avg cost/message: $0.02</li>
                        <li v-if="key === 'international'">{{ item.used }} minutes</li>
                        <li v-if="key === 'international'">Avg cost/min: $0.18</li>
                        <li v-if="key === 'fax'">{{ Math.floor(item.used / 5) }} pages sent</li>
                      </ul>
                      <a href="#" class="drill-down-link">View details →</a>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <p class="budget-footer-note">Services marked "Yes" have committed usage packs that are consumed first. Services marked "No" draw from recurring credits because they do not have committed usage packs. Contact your account manager to configure packs for other high-volume services.</p>
        </div>
      </div>

      <!-- Usage Alerts -->
      <div class="card">
        <h2>
          Usage Alerts
          <span class="info-icon-wrapper">
            <DtIconInfo class="info-icon" />
            <span class="info-tooltip">Alerts apply to combined usage from committed packs and recurring credits.</span>
          </span>
        </h2>
        <p class="section-subtitle">Alerts appear in Dialpad and via email • Alerts at first threshold • Services stop at second threshold</p>

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

      <!-- Usage History -->
      <div class="card">
        <h2>Usage History</h2>

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

      <!-- FAQ -->
      <div class="card">
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
                <li>Committed usage packs (usage-specific)</li>
                <li>Recurring credits (flexible pool) — ${{ data.available.toLocaleString() }}</li>
                <li>One-time credits — ${{ data.expiration.expiring.toLocaleString() }}</li>
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

          <!-- FAQ 4: Committed Packs -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.packs = !faqExpanded.packs">
              <span>How do committed usage packs work?</span>
              <span class="expand-toggle">{{ faqExpanded.packs ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.packs" class="faq-answer">
              <p>Committed packs are prepaid usage bundles negotiated for specific services (AI Agent, SMS, toll-free, international).</p>
              <p><strong>Key points:</strong></p>
              <ul>
                <li>Usage-specific: Can't use AI Agent packs for SMS</li>
                <li>Consumed first before recurring credits</li>
                <li>Typically offer discounted rates for enterprise customers</li>
              </ul>
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
import { mockData } from '../data/mockData.js'
import { DtIconInfo } from '@dialpad/dialtone-icons/vue3'

// Scenario B specific data - enterprise scale with hybrid model
const data = ref({
  ...mockData.scenarioA,
  totalCredits: 500000,      // $500K monthly recurring credits (enterprise scale)
  used: 238000,              // Used from recurring pool (by services without packs)
  available: 262000,         // $262K remaining in recurring pool

  // Override package info
  package: {
    ...mockData.scenarioA.package,
    renewalDate: 'Jan 1, 2026'
  },

  // Override expiration
  expiration: {
    expiring: 15000,
    expirationDate: 'Dec 31, 2025'
  }
})

// Committed packs data - showing only AI Agent services have packs (33% utilized)
// Other services (SMS, Toll-free, International, Fax) draw from recurring pool
const committedPacks = ref([
  { type: 'aiAgentDigital', label: 'AI Agent (Digital)', packSize: 10000, used: 3300, remaining: 6700, rate: '1.59', unit: 'conv' },
  { type: 'aiAgentVoice', label: 'AI Agent (Voice)', packSize: 7000, used: 2310, remaining: 4690, rate: '0.79', unit: 'conv' }
])

// Computed properties for pack totals
const totalPackCapacity = computed(() => {
  return committedPacks.value.reduce((sum, pack) => sum + pack.packSize, 0)
})

const totalPackUsed = computed(() => {
  return committedPacks.value.reduce((sum, pack) => sum + pack.used, 0)
})

const totalPackRemaining = computed(() => {
  return committedPacks.value.reduce((sum, pack) => sum + pack.remaining, 0)
})

const averagePackUtilization = computed(() => {
  if (totalPackCapacity.value === 0) return 0
  return (totalPackUsed.value / totalPackCapacity.value) * 100
})

const numberOfActivePacks = computed(() => {
  return committedPacks.value.length
})

// Calculate dollar value of pack usage
const packSpendDollars = computed(() => {
  return committedPacks.value.reduce((sum, pack) => {
    return sum + (pack.used * parseFloat(pack.rate))
  }, 0)
})

// Total current spend (packs + recurring pool)
const currentSpend = computed(() => {
  return Math.round(packSpendDollars.value + data.value.used)
})

// Spending variance
const spendingVariance = computed(() => {
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const monthlyBudget = data.value.totalCredits
  const expectedSpendToDate = (monthlyBudget / daysInMonth) * currentDay
  const actualSpend = data.value.used // Just recurring pool for this calc

  return Math.round(actualSpend - expectedSpendToDate)
})

// Budget row expansion
const expandedBudgetRow = ref(null)

const toggleBudgetRow = (key) => {
  expandedBudgetRow.value = expandedBudgetRow.value === key ? null : key
}

// Check if category has a committed pack
const hasPack = (key) => {
  return committedPacks.value.some(pack => pack.type === key)
}

// Dynamic trend card calculations
const trendCardData = computed(() => {
  const today = new Date()
  const currentDayOfMonth = today.getDate()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthlyBudget = data.value.totalCredits || 15000
  const expectedDailyBurn = monthlyBudget / daysInMonth
  const expectedSpendToDate = Math.round(expectedDailyBurn * currentDayOfMonth)

  const trendMultiplier = 1.8
  const actualSpend = Math.round(expectedSpendToDate * trendMultiplier)

  const remaining = monthlyBudget - actualSpend
  const actualDailyBurn = actualSpend / currentDayOfMonth
  const daysUntilDepletion = Math.floor(remaining / actualDailyBurn)

  const depletionDate = new Date(today)
  depletionDate.setDate(today.getDate() + daysUntilDepletion)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const depletionDateStr = `${monthNames[depletionDate.getMonth()]} ${depletionDate.getDate()}, ${depletionDate.getFullYear()}`

  return {
    currentDay: currentDayOfMonth,
    actualSpend,
    expectedSpend: expectedSpendToDate,
    depletionDate: depletionDateStr,
    daysRemaining: daysUntilDepletion
  }
})

// Calculate trend percentage
const getTrendPercent = (member) => {
  if (!member.previousCost || member.previousCost === 0) return 0
  return Math.round(((member.cost - member.previousCost) / member.previousCost) * 100)
}

// Get status class
const getStatusClass = (item) => {
  const percent = (item.used / item.allocated) * 100
  if (percent >= 100) return 'status-over'
  if (percent >= 80) return 'status-warning'
  return 'status-on-track'
}

// Get status text
const getStatusText = (item) => {
  const percent = (item.used / item.allocated) * 100
  if (percent >= 100) return 'Over budget'
  if (percent >= 80) return 'Trending high'
  return 'On track'
}

// Get short variance
const getShortVariance = (item, key) => {
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const expectedUsed = (item.allocated / daysInMonth) * currentDay
  const variance = ((item.used - expectedUsed) / expectedUsed) * 100

  if (Math.abs(variance) < 5) {
    return 'On pace'
  } else if (variance > 0) {
    return `↑${Math.round(variance)}`
  } else {
    return `↓${Math.abs(Math.round(variance))}`
  }
}

// Usage History filters
const selectedType = ref('all')
const selectedAgent = ref('all')
const selectedUserGroup = ref('all')
const selectedMonth = ref('all')

const uniqueUserGroups = computed(() => {
  const groups = data.value.usageHistory.map(entry => entry.userGroup)
  return [...new Set(groups)]
})

const filteredUsageHistory = computed(() => {
  return data.value.usageHistory.filter(entry => {
    const typeMatch = selectedType.value === 'all' || entry.type === selectedType.value
    const agentMatch = selectedAgent.value === 'all' || entry.agentName === selectedAgent.value
    const userGroupMatch = selectedUserGroup.value === 'all' || entry.userGroup === selectedUserGroup.value
    const monthMatch = selectedMonth.value === 'all' || entry.date.startsWith(selectedMonth.value)

    return typeMatch && agentMatch && userGroupMatch && monthMatch
  })
})

// FAQ expanded states
const faqExpanded = ref({
  drawdown: false,
  billable: false,
  recharge: false,
  packs: false,
  permissions: false
})
</script>

<style scoped>
/* Base Layout */
.scenario-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
  position: relative;
}

.mode-indicator {
  font-size: 12px;
  font-weight: 600;
  color: #6E4AE4;
  background-color: #F3F0FF;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 8px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 8px 0 4px 0;
}

.scenario-label {
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #888888;
  margin: 0;
}

/* Trend Card */
.trend-card {
  background-color: #FFF9E6;
  border-left: 3px solid #F5C000;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  color: #666666;
  margin-bottom: 16px;
}

/* Card */
.card {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
}

.card h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 16px 0;
}

/* Hero Cards Grid */
.hero-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .hero-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .hero-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .hero-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.hero-card {
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
}

.hero-card-primary {
  background-color: #FFFFFF;
  border: 2px solid #E5E5E5;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #888888;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-on-track {
  color: #2E7D32;
}

.status-warning {
  background-color: #FFF8E1;
  color: #F57C00;
}

.status-alert {
  background-color: #E3F2FD;
  color: #1976D2;
}

.hero-number {
  font-size: 36px;
  font-weight: 700;
  color: #1C1C1C;
  margin: 8px 0;
}

.hero-interpretation {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.hero-commit,
.hero-sequencing {
  font-size: 12px;
  color: #888888;
  margin-top: 4px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.hero-helper {
  font-size: 12px;
  color: #666666;
  margin-top: 8px;
  margin-bottom: 12px;
  line-height: 1.5;
  font-style: italic;
}

.hero-action-btn {
  margin-top: auto;
  padding: 6px 12px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #1C1C1C;
  transition: all 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.hero-card:hover .hero-action-btn {
  opacity: 1;
  pointer-events: auto;
}

.hero-action-btn:hover {
  background-color: #F9F9F9;
  border-color: #999999;
}

/* Info Icon and Tooltip */
.info-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 6px;
  vertical-align: middle;
}

.info-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
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

/* Committed Packs Section */
.committed-packs-section {
}

.packs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.packs-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0;
}

.packs-description {
  font-size: 13px;
  color: #666666;
  margin: 0 0 16px 0;
}

.packs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.packs-table thead {
  background-color: #F9F9F9;
}

.packs-table th {
  text-align: left;
  font-weight: 600;
  color: #666666;
  padding: 10px 12px;
  border-bottom: 2px solid #E5E5E5;
  font-size: 12px;
}

.packs-table th.text-right {
  text-align: right;
}

.pack-row {
  border-bottom: 1px solid #F0F0F0;
}

.pack-row td {
  padding: 12px;
  color: #1C1C1C;
}

.pack-row td.text-right {
  text-align: right;
}

.pack-row:hover {
  background-color: #FAFAFA;
}

/* Budget Snapshot */
.budget-snapshot-full {
}

.budget-snapshot-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.budget-header-left h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 4px 0;
}

.overall-trend {
  font-size: 13px;
  color: #F57C00;
  font-weight: 500;
}

.budget-snapshot-note {
  font-size: 13px;
  color: #666666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.budget-priority-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 20px 0;
  padding: 8px 12px;
  background-color: #FFF9E6;
  border-radius: 4px;
  border-left: 3px solid #F5C000;
}

.priority-label {
  font-size: 13px;
  color: #666666;
  font-weight: 500;
}

.priority-flow {
  font-size: 13px;
  color: #1C1C1C;
  font-weight: 500;
}

.budget-context-note {
  font-size: 12px;
  color: #666666;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.budget-footer-note {
  font-size: 12px;
  color: #666666;
  margin: 16px 0 0 0;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 4px;
  line-height: 1.6;
}

.btn-export {
  padding: 8px 16px;
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.btn-export:hover {
  background-color: #F9FAFB;
}

/* Budget Table */
.budget-table-ledger {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 16px;
}

.budget-table-ledger thead {
  background-color: #F9F9F9;
}

.budget-table-ledger th {
  text-align: left;
  font-weight: 600;
  color: #666666;
  padding: 10px 12px;
  border-bottom: 2px solid #E5E5E5;
  font-size: 12px;
}

.budget-row {
  border-bottom: 1px solid #F0F0F0;
}

.budget-row td {
  padding: 12px;
  color: #1C1C1C;
}

.budget-row-clickable {
  cursor: pointer;
}

.budget-row-clickable:hover {
  background-color: #FAFAFA;
}

.pack-badge {
  display: inline-block;
  background-color: #E6F7E6;
  color: #10B981;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.no-pack-badge {
  display: inline-block;
  color: #CCCCCC;
  font-size: 11px;
  font-weight: 600;
}

.status-dot {
  font-size: 16px;
  margin-right: 4px;
}

.status-dot.status-on-track {
  color: #10B981;
}

.status-dot.status-warning {
  color: #F5C000;
}

.status-dot.status-over {
  color: #EF4444;
}

.row-chevron {
  margin-left: 8px;
  color: #CCCCCC;
  font-size: 18px;
  opacity: 0;
  transition: all 0.2s;
  display: inline-block;
}

.budget-row-clickable:hover .row-chevron {
  opacity: 1;
  color: #666666;
}

.chevron-expanded {
  opacity: 1 !important;
  color: #666666 !important;
  transform: rotate(90deg);
}

.expanded-row {
  background-color: #FAFAFA;
}

.expanded-content {
  padding: 16px 24px !important;
}

.agent-breakdown,
.billing-summary {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.breakdown-title {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  margin: 0 0 12px 0;
}

.agent-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
}

.agent-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  padding: 8px 12px;
  border-bottom: 1px solid #E5E5E5;
}

.agent-table td {
  padding: 8px 12px;
  font-size: 13px;
  color: #1C1C1C;
  border-bottom: 1px solid #F0F0F0;
}

.change-up {
  color: #F57C00;
}

.change-down {
  color: #10B981;
}

.drill-down-link {
  font-size: 13px;
  color: #6E4AE4;
  text-decoration: none;
  font-weight: 500;
}

.drill-down-link:hover {
  text-decoration: underline;
}

.billing-summary {
  padding: 8px 0;
}

.summary-list {
  list-style: disc;
  margin: 0 0 12px 20px;
  padding: 0;
}

.summary-list li {
  font-size: 13px;
  color: #666666;
  margin-bottom: 6px;
  line-height: 1.5;
}

/* Usage Alerts */
.section-subtitle {
  font-size: 13px;
  color: #666666;
  margin: 0 0 16px 0;
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
  width: 20px;
  height: 20px;
  border: 2px solid #CCCCCC;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Usage History Styles */
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
  cursor: pointer;
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

.expand-toggle {
  font-size: 18px;
  font-weight: 600;
  color: #666666;
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
</style>
