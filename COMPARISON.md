# Scenario Comparison

**Side-by-side analysis to help leadership decide between billing models**

---

## Executive Summary

### Decision Question
Which billing model should Dialpad adopt for Agentic AI at February 1, 2026 GA launch?

### Important Context
Both scenarios use **ONE unified Billing surface** (not separate pages). The question is about the **pricing model**, not UI separation:

- **Scenario A:** All products (Agentic AI + SMS + International) use the SAME credits pricing model
- **Scenario B:** Agentic AI uses tiered rates, while SMS/International continue using credits - both in ONE surface

### Key Considerations

1. **Predictability vs Flexibility** - Which matters more for enterprise customers?
2. **UI Complexity** - How much management overhead can customers handle?
3. **Multi-Product Alignment** - How does this fit with existing Dialpad services?
4. **Discounting Strategy** - Upfront vs progressive volume incentives?

---

## Quick Links

- [View Scenario A Prototype](http://localhost:3000/daart-billing-prototype/#/scenario-a)
- [View Scenario B Prototype](http://localhost:3000/daart-billing-prototype/#/scenario-b)

---

## Scenario Overview

### Scenario A: Unified Credits
**Model:** Upfront credits with flat discount

Pre-purchase credits with flat discount. ONE universal pool for Agentic AI + SMS + International + Toll-free. All products use the SAME pricing model.

### Scenario B: Dual Pricing
**Model:** Monthly spend limit with progressive discounts

TWO pricing models in ONE billing surface: Agentic AI uses tiered rates (pay-as-you-go), while SMS/International use credits (existing model).

---

## Detailed Comparison

### 1. Predictability

#### Scenario A: Low
- Credits are a shared pool across multiple usage types
- **Impact:** Cannot accurately estimate "X credits = N conversations"
- Cannot show accurate "cost per agent" in Agent Builder

#### Scenario B: High
- Fixed rates per tier and usage type
- **Impact:** Accurate cost estimates in Agent Builder and projections
- Clear cost-per-conversation pricing

---

### 2. Flexibility

#### Scenario A: High
- Can allocate and reallocate credits across any usage type
- **Benefits:**
  - Universal credit pool
  - Flexible reallocation
  - Works across all services

#### Scenario B: Lower
- No credit reallocation - each usage type priced independently
- **Limitations:**
  - No cross-service credit sharing
  - Fixed rate structure

---

### 3. UI Complexity

#### Scenario A: Higher
- Requires budget allocation UI and management
- **Components:**
  - Budget allocation interface
  - Per-type limit settings
  - Reallocation controls

#### Scenario B: Lower
- Simpler - just tier progress and spend limit
- **Components:**
  - Tier progress visualization
  - Spend limit setting
  - No allocation needed

---

### 4. Customer Mental Model

#### Scenario A: More Complex
- Customer must understand credit pooling and allocation
- **Learning Curve:** Steeper - requires understanding of shared pool concept

#### Scenario B: Simpler
- Clear tier-based pricing like cell phone plans
- **Learning Curve:** Easier - familiar tiered discount model

---

### 5. Multi-Product Alignment

#### Scenario A: Perfect
- Natural fit for enterprise customers with multiple services
- **Benefits:**
  - Single credit pool for all services
  - Unified billing view

#### Scenario B: Requires Extension
- Dual pricing models in one surface
- SMS/International remain credit-based
- **Complexity:** Two billing systems to explain

---

### 6. Discounting Strategy

#### Scenario A
- **Model:** Flat discount on credit purchase
- **Flexibility:** Low - same discount for all usage types
- **Volume Incentive:** Upfront only

#### Scenario B
- **Model:** Progressive discounts with volume
- **Flexibility:** High - discounts improve automatically
- **Volume Incentive:** Ongoing motivation to increase usage

---

### 7. Alerts & Limits

#### Scenario A
- **Type:** Per-type budget alerts
- **Configuration:** Soft and hard limits per usage type
- **Granularity:** High

#### Scenario B
- **Type:** Spend limit alerts
- **Configuration:** Single monthly spend limit
- **Granularity:** Lower - overall spend only

---

## Pros & Cons

### Scenario A: Unified Credits

**Pros:**
- Simple unified credit pool
- Works across all Dialpad services
- Flexible reallocation
- Familiar prepaid model
- No monthly tier resets

**Cons:**
- Low predictability for cost estimates
- Requires budget allocation UI
- More complex customer mental model
- Cannot show accurate "cost per agent" in Agent Builder
- Use-it-or-lose-it may frustrate customers

**Best For:**
- Enterprise customers with diverse usage patterns
- Customers using multiple Dialpad services
- Organizations that prefer prepaid models

---

### Scenario B: Dynamic Tiered Rates

**Pros:**
- High predictability for cost estimates
- Simpler customer mental model
- Automatic volume discounts
- No upfront capital required
- Can show accurate costs in Agent Builder

**Cons:**
- Less flexible - no credit reallocation
- Dual pricing models in one surface
- Monthly tier resets
- Requires understanding two billing systems

**Best For:**
- Customers prioritizing cost predictability
- Organizations new to Dialpad ecosystem
- Customers wanting pay-as-you-go models

---

## Decision Criteria

### Which is easier to understand?
- **Scenario A:** "I have 7,234 credits left"
- **Scenario B:** "I'm at Tier 2, 267 to Tier 3"

### Which encourages desired behavior?
- **Scenario A:** May discourage usage (pool running out)
- **Scenario B:** Encourages usage (unlock savings)

### Which is easier to sell/quote?
- **Scenario A:** "$8K/month, locked rates"
- **Scenario B:** "Rates range from X to Y based on volume"

### Which requires less product complexity?
- **Scenario A:** Budget allocation UI required
- **Scenario B:** Tier tracking required

---

## Recommendation Framework

**Choose Scenario A if:**
- Multi-product alignment is critical
- Customer wants maximum flexibility
- Prepaid model preferred
- Cross-service credit sharing is valuable

**Choose Scenario B if:**
- Cost predictability is paramount
- Simpler mental model is desired
- Progressive discounts motivate usage
- Accurate Agent Builder estimates are critical

---

**Last Updated:** December 3, 2025
