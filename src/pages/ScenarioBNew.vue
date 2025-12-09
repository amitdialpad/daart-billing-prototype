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
      <div v-if="!isConfiguringUsagePlan" class="trend-card">
        Used <strong>${{ currentSpend.toLocaleString() }}</strong> by day {{ trendCardData.currentDay }} (expected <strong>~${{ trendCardData.expectedSpend.toLocaleString() }}</strong>) · Combined capacity depletes by <strong>{{ trendCardData.depletionDate }}</strong> ({{ trendCardData.daysRemaining }} days)
      </div>

      <!-- Hero Cards - 3 Cards: Committed Packs + Recurring Credit Pool + Total Capacity -->
      <div v-if="!isConfiguringUsagePlan" class="card">
        <div class="hero-cards-grid hero-cards-grid-three">
          <!-- 1. Committed Packs -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                COMMITTED PACKS
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Agentic pack commitments consumed before recurring credits.</span>
                </span>
              </span>
              <span class="status-badge status-on-track">{{ numberOfActivePacks }} active</span>
            </div>
            <div class="hero-number">{{ Math.round(averagePackUtilization) }}%</div>
            <div class="hero-interpretation">Average utilization across packs</div>
            <div class="hero-commit">{{ totalPackRemaining.toLocaleString() }} conversations remaining of {{ totalPackCapacity.toLocaleString() }} total.</div>
            <div class="hero-secondary-info">Hard cap: alert at {{ poolHardCap.softAlertPercent }}% · stop at {{ committedPacks[0].hardStopPercent }}% of pack.</div>
          </div>

          <!-- 2. Recurring Credit Pool -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                RECURRING CREDIT POOL
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Flexible credits used after packs or for services without packs.</span>
                </span>
              </span>
              <span class="status-badge status-on-track">On track</span>
            </div>
            <div class="hero-number">${{ data.available.toLocaleString() }}</div>
            <div class="hero-interpretation">Remaining of ${{ data.totalCredits.toLocaleString() }}</div>
            <div class="hero-commit">Hard cap applies to total pool spend across all services: alert at ${{ poolHardCap.softAlertAmount.toLocaleString() }} · stop at ${{ poolHardCap.hardCapAmount.toLocaleString() }}.</div>
            <div class="hero-secondary-info">One-time credits expiring: ${{ data.expiration.expiring.toLocaleString() }} in 27 days.</div>
          </div>

          <!-- 3. Capacity Runway -->
          <div class="hero-card hero-card-primary">
            <div class="hero-header">
              <span class="hero-label">
                CAPACITY RUNWAY
                <span class="info-icon-wrapper">
                  <DtIconInfo class="info-icon" />
                  <span class="info-tooltip">Days remaining until combined capacity (packs + pool) is depleted at current usage rate.</span>
                </span>
              </span>
              <span class="status-badge status-warning">Action needed</span>
            </div>
            <div class="hero-number">{{ trendCardData.daysRemaining }} days</div>
            <div class="hero-interpretation">Combined capacity depletes by {{ trendCardData.depletionDate }}</div>
            <div class="hero-commit">At current pace: ${{ currentSpend.toLocaleString() }} by day {{ trendCardData.currentDay }} (expected ~${{ trendCardData.expectedSpend.toLocaleString() }})</div>
          </div>
        </div>
      </div>

      <!-- Budget & Capacity Overview -->
      <div v-if="!isConfiguringUsagePlan" class="card">
        <div class="budget-snapshot-full">
          <div class="budget-snapshot-header">
            <div class="budget-header-left">
              <h3>Budget & Capacity Overview</h3>
              <p class="budget-header-subtitle">Packs are fixed commitments. You budget against the recurring credit pool.</p>
            </div>
            <div class="budget-header-actions">
              <button class="btn-export" @click="openUsagePlanConfig">Configure Usage Plan</button>
            </div>
          </div>

          <!-- Combined Capacity Display -->
          <div class="combined-capacity-box">
            <div class="capacity-item">
              <div class="capacity-label">Committed Packs Value</div>
              <div class="capacity-value">${{ Math.round(totalPackValue).toLocaleString() }}</div>
              <div class="capacity-detail">{{ totalPackCapacity.toLocaleString() }} conversations @ ${{ committedPacks[0].rate }}/conv</div>
            </div>
            <div class="capacity-item">
              <div class="capacity-label">Recurring Credit Pool</div>
              <div class="capacity-value">${{ data.totalCredits.toLocaleString() }}</div>
              <div class="capacity-detail">${{ data.used.toLocaleString() }} used · ${{ data.available.toLocaleString() }} available</div>
            </div>
            <div class="capacity-item">
              <div class="capacity-label">Total Flexible Capacity</div>
              <div class="capacity-value">${{ totalFlexibleCapacity.toLocaleString() }}</div>
              <div class="capacity-detail">Combined value across all entitlements</div>
            </div>
          </div>

          <div class="budget-priority-row">
            <span class="priority-label">Draw-down priority:</span>
            <span class="priority-flow">Committed packs → Recurring credits → One-time credits → Overage</span>
          </div>

          <table class="budget-table-ledger">
            <thead>
              <tr>
                <th class="th-category">Category</th>
                <th class="th-packs">Source</th>
                <th class="th-alloc-used">Allocated / Used</th>
                <th class="th-remaining">Remaining</th>
                <th class="th-trend">Trend</th>
                <th class="th-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <!-- Pack Allocation Row (shown first) -->
              <tr class="budget-row budget-row-clickable" @click="toggleBudgetRow('aiAgentPack')">
                <td class="td-category">Agentic Credits</td>
                <td class="td-packs">
                  <span class="pack-badge">Pack</span>
                </td>
                <td class="td-alloc-used">{{ committedPacks[0].packSize.toLocaleString() }} · {{ committedPacks[0].used.toLocaleString() }} used</td>
                <td class="td-remaining">{{ committedPacks[0].remaining.toLocaleString() }} conversations</td>
                <td class="td-trend">
                  <span class="sparkline">▂▃▅▇</span> {{ Math.round((committedPacks[0].used / committedPacks[0].packSize) * 100) }}%
                </td>
                <td class="td-status">
                  <span class="status-dot status-on-track">●</span> On track
                  <span class="row-chevron" :class="{ 'chevron-expanded': expandedBudgetRow === 'aiAgentPack' }">›</span>
                </td>
              </tr>

              <!-- Expanded Pack Row -->
              <tr v-if="expandedBudgetRow === 'aiAgentPack'" class="expanded-row">
                <td colspan="6" class="expanded-content">
                  <div class="agent-breakdown">
                    <h4 class="breakdown-title">▼ Agent breakdown (from committed pack)</h4>
                    <table class="agent-table">
                      <thead>
                        <tr>
                          <th>Agent</th>
                          <th>Conversations</th>
                          <th>% of Pack</th>
                          <th>Spend</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="agent in data.topAgentsSummary" :key="agent.name">
                          <td>{{ agent.name }}</td>
                          <td>{{ agent.conversations.toLocaleString() }}</td>
                          <td>{{ Math.round((agent.conversations / committedPacks[0].packSize) * 100) }}%</td>
                          <td>${{ (agent.conversations * parseFloat(committedPacks[0].rate)).toLocaleString() }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <a href="#" class="drill-down-link">View full agent report →</a>

                    <div class="pack-details">
                      <h4 class="pack-details-title">Pack Details</h4>
                      <ul class="pack-details-list">
                        <li><strong>Rate:</strong> ${{ committedPacks[0].rate }} per conversation (blended rate)</li>
                        <li><strong>Hard Cap:</strong> {{ committedPacks[0].hardCap.toLocaleString() }} conversations ({{ committedPacks[0].hardStopPercent }}% of pack size)</li>
                        <li><strong>Purpose:</strong> Usage stops at hard cap to prevent overage charges</li>
                        <li><strong>After pack exhaustion:</strong> Agents draw from recurring credit pool</li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Recurring Pool Allocations (shown after packs) -->
              <!-- Skip aiAgentDigital and aiAgentVoice - they're represented by the Agentic Credits pack row -->
              <template v-for="(item, key) in data.budgetAllocation" :key="key">
                <tr v-if="key !== 'aiAgentDigital' && key !== 'aiAgentVoice'" class="budget-row budget-row-clickable" @click="toggleBudgetRow(key)">
                  <td class="td-category">{{ item.label }}</td>
                  <td class="td-packs">
                    <span v-if="hasPack(key)" class="credits-badge">Credits (pack exhausted)</span>
                    <span v-else class="credits-badge">Credits</span>
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
                <tr v-if="expandedBudgetRow === key && key !== 'aiAgentDigital' && key !== 'aiAgentVoice'" class="expanded-row">
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
        </div>
      </div>

      <!-- Usage Alerts -->
      <div v-if="!isConfiguringUsagePlan" class="card">
        <h2>
          Usage Alerts
          <span class="info-icon-wrapper">
            <DtIconInfo class="info-icon" />
            <span class="info-tooltip">Alerts apply to combined usage from committed packs and recurring credits.</span>
          </span>
        </h2>
        <p class="section-subtitle">Alerts appear in Dialpad and via email • Alerts at first threshold • Services stop at second threshold</p>

        <div class="alerts-list">
          <!-- Pool-level Hard Cap (Scenario B specific) -->
          <div class="alert-item">
            <div class="alert-checkbox" :class="{ 'checked': poolHardCap.enabled }">
              <svg v-if="poolHardCap.enabled" width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M13.5 4L6 11.5L2.5 8" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="alert-content">
              <div class="alert-title">
                <strong>{{ poolHardCap.label }}</strong>: {{ poolHardCap.softAlertPercent }}% / {{ poolHardCap.hardCapPercent }}% (hard cap)
              </div>
              <div class="alert-subtitle">Prevents overage billing beyond ${{ poolHardCap.hardCapAmount.toLocaleString() }}</div>
            </div>
          </div>

          <!-- Service-level Alerts -->
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
      <div v-if="!isConfiguringUsagePlan" class="card">
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
      <div v-if="!isConfiguringUsagePlan" class="card">
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

      <!-- Configure Usage Plan Panel -->
      <div v-if="isConfiguringUsagePlan" class="card">
        <div class="config-panel">
          <h2>Configure Usage Plan</h2>
          <p class="section-subtitle">Manage packs, pool, budget allocation, and alerts in one unified workflow.</p>

          <!-- Current Setup Summary -->
          <div class="config-summary">
            <h3>Current Setup</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Committed Packs:</span>
                <span class="summary-value">${{ Math.round(totalPackValue).toLocaleString() }} ({{ totalPackCapacity.toLocaleString() }} conv)</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Recurring Pool:</span>
                <span class="summary-value">${{ data.totalCredits.toLocaleString() }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Capacity:</span>
                <span class="summary-value">${{ totalFlexibleCapacity.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Section 1: Committed Packs -->
          <div class="config-section">
            <h3 class="config-section-title">Committed Packs</h3>
            <p class="config-section-subtitle">Configure pre-purchased usage bundles</p>

            <div class="pack-config-grid">
              <div v-for="(pack, index) in committedPacks" :key="index" class="pack-config-item">
                <div class="pack-config-header">
                  <strong>{{ pack.label }}</strong>
                  <span class="pack-type-badge">Pack</span>
                </div>
                <div class="pack-config-fields">
                  <div class="config-field">
                    <label>Pack size:</label>
                    <input type="number" v-model.number="pack.packSize" class="config-input" /> conversations
                  </div>
                  <div class="config-field">
                    <label>Rate:</label>
                    <span>${{ pack.rate }}/conv</span>
                  </div>
                  <div class="config-field">
                    <label>Alert at:</label>
                    <input type="number" v-model.number="pack.softAlertPercent" class="config-input-sm" min="0" max="100" /> %
                  </div>
                  <div class="config-field">
                    <label>Stop at:</label>
                    <input type="number" v-model.number="pack.hardStopPercent" class="config-input-sm" min="0" max="100" /> %
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Recurring Credit Pool -->
          <div class="config-section">
            <h3 class="config-section-title">Recurring Credit Pool</h3>
            <p class="config-section-subtitle">Configure your flexible credit pool</p>

            <div class="pool-config-grid">
              <div class="config-field-large">
                <label>Monthly pool amount:</label>
                <input type="number" v-model.number="data.totalCredits" class="config-input-large" />
              </div>
              <div class="config-field-large">
                <label>Hard cap (never bill beyond):</label>
                <input type="number" v-model.number="poolHardCap.hardCapAmount" class="config-input-large" />
              </div>
              <div class="config-field">
                <label>Alert at:</label>
                <input type="number" v-model.number="poolHardCap.softAlertPercent" class="config-input-sm" min="0" max="100" /> %
                (${{ Math.round(data.totalCredits * poolHardCap.softAlertPercent / 100).toLocaleString() }})
              </div>
              <div class="config-field">
                <label>Stop at:</label>
                <input type="number" v-model.number="poolHardCap.hardCapPercent" class="config-input-sm" min="0" max="100" /> %
                (${{ Math.round(data.totalCredits * poolHardCap.hardCapPercent / 100).toLocaleString() }})
              </div>
            </div>

            <div class="config-note">
              ℹ Hard cap applies to total pool spend across all services (SMS, Intl, Fax, etc.)
            </div>
          </div>

          <!-- Section 3: Budget Allocation (Pool Only) -->
          <div class="config-section">
            <h3 class="config-section-title">Budget Allocation (Recurring Pool)</h3>
            <p class="config-section-subtitle">Allocate the credit pool across services</p>

            <div class="allocation-grid">
              <div v-for="(item, key) in data.budgetAllocation" :key="key" v-if="key !== 'aiAgentDigital' && key !== 'aiAgentVoice'" class="allocation-row">
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

            <div class="config-note">
              ℹ Packs are not budgeted here (they're commitments)
            </div>
          </div>

          <!-- Section 4: Alerts & Safeguards -->
          <div class="config-section">
            <h3 class="config-section-title">Alerts & Safeguards</h3>
            <p class="config-section-subtitle">Configure when and how you're notified</p>

            <div class="alerts-config-grid">
              <div class="config-field-large">
                <label>Alert Recipients (Email):</label>
                <input type="text" value="admin@company.com, billing@company.com" class="config-input-large" />
              </div>
              <div class="config-field">
                <label>
                  <input type="checkbox" checked /> Show in-product banner warnings
                </label>
              </div>
              <div class="config-field">
                <label>
                  <input type="checkbox" checked /> Daily digest at 9:00 AM
                </label>
              </div>
              <div class="config-field">
                <label>
                  <input type="checkbox" checked /> Real-time alerts for 80%, 90%, 95% thresholds
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="edit-actions">
            <button class="btn-secondary" @click="cancelUsagePlanConfig">Cancel</button>
            <button class="btn-primary" @click="saveUsagePlanConfig">Save Changes</button>
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

// Pool-level hard cap for recurring credits
const poolHardCap = ref({
  enabled: true,
  hardCapPercent: 95,
  hardCapAmount: 475000,  // 95% of $500K
  softAlertPercent: 80,
  softAlertAmount: 400000,  // 80% of $500K
  label: 'Recurring Credit Pool'
})

// Committed packs data - showing only AI Agent services have packs (33% utilized)
// Other services (SMS, Toll-free, International, Fax) draw from recurring pool
// Note: Combined Digital + Voice into single "AI Agent" pack per Abby's feedback
const committedPacks = ref([
  {
    type: 'aiAgent',
    label: 'Agentic Credits',
    packSize: 17000,
    used: 5610,  // 3300 digital + 2310 voice
    remaining: 11390,  // 6700 + 4690
    rate: '1.26',  // Blended rate: (10000*1.59 + 7000*0.79) / 17000 ≈ $1.26/conv
    unit: 'conv',
    hardCapEnabled: true,
    hardStopPercent: 95,
    hardCap: 16150  // 95% of 17,000
  }
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

// Calculate dollar value of pack usage (what's been spent from packs)
const packSpendDollars = computed(() => {
  return committedPacks.value.reduce((sum, pack) => {
    return sum + (pack.used * parseFloat(pack.rate))
  }, 0)
})

// Calculate total pack value (total capacity, not just what's used)
const totalPackValue = computed(() => {
  return committedPacks.value.reduce((sum, pack) => {
    return sum + (pack.packSize * parseFloat(pack.rate))
  }, 0)
})

// Total flexible capacity (pack total value + recurring pool total)
const totalFlexibleCapacity = computed(() => {
  return Math.round(totalPackValue.value + data.value.totalCredits)
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

// Fixed trend card data for Scenario B
const trendCardData = computed(() => {
  return {
    currentDay: 8,
    actualSpend: currentSpend.value,  // $245,069 (pack + pool spend)
    expectedSpend: 129032,
    depletionDate: 'Dec 17, 2025',
    daysRemaining: 9
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

// Configure Usage Plan functionality
const isConfiguringUsagePlan = ref(false)

const openUsagePlanConfig = () => {
  isConfiguringUsagePlan.value = true
  // Scroll to top when entering config mode
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelUsagePlanConfig = () => {
  isConfiguringUsagePlan.value = false
  // Scroll to top when exiting config mode
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const saveUsagePlanConfig = () => {
  // Save logic would go here (for now just close the panel)
  isConfiguringUsagePlan.value = false
  // Scroll to top when exiting config mode
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // In a real app, you'd save the changes to backend here
}
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

/* Hero Section Headers */
.hero-section-header {
  margin-bottom: 16px;
}

.hero-section-divider {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #E5E5E5;
}

.hero-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 4px 0;
}

.hero-section-subtitle {
  font-size: 13px;
  color: #666666;
  margin: 0;
}

/* Hero Cards Grid */
.hero-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.hero-cards-grid-single {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 400px;
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

/* Hero Cards Grid - 2 Column Version */
.hero-cards-grid-two {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .hero-cards-grid-two {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Hero Cards Grid - 3 Column Version */
.hero-cards-grid-three {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .hero-cards-grid-three {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .hero-cards-grid-three {
    grid-template-columns: repeat(3, 1fr);
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

.hero-card-highlight {
  background-color: #FFF9E6;
  border: 2px solid #F5C000;
}

.hero-card-alert {
  background-color: #FFF3E0;
  border: 2px solid #F57C00;
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

.hero-label-secondary {
  font-size: 12px;
  font-weight: 500;
  color: #666666;
  margin-top: 8px;
  margin-bottom: 4px;
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

.hero-secondary-info {
  font-size: 12px;
  color: #888888;
  margin-top: 8px;
  margin-bottom: 8px;
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

.budget-header-subtitle {
  font-size: 13px;
  color: #666666;
  margin: 4px 0 0 0;
  line-height: 1.5;
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

/* Combined Capacity Display */
.combined-capacity-box {
  display: flex;
  align-items: stretch;
  gap: 16px;
  margin-bottom: 20px;
}

.capacity-item {
  flex: 1;
  text-align: center;
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 20px;
}

.capacity-label {
  font-size: 11px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.capacity-value {
  font-size: 24px;
  font-weight: 700;
  color: #1C1C1C;
  margin-bottom: 4px;
}

.capacity-detail {
  font-size: 12px;
  color: #888888;
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

.budget-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Button Styles (Dialtone-inspired) */
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

.credits-badge {
  display: inline-block;
  background-color: #F3F4F6;
  color: #666666;
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

.pack-note {
  font-size: 12px;
  color: #666666;
  margin: 12px 0 0 0;
  font-style: italic;
}

.pack-details {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #E5E5E5;
}

.pack-details-title {
  font-size: 14px;
  font-weight: 600;
  color: #1C1C1C;
  margin: 0 0 12px 0;
}

.pack-details-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pack-details-list li {
  font-size: 13px;
  color: #666666;
  line-height: 1.8;
  padding: 4px 0;
}

.pack-details-list li strong {
  color: #1C1C1C;
}

.hard-cap-badge {
  display: inline-block;
  background-color: #FFF3E0;
  color: #F57C00;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.no-cap {
  display: inline-block;
  color: #CCCCCC;
  font-size: 13px;
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

.alert-subtitle {
  font-size: 12px;
  color: #666666;
  margin-top: 4px;
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

/* Configure Usage Plan Panel */
.config-panel {
  padding: 24px;
}

.config-panel h2 {
  margin-top: 0;
  margin-bottom: 8px;
}

.config-summary {
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
}

.config-summary h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 13px;
  color: #666666;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1C;
}

.config-section {
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
}

.config-section-title {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 18px;
}

.config-section-subtitle {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666666;
}

.pack-config-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pack-config-item {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #E5E5E5;
}

.pack-config-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.pack-config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pack-type-badge {
  background-color: #EEF2FF;
  color: #4F46E5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.pack-config-fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.config-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.config-field label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.config-input,
.config-input-sm {
  padding: 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 14px;
}

.config-input {
  width: 120px;
}

.config-input-sm {
  width: 60px;
}

.pool-config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.config-field-large {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-field-large label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.config-input-large {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

.config-note {
  margin-top: 16px;
  padding: 12px;
  background-color: #EFF6FF;
  border-left: 3px solid #3B82F6;
  font-size: 13px;
  color: #1E40AF;
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
  gap: 8px;
}

.allocation-input-field {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 14px;
  width: 100px;
  font-family: inherit;
}

.allocation-input-field.input-error {
  border-color: #DC2626;
  background-color: #FEE2E2;
}

.allocation-unit {
  color: #666666;
  font-size: 14px;
}

.allocation-used {
  text-align: right;
}

.used-text {
  font-size: 14px;
  color: #666666;
}

.allocation-error {
  grid-column: 1 / -1;
  color: #DC2626;
  font-size: 13px;
  margin-top: 4px;
}

.alerts-config-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alerts-config-grid input[type="checkbox"] {
  margin-right: 8px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
}
</style>
