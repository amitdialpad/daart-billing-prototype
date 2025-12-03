# DAART Billing Prototypes - Comprehensive Audit

**Date:** December 3, 2025
**Purpose:** Compare implemented prototypes against GA requirements and Josh's feedback

---

## Executive Summary

✅ **Overall Status:** Prototypes successfully implement the core billing models with high fidelity to requirements
⚠️ **Minor Gaps:** Some GA document specifics need adjustment in mock data
📝 **Recommendations:** Several enhancements identified for improved accuracy

---

## 1. Rate Card & Pricing Model

### GA Document Requirements
- **Digital Rate:** $1.99 per conversation
- **Voice Rate:** $0.99 per conversation
- **Note:** Voice is CHEAPER than Digital in GA document

### Current Implementation
- **Scenario A mockData:**
  - `digital: 0.99` ❌ INCORRECT
  - `voice: 1.99` ❌ INCORRECT
- **Scenario B mockData:**
  - `digital: 0.99` ❌ INCORRECT
  - `voice: 1.99` ❌ INCORRECT

### Status: ❌ **NEEDS FIX**
**Issue:** Rate card is inverted - we have Digital cheaper than Voice, but GA document specifies Voice cheaper than Digital.

**Fix Required:**
```javascript
baseRates: {
  digital: 1.99,  // Digital is MORE expensive
  voice: 0.99,    // Voice is CHEAPER
  sms: 0.15,
  international: 2.50
}
```

---

## 2. Billable Conversation Criteria

### GA Document Requirements
✅ A conversation is billable when:
1. At least 1 AI agent and customer interaction (customer must respond)
2. 1+ knowledge retrievals OR a successful skill execution (MCP tool call)
3. Session marked closed (timeout, hangup, bot closes, or human agent closes)

✅ **Key Rule:** Skill execution is REQUIRED for billing - without it, conversation is FREE

### Current Implementation
✅ **Scenario A mockData.billableCriteria:**
```javascript
requirements: [
  'At least 1 AI agent and customer interaction (customer must respond)',
  '1+ knowledge retrievals OR a successful skill execution (MCP tool call)',
  'Session marked closed (timeout, hangup, bot closes, or human agent closes)'
],
skillRequirement: 'A successful skill must be executed - without skill execution, conversation is FREE',
freeExamples: [
  'Standard IVR routing (press 1 for sales)',
  'AI-driven IVR routing without skill execution',
  'Simple menu navigation'
]
```

✅ **Scenario B mockData.billableCriteria:** Same structure

### Status: ✅ **CORRECT**
Billable criteria accurately reflects GA document requirements.

---

## 3. Fair Use & Re-charge Rules

### GA Document Requirements
- **Voice:** Calls exceeding **5 minutes** OR **10 actions** = 2× charge
- **Digital:** Conversations exceeding **10 actions** = 2× charge

### Current Implementation
✅ **mockData.rechargeRules:**
```javascript
rechargeRules: {
  voice: {
    durationThreshold: 5, // minutes
    actionsThreshold: 10,
    multiplier: 2
  },
  digital: {
    actionsThreshold: 10,
    multiplier: 2
  }
}
```

✅ **Scenario A FAQ:**
```javascript
'Voice: Calls exceeding 5 minutes or 10 actions = 2× charge'
'Digital: Conversations exceeding 10 actions = 2× charge'
```

✅ **Scenario B FAQ:** Same structure

### Status: ✅ **CORRECT**
Re-charge rules accurately implemented.

---

## 4. Minimum Commitment & Enterprise Focus

### GA Document Requirements
- **10,000 credits minimum** commitment for GA launch
- Enterprise-focused pricing

### Current Implementation
✅ **Scenario A:**
```javascript
minimumCommitment: 10000,
totalCredits: 15000
```

✅ **Scenario B:**
```javascript
minimumCommitment: 10000
```

### Status: ✅ **CORRECT**
Minimum commitment properly reflected.

---

## 5. Discount Structure

### GA Document Requirements
**Pricing Tiers (from GA PDF):**
- 50-500 credits: 5% discount
- 500-2,500 credits: 10% discount
- 2,500-10,000 credits: 15% discount
- 10,000-25,000 credits: 20% discount
- 25,000-50,000 credits: 25% discount
- 50,000+ credits: 30% discount

