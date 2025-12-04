<template>
  <AdminShell>
    <div class="notes-page">
      <div class="notes-content">
        <h1>Simplified Version of Abby's PRD</h1>

        <div class="page-section">
          <h2>Document Overview</h2>
          <p>This PRD defines how Dialpad will bill customers for AI Agent conversations at GA (February 1, 2026). It establishes different rates for voice vs. digital conversations and outlines the complete billing model.</p>
        </div>

        <div class="page-section">
          <h2>Core Pricing Model</h2>

          <h3>Rate Card:</h3>
          <ul>
            <li><strong>AI Agent Voice</strong> = <strong>1.99 credits</strong> per conversation (~$1.99 for voice calls)</li>
            <li><strong>AI Agent Digital</strong> = <strong>0.99 credits</strong> per conversation (~$0.99 for chat/digital)</li>
          </ul>

          <p><strong>Why the difference?</strong> Voice costs Dialpad more (telephony + AI costs) vs. digital (just AI costs).</p>
        </div>

        <div class="page-section">
          <h2>What Makes a Conversation Billable?</h2>

          <p>A conversation is charged <strong>ONLY</strong> when <strong>ALL</strong> these criteria are met:</p>

          <h3>Requirements (Both Voice & Digital):</h3>
          <ol>
            <li><strong>At least one AI agent ↔ customer interaction</strong> (customer must respond to the AI)</li>
            <li><strong>Either:</strong>
              <ul>
                <li>1+ knowledge retrievals (AI looked up information), OR</li>
                <li>1+ successful skill execution (AI performed an action via MCP tool)</li>
              </ul>
            </li>
            <li><strong>Session marked closed via:</strong>
              <ul>
                <li>Inactivity timeout</li>
                <li>Customer hangs up</li>
                <li>AI Agent closes session</li>
                <li>Human agent closes session after transfer</li>
              </ul>
            </li>
          </ol>

          <h3>Key Rule: Transfer Inclusive Billing</h3>
          <ul>
            <li>If an AI Agent handles a conversation, executes a skill, then <strong>transfers to a human</strong>, you're <strong>still charged for the AI conversation</strong></li>
            <li>The human interaction doesn't add another charge (unless it starts a new AI conversation)</li>
          </ul>
        </div>

        <div class="page-section">
          <h2>What's NOT Billable (Free)</h2>

          <p><strong>Standard IVR routing</strong> without agentic skills:</p>
          <ul>
            <li>Regular menu navigation</li>
            <li>Multi-level menus</li>
            <li>Call routing by phone number</li>
            <li>AI-powered routing menus (without skill execution)</li>
          </ul>

          <p><strong>The key:</strong> If no skill was executed, it's <strong>free</strong> - just routing doesn't count.</p>
        </div>

        <div class="page-section">
          <h2>Tiered Volume Discounts</h2>

          <p>Customers buy credits upfront with volume discounts:</p>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Credits/Month</th>
                  <th>Price per Credit</th>
                  <th>Digital Rate</th>
                  <th>Voice Rate</th>
                  <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pay-as-you-go</td>
                  <td>$1.00</td>
                  <td>$0.99</td>
                  <td>$1.99</td>
                  <td>0%</td>
                </tr>
                <tr>
                  <td>50-500</td>
                  <td>$0.95</td>
                  <td>$0.94</td>
                  <td>$1.89</td>
                  <td>5%</td>
                </tr>
                <tr>
                  <td>1,000-5,000</td>
                  <td>$0.90</td>
                  <td>$0.89</td>
                  <td>$1.79</td>
                  <td>10%</td>
                </tr>
                <tr class="highlight-row">
                  <td><strong>10,000-20,000</strong></td>
                  <td><strong>$0.80</strong></td>
                  <td><strong>$0.79</strong></td>
                  <td><strong>$1.59</strong></td>
                  <td><strong>20% ← Sales focus</strong></td>
                </tr>
                <tr>
                  <td>25,000-45,000</td>
                  <td>$0.75</td>
                  <td>$0.74</td>
                  <td>$1.49</td>
                  <td>25%</td>
                </tr>
                <tr>
                  <td>50,000+</td>
                  <td>$0.70</td>
                  <td>$0.69</td>
                  <td>$1.39</td>
                  <td>30%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Sales Strategy:</strong> Minimum 10K credits to contract (targeting MM/ENT customers).</p>
        </div>

        <div class="page-section">
          <h2>Channel Switching Rules</h2>

          <p>If a customer switches channels mid-conversation:</p>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Billing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Voice AI → Digital AI</td>
                  <td>2 charges (1 voice + 1 digital)</td>
                </tr>
                <tr>
                  <td>Digital AI → Voice AI</td>
                  <td>2 charges (1 digital + 1 voice)</td>
                </tr>
                <tr>
                  <td>Voice AI → Human escalation</td>
                  <td>1 charge (voice only)</td>
                </tr>
                <tr>
                  <td>Digital AI → Human escalation</td>
                  <td>1 charge (digital only)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Each channel = separate billable conversation</strong></p>
        </div>

        <div class="page-section">
          <h2>Product Protection (Cost Controls)</h2>

          <p><strong>Built-in safeguards:</strong></p>
          <ol>
            <li>Prioritize shorter calls in AI design</li>
            <li>Suggest deflecting to digital (cheaper for customer, better margin for Dialpad)</li>
            <li>Default 5-minute escalation threshold</li>
            <li>Abuse detection (unusual call patterns)</li>
            <li>Auto-improvement alerts (misconfigured bots flagged)</li>
          </ol>
        </div>

        <div class="page-section">
          <h2>MVP Product Requirements for GA</h2>

          <p>Customers need these features to <strong>manage usage</strong>:</p>

          <h3>1. Launchpad (Dashboard)</h3>
          <ul>
            <li>High-level usage overview</li>
            <li>Spike/anomaly detection</li>
          </ul>

          <h3>2. Agent Builder</h3>
          <ul>
            <li>See automation rate (ROI on what you've built)</li>
            <li>Unified voice/digital builder</li>
            <li>Understand what will be charged</li>
          </ul>

          <h3>3. Conversation History ⭐</h3>
          <ul>
            <li><strong>Show which conversations were charged & why</strong></li>
            <li><strong>Filter by: Skills executed / Agents / Channels / Escalations</strong></li>
            <li>End-to-end conversation view (including transfers)</li>
          </ul>

          <h3>4. Credit Usage / Analytics</h3>
          <ul>
            <li>Real-time credit burn rate</li>
            <li><strong>Hard caps:</strong> Stop service at X credits</li>
            <li><strong>Soft caps:</strong> Alert at X% usage</li>
            <li>Forecasted usage (when you'll run out)</li>
            <li>Per-agent breakdowns</li>
          </ul>

          <h3>5. RBAC Permissions</h3>
          <p><strong>Two key roles:</strong></p>
          <ul>
            <li><strong>Conversation Designer:</strong> Build/edit agents + view history + see analytics</li>
            <li><strong>Billing Admin:</strong> View-only access to agents + full analytics/billing control</li>
          </ul>
        </div>

        <div class="page-section">
          <h2>Open Questions (Still Unresolved)</h2>

          <ol>
            <li><strong>Price levels across currencies</strong> - How to handle international pricing?</li>
            <li><strong>Fair use treatment</strong> - Should calls over 5 minutes cost more?</li>
            <li><strong>Draw-down priority</strong> - Which credit pools get used first (recurring vs one-time)?</li>
            <li><strong>MVP feature scope</strong> - What's absolutely required vs. nice-to-have for GA?</li>
          </ol>
        </div>

        <div class="page-section">
          <h2>Contract & Legal</h2>

          <h3>Key contractual terms:</h3>
          <ol>
            <li><strong>Usage resets per billing period</strong> (pro-rated on upgrades)</li>
            <li><strong>200% overage trigger</strong> - If customer exceeds 2x commitment, mandatory account manager meeting</li>
            <li><strong>Annual minimum commitment</strong> - Can only upgrade or pay overages mid-contract</li>
          </ol>

          <h3>Example Order Form:</h3>
          <ul>
            <li>AI Agent Credits: 1,000 credits/month @ $0.82/credit = $9,840/year</li>
            <li>Recurring Credits: $1,000/month (flexible usage) = $12,000/year</li>
            <li><strong>Total: $21,840/year</strong></li>
          </ul>
        </div>

        <div class="page-section">
          <h2>Scenario Comparison & Decision Framework</h2>

          <h3>Detailed Comparison</h3>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Scenario A: Unified Credits</th>
                  <th>Scenario B: Dynamic Tiered Rates</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1. Predictability</strong></td>
                  <td>
                    <strong>Low</strong><br>
                    • Shared pool across usage types<br>
                    • Cannot estimate "X credits = N conversations"<br>
                    • No accurate cost per agent in Agent Builder
                  </td>
                  <td>
                    <strong>High</strong><br>
                    • Fixed rates per tier and usage type<br>
                    • Accurate cost estimates<br>
                    • Clear cost-per-conversation pricing
                  </td>
                </tr>
                <tr>
                  <td><strong>2. Flexibility</strong></td>
                  <td>
                    <strong>High</strong><br>
                    • Allocate/reallocate credits freely<br>
                    • Universal credit pool<br>
                    • Works across all services
                  </td>
                  <td>
                    <strong>Lower</strong><br>
                    • No credit reallocation<br>
                    • No cross-service sharing<br>
                    • Fixed rate structure
                  </td>
                </tr>
                <tr>
                  <td><strong>3. UI Complexity</strong></td>
                  <td>
                    <strong>Higher</strong><br>
                    • Budget allocation UI required<br>
                    • Per-type limit settings<br>
                    • Reallocation controls
                  </td>
                  <td>
                    <strong>Lower</strong><br>
                    • Tier progress visualization<br>
                    • Spend limit setting<br>
                    • No allocation needed
                  </td>
                </tr>
                <tr>
                  <td><strong>4. Customer Mental Model</strong></td>
                  <td>
                    <strong>More Complex</strong><br>
                    • Must understand pooling & allocation<br>
                    • Steeper learning curve
                  </td>
                  <td>
                    <strong>Simpler</strong><br>
                    • Like cell phone plans<br>
                    • Familiar tiered discount model
                  </td>
                </tr>
                <tr>
                  <td><strong>5. Multi-Product Alignment</strong></td>
                  <td>
                    <strong>Perfect</strong><br>
                    • Single credit pool for all services<br>
                    • Unified billing view<br>
                    • Natural enterprise fit
                  </td>
                  <td>
                    <strong>Requires Extension</strong><br>
                    • Dual pricing models<br>
                    • SMS/Intl remain credit-based<br>
                    • Two systems to explain
                  </td>
                </tr>
                <tr>
                  <td><strong>6. Discounting Strategy</strong></td>
                  <td>
                    • Flat discount on purchase<br>
                    • Low flexibility<br>
                    • Upfront volume incentive only
                  </td>
                  <td>
                    • Progressive volume discounts<br>
                    • High flexibility<br>
                    • Ongoing usage motivation
                  </td>
                </tr>
                <tr>
                  <td><strong>7. Alerts & Limits</strong></td>
                  <td>
                    • Per-type budget alerts<br>
                    • Soft/hard limits<br>
                    • High granularity
                  </td>
                  <td>
                    • Single monthly spend limit<br>
                    • Overall spend tracking<br>
                    • Lower granularity
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Pros & Cons Summary</h3>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th style="width: 50%">Scenario A: Unified Credits</th>
                  <th style="width: 50%">Scenario B: Dynamic Tiered Rates</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Pros:</strong><br>
                    • Simple unified credit pool<br>
                    • Works across all Dialpad services<br>
                    • Flexible reallocation<br>
                    • Familiar prepaid model<br>
                    • No monthly tier resets<br><br>
                    <strong>Cons:</strong><br>
                    • Low predictability for cost estimates<br>
                    • Requires budget allocation UI<br>
                    • More complex customer mental model<br>
                    • Cannot show accurate "cost per agent"<br>
                    • Use-it-or-lose-it may frustrate<br><br>
                    <strong>Best For:</strong> Enterprise customers with diverse usage patterns, multiple Dialpad services, prepaid model preference
                  </td>
                  <td>
                    <strong>Pros:</strong><br>
                    • High predictability for cost estimates<br>
                    • Simpler customer mental model<br>
                    • Automatic volume discounts<br>
                    • No upfront capital required<br>
                    • Accurate costs in Agent Builder<br><br>
                    <strong>Cons:</strong><br>
                    • Less flexible - no credit reallocation<br>
                    • Dual pricing models in one surface<br>
                    • Monthly tier resets<br>
                    • Two billing systems to explain<br><br>
                    <strong>Best For:</strong> Cost predictability priority, new to Dialpad ecosystem, pay-as-you-go preference
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Decision Criteria</h3>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Scenario A</th>
                  <th>Scenario B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Which is easier to understand?</strong></td>
                  <td>"I have 7,234 credits left"</td>
                  <td>"I'm at Tier 2, 267 to Tier 3"</td>
                </tr>
                <tr>
                  <td><strong>Which encourages desired behavior?</strong></td>
                  <td>May discourage usage (pool running out)</td>
                  <td>Encourages usage (unlock savings)</td>
                </tr>
                <tr>
                  <td><strong>Which is easier to sell/quote?</strong></td>
                  <td>"$8K/month, locked rates"</td>
                  <td>"Rates range from X to Y based on volume"</td>
                </tr>
                <tr>
                  <td><strong>Which requires less product complexity?</strong></td>
                  <td>Budget allocation UI required</td>
                  <td>Tier tracking required</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Recommendation Framework</h3>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th style="width: 50%">Choose Scenario A if:</th>
                  <th style="width: 50%">Choose Scenario B if:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    • Multi-product alignment is critical<br>
                    • Customer wants maximum flexibility<br>
                    • Prepaid model preferred<br>
                    • Cross-service credit sharing is valuable
                  </td>
                  <td>
                    • Cost predictability is paramount<br>
                    • Simpler mental model is desired<br>
                    • Progressive discounts motivate usage<br>
                    • Accurate Agent Builder estimates are critical
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="page-section">
          <h2>Long-Term Vision (Future Scenarios)</h2>

          <p>Document explores two approaches:</p>

          <h3>Scenario A: Upfront Credits Model (Simpler)</h3>
          <ul>
            <li>Buy credits upfront</li>
            <li>Allocate budgets across services</li>
            <li>Set limits per service</li>
            <li>Fixed discount based on volume</li>
          </ul>

          <p><strong>Think of it like:</strong></p>
          <ul>
            <li><strong>Video game arcade:</strong> Buy 100 tokens upfront for $80 (20% discount). Use tokens on any game you want. When you run out, buy more tokens.</li>
            <li><strong>Prepaid phone plan:</strong> Pay $50 upfront for 1000 minutes. Use them however you want across calls, texts, data. No surprises at month-end.</li>
          </ul>

          <h3>Scenario B: Tiered Rates Model (More Flexible)</h3>
          <ul>
            <li>Dynamic rates per usage type</li>
            <li>Volume discounts per service category</li>
            <li>More complex but better for negotiations</li>
          </ul>

          <p><strong>Think of it like:</strong></p>
          <ul>
            <li><strong>Video game arcade with tier cards:</strong> First 100 games cost $1 each. Next 500 games cost $0.80 each. After 1000 games, pay only $0.60 each. Rates adjust automatically as you play more.</li>
            <li><strong>Post-paid phone plan:</strong> Pay at month-end based on actual usage. The more you use, the cheaper each minute becomes. 0-100 mins = $0.10/min, 100-500 mins = $0.08/min, 500+ mins = $0.05/min.</li>
          </ul>
        </div>

        <div class="page-section">
          <h2>Summary of Changes Requested by Josh on Dec 4th 2025</h2>

          <ol>
            <li>
              <strong>Reduce visual noise</strong>
              <ul>
                <li>Remove large bars, rings, and decorative graphics.</li>
                <li>Prioritize numbers over visuals.</li>
                <li>Avoid repeating the same status signal multiple times (e.g., "Trending high").</li>
              </ul>
            </li>

            <li>
              <strong>Improve clarity of remaining vs used</strong>
              <ul>
                <li>Emphasize remaining credits or remaining spend more strongly than used amounts.</li>
                <li>Make the "remaining" value the dominant number for quick scanning.</li>
              </ul>
            </li>

            <li>
              <strong>Simplify layout and information density</strong>
              <ul>
                <li>Reduce text per row and avoid paragraphs.</li>
                <li>Collapse alloc/used/remaining into tighter formats.</li>
                <li>Make the interface feel like a control panel, not a report.</li>
              </ul>
            </li>

            <li>
              <strong>Replace verbose labels with simple indicators</strong>
              <ul>
                <li>Use minimal status markers (dot + text) instead of pills or tags.</li>
                <li>Shorten interpretation lines to mechanical phrases.</li>
              </ul>
            </li>

            <li>
              <strong>Add predictive signals</strong>
              <ul>
                <li>Show simple pacing indicators (on track, projected over).</li>
                <li>Add micro-visuals (tiny sparkline or meter) to convey trend direction.</li>
                <li>Provide a single trend summary rather than repeating it across sections.</li>
              </ul>
            </li>

            <li>
              <strong>Strengthen budgeting and controls</strong>
              <ul>
                <li>Add ability to allocate budgets per category.</li>
                <li>Include hard and soft caps.</li>
                <li>Provide clear alerts (thresholds, forecast depletion).</li>
                <li>Make rollover management clear for one-time credits.</li>
              </ul>
            </li>

            <li>
              <strong>Consistent treatment across A and B</strong>
              <ul>
                <li>Scenario B should follow the same structural principles as Scenario A.</li>
                <li>Use the same hero-card pattern, trend banner, and ledger-style table.</li>
              </ul>
            </li>

            <li>
              <strong>Reorganize the hierarchy</strong>
              <ul>
                <li>Trend banner at the top with a single interpretation line.</li>
                <li>Hero cards present the most important metrics.</li>
                <li>Budget snapshot or tier progress follows as a compact ledger.</li>
                <li>Purchasing actions (Add Credits) belong in credit-based sections only, not in budget tables.</li>
              </ul>
            </li>

            <li>
              <strong>Clarify credit pool behavior</strong>
              <ul>
                <li>Explain sequencing between renewing and one-time credits.</li>
                <li>Allow configuration of rollover, auto-top-up, and fallback rules.</li>
              </ul>
            </li>

            <li>
              <strong>Avoid documentation-like content</strong>
              <ul>
                <li>Replace explanatory blocks with short, self-evident UI patterns.</li>
                <li>Provide optional inline expansions only when needed.</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import AdminShell from '../components/layout/AdminShell.vue'
</script>

<style scoped>
.notes-page {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.notes-content {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.notes-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1C1C1C;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #E5E5E5;
}

.page-section {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #F0F0F0;
}

.page-section:last-child {
  border-bottom: none;
}

.page-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1C1C1C;
  margin-bottom: 20px;
}

.page-section h3 {
  font-size: 19px;
  font-weight: 600;
  color: #1C1C1C;
  margin-top: 20px;
  margin-bottom: 12px;
}

.page-section p {
  font-size: 16px;
  line-height: 1.6;
  color: #535353;
  margin-bottom: 12px;
}

.page-section ul,
.page-section ol {
  margin-left: 24px;
  margin-bottom: 16px;
}

.page-section li {
  font-size: 16px;
  line-height: 1.7;
  color: #535353;
  margin-bottom: 8px;
}

.page-section li ul,
.page-section li ol {
  margin-top: 8px;
  margin-bottom: 8px;
}

.pricing-table {
  overflow-x: auto;
  margin: 20px 0;
}

.pricing-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.pricing-table th {
  background-color: #F9F9F9;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #1C1C1C;
  border-bottom: 2px solid #E5E5E5;
}

.pricing-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #F0F0F0;
  color: #535353;
}

.pricing-table tr:hover {
  background-color: #FAFAFA;
}

.highlight-row {
  background-color: #F3F3F8;
  font-weight: 600;
}

.highlight-row td {
  color: #1C1C1C;
}

strong {
  font-weight: 600;
  color: #1C1C1C;
}

em {
  font-style: italic;
  color: #888888;
}
</style>
