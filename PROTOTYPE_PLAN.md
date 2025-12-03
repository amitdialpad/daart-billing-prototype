# DAART Billing Prototype - Complete Plan & Context

**Project**: Agentic AI Billing Scenario Prototypes
**Due Date**: Thursday, December 5, 2025 (Morning meeting with Abby)
**Goal**: Help leadership choose between Scenario A vs Scenario B
**Owner**: Amit Ayre (taking over from Aykut)

---

## Executive Summary

Building interactive prototypes of two billing approaches for Dialpad's Agentic AI product to help leadership make a critical decision. The prototypes will show how customers manage AI Agent usage billing across two different models:

- **Scenario A**: Upfront credit purchase with flat discount + budget allocation
- **Scenario B**: Dynamic tiered rates that improve with consumption

---

## Background Context

### Timeline & Constraints

- **GA Launch**: February 1, 2026
- **Code Freeze**: December 12, 2025 (6 days away - likely backend only)
- **Thursday Meeting**: December 5, 2025 - Abby presents to leadership
- **Current State**: No approved designs, no engineering team assigned
- **Design Handover**: Aykut going on sabbatical, Amit taking over

### The Problem

Leadership is **paralyzed** between two pricing models. Both have trade-offs:
- Scenario A is simpler but less flexible
- Scenario B encourages usage but adds complexity

Without a decision, engineering can't proceed. The prototype will help leadership "pick a lane."

---

## Key Stakeholders & Decisions

### From Meeting Transcripts:

**Josh (Dec 2):**
- Needs prototype by Thursday morning for Abby's leadership presentation
- Must show holistic billing (agentic + SMS + toll-free + international together)
- ONE billing surface with RBAC-based visibility
- Focus on existing Dialpad customers (NOT standalone/new signups)

**Aykut (Dec 2 Handover):**
- V2 explorations done but not reviewed
- Pool concept: Main Pool → Agentic Pool → Overage Pool
- Customer prioritization: Invoice > Credit Card
- Use-it-or-lose-it credits (no rollover)

**From Documents:**
- Minimum commitment: 10K+ credits at launch
- Sales focus: Existing MM/ENT customers with simple use cases
- Free trial: 7 days digital only (voice requires paid state)
- Fair use policy: Voice >5min = 2× charge, Digital >10 actions = 2× charge

---

## Pricing & Rate Card

### Fixed Conversation Rates:
- **Digital**: 0.99 credits per conversation
- **Voice**: 1.99 credits per conversation

### Billable Conversation Criteria:
Must meet ALL three:
1. At least 1 AI agent-customer interaction (response to agent)
2. 1+ knowledge retrievals OR successful skill/MCP tool call
3. Session marked closed (timeout, hangup, bot closes, agent closes)

### Free Conversations (No Charge):
- Standard IVR routing workflows (no agentic skill executed)
- AI-driven routing workflows without skill execution

### Channel Switching:
- Voice → Digital = 2 separate charges
- Digital → Voice = 2 separate charges

### Discount Tiers (Page 3 of PDF):

| Credits/Mo | Price/Credit | Digital Rate | Voice Rate | Discount | Sales Launch |
|------------|--------------|--------------|------------|----------|--------------|
| PAYG       | $1.00        | $0.99        | $1.99      | 0%       | No           |
| 50-500     | $0.95        | $0.94        | $1.89      | 5%       | No           |
| 1,000-5,000| $0.90        | $0.89        | $1.79      | 10%      | No           |
| 10,000+    | $0.80        | $0.79        | $1.59      | 20%      | **YES**      |
| 25,000+    | $0.75        | $0.74        | $1.49      | 25%      | **YES**      |
| 50,000+    | $0.70        | $0.69        | $1.39      | 30%      | **YES**      |

---

## Technical Architecture

### Three-Pool System:

1. **Main Pool** (Recurring Credits)
   - Existing telephony usage (SMS, toll-free, international)
   - Rate at time of consumption
   - Pool of dollars across platform

