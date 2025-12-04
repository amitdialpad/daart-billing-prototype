# Implementation Plan - Friday Dec 6 Deadline

**Created**: December 3, 2025
**Deadline**: Friday, December 6, 2025 (Morning)
**Time Available**: ~48 hours
**Goal**: Address Josh's critical feedback and deliver updated prototype

---

## 🎯 STRATEGY

**Key Insight from Josh**: Scenarios A & B are not alternatives - they're two billing options in one unified system.

**Approach**:
1. Create ONE unified billing page
2. Show both pre-purchase and pay-as-go options
3. Focus on budgeting controls as the centerpiece
4. Add predictive alerts and trending
5. Visual redesign: numbers first, charts second

---

## ⚡ PRIORITY 1: MUST HAVE (Friday Morning)

### 1. Visual Redesign - Scenario A & B (~6 hours)
**Files**: `ScenarioA.vue`, `ScenarioB.vue`

**Changes**:
- ✅ Remove bar chart emphasis (make subtle or replace)
- ✅ Make numbers large and prominent
- ✅ Change from "X used" to "X remaining"
- ✅ Add small donut/circle indicators (subtle visual cue)
- ✅ Use columns to show clear relationships
- ✅ Ensure most important info is largest

**Specific Areas**:
- Credits overview card (Scenario A)
- Tier status card (Scenario B)
- Budget allocation display
- Monthly spend display

**Success Criteria**:
- Numbers are 2-3x larger than current
- Visual indicators are 30% size of current
- "Remaining" language throughout
- Easy to scan in 2-3 seconds

---

### 2. Unified Concept View (~4 hours)
**Files**: New `UnifiedBilling.vue` or update both scenarios

**Changes**:
- ✅ Create view showing both options side-by-side
- ✅ "Pre-purchase credits" vs "Pay-as-you-go" toggle/comparison
- ✅ Show savings calculator
  - Example: "Pre-purchase 10,000 at 80¢ = $8,000"
  - "Pay-as-go for 10,000 = $8,800"
  - "You save $800/month ($9,600/year)"
- ✅ Make it clear both options exist in same system

**Design Pattern**:
```
┌─────────────────────────────────────────────────┐
│ Choose Your Billing Model                       │
├─────────────────────────────────────────────────┤
│ ○ Pre-purchase Credits (Lock in savings)        │
│   10,000 credits at 80¢ = $8,000/month         │
│   ✓ Guaranteed rate  ✓ ~$9,600/year savings   │
│                                                  │
│ ○ Pay-as-you-go (Flexible usage)               │
│   Tiered rates: 95¢→90¢→80¢ as you use more   │
│   ✓ No commitment  ✓ Only pay for what you use │
└─────────────────────────────────────────────────┘
```

---

### 3. Budgeting Controls - The Centerpiece (~8 hours)
**Files**: `ScenarioA.vue`, `ScenarioB.vue`, new `BudgetControls.vue` component

