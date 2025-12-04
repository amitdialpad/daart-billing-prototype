# Josh's Feedback - Dec 3, 2025 Office Hours

**Meeting Date**: December 3, 2025
**Deadline**: Friday morning (Dec 6, 2025)
**Status**: Critical feedback requiring immediate action

---

## 🔴 CRITICAL INSIGHTS

### 1. Scenarios A & B Are NOT Two Different Options
**Josh's Quote**: *"These are two sides of the same coin"*

**What This Means**:
- Scenario A = Pre-purchasing credits at a locked rate
- Scenario B = Pay-as-you-go with tiered rates
- **Both should exist as options in the SAME system**
- It's not A vs B, it's "Do you want to pre-purchase or pay-as-you-go?"

**Example**:
- Pre-purchase 10,000 credits at 80¢ = $8,000 (locked rate)
- Pay-as-you-go for 10,000 credits = ~$8,800 (varying rates: 95¢, 90¢, 80¢)
- **Savings: $800/month = ~$9,000/year by pre-purchasing**

**After Pre-Purchase Limit**:
- If you pre-purchase 10,000 at 80¢ but use 40,000 total:
  - First 10,000 = 80¢ (locked)
  - Remaining 30,000 = follows rate sheet tiers

---

## 🎨 VISUAL DESIGN FEEDBACK

### 2. Bar Charts Are Overwhelming and Unhelpful
**Josh's Quote**: *"I don't know how much the bars actually help. The most important thing is that number."*

**Problems**:
- Too much emphasis on visual bars
- Hard to scan quickly
- "Lots of bars" = cognitive overload
- Most important info (numbers) is small
- Least important info (bars) is prominent

**What Users Need**:
- **"How many are left?"** not "How many have you used?"
- The number needs to be the hero element
- Visual should be subtle support, not the main focus

**Josh's Suggestion**:
- Small donut circle next to the number
- Shows at-a-glance status
- Can expand/drill-in on interaction
- Number stays the most important element

### 3. Franco's Ring Design Is Still Too Busy
**Problems with Franco's approach**:
- Still too visually busy
- Not great use of space
- Hard to read - numbers disconnected from labels
- Need columns to show relationships clearly

**Quote**: *"Is this related? Or is this something else?"* - visual relationships are unclear

---

## 🏗️ BUSINESS MODEL & ARCHITECTURE

### 4. Get Rid of "Non-Recurring" vs "Recurring" Credits
**Current Problem**: Confusing terminology and behavior

**New Model Should Be**:
1. **Monthly Commitment** (replaces "recurring credits")
   - Renews every month
   - Can be pre-purchased at locked rate

2. **One-Time Emergency Pool** (replaces "non-recurring credits")
   - Optional safety buffer
   - Used only when monthly credits depleted
   - Simpler name (NOT "non-recurring")

**Josh's Quote**: *"I hate the word non-recurring. It's such a mouthful."*

### 5. Spending Limits Should Be Optional
**Josh's Example**: Dialpad's use of Claude Code
- No spending limit
- "Whatever we spend, that's fine"
- Value is so high, limits don't matter

**Implication**: Need to support both:
- Customers who want hard caps
- Customers who want unlimited spend (just tracking/alerts)

### 6. The Value Proposition (Why Customers Won't Care About Limits)
**Josh's Math Example**:
- 200 support agents = $4.2M/year total cost
- Current Dialpad spend = $120k/year (seats only)
- With 50% agentic deflection:
  - Only need 100 agents now
  - Total cost drops to $2.1M (saves $2M!)
  - Dialpad seat revenue drops to $60k
  - But agentic brings total to $220k
- **Customer saves $2M, Dialpad almost doubles revenue**

**Result**: Early customers reaping these savings won't care about spend limits - the ROI is massive.

---

## 🎛️ FUNCTIONALITY - BUDGETING CONTROLS (THE CENTERPIECE)

### 7. Budgeting Controls Are The Main Feature
**Josh's Quote**: *"That's coming out as the centerpiece of everything"*

**What Was Missing from PRD**:
- This is the "control panel" for admins
- Most critical feature for preventing overspend
- Needs to be prominent, not buried

**Requirements**:
1. **Allocate budget across services**
   - Example: 70% agentic, 10% SMS, 10% international, 10% fax
   - Prevents agentic from "eating everything"

2. **Mid-month reallocation**
   - Admin sees: SMS at 50% on day 20, no campaigns planned
   - Agentic at 65% with 10 days left
   - Admin can reallocate 5% from SMS to agentic

3. **Can't use percentages alone**
   - Different services have different rates
   - SMS credits ≠ agentic credits ≠ international credits
   - Need actual credit amounts, not just percentages

4. **RBAC controls**
   - Agent admin: View all, edit only their area
   - Billing admin: View and edit everything

---

## 📊 PREDICTIVE ALERTS & TRENDING

### 8. Early Warning System Is Critical
**Josh's Quote**: *"Bad news is always better to share as early as possible"*

**Current Problem**:
- User gets alert at 80% usage on day 15
- Too late to adjust

**New Approach**:
1. **Daily trending analysis**
   - Budget 6,000 credits over 30 days = 200/day
   - Day 3: Should be at ~600, actually at 800
   - Show alert: "Projected to exceed budget"