2. **Agentic Pool** (AI Agent Credits)
   - Separate financial bucket
   - Upfront discounts
   - Can stand alone as distinct product

3. **Overage Pool**
   - Top-Up (credit card): Immediate payment
   - True-Up (invoice): Monthly arrears at 120% threshold

### Drawdown Priority:
Pack → Recurring Credits → One-time Credits

### Backend:
- $1 = 1 credit (internal)
- Discounts locked (no deal desk modification)
- Credits expire at billing cycle end (use-it-or-lose-it)

---

## Product Integration Points

### Where Billing Appears (from PDF page 4-5):

1. **Launchpad** (Priority: High-level overview)
   - Aggregated usage cost
   - Alerts for spikes/changes

2. **Agent Builder** (Priority: Build-time context)
   - Automation rate (value of what you've built)
   - ROI calculator (what to build/why) → Feb/March feature
   - Cost estimates as you configure

3. **Conversation History** (Priority: Audit trail)
   - Which conversations were charged & why
   - Skills executed, agents, channels, escalations
   - End-to-end view inclusive of escalation

4. **Credit Usage / Analytics** (Priority: PRIMARY - Main billing page)
   - Review actual cost, price per credit
   - Set hard/soft caps and alerts
   - All agents aggregated
   - Forecasted usage

### RBAC Permissions:

**Conversation Designer Role:**
- Agent Builder: Edit-only
- Conversation History: Full access
- Credit/Usage/Analytics: Full access
- NO admin access to full contact center

**Billing + Conversation Designer Role:**
- Agent Builder: Read-only
- Conversation History: Read-only
- Credit/Usage/Analytics: Full access

---

## Current Production State

From screenshots (`context/summary.png`, `context/credits.png`, `context/changelog.png`):

### Billing Summary Page:
- Shows Enterprise plan with billing cycle dates
- Line items: Toll-Free, Dialpad BI Add-on, Support, Scorecards, Connect, Coaching Team, Global Unlimited, Meetings, Local Numbers
- Per-seat/per-minute pricing model

### Credits and Usage Page:
- **Available Credits**: $47,657.28
- **Plan Usage Balance**:
  - Domestic Unlimited: 347/858,000 minutes
  - Global Unlimited: 33/2,253,000 minutes
  - SMS/MMS: 482/153,750 messages
  - Fax: 84/756 pages
- **Usage History**: Transaction table with date, user, contact, type, duration, cost

### Changelog Page:
- License additions/removals
- User, license type, quantity changes, before/after counts, timestamps

---

## Design Explorations Review

From `context/` folder images:

### Aykut's V2 Explorations:
- Billing overview with credits & usage split
- Manage limits modal
- Add credits flow (trial vs paid states)
- Invoice vs credit card customer experiences
- Pool visualization
- Usage breakdown by type

### Sof's Wireframes:
- Tab structure with AI Agent section separate
- Credits & usage flow
- Billing overview → detailed view pattern

### Stakeholder Feedback:

**Abby (Nov 10):**
- Focus on conversations as billing unit
- Voice vs digital credit consumption with set values

**Josh (Nov 20):**
- "Opt into complexity" philosophy
- "Works in 5 clicks"
- "Documentation is a failed state"
- Show only balance/monthly spend/upcoming bill
- Hide details behind expandable sections

**Dave (Nov 22):**
- Same criteria as Jira DP-166269

**Short-term Requirements (Nov):**
- $1 = 1 credit backend
- Single rate card
- Discount upfront on credits
- Budget management with hard/soft caps

---

## Prototype Plan

### What We're Building:

**2 Full Pages** inside Dialpad Admin UI shell:

1. **Scenario A**: `/scenario-a` - Upfront Credits + Budget Allocation
2. **Scenario B**: `/scenario-b` - Dynamic Tiered Rates

**Plus:** Embedded mockup sections showing how billing appears in:
- Launchpad
- Agent Builder
- Conversation History

### Why Only 2 Pages?

- Current production pages (Billing Summary, Changelog) already exist in admin - Abby/Josh can reference those
- Focus build time on what's NEW and needs a decision
- Leadership needs to compare A vs B, not see every page in the product

---

## Scenario A: Upfront Credits + Budget Allocation

### Core Concept:
Customer buys credits upfront with flat discount, then allocates budget across usage types.

### Key Features:

**1. Credits Overview**
```
Available Credits: 8,766 / 15,000
Effective Rate: $0.79 per digital, $1.59 per voice (20% discount)
Next Billing: Jan 1, 2025
```

**2. Budget Allocation Panel** (NEW - doesn't exist today)
- Slider/input controls to split 15,000 credits across:
  - AI Agent Digital: 5,000 credits
  - AI Agent Voice: 7,000 credits
  - SMS/MMS: 2,000 credits
  - International: 1,000 credits
- Shows unallocated credits
- Interactive: Moving sliders updates numbers

**3. Limits & Alerts** (per usage type)
- Soft Alert: Notification at X% usage (e.g., 80% = 4,000/5,000)
- Hard Stop: Block service at 100% (e.g., 5,000/5,000)
- Toggle to enable/disable per type
- Visual status indicators

**4. Effective Rate Display**
- Shows actual cost per conversation after discount
- Digital: 0.99 credits × $0.80 = $0.79
- Voice: 1.99 credits × $0.80 = $1.59

**5. Usage History Table**
| Date/Time | Type | Channel/Contact | Credits | Rate | Balance |
|-----------|------|-----------------|---------|------|---------|
| Dec 2 14:23 | AI Digital | #support | 0.99 | $0.79 | 8,766 |
| Dec 2 14:15 | AI Voice | (919)888-7029 | 1.99 | $1.59 | 8,767 |

**6. Holistic Billing View**
- Shows ALL usage types together:
  - AI Agent (Digital + Voice)
  - SMS/MMS
  - Toll-free
  - International calling
- Demonstrates "ONE surface for billing" requirement

**7. Embedded Mockups Section**
"How This Appears Across Dialpad"
- Launchpad badge: "AI Agent: 4,234/15,000 credits (28%)"
- Agent Builder panel: "Estimated cost: ~1,500 credits/month"
- Conversation History column: Shows "Credits Charged" in table

### Key Challenges to Show:

**Unpredictability:**
- Customer doesn't know if 5,000 credits = 2,500 digital OR 1,250 voice conversations
- Mix of channels makes forecasting hard

**Budget Reallocation:**
- What happens when digital budget runs out but voice has 3,000 left?
- Can customers reallocate mid-cycle?

**Limit Hit Scenarios:**
- Soft alert banner when hitting 80%
- Hard stop modal blocking service at 100%
- How to increase allocation

### Mock Data:
```javascript
scenarioA: {
  totalCredits: 15000,
  used: 6234,
  available: 8766,
  pricePerCredit: 0.80,
  discountPercent: 20,
  effectiveRates: {
    digital: 0.79,
    voice: 1.59
  },
  budgetAllocation: {
    aiAgentDigital: { allocated: 5000, used: 2134 },
    aiAgentVoice: { allocated: 7000, used: 3100 },
    sms: { allocated: 2000, used: 800 },
    international: { allocated: 1000, used: 200 }
  },
  limits: {
    aiAgentDigital: { softAlert: 0.80, hardStop: 1.00, enabled: true },
    aiAgentVoice: { softAlert: 0.90, hardStop: null, enabled: true }
  }
}
```

---

## Scenario B: Dynamic Tiered Rates

### Core Concept:
Customer gets better per-conversation rates automatically as monthly consumption increases.

### Key Features:

**1. Current Tier Status**
```
Current Tier: Tier 2 (501-1,000 conversations)
Digital: $0.94/conversation | Voice: $1.87/conversation
```

**2. Tier Progress Bar**
```
Progress to Tier 3:
[=========>        ] 734 / 1,001 conversations
267 conversations until 10% savings
```

**3. Rate Card Table**
| Tier | Volume Range | Digital | Voice | Discount |
|------|--------------|---------|-------|----------|
| 1    | 0-500        | $0.99   | $1.99 | 0%       |
| 2    | 501-1,000    | $0.94   | $1.87 | 5%       | ← YOU ARE HERE
| 3    | 1,001-2,500  | $0.89   | $1.77 | 10%      |
| 4    | 2,501-5,000  | $0.79   | $1.59 | 20%      |
| 5    | 5,001+       | $0.69   | $1.39 | 30%      |

**4. Budget Management (Simpler)**
```
Monthly Spend Limit: $5,000
Current Spend: $1,247 (25%)

Estimated at current tier (T2):
  ~2,500 digital OR ~1,250 voice conversations

If you reach Tier 3:
  ~2,810 digital OR ~1,410 voice conversations
```

**5. Usage History with Rate Changes**
| Date/Time | Type | Tier | Rate | Cost | Running Total |
|-----------|------|------|------|------|---------------|
| Dec 2 14:23 | Digital | T2 | $0.94 | $0.94 | $1,247 |
| Dec 2 14:15 | Voice | T2 | $1.87 | $1.87 | $1,246 |
| Dec 1 23:45 | Digital | T1→T2 | $0.99→$0.94 | $0.94 | $1,244 |

Shows tier transitions with rate changes highlighted

**6. Monthly Reset Notice**
```
⚠️ Your tier resets on Jan 1, 2025
Next month you'll start again at Tier 1 standard rates
```

**7. Savings Forecast**
```
Based on current usage pattern:
- You'll reach Tier 3 by Dec 15
- Estimated savings this month: $127 from tier improvements
```

**8. Embedded Mockups Section**
Same as Scenario A but shows tier-based displays:
- Launchpad: "Tier 2 rates active - 267 to next tier"
- Agent Builder: "Current rates: $0.94 digital, $1.87 voice"
- Conversation History: Shows tier column

### Key Challenges to Show:

**Unpredictability Amplified:**
- Customer doesn't know final cost until month ends
- "Will I reach Tier 3 or stay at Tier 2?"
- Budgeting is difficult without locked rates

**Mixed Usage Complexity:**
- If 300 digital + 200 voice, how are tiers calculated?
- Separate tiers per channel OR combined volume?
- Prototype shows combined volume model

**Psychological Impact:**
- Encourages consumption: "Just 50 more to unlock savings!"
- Risk of month-end rush behavior
- Gamification concerns

**Quoting Difficulty:**
- Sales can't promise specific rates
- Contract: "Rates subject to tier achieved"
- Customer: "What will this cost?" → "Depends on usage"

### Mock Data:
```javascript
scenarioB: {
  currentTier: 2,
  conversationsThisMonth: 734,
  currentSpend: 1247,
  monthlySpendLimit: 5000,
  tiers: [
    { tier: 1, min: 0, max: 500, digital: 0.99, voice: 1.99, discount: 0 },
    { tier: 2, min: 501, max: 1000, digital: 0.94, voice: 1.87, discount: 0.05 },
    { tier: 3, min: 1001, max: 2500, digital: 0.89, voice: 1.77, discount: 0.10 },
    { tier: 4, min: 2501, max: 5000, digital: 0.79, voice: 1.59, discount: 0.20 },
    { tier: 5, min: 5001, max: null, digital: 0.69, voice: 1.39, discount: 0.30 }
  ],
  conversationsToNextTier: 267
}
```

---

## Technical Implementation

### Project Structure:

```
daart-billing/
├── public/
│   └── context/                    # Existing context images
├── src/
│   ├── assets/
│   │   └── mockups/                # Launchpad/Builder/History images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminShell.vue      # Left nav + top bar wrapper
│   │   │   ├── LeftSidebar.vue     # Navigation sidebar
│   │   │   └── TopBar.vue          # Breadcrumb + search
│   │   ├── billing/
│   │   │   # Shared Components:
│   │   │   ├── CreditsHeader.vue   # Available credits banner
│   │   │   ├── UsageTable.vue      # Transaction history table
│   │   │   ├── UsageBreakdown.vue  # Usage by type
│   │   │   ├── CrossProductMockups.vue  # Embedded mockups
│   │   │   #
│   │   │   # Scenario A:
│   │   │   ├── BudgetAllocation.vue      # Slider/input allocation
│   │   │   ├── LimitsAlerts.vue          # Hard/soft caps
│   │   │   ├── EffectiveRates.vue        # Rate calculation
│   │   │   #
│   │   │   # Scenario B:
│   │   │   ├── TierStatus.vue            # Current tier badge
│   │   │   ├── RateCardTable.vue         # All tiers table
│   │   │   └── TierProgress.vue          # Progress to next
│   │   └── ui/
│   │       ├── StatCard.vue        # Reusable stat display
│   │       └── ProgressBar.vue     # Progress bars
│   ├── pages/
│   │   ├── ScenarioA.vue           # Main Scenario A page
│   │   └── ScenarioB.vue           # Main Scenario B page
│   ├── data/
│   │   └── mockData.js             # All mock billing data
│   ├── router/
│   │   └── index.js                # Routes
│   ├── App.vue
│   └── main.js
├── package.json
├── vite.config.js
└── index.html
```

### Tech Stack:

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "@dialpad/dialtone-vue": "latest",
    "@dialpad/dialtone-icons": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

### Dialtone Components to Use:

From MCP searches:
- `DtButton` - All CTAs (importance: clear, outlined, primary)
- `DtBadge` - Credits display, tier indicators (types: default, info, success)
- `DtNotice` - Alerts when hitting limits (kinds: info, warning, error)
- `DtTab`, `DtTabGroup`, `DtTabPanel` - For tabbed interfaces
- `DtModal` - For settings modals
- `DtPopover` - For tooltips/help text
- `DtInput`, `DtInputGroup` - For credit allocation inputs
- Icons: `DtIconCheckCircleFilled`, `DtIconAlertCircle`, `DtIconArrowRight`

### Utility Classes:

- Layout: `d-d-flex`, `d-fd-column`, `d-ai-center`, `d-jc-space-between`
- Spacing: `d-p8`, `d-px16`, `d-py24`, `d-mt16`, `d-mb8`
- Sizing: `d-w100p`, `d-h100p`
- Design tokens: `--dt-color-foreground-primary`, `--dt-color-brand-purple`, `--dt-space-400`

### Routes:

```javascript
const routes = [
  {
    path: '/scenario-a',
    name: 'ScenarioA',
    component: ScenarioA,
    meta: {
      title: 'Scenario A: Upfront Credits',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / CREDITS (SCENARIO A)'
    }
  },
  {
    path: '/scenario-b',
    name: 'ScenarioB',
    component: ScenarioB,
    meta: {
      title: 'Scenario B: Tiered Rates',
      breadcrumb: 'ADMIN / DIALPADBETA / BILLING / CREDITS (SCENARIO B)'
    }
  },
  {
    path: '/',
    redirect: '/scenario-a'
  }
]
```

---

## Development Plan

### Phase 1: Foundation (Dec 2) ✅ COMPLETE
- [x] Plan finalized
- [x] Initialize Vue 3 + Vite project
- [x] Install Dialtone dependencies
- [x] Set up routing
- [x] Build admin shell (left nav + top bar)
- [x] Create mock data structure

### Phase 2: Scenario A (Dec 2-3) ✅ COMPLETE
- [x] CreditsHeader component
- [x] BudgetAllocation component (sliders)
- [x] LimitsAlerts component (simplified to percentages)
- [x] EffectiveRates display
- [x] UsageTable component
- [x] FAQ section (replaced CrossProductMockups)
- [x] Wire up interactivity

### Phase 3: Scenario B (Dec 3) ✅ COMPLETE
- [x] TierStatus component
- [x] RateCardTable component
- [x] TierProgress component
- [x] Spend limits UI
- [x] UsageTable (tier variant)
- [x] FAQ section (replaced CrossProductMockups)
- [x] Wire up interactivity

### Phase 3.5: Simplification (Dec 3) ✅ COMPLETE
- [x] Applied Josh's "opt into complexity" principle
- [x] Consolidated 14 cards into 2 FAQ sections
- [x] Removed repetitive alert explanations
- [x] Removed colored styling from FAQs
- [x] Cleaned up unused CSS
- [x] Matched Scenario B structure to Scenario A
- [x] Added guardrails notes to both scenarios

### Phase 4: Polish & Deploy (Dec 3-4) ⏳ IN PROGRESS
- [x] Test walkthrough flow
- [ ] Responsive design check
- [ ] Transitions/animations (deferred - not critical)
- [ ] Deploy to GitHub Pages
- [ ] Create demo notes for Abby
- [ ] Share prototype links with Josh

### Phase 5: Thursday Meeting (Dec 5) ⏳ UPCOMING
- Abby presents to leadership
- Leadership makes decision
- Amit available for questions

---

## Deployment

### Build:
```bash
npm run build
```

### Deploy to GitHub Pages:
```bash
npm run deploy
```

### URLs:
- Production: `https://amitdialpad.github.io/daart-billing-prototype/`
- Scenario A: `https://amitdialpad.github.io/daart-billing-prototype/#/scenario-a`
- Scenario B: `https://amitdialpad.github.io/daart-billing-prototype/#/scenario-b`

---

## Success Criteria

After seeing both prototypes, leadership should be able to answer:

1. **Which scenario is easier for customers to understand?**
   - A: "I bought 10K credits, I have 7,234 left"
   - B: "I'm at Tier 2 rates, 267 away from Tier 3"

2. **Which scenario encourages desired behavior?**
   - A: Discourages usage (finite pool running out)
   - B: Encourages usage (unlock better rates)

3. **Which scenario is easier to sell/quote?**
   - A: "10K credits at $0.80 = $8K/month, locked-in rates"
   - B: "Rates range from $X to $Y depending on volume"

4. **Which scenario requires less product complexity?**
   - A: Budget allocation UI, simpler rate logic
   - B: No budget allocation, complex tier tracking

5. **Which scenario better handles multi-usage complexity?**
   - A: One pool, allocate across usage types
   - B: Multiple tier systems in parallel

---

## Open Questions

1. **Engineering Resources**: Who will build this after Dec 12 code freeze?
2. **Design Approval**: Who approves final designs after leadership picks a lane?
3. **Implementation Phases**: What ships for Feb 1 GA vs what comes later?
4. **RBAC Implementation**: How complex is the permission system?
5. **Overage Handling**: Top-up vs true-up decision process?
6. **Fair Use**: Token-based vs time/action-based for GA?

---

## References

### Documents:
- Agentic AI Billing Design Document (Nov 6, 2025)
- Agentic AI Pricing and Pool (V2 Model)
- GA_ Voice vs. Digital Agentic Billable Definition.pdf
- Jira: DP-166269

### Meetings:
- Amit ↔ Aykut Handover (Dec 2)
- Agentic Billing Prototypes w/ Josh & Ted (Dec 2)

### Design Assets:
- `/context/aykut's billing v2.png`
- `/context/sof's billing thingies.png`
- `/context/Billing.png`
- `/context/Group 632687-632691.png`
- `/context/summary.png`
- `/context/credits.png`
- `/context/changelog.png`

### Tools:
- Dialtone Design System: https://dialtone.dialpad.com/
- Dialtone MCP: Available for component/token/icon search
- Vue 3: https://vuejs.org/
- Vite: https://vitejs.dev/

---

**Last Updated**: December 3, 2025, 4:30 AM
**Status**: ✅ Prototype complete & simplified (ready for deployment)
**Next Step**: Deploy to GitHub Pages and share with stakeholders

**Additional Documentation**:
- See `SIMPLIFICATION_LOG.md` for detailed change history
- See `DESIGN_PRINCIPLES.md` for Josh's philosophy and applications
- See `CURRENT_STATE.md` for up-to-date implementation status
