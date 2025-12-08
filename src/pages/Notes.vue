<template>
  <AdminShell>
    <div class="notes-page">
      <div class="notes-content">
        <h1>Simplified Version of Abby's PRD</h1>

        <!-- Index -->
        <div class="page-section index-section">
          <h2>Document Index</h2>

          <div class="index-grid">
            <div class="index-column">
              <h3>Original PRD Content</h3>
              <ul class="index-list">
                <li><a @click.prevent="scrollTo('document-overview')">Document Overview</a></li>
                <li><a @click.prevent="scrollTo('core-pricing')">Core Pricing Model</a></li>
                <li><a @click.prevent="scrollTo('billable-criteria')">What Makes a Conversation Billable?</a></li>
                <li><a @click.prevent="scrollTo('not-billable')">What's NOT Billable (Free)</a></li>
                <li><a @click.prevent="scrollTo('volume-discounts')">Tiered Volume Discounts</a></li>
                <li><a @click.prevent="scrollTo('channel-switching')">Channel Switching Rules</a></li>
                <li><a @click.prevent="scrollTo('cost-controls')">Product Protection (Cost Controls)</a></li>
                <li><a @click.prevent="scrollTo('mvp-requirements')">MVP Product Requirements for GA</a></li>
                <li><a @click.prevent="scrollTo('open-questions')">Open Questions (Still Unresolved)</a></li>
                <li><a @click.prevent="scrollTo('contract-legal')">Contract & Legal</a></li>
              </ul>
            </div>

            <div class="index-column">
              <h3>Scenario Analysis</h3>
              <ul class="index-list">
                <li><a @click.prevent="scrollTo('scenario-comparison')">Scenario Comparison & Decision Framework</a></li>
                <li><a @click.prevent="scrollTo('future-scenarios')">Long-Term Vision (Future Scenarios)</a></li>
              </ul>

              <h3 style="margin-top: 24px;">Implementation Updates</h3>
              <ul class="index-list">
                <li><a @click.prevent="scrollTo('josh-feedback')">Josh's Feedback (Dec 4, 2025)</a></li>
                <li><a @click.prevent="scrollTo('billing-scenarios')"><strong>NEW:</strong> Billing Scenarios A, B, C, D (Dec 8, 2025)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="page-section" id="document-overview">
          <h2>Document Overview</h2>
          <p>This PRD defines how Dialpad will bill customers for AI Agent conversations at GA (February 1, 2026). It establishes different rates for voice vs. digital conversations and outlines the complete billing model.</p>
        </div>

        <div class="page-section" id="core-pricing">
          <h2>Core Pricing Model</h2>

          <h3>Rate Card:</h3>
          <ul>
            <li><strong>AI Agent Voice</strong> = <strong>1.99 credits</strong> per conversation (~$1.99 for voice calls)</li>
            <li><strong>AI Agent Digital</strong> = <strong>0.99 credits</strong> per conversation (~$0.99 for chat/digital)</li>
          </ul>

          <p><strong>Why the difference?</strong> Voice costs Dialpad more (telephony + AI costs) vs. digital (just AI costs).</p>
        </div>

        <div class="page-section" id="billable-criteria">
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

        <div class="page-section" id="not-billable">
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

        <div class="page-section" id="volume-discounts">
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

        <div class="page-section" id="channel-switching">
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

        <div class="page-section" id="cost-controls">
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

        <div class="page-section" id="mvp-requirements">
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

        <div class="page-section" id="open-questions">
          <h2>Open Questions (Still Unresolved)</h2>

          <ol>
            <li><strong>Price levels across currencies</strong> - How to handle international pricing?</li>
            <li><strong>Fair use treatment</strong> - Should calls over 5 minutes cost more?</li>
            <li><strong>Draw-down priority</strong> - Which credit pools get used first (recurring vs one-time)?</li>
            <li><strong>MVP feature scope</strong> - What's absolutely required vs. nice-to-have for GA?</li>
          </ol>
        </div>

        <div class="page-section" id="contract-legal">
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

        <div class="page-section" id="scenario-comparison">
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

        <div class="page-section" id="future-scenarios">
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

        <div class="page-section" id="josh-feedback">
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

        <div class="page-section" id="billing-scenarios">
          <h2>Implemented Billing Scenarios (December 8, 2025)</h2>

          <p>Based on Abby's PRD and stakeholder feedback, we've built four distinct billing scenarios to explore different entitlement models and control mechanisms. Each scenario demonstrates a different approach to managing AI Agent costs and service consumption.</p>

          <h3>Scenario A: Recurring Credits Only</h3>

          <p><strong>Model:</strong> Single flexible credit pool used across all services</p>

          <p><strong>What it does:</strong></p>
          <ul>
            <li>Customers purchase a recurring credit pool (e.g., $15,000/month)</li>
            <li>Admins allocate credits across services (AI Agent Digital, AI Agent Voice, SMS, International, Fax)</li>
            <li>Credits are shared and can be reallocated based on actual usage patterns</li>
            <li>Hard stops at 100% of allocated budget prevent services from consuming more than their allocation</li>
          </ul>

          <p><strong>Key features:</strong></p>
          <ul>
            <li>Budget Snapshot with allocation controls</li>
            <li>Usage Alerts with soft thresholds (80%) and hard stops (100%)</li>
            <li>Rollover settings for recurring vs one-time credits</li>
            <li>Expiring credits tracking (use-it-or-lose-it model)</li>
          </ul>

          <p><strong>Best for:</strong> Enterprise customers with diverse usage patterns who want flexibility to reallocate spend across services.</p>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Entitlement</th>
                  <th>Cap Mechanism</th>
                  <th>Control Point</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$15,000 recurring credit pool (shared)</td>
                  <td>Hard stops at 100% of allocated budget</td>
                  <td>Budget allocation per service</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Scenario B: Hybrid (Recurring + Committed Packs)</h3>

          <p><strong>Model:</strong> Committed packs for AI Agent + recurring credit pool for other services</p>

          <p><strong>What it does:</strong></p>
          <ul>
            <li>AI Agent services (Digital & Voice) use committed usage packs (e.g., 17,000 conversations prepaid)</li>
            <li>Other services (SMS, International, Fax) draw from a separate recurring credit pool ($500,000)</li>
            <li>Packs are consumed first, then recurring credits, then one-time credits, then overage charges apply</li>
            <li>Dual cap system: pack depletion for AI Agent, credit hard stops for other services</li>
          </ul>

          <p><strong>Key features:</strong></p>
          <ul>
            <li>Committed Usage Packs table showing pack size, utilization, and rates</li>
            <li>Budget Snapshot for recurring credit pool (SMS, International, Fax only)</li>
            <li>Usage Alerts only for credit-based services (not for packs)</li>
            <li>Clear draw-down priority: Packs → Recurring → One-time → Overage</li>
          </ul>

          <p><strong>Best for:</strong> Customers with predictable AI Agent usage who want volume discounts via packs, while maintaining flexibility for variable services.</p>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Entitlement</th>
                  <th>Cap Mechanism</th>
                  <th>Control Point</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>17,000 conversation packs (AI Agent)</td>
                  <td>Pack depletion (self-limiting)</td>
                  <td>Pack size defines capacity</td>
                </tr>
                <tr>
                  <td>$500,000 recurring credits (other services)</td>
                  <td>Hard stops at 100% of allocated budget</td>
                  <td>Budget allocation per service</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Why two systems?</strong> AI Agent packs are prepaid capacity (like buying a phone plan), so the pack size is the cap. Other services use the flexible credit pool and need explicit budget controls to prevent over-consumption.</p>

          <h3>Scenario C: Committed Packs Only</h3>

          <p><strong>Model:</strong> All services use committed usage packs (no flexible credit pool)</p>

          <p><strong>What it does:</strong></p>
          <ul>
            <li>Customers purchase usage-specific packs for each service (e.g., 10,000 AI Digital conversations, 50,000 SMS messages)</li>
            <li>Each pack is consumed independently—cannot share capacity across services</li>
            <li>Hard caps at 95-98% of pack size prevent overage charges by stopping usage before pack depletes</li>
            <li>When pack exhausts: either usage stops (if hard cap enabled) or overage charges apply at standard rates</li>
          </ul>

          <p><strong>Key features:</strong></p>
          <ul>
            <li>Usage by Pack Type table with Utilization, Rate, <strong>Hard Cap</strong>, and Status columns</li>
            <li>Pack Coverage indicator showing which services have packs (5/6 services)</li>
            <li>Overage Risk tracking for packs depleting faster than expected</li>
            <li>Usage Alerts per pack with configurable soft alerts and hard caps</li>
          </ul>

          <p><strong>Best for:</strong> Enterprise customers with very predictable usage who want precise per-service control and maximum protection against surprise charges.</p>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Entitlement</th>
                  <th>Cap Mechanism</th>
                  <th>Control Point</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5 committed packs (usage-specific)</td>
                  <td>Hard caps at 95-98% of pack size</td>
                  <td>Optional per-pack overage prevention</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Hard Cap Explained (Scenario C only):</strong></p>
          <ul>
            <li><strong>Example:</strong> AI Agent Digital pack has 10,000 conversations with a 95% hard cap (9,500 conversations)</li>
            <li><strong>Purpose:</strong> Stops usage at 9,500 to prevent overage charges, leaving 500-unit safety buffer</li>
            <li><strong>Trade-off:</strong> Zero surprise costs vs potential service interruption until admin adds capacity</li>
            <li><strong>Why below 100%?</strong> Buffer prevents accidental overage from in-flight requests or race conditions</li>
          </ul>

          <p><em><strong>Key difference from Scenario A/B:</strong> Scenario A and B have "hard stops" at 100% of <strong>allocated budget</strong> (budget control). Scenario C has "hard caps" at 95-98% of <strong>pack size</strong> (overage prevention). Different purposes, different mechanisms.</em></p>

          <h3>Scenario D: Dynamic Tiered Rates (Pay-As-You-Go)</h3>

          <p><strong>Model:</strong> Pay-as-you-go pricing with progressive volume discounts</p>

          <p><strong>What it does:</strong></p>
          <ul>
            <li>No upfront commitment—customers pay per conversation at rates that decrease with volume</li>
            <li>7 tiers from Starter (0-500 conversations) to Enterprise (50,001+)</li>
            <li>Automatic tier upgrades as monthly usage increases</li>
            <li>Monthly spend limits (soft or hard) prevent runaway costs</li>
            <li>Tiers reset monthly (fresh start each billing period)</li>
          </ul>

          <p><strong>Key features:</strong></p>
          <ul>
            <li>Tier progression visualization showing current tier and progress to next tier</li>
            <li>Rate card showing all 7 tiers with Digital/Voice rates and discount percentages</li>
            <li>Forecast showing projected tier by month-end based on current pace</li>
            <li>Spend limit management (soft vs hard limits)</li>
          </ul>

          <p><strong>Best for:</strong> Customers with variable usage who want flexibility, no upfront capital commitment, and automatic volume discounts.</p>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Entitlement</th>
                  <th>Cap Mechanism</th>
                  <th>Control Point</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Unlimited pay-as-you-go (no prepayment)</td>
                  <td>Monthly spend limit (soft or hard)</td>
                  <td>Dollar-based cap, not usage cap</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>⚠️ Important Note:</strong> Scenario D represents a different billing philosophy than Scenarios A, B, and C. After initial exploration, <strong>Abby indicated we should not continue developing this model</strong>. The prototype remains for reference and comparison purposes, but the focus has shifted to committed capacity models (A, B, C) which align better with Dialpad's enterprise-first strategy and existing billing infrastructure.</p>

          <p><strong>Why Abby said no:</strong> Dynamic tiered rates introduce monthly resets, variable revenue forecasting complexity, and potential "gaming" behavior at tier boundaries. The committed models (A, B, C) provide more predictable revenue for Dialpad and clearer cost expectations for customers.</p>

          <h3>Summary Comparison</h3>

          <div class="pricing-table">
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Core Model</th>
                  <th>Flexibility</th>
                  <th>Predictability</th>
                  <th>Key Control</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>A: Recurring Credits</strong></td>
                  <td>Shared credit pool</td>
                  <td>High (reallocate anytime)</td>
                  <td>Medium (pool shared)</td>
                  <td>Budget allocation</td>
                </tr>
                <tr>
                  <td><strong>B: Hybrid</strong></td>
                  <td>Packs + Credits</td>
                  <td>Medium (dual system)</td>
                  <td>High (separate pools)</td>
                  <td>Dual cap system</td>
                </tr>
                <tr>
                  <td><strong>C: Packs Only</strong></td>
                  <td>Usage-specific packs</td>
                  <td>Low (no sharing)</td>
                  <td>Highest (locked rates)</td>
                  <td>Hard caps per pack</td>
                </tr>
                <tr class="highlight-row">
                  <td><strong>D: Tiered Rates</strong></td>
                  <td>Pay-as-you-go</td>
                  <td>Highest (unlimited)</td>
                  <td>Low (variable cost)</td>
                  <td>Spend limit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import AdminShell from '../components/layout/AdminShell.vue'

const scrollTo = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
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

/* Index Section */
.index-section {
  background-color: #F9FAFB;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  padding: 24px;
}

.index-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .index-grid {
    grid-template-columns: 1fr;
  }
}

.index-column h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1C1C1C;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #D1D5DB;
}

.index-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.index-list li {
  margin-bottom: 8px;
}

.index-list a {
  color: #6E4AE4;
  text-decoration: none;
  font-size: 15px;
  line-height: 1.5;
  display: block;
  padding: 4px 0;
  transition: color 0.2s ease;
  cursor: pointer;
}

.index-list a:hover {
  color: #5A3ABD;
  text-decoration: underline;
}

.index-list a strong {
  color: #10B981;
  font-weight: 600;
}
</style>