2. **Simple indicators**
   - ✓ "On track" (thumbs up)
   - ⚠️ "Projected to be over"
   - Don't need perfect accuracy, 10% variance is fine

3. **Account for variance**
   - Weekdays vs weekends differ
   - Wait until 5-10% variance before alerting
   - Avoid false alarms from natural fluctuation

4. **Visual representation**
   - Simple two-line chart (expected vs actual)
   - Next to the number, not overwhelming
   - Can drill-in for details

**Josh's Quote**: *"Nobody can sit here and go, oh, I'm totally going to only need 200 conversations a day"* - there's natural variance, we just need ballpark.

---

## 🧮 CONTEXT FOR DECISION-MAKING

### 9. Help Admins Understand What Credits Mean
**Problem**: Admin doesn't know what "1000 credits" translates to in real usage

**Solution**: Provide context per service
- **International calling**: "Your international calls average 8 minutes, so 1000 credits ≈ 200 calls"
- **SMS**: Show average message credits
- **Agentic**: Show average conversation credits

**Goal**: Help admins make informed allocation decisions

---

## 🔀 MIXED BILLING MODELS

### 10. Scenario B: Different Billing for Different Services
**Agentic**: Tiered pay-as-you-go (not credits)
- Tier 1: 0-500 conversations at $0.99 digital / $1.99 voice
- Tier 2: 501-1,000 at $0.94 / $1.87
- Etc.

**Other Services** (SMS, International, Fax): Credit-based
- Still use the allocation/budgeting system
- Still pull from credit pools

**This is valid** - Josh confirmed this approach makes sense

---

## 📄 PAGE STRUCTURE

### 11. Current Billing Summary Page Problems
**Issues**:
- Trying to do too much
- Cramming everything into header
- Credits and usage should probably be on billing summary (not separate page)

**Don't**:
- Add charts just because it looks boring
- Add visual elements for visual sake

**Do**:
- Every chart should serve a clear purpose
- Focus on what users need to know

---

## 🎯 IMPLEMENTATION PRIORITIES

### HIGH PRIORITY (Must Have for Friday)

1. **Visual Redesign**
   - Remove bar charts
   - Make numbers prominent and large
   - Add subtle visual indicators (small donut/circle)
   - Use columns for clear relationships
   - "Credits remaining" not "credits used"

2. **Merge Scenarios Conceptually**
   - Not A vs B selection
   - Both options available
   - Show pre-purchase savings clearly
   - Support both capped and uncapped spending

3. **Budgeting Controls UI**
   - Prominent allocation interface
   - Show allocations per service
   - Make it easy to reallocate mid-month
   - Show what each allocation means (context)

4. **Predictive Alerts**
   - On-track vs projected-over indicators
   - Daily trending comparison
   - Simple visual (two-line chart)
   - Early warnings (day 2-3, not day 15)

### MEDIUM PRIORITY (Important but can iterate)

5. **Context for Services**
   - Show what credits translate to
   - Average call duration for international
   - Help users understand allocations

6. **Auto-renew & Alert Settings**
   - Auto-renew when credits hit zero
   - Auto-renew when below X amount
   - Alert me when over X amount

7. **RBAC Controls**
   - View-only for certain roles
   - Edit permissions per service area

### LOW PRIORITY (Nice to have / future)

8. **Advanced Forecasting**
   - More sophisticated trending
   - Historical pattern analysis
   - Seasonal adjustments

9. **Cross-Product Integration**
   - Launchpad view
   - Agent Builder cost preview
   - Conversation History billing info

---

## 🚫 WHAT TO REMOVE

1. **All bar chart emphasis** - keep them subtle or replace with donut circles
2. **"Used" mentality** - switch to "Remaining"
3. **Recurring/Non-recurring terminology** - use "Monthly" and "One-time Pool"
4. **Scenario A vs B as separate prototypes** - merge into one system with options
5. **Franco's busy ring designs** - still too much visual noise

---

## 💬 KEY QUOTES

> "These are two sides of the same coin"

> "The most important thing is that number. Not the bar."

> "What you need to know is not how many have you used, it's like, how many are left?"

> "Bad news is always better to share as early as possible"

> "That's coming out as the centerpiece of everything" - on budgeting controls

> "Stuff that I need to read is small. And the stuff that I don't need to is prominent"

> "It doesn't have to be super advanced. Within a 10% variance is good enough"

> "We don't have to be perfect here. We can just be in the ballpark"

---

## 📋 NEXT STEPS

1. **Sync with Abby** (Josh will do)
   - Ensure prototypes address her concerns
   - Get alignment on approach

2. **Visual redesign** (Amit - Priority 1)
   - Numbers first, visuals second
   - Remove bar emphasis
   - Add subtle indicators

3. **Build budgeting controls** (Amit - Priority 1)
   - Allocation UI
   - Reallocation flow
   - RBAC considerations

4. **Add predictive alerts** (Amit - Priority 1)
   - On-track indicators
   - Trending comparison
   - Early warnings

5. **Merge scenario concept** (Amit - Priority 2)
   - Show as unified system
   - Pre-purchase vs pay-as-go options
   - Demonstrate savings

---

## ⏰ TIMELINE

**Deadline**: Friday morning (Dec 6, 2025)
**Remaining time**: ~2 days
**Approach**: Focus on high priority items, iterate on medium priority

---

**Last Updated**: December 3, 2025
**Next Update**: After incorporating feedback into prototype
