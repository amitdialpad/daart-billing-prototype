# DAART Billing Prototypes

**Project Owner**: Amit Ayre
**Status**: ✅ Complete & Ready for Review
**Presentation**: Thursday, December 5, 2025

---

## 🎯 Project Overview

Interactive prototypes comparing two billing approaches for Dialpad's Agentic AI product to help leadership make a critical decision before February 1, 2026 GA launch.

- **Scenario A**: Upfront Credits + Budget Allocation
- **Scenario B**: Dynamic Tiered Rates

---

## 🚀 Quick Start

### Local Development:
```bash
npm run dev
```

**Local URL**: http://localhost:3000/daart-billing-prototype/

### Live Demo:
**GitHub Pages**: https://amitdialpad.github.io/daart-billing-prototype/

---

## 📚 Documentation Structure

### For Quick Context:
- **[QUICKSTART.md](QUICKSTART.md)** - Start here! 2-minute overview
- **[CURRENT_STATE.md](CURRENT_STATE.md)** - Implementation status & features

### For Deep Understanding:
- **[PROTOTYPE_PLAN.md](PROTOTYPE_PLAN.md)** - Original plan & complete project context
- **[SIMPLIFICATION_LOG.md](SIMPLIFICATION_LOG.md)** - Detailed change history & decisions
- **[DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)** - Josh's philosophy & applications

### Decision Flow:
```
New to project?          → Read QUICKSTART.md
Need current status?     → Read CURRENT_STATE.md
Want change history?     → Read SIMPLIFICATION_LOG.md
Understand design?       → Read DESIGN_PRINCIPLES.md
Need full context?       → Read PROTOTYPE_PLAN.md
```

---

## 🎨 What We Built

### Scenario A: Upfront Credits
Buy credits upfront → Allocate across services → Set limits → Fixed rates

**Key Features**:
- Credits overview (8,766 / 15,000)
- Budget allocation controls
- Simplified usage alerts (80% / 100%)
- Usage history with filtering
- FAQ section (5 questions)

### Scenario B: Tiered Rates
Start at base rate → Unlock discounts with volume → Monthly reset

**Key Features**:
- Tier progression (734 / 1,001 to Tier 3)
- Rate card (all 5 tiers)
- Usage forecast
- Tier transitions in history
- FAQ section (5 questions)

---

## 📊 Simplification Results

Applied Josh's "opt into complexity" principle:

### Before:
- 23 cards with verbose documentation
- 3,000+ words visible on load
- 7,700px vertical scrolling
- Repetitive explanations everywhere

### After:
- 11 cards with consolidated FAQs
- 900 words visible (67% reduction)
- 4,600px scrolling (45% reduction)
- Pattern explained once, never repeated

---

## 🛠️ Tech Stack

- Vue 3.5.25 (Composition API)
- Vue Router 4.6.3
- Vite 5.4.21
- Dialtone Vue 3.14.12
- Dialtone Icons 3.18.2

---

## 📁 Key Files

### Code:
```
src/
├── pages/
│   ├── ScenarioA.vue          # Upfront credits page
│   ├── ScenarioB.vue          # Tiered rates page
│   └── Comparison.vue         # Side-by-side view
├── data/
│   └── mockData.js            # All billing mock data
├── components/layout/
│   ├── AdminShell.vue         # Main layout
│   ├── LeftSidebar.vue        # Navigation
│   └── TopBar.vue             # Breadcrumbs
└── router/
    └── index.js               # Routes
```

### Documentation:
```
docs/
├── README.md                  # This file
├── QUICKSTART.md              # Fast overview
├── CURRENT_STATE.md           # Implementation status
├── SIMPLIFICATION_LOG.md      # Change history
├── DESIGN_PRINCIPLES.md       # Josh's philosophy
└── PROTOTYPE_PLAN.md          # Complete context
```

---

## 🎯 Success Criteria

Leadership needs to decide:

1. **Which is easier to understand?**
2. **Which encourages desired behavior?**
3. **Which is easier to sell/quote?**
4. **Which requires less complexity?**

Both scenarios presented with equal detail and simplicity.

---

## 📋 Next Steps

### Pre-Thursday Meeting:
- [ ] Deploy to GitHub Pages
- [ ] Share URLs with Josh/Abby
- [ ] Create demo walkthrough

### Thursday Meeting:
- Abby presents to leadership
- Leadership compares A vs B
- Decision made

### Post-Decision:
- Full design phase begins
- Engineering team assigned
- Implementation for Feb 1 GA

---

## 🔗 Navigation

### Live Prototype:
- **Scenario A**: `/#/scenario-a`
- **Scenario B**: `/#/scenario-b`
- **Comparison**: `/#/comparison`

### Documentation:
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Current Status**: [CURRENT_STATE.md](CURRENT_STATE.md)
- **Change History**: [SIMPLIFICATION_LOG.md](SIMPLIFICATION_LOG.md)
- **Design Philosophy**: [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)
- **Complete Plan**: [PROTOTYPE_PLAN.md](PROTOTYPE_PLAN.md)

---

## 📞 Stakeholders

- **Amit Ayre**: Project owner, design lead
- **Josh**: Requested prototype, design principles
- **Abby**: Presenting to leadership
- **Aykut**: Previous owner (on sabbatical)

---

## 💡 Key Decisions Made

### Simplification:
✅ Consolidated 14 cards → 2 FAQ sections
✅ Removed repetitive explanations
✅ Eliminated colored documentation styling
✅ Applied "opt into complexity" throughout

### Structure:
✅ Matched Scenario B to Scenario A layout
✅ Combined related cards (Tier + Spend)
✅ FAQ as final card in both scenarios

### Data:
✅ All services with limits shown
✅ Guardrails displayed subtly
✅ Re-charge indicators visible
✅ International & Fax included

---

## 🏆 Achievement Summary

### Prototype Built:
- ✅ 2 complete scenarios
- ✅ Comparison view
- ✅ Admin shell UI
- ✅ Mock data system
- ✅ FAQ sections

### Simplification Applied:
- ✅ 52% fewer cards
- ✅ 67% fewer words
- ✅ 45% less scrolling
- ✅ Josh's principles throughout

### Documentation Created:
- ✅ 5 comprehensive markdown files
- ✅ Full context preserved
- ✅ Change history tracked
- ✅ Design rationale explained

---

**Built with care by Amit Ayre for Dialpad DAART**

**Last Updated**: December 3, 2025, 3:45 PM

---

## 🔄 Latest Updates (Dec 3, 3:45 PM)

### Usage History Improvements:
- ✅ Added Agent column (aligns with PRD requirements)
- ✅ Changed "Type" to "Channel" for clarity
- ✅ Fixed business logic (SMS/International show "—" for agent)
- ✅ Default filter set to current month (Dec 2025)

### Scenario B Enhancements:
- ✅ Renamed "December 2025 Spend" to "This Month's Spending"
- ✅ Added "Your current plan" label for tier section
- ✅ Made conversation breakdown (450 digital, 284 voice) more prominent
- ✅ Moved conversation breakdown to tier progress section
- ✅ Added savings to hero section (25% spent • $65 saved)
- ✅ Simplified forecast section with complete metrics
- ✅ Various typography and spacing improvements
