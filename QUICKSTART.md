# Quick Start Guide

**Project**: DAART Billing Prototypes
**Status**: ✅ Complete & Simplified
**Meeting**: Thursday, December 5, 2025

---

## 🚀 Start Development

```bash
cd /Users/amitayre/daart-billing
npm run dev
```

**Local URL**: http://localhost:3000/daart-billing-prototype/

---

## 📁 Key Files

### Code:
- **Scenario A**: `/src/pages/ScenarioA.vue`
- **Scenario B**: `/src/pages/ScenarioB.vue`
- **Mock Data**: `/src/data/mockData.js`
- **Layout**: `/src/components/layout/AdminShell.vue`

### Documentation:
- **Original Plan**: `PROTOTYPE_PLAN.md` (complete project context)
- **Change Log**: `SIMPLIFICATION_LOG.md` (what changed & why)
- **Design Philosophy**: `DESIGN_PRINCIPLES.md` (Josh's principles)
- **Current Status**: `CURRENT_STATE.md` (implementation details)
- **This Guide**: `QUICKSTART.md` (you are here)

---

## 🎯 What This Prototype Does

Helps leadership choose between two billing models for Dialpad's Agentic AI:

### Scenario A: Upfront Credits + Budget Allocation
- Buy 15,000 credits upfront at 20% discount
- Allocate credits across services (Digital, Voice, SMS, etc.)
- Set soft/hard limits per service
- Fixed, predictable rates

### Scenario B: Dynamic Tiered Rates
- Start at Tier 1 ($0.99 digital, $1.99 voice)
- Unlock better rates as volume increases
- 5 tiers total (up to 30% savings at Tier 5)
- Monthly reset, variable costs

---

## 🎨 Recent Simplification Work

Applied Josh's "opt into complexity" principle:

### Before:
- 23 cards total across both scenarios
- 3,000+ words of documentation
- 7,700px vertical scrolling
- Verbose explanations repeated everywhere

### After:
- 11 cards total (52% reduction)
- 900 words (67% reduction)
- 4,600px scrolling (45% reduction)
- Documentation consolidated into FAQs

### Key Changes:
1. ✅ Alerts simplified from verbose to "80% / 100%"
2. ✅ 14 documentation cards → 2 FAQ sections
3. ✅ Removed all colored styling from FAQs
4. ✅ Scenario B structure matches Scenario A
5. ✅ Guardrails shown subtly (one line)

---

## 📋 What's in Each Scenario

### Scenario A (Upfront Credits)
```
1. Credits Overview
   └─ 8,766 / 15,000 available

2. Budget Allocation
   └─ Digital: 5,000 | Voice: 7,000 | SMS: 2,000 | Intl: 1,000

3. Usage Alerts (Simplified)
   └─ Email at first • Stop at second
   └─ Digital: 80% / 100%
   └─ Voice: 90% / No limit
   └─ [+ 3 more services]
   └─ Guardrails: 120% true-up • 200% AM meeting

4. Usage History
   └─ Filterable table with credits/cost

5. Other Services
   └─ SMS, International, Fax usage

6. FAQ (Collapsed)
   └─ 5 questions (click to expand)
```

### Scenario B (Tiered Rates)
```
1. Tier Status & Monthly Spend
   └─ Current: Tier 2 (5% savings)
   └─ Progress: 734 / 1,001 to Tier 3
   └─ Spend: $1,247 / $5,000
   └─ Guardrails: 120% true-up • 200% AM meeting

2. Usage History
   └─ Shows tier transitions (T1→T2)
   └─ Re-charge indicators (2×)

3. Rate Card Table
   └─ All 5 tiers visible

4. Usage Forecast
   └─ Projected spend, tier, savings

5. Other Services
   └─ Credit-based (SMS, Intl)

6. FAQ (Collapsed)
   └─ 5 questions (click to expand)
```

---

## 🛠️ Tech Stack

- **Vue**: 3.5.25 (Composition API)
- **Vue Router**: 4.6.3 (hash mode)
- **Vite**: 5.4.21
- **Dialtone Vue**: 3.14.12
- **Dialtone Icons**: 3.18.2

---

## 📊 Mock Data Structure

Located in `/src/data/mockData.js`:

```javascript
{
  scenarioA: {
    totalCredits: 15000,
    available: 8766,
    budgetAllocation: { ... },
    limits: { ... },
    usageHistory: [ ... ]
  },
  scenarioB: {
    currentTier: 2,
    tiers: [ ... ],
    forecast: { ... },
    usageHistory: [ ... ]
  }
}
```

---

## 🧪 Interactive Features

### Working:
- ✅ FAQ expand/collapse
- ✅ Left sidebar navigation
- ✅ Usage history tables
- ✅ Comparison view

### Visual Only (Prototype):
- ⚠️ Budget allocation sliders
- ⚠️ Export CSV buttons
- ⚠️ Filter dropdowns

---

## 📝 Josh's Design Principles

From Nov 20, 2025 feedback:

1. **"Opt into complexity"**
   - Show simple view first
   - Let users expand for details
   - Don't force documentation

2. **"It works in 5 clicks"**
   - Fast to working state
   - No long tutorials
   - Clear hierarchy

3. **"Documentation is a failed state"**
   - UI should be self-evident
   - Remove repetitive explanations
   - Trust user intelligence

---

## 🎯 Success Metrics

Leadership should be able to answer after seeing prototypes:

1. **Easier to understand?**
   - A: "I have 7,234 credits left"
   - B: "I'm at Tier 2, 267 to Tier 3"

2. **Better behavior incentive?**
   - A: Discourages usage (pool running out)
   - B: Encourages usage (unlock savings)

3. **Easier to sell/quote?**
   - A: "$8K/month, locked rates"
   - B: "Rates range from X to Y"

4. **Less product complexity?**
   - A: Budget allocation needed
   - B: Tier tracking needed

---

## 🚢 Next Steps (Pre-Thursday)

- [ ] Deploy to GitHub Pages
- [ ] Test deployed URLs
- [ ] Create demo walkthrough
- [ ] Share links with Josh/Abby

---

## 📞 Stakeholders

- **Josh**: Requested prototype for leadership meeting
- **Abby**: Presenting to leadership Thursday
- **Amit**: Current owner (you!)
- **Aykut**: Previous owner (on sabbatical)

---

## 🔗 Useful Links

- **Dialtone**: https://dialtone.dialpad.com/
- **Vue 3**: https://vuejs.org/
- **PRD**: `/context/GA_ Voice vs. Digital Agentic Billable Definition.pdf`

---

## 💡 Quick Context

If you need to understand the full project quickly:

1. **10 seconds**: Read this file (QUICKSTART.md)
2. **5 minutes**: Read CURRENT_STATE.md
3. **15 minutes**: Read SIMPLIFICATION_LOG.md
4. **30 minutes**: Read DESIGN_PRINCIPLES.md
5. **Full context**: Read PROTOTYPE_PLAN.md

---

## 🐛 Known Issues

None! Prototype is working correctly.

### By Design (Prototype Scope):
- Not responsive (desktop only)
- No actual API calls (mock data)
- Sliders/filters visual only
- No cross-product integrations
- No authentication/RBAC

---

## ⚡ Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run lint
```

---

**Last Updated**: December 3, 2025, 4:30 AM
**Next Update**: After deployment to GitHub Pages