### Current Implementation

**Scenario A:**
✅ `discountPercent: 20` (for 15K credits - matches 10K-25K tier)

**Scenario B:**
⚠️ **Tier structure needs review:**
```javascript
tiers: [
  { tier: 1, min: 0, max: 500, discount: 0 },      // 0% - OK
  { tier: 2, min: 501, max: 1000, discount: 0.05 }, // 5% - OK
  { tier: 3, min: 1001, max: 2500, discount: 0.10 }, // 10% - OK
  { tier: 4, min: 2501, max: 5000, discount: 0.20 }, // 20% - ⚠️ Should be 15%
  { tier: 5, min: 5001, max: null, discount: 0.30 }  // 30% - ⚠️ Need more granular tiers
]
```

### Status: ⚠️ **NEEDS REFINEMENT**
Scenario B tiers should more closely match GA document's pricing structure.

---

## 6. Usage History & Data Display

### GA Document Requirements
- Show consumption by usage type
- Display charges clearly
- Show re-charge applications

### Current Implementation
✅ **Scenario A:**
- User/Group column
- Contact information
- Type (AI Agent Digital, Voice, SMS, etc.)
- Date & Time
- Duration
- Rate/Cost information
- Re-charge badges (2×)
- Discount visualization

✅ **Scenario B:**
- All Scenario A features PLUS
- Billing Model column (Tiered vs Credits)
- Tier transitions displayed (T1→T2)
- Mixed billing model support
- Subtitle "(at time of use)" for clarity

### Status: ✅ **EXCELLENT**
Usage history exceeds requirements with clear data presentation.

---

## 7. Josh's Feedback Implementation

### From Transcript Analysis

**Key Requirements Identified:**

1. ✅ **Billing page where customers see what they bought**
   - Implemented in both scenarios with clear credit/tier status

2. ✅ **Understanding what constitutes a charge**
   - FAQ sections explain billable criteria
   - Clear examples of free vs billable conversations

3. ✅ **Consumption tracking and visibility**
   - Usage history with detailed breakdowns
   - Progress indicators showing consumption
   - Forecast projections

4. ✅ **Agent-level consumption visibility**
   - Usage history shows per-interaction data
   - Can be filtered by service type
   - Exportable for analysis

5. ⚠️ **Wireframes for GTM alignment**
   - Prototypes provide visual representation
   - Need to ensure GTM team has seen these

### Status: ✅ **WELL ADDRESSED**
Josh's feedback well incorporated into designs.

---

## 8. Scenario A vs B Alignment with GA Document

### GA Document Long-Term Scenarios

**Scenario A (GA Document):**
> "Upfront credits with flat discount - ONE universal pool for all services (Agentic AI + SMS + International + Toll-free)"

✅ **Current Implementation Matches:**
- Unified credit pool: `totalCredits: 15000`
- Budget allocation across all services
- Single upfront discount: `discountPercent: 20`
- All services draw from same pool

**Scenario B (GA Document):**
> "Monthly spend limit with progressive discounts - TWO pricing models: Agentic AI uses tiered rates (pay-as-you-go), while SMS/International use credits"

✅ **Current Implementation Matches:**
- Tiered rates for Agentic AI
- Credit-based for other services: `otherServicesCredits`
- Progressive discounts via tier system
- Monthly spend limit: `monthlySpendLimit: 5000`

### Status: ✅ **EXCELLENT ALIGNMENT**
Both scenarios accurately represent GA document vision.

---

## 9. Guardrails & Protection

### GA Document Requirements
- **120% threshold:** Triggers true-up discussion
- **200% threshold:** Requires AM meeting
- Services do NOT stop at these thresholds

### Current Implementation

✅ **Scenario A:**
```javascript
guardrails: {
  trueUpTrigger: {
    threshold: 120,
    thresholdPercent: '120%',
    action: 'Legal trigger for contract true-up discussion'
  },
  usageAlert: {
    threshold: 200,
    thresholdPercent: '200%',
    action: 'Mandatory notification + meeting with account manager'
  }
}
```

