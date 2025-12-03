<template>
  <AdminShell>
    <div class="comparison-page">
      <div class="page-header">
        <h1>Scenario Comparison</h1>
        <p class="subtitle">Side-by-side analysis to help leadership decide between billing models</p>
      </div>

      <!-- Executive Summary -->
      <div class="card highlight-card">
        <h2>{{ data.recommendation.title }}</h2>
        <div class="recommendation-question">{{ data.recommendation.question }}</div>
        <div class="important-note">
          <strong>Important:</strong> Both scenarios use ONE unified Billing surface (not separate pages). The question is about the <strong>pricing model</strong>, not UI separation:
          <ul>
            <li><strong>Scenario A:</strong> All products (Agentic AI + SMS + International) use the SAME credits pricing model</li>
            <li><strong>Scenario B:</strong> Agentic AI uses tiered rates, while SMS/International continue using credits - both in ONE surface</li>
          </ul>
        </div>
        <div class="consideration-list">
          <div class="consideration-title">Key Considerations:</div>
          <ul>
            <li v-for="item in data.recommendation.considerations" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="quick-links">
        <router-link to="/scenario-a" class="quick-link-btn">View Scenario A Prototype →</router-link>
        <router-link to="/scenario-b" class="quick-link-btn">View Scenario B Prototype →</router-link>
      </div>

      <!-- Scenario Overview Cards -->
      <div class="scenario-cards">
        <div class="scenario-card scenario-a">
          <div class="scenario-header">
            <h3>Scenario A: Unified Credits</h3>
            <div class="scenario-model">{{ data.scenarioA.model }}</div>
          </div>
          <p class="scenario-description">Pre-purchase credits with flat discount. ONE universal pool for Agentic AI + SMS + International + Toll-free. All products use the SAME pricing model.</p>
        </div>

        <div class="scenario-card scenario-b">
          <div class="scenario-header">
            <h3>Scenario B: Dual Pricing</h3>
            <div class="scenario-model">{{ data.scenarioB.model }}</div>
          </div>
          <p class="scenario-description">TWO pricing models in ONE billing surface: Agentic AI uses tiered rates (pay-as-you-go), while SMS/International use credits (existing model).</p>
        </div>
      </div>

      <!-- Detailed Comparison Table -->
      <div class="card">
        <h2>Detailed Comparison</h2>

        <div class="comparison-section">
          <div class="comparison-category">
            <div class="category-title">Predictability</div>
            <div class="comparison-row">
              <div class="comparison-cell">
                <div class="level-badge level-low">{{ data.scenarioA.predictability.level }}</div>
                <p>{{ data.scenarioA.predictability.description }}</p>
                <p class="impact-text"><strong>Impact:</strong> {{ data.scenarioA.predictability.impact }}</p>
              </div>
              <div class="comparison-cell">
                <div class="level-badge level-high">{{ data.scenarioB.predictability.level }}</div>
                <p>{{ data.scenarioB.predictability.description }}</p>
                <p class="impact-text"><strong>Impact:</strong> {{ data.scenarioB.predictability.impact }}</p>
              </div>
            </div>
          </div>

          <div class="comparison-category">
            <div class="category-title">Flexibility</div>
            <div class="comparison-row">
              <div class="comparison-cell">
                <div class="level-badge level-high">{{ data.scenarioA.flexibility.level }}</div>
                <p>{{ data.scenarioA.flexibility.description }}</p>
                <ul class="benefit-list">
                  <li v-for="benefit in data.scenarioA.flexibility.benefits" :key="benefit">{{ benefit }}</li>
                </ul>
              </div>
              <div class="comparison-cell">
                <div class="level-badge level-low">{{ data.scenarioB.flexibility.level }}</div>
                <p>{{ data.scenarioB.flexibility.description }}</p>
                <ul class="limitation-list">
                  <li v-for="limit in data.scenarioB.flexibility.limitations" :key="limit">{{ limit }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="comparison-category">
            <div class="category-title">UI Complexity</div>
            <div class="comparison-row">
              <div class="comparison-cell">
                <div class="level-badge level-high">{{ data.scenarioA.uiComplexity.level }}</div>
                <p>{{ data.scenarioA.uiComplexity.description }}</p>
                <ul class="component-list">
                  <li v-for="comp in data.scenarioA.uiComplexity.components" :key="comp">{{ comp }}</li>
                </ul>
              </div>
              <div class="comparison-cell">
                <div class="level-badge level-low">{{ data.scenarioB.uiComplexity.level }}</div>
                <p>{{ data.scenarioB.uiComplexity.description }}</p>
                <ul class="component-list">
                  <li v-for="comp in data.scenarioB.uiComplexity.components" :key="comp">{{ comp }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="comparison-category">
            <div class="category-title">Customer Mental Model</div>
            <div class="comparison-row">
              <div class="comparison-cell">
                <div class="level-badge level-high">{{ data.scenarioA.customerMentalModel.complexity }}</div>
                <p>{{ data.scenarioA.customerMentalModel.description }}</p>
                <p class="learning-curve"><strong>Learning Curve:</strong> {{ data.scenarioA.customerMentalModel.learningCurve }}</p>
              </div>
              <div class="comparison-cell">
                <div class="level-badge level-low">{{ data.scenarioB.customerMentalModel.complexity }}</div>
                <p>{{ data.scenarioB.customerMentalModel.description }}</p>
                <p class="learning-curve"><strong>Learning Curve:</strong> {{ data.scenarioB.customerMentalModel.learningCurve }}</p>
              </div>
            </div>
          </div>

          <div class="comparison-category">
            <div class="category-title">Multi-Product Alignment</div>
            <div class="comparison-row">
              <div class="comparison-cell winner">
                <div class="level-badge level-winner">{{ data.scenarioA.multiProduct.alignment }}</div>
                <p>{{ data.scenarioA.multiProduct.description }}</p>
                <ul class="benefit-list">
                  <li v-for="benefit in data.scenarioA.multiProduct.benefits" :key="benefit">{{ benefit }}</li>
                </ul>
              </div>
              <div class="comparison-cell">
                <div class="level-badge level-warning">{{ data.scenarioB.multiProduct.alignment }}</div>
                <p>{{ data.scenarioB.multiProduct.description }}</p>
                <ul class="limitation-list">
                  <li v-for="challenge in data.scenarioB.multiProduct.challenges" :key="challenge">{{ challenge }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="comparison-category">
            <div class="category-title">Discounting Model</div>
            <div class="comparison-row">
              <div class="comparison-cell">
                <p><strong>Model:</strong> {{ data.scenarioA.discounting.model }}</p>
                <p><strong>Flexibility:</strong> {{ data.scenarioA.discounting.flexibility }}</p>
                <p><strong>Volume Incentive:</strong> {{ data.scenarioA.discounting.volumeIncentive }}</p>
              </div>
              <div class="comparison-cell">
                <p><strong>Model:</strong> {{ data.scenarioB.discounting.model }}</p>
                <p><strong>Flexibility:</strong> {{ data.scenarioB.discounting.flexibility }}</p>
                <p><strong>Volume Incentive:</strong> {{ data.scenarioB.discounting.volumeIncentive }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Operational Details Comparison -->
      <div class="card">
        <h2>Operational Details & Safeguards</h2>
        <p class="info">How each scenario handles forecasting, protection, and billing criteria</p>

        <div class="operational-grid">
          <!-- Enterprise Commitment -->
          <div class="operational-section shared">
            <h3>Enterprise Commitment</h3>
            <div class="shared-badge">Identical in Both Scenarios</div>
            <ul>
              <li><strong>Minimum:</strong> 10,000+ credits at GA launch</li>
              <li><strong>Target:</strong> Enterprise customers, not SMB</li>
              <li><strong>Reason:</strong> Ensures high-value customer focus during initial rollout</li>
            </ul>
          </div>

          <!-- Cost Protection Guardrails -->
          <div class="operational-section shared">
            <h3>Cost Protection Guardrails</h3>
            <div class="shared-badge">Identical in Both Scenarios</div>
            <ul>
              <li><strong>120% True-up:</strong> Legal trigger for contract true-up discussion</li>
              <li><strong>200% Usage Alert:</strong> Mandatory notification + meeting with account manager</li>
              <li><strong>Service Continuity:</strong> Service does NOT stop at limits - protection is notification-based</li>
            </ul>
          </div>

          <!-- Billable Criteria -->
          <div class="operational-section shared">
            <h3>Billable Criteria</h3>
            <div class="shared-badge">Identical in Both Scenarios</div>
            <p><strong>All 3 requirements must be met:</strong></p>
            <ul>
              <li>At least 1 AI agent and customer interaction</li>
              <li>1+ knowledge retrievals OR successful skill execution</li>
              <li>Session marked closed (timeout, hangup, bot/human closes)</li>
            </ul>
            <p class="highlight-text"><strong>Critical:</strong> Without skill execution, conversation is FREE (e.g., standard IVR routing)</p>
          </div>

          <!-- Forecasted Usage -->
          <div class="operational-section different">
            <h3>Forecasted Usage Approach</h3>
            <div class="different-badge">Different Between Scenarios</div>

            <div class="scenario-comparison-inline">
              <div class="scenario-inline">
                <div class="scenario-label">Scenario A</div>
                <p><strong>Credit Depletion Forecast:</strong></p>
                <ul>
                  <li>Projected run-out date for credit pool</li>
                  <li>Days remaining until depletion</li>
                  <li>Average daily credit burn rate</li>
                  <li>Draw-down priority visualization (Committed → Recurring → One-time)</li>
                </ul>
              </div>

              <div class="scenario-inline">
                <div class="scenario-label">Scenario B</div>
                <p><strong>Tier Progression Forecast:</strong></p>
                <ul>
                  <li>Projected spend by month end</li>
                  <li>Expected tier advancement date</li>
                  <li>Estimated monthly savings from tier progression</li>
                  <li>Real-time tier unlock progress</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Discount Timing -->
          <div class="operational-section different">
            <h3>Discount Application Timing</h3>
            <div class="different-badge">Different Between Scenarios</div>

            <div class="scenario-comparison-inline">
              <div class="scenario-inline">
                <div class="scenario-label">Scenario A</div>
                <p><strong>Upfront at Purchase:</strong></p>
                <ul>
                  <li>15% discount applied BEFORE consumption</li>
                  <li>Makes quoting easier (figure credits, apply discount, done)</li>
                  <li>Customer sees immediate value at purchase</li>
                </ul>
              </div>

              <div class="scenario-inline">
                <div class="scenario-label">Scenario B</div>
                <p><strong>Progressive with Volume:</strong></p>
                <ul>
                  <li>Discount improves automatically as volume increases</li>
                  <li>No upfront calculations needed</li>
                  <li>Incentivizes higher usage to unlock better rates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pros & Cons -->
      <div class="card">
        <h2>Pros & Cons</h2>
        <div class="pros-cons-grid">
          <div class="pros-cons-section">
            <h3>Scenario A</h3>
            <div class="pros-section">
              <div class="section-title pros-title">Pros</div>
              <ul class="pros-list">
                <li v-for="pro in data.scenarioA.pros" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="cons-section">
              <div class="section-title cons-title">Cons</div>
              <ul class="cons-list">
                <li v-for="con in data.scenarioA.cons" :key="con">{{ con }}</li>
              </ul>
            </div>
            <div class="best-for-section">
              <div class="section-title">Best For:</div>
              <ul class="best-for-list">
                <li v-for="item in data.scenarioA.bestFor" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <div class="pros-cons-section">
            <h3>Scenario B</h3>
            <div class="pros-section">
              <div class="section-title pros-title">Pros</div>
              <ul class="pros-list">
                <li v-for="pro in data.scenarioB.pros" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="cons-section">
              <div class="section-title cons-title">Cons</div>
              <ul class="cons-list">
                <li v-for="con in data.scenarioB.cons" :key="con">{{ con }}</li>
              </ul>
            </div>
            <div class="best-for-section">
              <div class="section-title">Best For:</div>
              <ul class="best-for-list">
                <li v-for="item in data.scenarioB.bestFor" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Decision Factors -->
      <div class="card">
        <h2>Key Decision Factors</h2>
        <p class="info">How each scenario performs on critical dimensions</p>

        <table class="decision-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Scenario A</th>
              <th>Scenario B</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="factor in data.decisionFactors" :key="factor.factor">
              <td class="factor-name">{{ factor.factor }}</td>
              <td :class="{ 'winner-cell': factor.scenarioA.includes('Winner') }">
                {{ factor.scenarioA }}
              </td>
              <td :class="{ 'winner-cell': factor.scenarioB.includes('Winner') }">
                {{ factor.scenarioB }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Final Recommendation -->
      <div class="card final-recommendation">
        <h2>Decision Framework</h2>
        <div class="decision-framework">
          <div class="framework-option">
            <div class="framework-title">Choose Scenario A if:</div>
            <ul>
              <li>Multi-product billing alignment is a top priority</li>
              <li>Customers prefer prepaid models with upfront discounts</li>
              <li>Flexibility to reallocate credits is valuable</li>
              <li>Want unified billing for Agentic + SMS + Toll-free + International</li>
            </ul>
          </div>

          <div class="framework-option">
            <div class="framework-title">Choose Scenario B if:</div>
            <ul>
              <li>Cost predictability and accuracy are critical</li>
              <li>Agent Builder needs exact cost estimates</li>
              <li>Customers prefer pay-as-you-go models</li>
              <li>Simpler customer experience is more important than flexibility</li>
              <li>Focus is primarily on Agentic AI (not multi-product)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { ref } from 'vue'
import AdminShell from '../components/layout/AdminShell.vue'
import { mockData } from '../data/mockData'

const data = ref(mockData.comparison)
</script>

<style scoped>
.comparison-page {
  max-width: 1400px;
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
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.subtitle {
  color: #666666;
  font-size: 14px;
}

.card {
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
}

.highlight-card {
  background-color: #FFF8E1;
  border: 2px solid #000000;
}

.recommendation-question {
  font-size: 18px;
}

.important-note {
  margin: 16px 0;
  padding: 16px;
  background-color: #F0F7FF;
  border-left: 4px solid #0066CC;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
}

.important-note ul {
  margin-top: 8px;
  margin-left: 20px;
  font-weight: 600;
  margin: 16px 0;
}

.consideration-list {
  margin-top: 16px;
}

.consideration-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.consideration-list ul {
  list-style-type: disc;
  margin-left: 24px;
  line-height: 1.8;
}

.quick-links {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.quick-link-btn {
  flex: 1;
  padding: 16px 24px;
  background-color: #000000;
  color: #FFFFFF;
  text-align: center;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
}

.quick-link-btn:hover {
  background-color: #333333;
}

.scenario-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.scenario-card {
  background-color: #FFFFFF;
  border: 2px solid #000000;
  border-radius: 4px;
  padding: 20px;
}

.scenario-header {
  margin-bottom: 12px;
}

.scenario-model {
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
}

.scenario-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666666;
}

.comparison-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comparison-category {
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  overflow: hidden;
}

.category-title {
  background-color: #F5F5F5;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 16px;
}

.comparison-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.comparison-cell {
  padding: 16px;
  border-right: 1px solid #E5E5E5;
}

.comparison-cell:last-child {
  border-right: none;
}

.comparison-cell.winner {
  background-color: #F0FFF4;
}

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.level-high {
  background-color: #000000;
  color: #FFFFFF;
}

.level-low {
  background-color: #E5E5E5;
  color: #666666;
}

.level-winner {
  background-color: #059669;
  color: #FFFFFF;
}

.level-warning {
  background-color: #FFA500;
  color: #FFFFFF;
}

.impact-text {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
}

.learning-curve {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
}

.benefit-list,
.limitation-list,
.component-list {
  margin: 8px 0 0 20px;
  font-size: 13px;
  line-height: 1.6;
  color: #666666;
}

.pros-cons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.pros-cons-section {
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 20px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
}

.pros-title {
  color: #059669;
}

.cons-title {
  color: #DC2626;
}

.pros-section,
.cons-section,
.best-for-section {
  margin-bottom: 20px;
}

.pros-list,
.cons-list,
.best-for-list {
  margin: 0 0 0 20px;
  line-height: 1.8;
  font-size: 14px;
}

.info {
  font-size: 14px;
  color: #666666;
  margin-bottom: 16px;
}

.decision-table {
  width: 100%;
  border-collapse: collapse;
}

.decision-table th {
  text-align: left;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  background-color: #F5F5F5;
  border-bottom: 2px solid #E5E5E5;
}

.decision-table td {
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #F5F5F5;
}

.factor-name {
  font-weight: 600;
}

.winner-cell {
  background-color: #F0FFF4;
  font-weight: 600;
}

.final-recommendation {
  background-color: #F9F9F9;
  border: 2px solid #000000;
}

.decision-framework {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.framework-option {
  padding: 20px;
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
}

.framework-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.framework-option ul {
  margin: 0 0 0 20px;
  line-height: 1.8;
  font-size: 14px;
}

/* Operational Details Styles */
.operational-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
}

.operational-section {
  padding: 24px;
  border-radius: 8px;
  border: 2px solid #E5E5E5;
}

.operational-section.shared {
  background-color: #F0FFF8;
  border-color: #00C48C;
}

.operational-section.different {
  background-color: #FFF9F0;
  border-color: #FFB020;
}

.operational-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1C1C1C;
}

.operational-section ul {
  margin: 12px 0 0 20px;
  line-height: 1.8;
  font-size: 14px;
}

.operational-section p {
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0;
}

.shared-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #00C48C;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.different-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #FFB020;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scenario-comparison-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 12px;
}

.scenario-inline {
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 6px;
  border: 1px solid #E5E5E5;
}

.scenario-label {
  font-weight: 700;
  font-size: 14px;
  color: #6B46EE;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #6B46EE;
}

.scenario-inline ul {
  margin: 8px 0 0 20px;
  line-height: 1.7;
  font-size: 13px;
}

.highlight-text {
  margin-top: 12px;
  padding: 12px;
  background-color: #FFF9F0;
  border-left: 4px solid #FFB020;
  border-radius: 4px;
  font-size: 14px;
}
</style>