**Phase 1: Allocation Interface** (~4 hours)
- ✅ Prominent allocation card (not buried in settings)
- ✅ Show allocations per service with clear numbers
- ✅ Visual breakdown (subtle, not bars)
- ✅ Make reallocation obvious and easy

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Budget Allocation                    [Edit]     │
├─────────────────────────────────────────────────┤
│ Agentic          4,200 cr remaining  (70%)     │
│ SMS/MMS            600 cr remaining  (10%)     │
│ International      600 cr remaining  (10%)     │
│ Fax                600 cr remaining  (10%)     │
│                                                  │
│ Total: 6,000 credits remaining                  │
└─────────────────────────────────────────────────┘
```

**Phase 2: Context for Services** (~2 hours)
- ✅ Show what credits mean
  - "600 SMS credits ≈ 12,000 messages"
  - "600 international credits ≈ 75 calls (avg 8 min)"
  - "4,200 agentic credits ≈ 4,200 conversations"

**Phase 3: Reallocation Flow** (~2 hours)
- ✅ Click "Edit" opens reallocation modal
- ✅ Drag sliders or input numbers
- ✅ Show impact in real-time
- ✅ "Save Changes" commits new allocation

**Success Criteria**:
- Budgeting is the first or second card on page
- Admin can reallocate in 3 clicks
- Context shows what allocations mean in practice

---

### 4. Predictive Alerts & Trending (~6 hours)
**Files**: `ScenarioA.vue`, `ScenarioB.vue`, new `TrendingIndicator.vue` component

**Phase 1: On-Track Indicators** (~2 hours)
- ✅ Add status next to each budget line
  - ✓ "On track" (green check or thumbs up)
  - ⚠️ "Projected over" (yellow warning)
  - 🔴 "Over budget" (red alert)
- ✅ Calculate daily burn rate
- ✅ Compare to expected daily rate
- ✅ Show status if >5% variance

**Phase 2: Simple Trending Visual** (~2 hours)
- ✅ Small two-line chart next to number
  - Line 1: Expected trend (dotted)
  - Line 2: Actual usage (solid)
- ✅ Shows last 7-10 days
- ✅ Click to expand for details

**Phase 3: Early Warning System** (~2 hours)
- ✅ Calculate: Budget ÷ Days in month = expected daily
- ✅ Compare: Actual daily average
- ✅ Alert if trending >110% by day 3
- ✅ Show: "At current pace, you'll use 11,500 by month end"

**Design**:
```
┌─────────────────────────────────────────────────┐
│ Agentic                                          │
│ 4,200 remaining  ⚠️ Projected over  [▂▃▅▇]     │
│ At current pace: 7,800 by month end (+30%)     │
└─────────────────────────────────────────────────┘
```

**Success Criteria**:
- Alerts show by day 2-3, not day 15
- Visual is subtle, doesn't dominate
- Clear action: reallocate or adjust usage

---

### 5. Terminology Updates (~2 hours)
**Files**: All Vue files, mockData.js

**Changes**:
- ✅ Remove "non-recurring" / "recurring"
- ✅ Use "Monthly commitment" and "One-time pool"
- ✅ Change "X used" to "X remaining" everywhere
- ✅ "Credits left" not "credits consumed"

**Find & Replace**:
- "non-recurring" → "one-time emergency pool"
- "recurring credits" → "monthly commitment"
- "used" → "remaining" (where appropriate)
- "consumed" → "left" or "available"

---

## 📊 PRIORITY 2: IMPORTANT (If Time Allows)

### 6. Optional Spending Limits (~3 hours)
**Files**: `ScenarioA.vue`, `ScenarioB.vue`

**Changes**:
- ✅ Add toggle: "Set spending limit" (On/Off)
- ✅ When Off: Show "Unlimited spend - tracking only"
- ✅ When On: Show limit controls
- ✅ Make it clear unlimited is an option

---

### 7. Auto-Renew & Alert Settings (~3 hours)
**Files**: New settings modal or section

**Features**:
- ✅ Auto-renew when credits hit zero
- ✅ Auto-renew when below X amount
- ✅ Alert me when over X amount
- ✅ Alert me when projected to exceed

---

### 8. Savings Calculator (~2 hours)
**Files**: New component or section in main view

**Feature**:
- ✅ Input: Monthly usage estimate
- ✅ Output: Pre-purchase cost vs Pay-as-go cost
- ✅ Show: Annual savings amount
- ✅ Help users decide which option

---

## 🎨 PRIORITY 3: POLISH (Nice to Have)

### 9. RBAC View-Only Mode (~2 hours)
- Different view for agent admin vs billing admin
- Grayed out controls for view-only

### 10. Historical Trending (~2 hours)
- Last 3 months comparison
- Seasonal patterns

### 11. Agent Consumption Alerts (~2 hours)
- Show biggest spend increase
- Alert on anomalies

---

## 📝 IMPLEMENTATION ORDER

### Day 1 (Dec 3-4, Evening) - 10 hours
1. **Visual Redesign** (6 hours) - MUST HAVE
   - Scenario A credits overview
   - Scenario B tier status
   - All number emphasis changes
   - Remove bar dominance

2. **Budgeting Controls Phase 1** (4 hours) - MUST HAVE
   - Allocation interface
   - Make it prominent
   - Basic reallocation

### Day 2 (Dec 4-5, Full day) - 12 hours
3. **Predictive Alerts** (6 hours) - MUST HAVE
   - On-track indicators
   - Trending calculations
   - Early warnings

4. **Budgeting Controls Phase 2 & 3** (4 hours) - MUST HAVE
   - Context for services
   - Reallocation flow

5. **Terminology Updates** (2 hours) - MUST HAVE
   - Find & replace
   - Test all pages

### Day 3 (Dec 5-6, Morning) - 6 hours
6. **Unified Concept View** (4 hours) - MUST HAVE
   - Show both options
   - Savings comparison

7. **Testing & Polish** (2 hours)
   - Test all interactions
   - Fix any bugs
   - Deploy to production

### If Time Remaining:
8. **Optional Spending Limits** (3 hours)
9. **Savings Calculator** (2 hours)

---

## 🧪 TESTING CHECKLIST

### Visual
- [ ] Numbers are largest element in each card
- [ ] Visual indicators are subtle (30% size)
- [ ] "Remaining" language throughout
- [ ] Easy to scan entire page in <5 seconds

### Functional
- [ ] Budget allocation is prominent
- [ ] Reallocation works in 3 clicks
- [ ] Predictive alerts show by day 2-3
- [ ] On-track indicators accurate
- [ ] Context shows for each service

### Conceptual
- [ ] Both billing options clearly presented
- [ ] Savings from pre-purchase shown
- [ ] No "Scenario A vs B" - it's one system
- [ ] Optional limits are clear

### Performance
- [ ] No console errors
- [ ] Fast load times
- [ ] Smooth interactions
- [ ] Hot reload working

---

## 📦 DELIVERABLES

1. **Updated Scenario A page**
   - Visual redesign
   - Budgeting controls
   - Predictive alerts
   - New terminology

2. **Updated Scenario B page**
   - Visual redesign
   - Budgeting controls
   - Predictive alerts
   - New terminology

3. **Unified concept view** (new or updated)
   - Shows both options
   - Savings calculator
   - Clear comparison

4. **Updated Notes page**
   - Document the unified approach
   - Explain pre-purchase vs pay-as-go
   - Show savings math

5. **Updated mockData.js**
   - New data structures for budgeting
   - Trending data
   - Allocation data

---

## 🚨 RISKS & MITIGATION

### Risk 1: Time constraint (48 hours)
**Mitigation**: Focus only on Priority 1 items. Priority 2/3 are nice-to-have.

### Risk 2: Conceptual change (merging scenarios)
**Mitigation**: Keep existing pages, add unified view. Can iterate.

### Risk 3: Budgeting controls complexity
**Mitigation**: Start simple (just show allocations), iterate on editing.

### Risk 4: Predictive algorithm accuracy
**Mitigation**: Josh said 10% variance is fine, keep it simple.

---

## 💡 QUICK WINS

These can be done fast and show immediate improvement:

1. **Number sizes** (30 min) - Make them 3x larger
2. **"Remaining" language** (30 min) - Find & replace
3. **Remove bar emphasis** (1 hour) - Make them subtle
4. **Budget card prominence** (1 hour) - Move to top
5. **On-track icons** (1 hour) - Add ✓ or ⚠️ next to numbers

**Total quick wins: 4 hours = Big visual impact**

---

## 📞 COMMUNICATION PLAN

### Josh
- Send updated prototype link by Thursday evening
- Highlight key changes in email
- Request quick feedback before Friday

### Abby
- Wait for Josh to sync with her first
- Then send updated prototype
- Explain unified approach

---

## ✅ SUCCESS CRITERIA

By Friday morning, the prototype should:

1. **Look different** - Numbers dominate, not bars
2. **Feel simpler** - One system, not A vs B
3. **Show budgeting** - Allocation controls prominent
4. **Predict issues** - Early alerts, trending indicators
5. **Make sense** - Pre-purchase vs pay-as-go is clear

**Josh's test**: Can a user scan the page in 2-3 seconds and know:
- Where they are (remaining credits/spend)
- If they're on track (status indicators)
- What to do next (reallocate if needed)

---

**Last Updated**: December 3, 2025
**Next Update**: After Day 1 implementation complete