✅ **Scenario B:** Same structure

✅ **UI Display:** "Guardrails: 120% triggers true-up discussion • 200% requires AM meeting"

### Status: ✅ **CORRECT**
Guardrails properly implemented per GA requirements.

---

## 10. UI/UX Components

### Implemented Features

**Scenario A:**
✅ Credits overview with large dollar display
✅ Expiration warnings with info tooltips
✅ Forecast alerts
✅ Budget allocation breakdown by service
✅ Usage alerts configuration
✅ Usage history table with filtering
✅ FAQ with collapsible sections
✅ Add Credits / Settings buttons
✅ Export functionality

**Scenario B:**
✅ Hero section (Spend display)
✅ Visual hierarchy (Size = Importance)
✅ Context section (Current tier info)
✅ Progress to next tier
✅ Consolidated forecast
✅ Other services (credit-based) card
✅ Combined usage history (dual billing models)
✅ Rate card in FAQ
✅ Tier transitions in history

### Missing/Not Implemented
⚠️ **Per-Agent Consumption View** (Josh's feedback)
- Usage history shows interactions but not aggregated per-agent view
- Could add agent-level dashboard/filter

⚠️ **Budget Allocation UI (Scenario A)**
- Currently shows allocation but doesn't allow editing
- Settings button is placeholder

⚠️ **Spend Limit Configuration (Scenario B)**
- Display exists but no edit capability
- Would need modal/form for adjustment

### Status: ✅ **CORE COMPLETE** / ⚠️ **NICE-TO-HAVES IDENTIFIED**

---

## 11. Data Consistency Issues

### Found Issues

1. ❌ **Rate Card Inversion** (Critical)
   - Need to swap Digital/Voice rates throughout

2. ⚠️ **Scenario B Tier Discounts**
   - Tier 4 shows 20% but GA doc suggests 15% for 2500-5000 range
   - Tier 5 lumps everything 5K+ at 30% - GA doc has more granular tiers

3. ⚠️ **Effective Rates Calculation**
   - Need to recalculate after fixing base rates
   - Scenario A: `effectiveRates` object
   - Scenario B: Tier rate calculations

4. ✅ **Usage History Consistency**
   - Both scenarios properly show conversation data
   - Scenario B correctly shows mixed billing models

### Status: ❌ **CRITICAL FIX NEEDED** (Rate card)

---

## 12. Documentation & Comparison

### COMPARISON.md File
✅ **Comprehensive comparison document created**
- Side-by-side analysis of both scenarios
- Executive summary for leadership
- Detailed breakdowns of predictability, flexibility, complexity
- Pros & cons for each scenario
- Decision criteria
- Recommendation framework

### Status: ✅ **EXCELLENT**
Comparison doc provides clear decision support for leadership.

---

## 13. Missing Features from GA Document

### Identified Gaps

1. ⚠️ **AI Routing vs AI Agents Distinction** (from GA doc)
   - GA mentions separating "AI Routing" (free back-office applications) from "AI Agents" (billable customer-facing)
   - Not reflected in current prototypes
   - Would need UI distinction/badging

2. ⚠️ **Conversation Review/Dispute Mechanism** (from Abby's update)
   - GA mentions customers can request review of billed conversations
   - No UI for this in prototypes
   - Could be added as "Dispute Charge" button in history

3. ⚠️ **Agent Builder Cost Estimates**
   - Mentioned throughout as important feature
   - Not part of billing prototype (separate feature area)
   - Out of scope for current work

4. ⚠️ **Per-Agent Dashboard**
   - Josh mentioned agent listing page with consumption
   - Current prototype shows interaction-level, not agent-level aggregation
   - Could enhance with agent-level view

### Status: ⚠️ **ENHANCEMENT OPPORTUNITIES**

---

## 14. Visual Design & Dialtone Adherence

### Assessment

✅ **Dialtone Integration:**
- Using DtIconInfo from @dialpad/dialtone-icons/vue3
- Following Dialtone color palette
- Proper component structure

✅ **Josh's Design Principles:**
- "Opt into complexity" ✅ - Progressive disclosure with FAQs
- "Documentation is a failed state" ✅ - Inline info tooltips, contextual help
- "Works in 5 clicks" ✅ - Clear navigation, minimal friction
- "Size = Importance" ✅ - Especially in Scenario B Card 1 redesign

✅ **Visual Hierarchy:**
- Scenario B Card 1 particularly strong
- Clear tier system (Hero → Context → Progress → Forecast → Guardrails)

### Status: ✅ **EXCELLENT**

---

## Summary of Findings

### ✅ Successfully Implemented (High Priority)

1. **Dual scenario models** (Upfront Credits vs Tiered Rates)
2. **Billable conversation criteria** (accurate per GA doc)
3. **Re-charge rules** (5 min voice, 10 actions)
4. **Guardrails** (120% and 200% thresholds)
5. **Usage history** (comprehensive with filtering)
6. **Forecast projections**
7. **FAQ sections** (collapsible, informative)
8. **Progressive disclosure** (Josh's principle)
9. **Visual hierarchy** (especially Scenario B)
10. **Comparison documentation** (COMPARISON.md)
11. **Minimum commitment** (10K+ credits)
12. **Multi-service support** (Agentic + SMS + International + Fax + Domestic)

### ❌ Critical Issues (Must Fix)

1. **Rate card inversion** - Digital and Voice rates are backwards
2. **Base rate propagation** - Need to update all derived calculations

### ⚠️ Refinements Needed (Should Fix)

1. **Scenario B tier structure** - Align more closely with GA doc pricing tiers
2. **Effective rates recalculation** - After base rate fix
3. **Usage history rate displays** - Update after base rate fix

### 📝 Enhancement Opportunities (Nice to Have)

1. **AI Routing vs AI Agents distinction** - Badge/visual differentiation
2. **Conversation dispute mechanism** - "Request Review" button
3. **Budget allocation UI** - Make Settings button functional in Scenario A
4. **Spend limit editor** - Make it adjustable in Scenario B
5. **Per-agent consumption view** - Aggregate dashboard by agent
6. **Agent Builder integration** - Cost estimates per agent (separate feature)

---

## Recommendations

### Immediate Actions (P0)

1. **Fix rate card inversion**
   - Update `baseRates` in mockData.js
   - Recalculate `effectiveRates` in Scenario A
   - Update tier rates in Scenario B
   - Review all usage history entries

2. **Update UI copy**
   - Ensure all displayed rates match corrected values
   - Update FAQ examples if needed

### Short-term Improvements (P1)

1. **Align Scenario B tiers with GA doc**
   - Add Tier 4: 2,501-10,000 at 15%
   - Add Tier 5: 10,001-25,000 at 20%
   - Add Tier 6: 25,001-50,000 at 25%
   - Add Tier 7: 50,001+ at 30%

2. **Add AI Routing distinction**
   - Visual badge for "AI Routing" (free) vs "AI Agent" (billable)
   - Could be in Usage Type column

### Future Enhancements (P2)

1. **Make Settings functional**
   - Budget allocation editor for Scenario A
   - Spend limit adjuster for Scenario B

2. **Add dispute mechanism**
   - "Request Review" button in usage history
   - Modal for submitting dispute

3. **Per-agent dashboard**
   - New view showing aggregated consumption per agent
   - Filterable by date range

---

## Conclusion

**Overall Grade: A-**

The DAART Billing prototypes successfully capture the core vision from the GA document and Josh's feedback. Both Scenario A (Unified Credits) and Scenario B (Tiered Rates) are well-implemented with excellent UI/UX following Dialtone and design principles.

**Critical Fix Required:** Rate card inversion must be corrected before presenting to stakeholders or using for GTM alignment.

**Strengths:**
- Comprehensive feature coverage
- Excellent visual design and hierarchy
- Strong progressive disclosure
- Clear comparison documentation
- Accurate billable criteria and re-charge rules

**Next Steps:**
1. Fix rate card (P0)
2. Refine Scenario B tiers (P1)
3. Review with stakeholders
4. Iterate based on feedback
5. Consider enhancement opportunities for v2

---

**Last Updated:** December 3, 2025
