<template>
  <AdminShell>
    <div class="scenario-page">
      <div class="page-header">
        <div class="mode-indicator">Scenario C · Committed Packs Only</div>
        <h1>Credits and Usage</h1>
        <h2 class="scenario-label">Committed Usage Packs Only</h2>
        <p class="subtitle">Prepaid usage packs per service type, no flexible credit pool.</p>
      </div>

      <!-- Trend Card - Pack consumption pacing -->
      <div class="trend-card">
        Used <strong>{{ totalPackUsedPercent }}%</strong> of all packs by day {{ currentDay }} (expected <strong>~{{ expectedPackUsedPercent }}%</strong>) · Average pack depletes by <strong>{{ averageDepletionDate }}</strong>
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
                  <span class="info-tooltip">All usage comes from committed packs. Packs are usage-specific and consumed first, then overage charges apply if packs are exhausted.</span>
                </span>
              </span>
              <span class="status-badge status-on-track">{{ numberOfActivePacks }} active</span>
            </div>
            <div class="hero-number">{{ Math.round(averagePackUtilization) }}%</div>
            <div class="hero-interpretation">Average utilization across all packs</div>
            <div class="hero-commit">{{ totalPackRemaining.toLocaleString() }} units remaining of {{ totalPackCapacity.toLocaleString() }} total</div>
            <button class="hero-action-btn">Configure packs</button>
          </div>

          <!-- 2. Current Spend (Pack-based only) -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                CURRENT SPEND
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Month-to-date spend from committed packs only. No flexible credit pool in this model. Overage charges apply if packs are exhausted.</span>
                </span>
              </span>
              <span class="status-badge status-on-track">On track</span>
            </div>
            <div class="hero-number">${{ Math.round(packSpendDollars).toLocaleString() }}</div>
            <div class="hero-interpretation">From committed packs</div>
            <div class="hero-commit">Month-to-date across {{ numberOfActivePacks }} packs</div>
            <button class="hero-action-btn">View breakdown</button>
          </div>

          <!-- 3. Pack Coverage -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                PACK COVERAGE
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Services with committed packs. Usage for services without packs will result in overage charges at standard rates.</span>
                </span>
              </span>
            </div>
            <div class="hero-number">{{ numberOfActivePacks }}/6</div>
            <div class="hero-interpretation">Services with packs</div>
            <div class="hero-commit">{{ servicesWithoutPacks.length }} service{{ servicesWithoutPacks.length !== 1 ? 's' : '' }} without packs</div>
            <button class="hero-action-btn">Add packs</button>
          </div>

          <!-- 4. Overage Risk -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                OVERAGE RISK
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Packs projected to exhaust before billing period ends. Overage charges will apply at standard rates.</span>
                </span>
              </span>
              <span class="status-badge status-warning">{{ packsAtRisk }} at risk</span>
            </div>
            <div class="hero-number">{{ packsAtRisk }}</div>
            <div class="hero-interpretation">Pack{{ packsAtRisk !== 1 ? 's' : '' }} depleting early</div>
            <div class="hero-commit">Based on current consumption pace</div>
            <button class="hero-action-btn">Review usage</button>
          </div>
        </div>
      </div>

      <!-- Usage by Pack Type - Replaces Budget Snapshot -->
      <div class="card">
        <div class="usage-by-pack-header">
          <div>
            <h2>Usage by Pack Type</h2>
            <p class="section-subtitle">Monitor consumption and remaining capacity per pack. Packs are usage-specific and cannot be shared across services.</p>
          </div>
          <button class="btn-export">Manage packs</button>
        </div>

        <div class="pack-priority-row">
          <span class="priority-label">Draw-down priority:</span>
          <span class="priority-flow">Committed packs → One-time credits → Overage (standard rates)</span>
        </div>

        <table class="packs-table">
          <thead>
            <tr>
              <th>Usage Type</th>
              <th class="text-right">Pack Size</th>
              <th class="text-right">Used</th>
              <th class="text-right">Remaining</th>
              <th class="text-right">Utilization</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Hard Cap</th>
              <th class="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pack in committedPacks" :key="pack.type" class="pack-row">
              <td><strong>{{ pack.label }}</strong></td>
              <td class="text-right">{{ pack.packSize.toLocaleString() }} {{ pack.unit }}</td>
              <td class="text-right">{{ pack.used.toLocaleString() }}</td>
              <td class="text-right"><strong>{{ pack.remaining.toLocaleString() }}</strong></td>
              <td class="text-right">{{ Math.round((pack.used / pack.packSize) * 100) }}%</td>
              <td class="text-right">${{ pack.rate }} / {{ pack.unit }}</td>
              <td class="text-right">
                <span v-if="pack.hardCap" class="hard-cap-badge">{{ pack.hardCap.toLocaleString() }}</span>
                <span v-else class="no-cap">—</span>
              </td>
              <td class="text-right">
                <span class="status-dot" :class="getPackStatusClass(pack)">●</span>
                {{ getPackStatusText(pack) }}
              </td>
            </tr>
          </tbody>
        </table>

        <p class="pack-footer-note">
          Packs reset at the end of your billing period (contract-based). Unused units may roll over or expire based on your agreement.
          Contact your account manager to add packs for additional services or adjust capacities.
        </p>
      </div>

      <!-- Usage Alerts - Per Pack -->
      <div class="card">
        <h2>Usage Alerts</h2>
        <p class="section-subtitle">Alerts appear in Dialpad and via email • Alerts at soft threshold • Usage stops at hard cap</p>
        <p class="section-subtitle" style="margin-top: 8px;">Hard caps prevent overage charges by stopping usage when pack is exhausted.</p>

        <div class="alerts-list">
          <div v-for="pack in committedPacks" :key="`alert-${pack.type}`" class="alert-item">
            <div class="alert-checkbox" :class="{ 'checked': pack.alertsEnabled }">
              <svg v-if="pack.alertsEnabled" width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M13.5 4L6 11.5L2.5 8" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="alert-content">
              <div class="alert-title">
                {{ pack.label }}: {{ pack.softAlertPercent }}% / {{ pack.hardCapEnabled ? pack.hardStopPercent + '%' : 'No stop' }}
              </div>
              <div class="alert-subtitle">
                Alert at {{ (pack.packSize * pack.softAlertPercent / 100).toLocaleString() }} {{ pack.unit }}{{ pack.hardCapEnabled ? ` • Stop at ${(pack.packSize * pack.hardStopPercent / 100).toLocaleString()} ${pack.unit}` : '' }}
              </div>
            </div>
          </div>
        </div>

        <div class="guardrails-note">
          Enterprise guardrails: Overage protection available for all packs • Contact AM to enable hard caps
        </div>
      </div>

      <!-- Usage History -->
      <div class="card">
        <h2>Usage History</h2>

        <div class="history-controls">
          <div class="history-filters">
            <select v-model="selectedType" class="filter-select">
              <option value="all">All Pack Types</option>
              <option value="aiAgentDigital">AI Agent Digital</option>
              <option value="aiAgentVoice">AI Agent Voice</option>
              <option value="sms">SMS/MMS</option>
              <option value="tollFree">Toll-free Voice</option>
              <option value="international">International</option>
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
              <th>Pack Type</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Units</th>
              <th class="text-right">Pack Rate</th>
              <th class="text-right">Cost</th>
              <th class="text-right">Source</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in filteredUsageHistory" :key="entry.id">
              <td><strong>{{ entry.packLabel }}</strong></td>
              <td class="text-secondary">{{ entry.service }}</td>
              <td>
                {{ entry.date }}<br>
                <span class="small-text">{{ entry.time }}</span>
              </td>
              <td>{{ entry.units }} {{ entry.unit }}</td>
              <td class="text-right">${{ entry.packRate }}</td>
              <td class="text-right cost-value">${{ entry.cost }}</td>
              <td class="text-right">
                <span v-if="entry.fromPack" class="pack-source-badge">Pack</span>
                <span v-else class="overage-badge">Overage</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- FAQ -->
      <div class="card">
        <h2>Frequently Asked Questions</h2>

        <div class="faq-list">
          <!-- FAQ 1: How packs work -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.packs = !faqExpanded.packs">
              <span>How do committed usage packs work?</span>
              <span class="expand-toggle">{{ faqExpanded.packs ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.packs" class="faq-answer">
              <p>Committed packs are prepaid usage bundles for specific services:</p>
              <ul>
                <li>Usage-specific: Can't use AI Agent packs for SMS</li>
                <li>Consumed first before any fallback credits</li>
                <li>Discounted rates for volume commitments</li>
                <li>Reset based on contract billing period</li>
              </ul>
              <p>If packs are exhausted, overage charges apply at standard rates.</p>
            </div>
          </div>

          <!-- FAQ 2: What happens when pack runs out -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.overage = !faqExpanded.overage">
              <span>What happens when my pack runs out?</span>
              <span class="expand-toggle">{{ faqExpanded.overage ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.overage" class="faq-answer">
              <p><strong>If hard cap is disabled:</strong> Usage continues at standard rates (overage charges)</p>
              <p><strong>If hard cap is enabled:</strong> Usage stops entirely to prevent overage</p>
              <p>Contact your account manager to purchase additional capacity or enable hard caps.</p>
            </div>
          </div>

          <!-- FAQ 3: Why no recurring credits -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.noRecurring = !faqExpanded.noRecurring">
              <span>Why don't I have recurring credits?</span>
              <span class="expand-toggle">{{ faqExpanded.noRecurring ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.noRecurring" class="faq-answer">
              <p>Your account uses committed packs only (Scenario C). This model:</p>
              <ul>
                <li>Provides discounted rates through volume commitments</li>
                <li>Gives precise control over spend per usage type</li>
                <li>Common for enterprise customers with predictable usage</li>
              </ul>
              <p>If you need flexible spending across services, contact your account manager about hybrid models.</p>
            </div>
          </div>

          <!-- FAQ 4: Hard caps -->
          <div class="faq-item">
            <div class="faq-question" @click="faqExpanded.hardCaps = !faqExpanded.hardCaps">
              <span>How do hard caps work?</span>
              <span class="expand-toggle">{{ faqExpanded.hardCaps ? '−' : '+' }}</span>
            </div>
            <div v-if="faqExpanded.hardCaps" class="faq-answer">
              <p>Hard caps prevent overage charges by stopping usage at a specific threshold.</p>
              <p><strong>Example:</strong> If your AI Agent pack has 10,000 units with a hard cap at 100%, usage stops at 10,000 units.</p>
              <p>Set hard caps lower than 100% (e.g., 95%) to leave buffer room before complete stoppage.</p>
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
import { DtIconInfo } from '@dialpad/dialtone-icons/vue3'

// Scenario C specific data - committed packs only, no recurring credits
const committedPacks = ref([
  {
    type: 'aiAgentDigital',
    label: 'AI Agent (Digital)',
    packSize: 10000,
    used: 6234,
    remaining: 3766,
    rate: '1.59',
    unit: 'conv',
    softAlertPercent: 80,
    hardCapEnabled: true,
    hardStopPercent: 95,
    hardCap: 9500,
    alertsEnabled: true
  },
  {
    type: 'aiAgentVoice',
    label: 'AI Agent (Voice)',
    packSize: 7000,
    used: 2891,
    remaining: 4109,
    rate: '0.79',
    unit: 'conv',
    softAlertPercent: 80,
    hardCapEnabled: false,
    hardStopPercent: 0,
    hardCap: null,
    alertsEnabled: true
  },
  {
    type: 'sms',
    label: 'SMS/MMS',
    packSize: 50000,
    used: 12450,
    remaining: 37550,
    rate: '0.02',
    unit: 'msg',
    softAlertPercent: 90,
    hardCapEnabled: false,
    hardStopPercent: 0,
    hardCap: null,
    alertsEnabled: true
  },
  {
    type: 'tollFree',
    label: 'Toll-free Voice',
    packSize: 25000,
    used: 8920,
    remaining: 16080,
    rate: '0.02',
    unit: 'min',
    softAlertPercent: 85,
    hardCapEnabled: true,
    hardStopPercent: 98,
    hardCap: 24500,
    alertsEnabled: true
  },
  {
    type: 'international',
    label: 'International Calling',
    packSize: 15000,
    used: 4567,
    remaining: 10433,
    rate: '0.18',
    unit: 'min',
    softAlertPercent: 90,
    hardCapEnabled: false,
    hardStopPercent: 0,
    hardCap: null,
    alertsEnabled: true
  }
])

// All possible services
const allServices = ['AI Agent (Digital)', 'AI Agent (Voice)', 'SMS/MMS', 'Toll-free Voice', 'International Calling', 'Fax']

// Services without packs
const servicesWithoutPacks = computed(() => {
  const servicesWithPacks = committedPacks.value.map(p => p.label)
  return allServices.filter(s => !servicesWithPacks.includes(s))
})

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

// Packs at risk of depletion
const packsAtRisk = computed(() => {
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const progressPct = (currentDay / daysInMonth) * 100

  return committedPacks.value.filter(pack => {
    const usedPct = (pack.used / pack.packSize) * 100
    return usedPct > progressPct + 10 // More than 10% ahead of schedule
  }).length
})

// Current day for trend card
const currentDay = computed(() => new Date().getDate())

// Total pack used percent
const totalPackUsedPercent = computed(() => Math.round(averagePackUtilization.value))

// Expected pack used percent based on day of month
const expectedPackUsedPercent = computed(() => {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  return Math.round((currentDay.value / daysInMonth) * 100)
})

// Average depletion date
const averageDepletionDate = computed(() => {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const avgDailyBurn = totalPackUsed.value / currentDay.value
  const daysUntilDepletion = Math.floor(totalPackRemaining.value / avgDailyBurn)

  const depletionDate = new Date(today)
  depletionDate.setDate(today.getDate() + daysUntilDepletion)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[depletionDate.getMonth()]} ${depletionDate.getDate()}, ${depletionDate.getFullYear()}`
})

// Get pack status class
const getPackStatusClass = (pack) => {
  const percent = (pack.used / pack.packSize) * 100
  if (percent >= 90) return 'status-over'
  if (percent >= 70) return 'status-warning'
  return 'status-on-track'
}

// Get pack status text
const getPackStatusText = (pack) => {
  const percent = (pack.used / pack.packSize) * 100
  if (percent >= 90) return 'High usage'
  if (percent >= 70) return 'Moderate'
  return 'On track'
}

// Usage History filters
const selectedType = ref('all')
const selectedMonth = ref('all')

// Mock usage history data
const usageHistory = ref([
  { id: 1, packLabel: 'AI Agent (Digital)', service: 'Support Bot Alpha', date: 'Dec 5, 2025', time: '14:23', units: 1, unit: 'conv', packRate: '1.59', cost: '1.59', fromPack: true },
  { id: 2, packLabel: 'SMS/MMS', service: 'Campaign: Holiday', date: 'Dec 5, 2025', time: '10:15', units: 100, unit: 'msg', packRate: '0.02', cost: '2.00', fromPack: true },
  { id: 3, packLabel: 'AI Agent (Voice)', service: 'Sales Bot A', date: 'Dec 4, 2025', time: '16:45', units: 1, unit: 'conv', packRate: '0.79', cost: '0.79', fromPack: true },
  { id: 4, packLabel: 'Toll-free Voice', service: 'Inbound: 1-800', date: 'Dec 4, 2025', time: '09:30', units: 12, unit: 'min', packRate: '0.02', cost: '0.24', fromPack: true },
  { id: 5, packLabel: 'International Calling', service: 'Outbound: UK', date: 'Dec 3, 2025', time: '11:22', units: 5, unit: 'min', packRate: '0.18', cost: '0.90', fromPack: true },
])

const filteredUsageHistory = computed(() => {
  return usageHistory.value.filter(entry => {
    const typeMatch = selectedType.value === 'all' || entry.packLabel.includes(selectedType.value)
    const monthMatch = selectedMonth.value === 'all' || entry.date.startsWith(selectedMonth.value)
    return typeMatch && monthMatch
  })
})

// FAQ expanded states
const faqExpanded = ref({
  packs: false,
  overage: false,
  noRecurring: false,
  hardCaps: false,
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
  white-space: nowrap;
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

.hero-commit {
  font-size: 12px;
  color: #888888;
  margin-top: 4px;
  margin-bottom: 16px;
  line-height: 1.5;
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

/* Usage by Pack Type */
.usage-by-pack-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.usage-by-pack-header h2 {
  margin: 0 0 8px 0;
}

.section-subtitle {
  font-size: 13px;
  color: #666666;
  margin: 0 0 16px 0;
}

.pack-priority-row {
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

/* Packs Table */
.packs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 16px;
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

.hard-cap-badge {
  display: inline-block;
  background-color: #FFE6E6;
  color: #EF4444;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.no-cap {
  color: #CCCCCC;
  font-size: 12px;
}

.status-dot {
  font-size: 16px;
  margin-right: 4px;
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

.pack-footer-note {
  font-size: 12px;
  color: #666666;
  margin: 0;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 4px;
  line-height: 1.6;
}

/* Usage Alerts */
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
  margin-bottom: 4px;
}

.alert-subtitle {
  font-size: 12px;
  color: #666666;
}

.guardrails-note {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
  font-size: 13px;
  color: #888888;
  line-height: 1.5;
}

/* Usage History */
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

.cost-value {
  font-weight: 600;
  color: #1C1C1C;
}

.pack-source-badge {
  display: inline-block;
  background-color: #E6F7E6;
  color: #10B981;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.overage-badge {
  display: inline-block;
  background-color: #FFE6E6;
  color: #EF4444;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

/* FAQ */
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

.faq-answer ul {
  margin: 8px 0 12px 20px;
  padding: 0;
}

.faq-answer li {
  margin-bottom: 6px;
  line-height: 1.5;
}
</style>
