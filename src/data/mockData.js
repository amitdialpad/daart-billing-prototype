export const mockData = {
  // Base Rate Card (Universal)
  baseRates: {
    digital: 1.99,  // Digital is MORE expensive
    voice: 0.99,    // Voice is CHEAPER
    sms: 0.15,
    international: 2.50
  },

  // Re-charge Rules
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
  },

  // RBAC Roles
  rbacRoles: {
    billingAdmin: {
      canView: ['billing', 'credits', 'usage', 'allocation', 'limits', 'history'],
      canEdit: ['allocation', 'limits', 'alerts']
    },
    agenticOnly: {
      canView: ['agenticUsage', 'agenticHistory'],
      canEdit: []
    },
    readOnly: {
      canView: ['billing', 'usage'],
      canEdit: []
    }
  },

  scenarioA: {
    // UNIFIED CREDIT POOL FOR ALL PRODUCTS:
    // - ONE credit pool shared across Agentic AI, SMS, International, Toll-free
    // - Flexible reallocation across usage types
    // - All products draw from the same pool

    // Credits Overview
    totalCredits: 15000,
    used: 9000,
    available: 6000,
    pricePerCredit: 1.00,  // 1 credit = $1
    discountPercent: 20,
    discountApplied: 'upfront', // Discount given at purchase time, not consumption
    nextBilling: 'Jan 1, 2026',
    minimumCommitment: 10000, // Enterprise-focused: 10K+ credits minimum at launch

    // AI Agent counts per team
    teamAgentCounts: {
      'Support Team': 3,
      'Sales Team': 2,
      'Auto-Routing': 1,
      'Customer Success': 2,
      'Technical Support': 4
    },

    // Draw-down Priority (which credit pool to use first)
    drawDownPriority: {
      order: ['committed', 'recurring', 'oneTime'],
      committed: { balance: 6000, label: 'Committed Pack (Monthly Allowance)' },
      recurring: { balance: 0, label: 'Recurring Credit Pool' },
      oneTime: { balance: 0, label: 'One-time Credit Pool' },
      description: 'Credits are drawn in this order: Committed pack → Recurring credits → One-time credits'
    },

    // Guardrails & Protection
    guardrails: {
      trueUpTrigger: {
        threshold: 120,
        thresholdPercent: '120%',
        action: 'Legal trigger for contract true-up discussion',
        description: 'If usage exceeds 120% of committed usage, triggers mandatory account review'
      },
      usageAlert: {
        threshold: 200,
        thresholdPercent: '200%',
        action: 'Mandatory notification + meeting with account manager',
        description: 'Service does not stop, but requires immediate review to prevent cost overruns'
      }
    },

    // Forecasted Usage
    forecast: {
      projectedRunOutDate: 'Dec 20, 2025',
      daysRemaining: 16,
      averageDailyBurn: 375,
      description: 'Based on current usage patterns, credits will be depleted by Dec 20, 2025'
    },

    // Billable Criteria (What makes a conversation billable)
    billableCriteria: {
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
    },

    // Package Details
    package: {
      name: 'Credit Package',
      totalCost: 12000,  // $12,000 for 15,000 credits (20% discount from $15,000)
      renewalDate: 'Jan 1, 2026',
      originalValue: 15000,
      discountAmount: 3000,
      discountPercent: 20
    },

    // Agentic AI Package Details
    agenticPackage: {
      name: 'AI Conversations credits',
      creditAmount: 12000,  // 12,000 credits allocated for agentic
      totalCredits: 15000,
      renewalDate: 'Jan 1, 2026',
      description: '$12,000.00 Credit Package (12000 AI Conversations credits) will renew on Jan 1, 2026'
    },

    // Credit Expiration
    expiration: {
      nonExpiring: 6000,
      nonExpiringPercent: 68,
      expiring: 2766,
      expiringPercent: 32,
      expirationDate: 'Dec 31, 2025',
      policy: 'Use-it-or-lose-it: Credits expire at billing cycle end'
    },

    // Rollover Settings
    rolloverSettings: {
      consumptionOrder: 'renewing-first', // 'renewing-first' | 'onetime-first'
      autoRenew: {
        enabled: false,
        threshold: 500,
        topUpAmount: 5000,
        alertBeforeRenew: true
      },
      expirationAlerts: {
        thirtyDays: true,
        sevenDays: true,
        dayOf: false
      },
      exhaustionFallback: 'block' // 'block' | 'overage'
    },

    // Effective Rates (base rate × discount)
    effectiveRates: {
      digital: 1.59,  // 1.99 × 0.80
      voice: 0.79,    // 0.99 × 0.80
      sms: 0.12,      // 0.15 × 0.80
      international: 2.00  // 2.50 × 0.80
    },

    // Rate Lock Policy
    rateLock: {
      locked: true,
      customDiscountsAllowed: false,
      message: 'Rates are locked and cannot be custom-discounted by Deal Desk'
    },

    // Budget Allocation across usage types (excludes domestic unlimited)
    budgetAllocation: {
      aiAgentDigital: {
        allocated: 7000,
        used: 4000,
        remaining: 3000,
        label: 'AI Agent (Digital)',
        unit: 'AI Conversations credits',
        unitType: 'conversations'
      },
      aiAgentVoice: {
        allocated: 6000,
        used: 3500,
        remaining: 2500,
        label: 'AI Agent (Voice)',
        unit: 'AI Conversations credits',
        unitType: 'conversations'
      },
      sms: {
        allocated: 1000,
        used: 800,
        remaining: 200,
        label: 'SMS/MMS',
        unit: 'messages',
        unitType: 'messages'
      },
      international: {
        allocated: 600,
        used: 500,
        remaining: 100,
        label: 'International Calling',
        unit: 'minutes',
        unitType: 'minutes'
      },
      fax: {
        allocated: 400,
        used: 200,
        remaining: 200,
        label: 'Fax',
        unit: 'pages',
        unitType: 'pages'
      }
    },

    // Plan Usage Balance Description
    planDescription: 'When limits are reached, available credits are used at contracted rates. Plan resets monthly.',

    // Predictability Limitations
    predictability: {
      issue: 'Limited predictability',
      reason: 'Credits are a shared pool across multiple usage types (Agentic, SMS, Toll-free, International)',
      impact: 'System cannot accurately estimate "X credits = N conversations" because credits may be spent on other services',
      affectedSurfaces: ['Agent Builder cost estimates', 'Usage projections', 'Budget planning']
    },

    // Limits & Alerts configuration
    limits: {
      aiAgentDigital: {
        softAlert: 4000,    // 80% of 5000
        softAlertPercent: 80,
        hardStop: 5000,     // 100%
        hardStopPercent: 100,
        enabled: true,
        label: 'AI Agent Digital',
        whenReached: {
          softAlert: {
            action: 'notify',
            locations: ['Email to billing admin', 'Banner in Billing page', 'Badge in Launchpad'],
            message: 'You have used 80% of your AI Agent Digital budget'
          },
          hardStop: {
            action: 'block',
            message: 'AI Agent Digital usage blocked: Budget limit reached',
            allowOverride: true,
            overridePermission: 'billingAdmin'
          }
        }
      },
      aiAgentVoice: {
        softAlert: 6300,    // 90% of 7000
        softAlertPercent: 90,
        hardStop: null,     // No hard stop
        hardStopPercent: null,
        enabled: true,
        label: 'AI Agent Voice',
        whenReached: {
          softAlert: {
            action: 'notify',
            locations: ['Email to billing admin', 'Banner in Billing page'],
            message: 'You have used 90% of your AI Agent Voice budget'
          },
          hardStop: null
        }
      },
      sms: {
        softAlert: 1600,    // 80% of 2000
        softAlertPercent: 80,
        hardStop: 2000,
        hardStopPercent: 100,
        enabled: true,
        label: 'SMS/MMS',
        whenReached: {
          softAlert: {
            action: 'notify',
            locations: ['Email to billing admin', 'Banner in Billing page'],
            message: 'You have used 80% of your SMS/MMS budget'
          },
          hardStop: {
            action: 'block',
            message: 'SMS/MMS usage blocked: Budget limit reached',
            allowOverride: false
          }
        }
      },
      international: {
        softAlert: 800,     // 80% of 1000
        softAlertPercent: 80,
        hardStop: 1000,
        hardStopPercent: 100,
        enabled: true,
        label: 'International',
        whenReached: {
          softAlert: {
            action: 'notify',
            locations: ['Email to billing admin'],
            message: 'You have used 80% of your International calling budget'
          },
          hardStop: {
            action: 'block',
            message: 'International calling blocked: Budget limit reached',
            allowOverride: true,
            overridePermission: 'billingAdmin'
          }
        }
      },
      fax: {
        softAlert: 400,     // 80% of 500
        softAlertPercent: 80,
        hardStop: 500,
        hardStopPercent: 100,
        enabled: true,
        label: 'Fax',
        whenReached: {
          softAlert: {
            action: 'notify',
            locations: ['Email to billing admin', 'Banner in Billing page'],
            message: 'You have used 80% of your Fax page allocation'
          },
          hardStop: {
            action: 'block',
            message: 'Fax usage blocked: Page limit reached',
            allowOverride: true,
            overridePermission: 'billingAdmin'
          }
        }
      }
    },

    // Top AI Agents consumption summary (realistic monthly data)
    topAgentsSummary: [
      {
        name: 'Support Bot Alpha',
        conversations: 456,
        cost: 724.32,
        previousCost: 499.20, // 45% increase
        trend: 'up'
      },
      {
        name: 'Sales Bot A',
        conversations: 382,
        cost: 589.47,
        previousCost: 526.50, // 12% increase
        trend: 'up'
      },
      {
        name: 'Support Bot Beta',
        conversations: 328,
        cost: 521.44,
        previousCost: 566.80, // 8% decrease
        trend: 'down'
      },
      {
        name: 'Sales Bot B',
        conversations: 284,
        cost: 438.26,
        previousCost: 441.00, // 1% decrease
        trend: 'flat'
      },
      {
        name: 'Support Bot Gamma',
        conversations: 217,
        cost: 344.93,
        previousCost: 289.50, // 19% increase
        trend: 'up'
      },
      {
        name: 'Marketing Bot',
        conversations: 156,
        cost: 248.04,
        previousCost: 252.00, // 2% decrease
        trend: 'flat'
      },
      {
        name: 'Routing Bot',
        conversations: 0,
        cost: 0,
        previousCost: 0,
        trend: 'flat'
      }
    ],

    // Usage History
    usageHistory: [
      {
        id: 1,
        date: '2025-12-02',
        time: '14:23',
        type: 'AI Agent Digital',
        channel: '#support-queue',
        userGroup: 'Support Team',
        agentName: 'Support Bot Alpha',
        contact: 'jennifer.martinez@techcorp.com',
        duration: '3m 24s',
        actions: 7,
        credits: 1.99,
        listPrice: 1.99,
        effectiveRate: 1.59,
        discountApplied: 0.40,
        balance: 8766,
        status: 'completed',
        rechargeApplied: false
      },
      {
        id: 1.5,
        date: '2025-12-02',
        time: '14:18',
        type: 'AI Routing Digital',
        channel: 'IVR System',
        userGroup: 'Auto-Routing',
        agentName: 'Routing Bot',
        contact: 'robert.chen@globalmart.com',
        duration: '0m 45s',
        actions: 2,
        credits: 0,
        listPrice: null,
        effectiveRate: 0,
        discountApplied: 0,
        balance: 8766,
        status: 'completed',
        rechargeApplied: false,
        isFree: true,
        freeReason: 'No skill execution - IVR routing only'
      },
      {
        id: 2,
        date: '2025-12-02',
        time: '14:15',
        type: 'AI Agent Voice',
        channel: '(919) 847-3201',
        userGroup: 'Sales Team',
        agentName: 'Sales Bot A',
        contact: 'Marcus Johnson',
        duration: '6m 12s',
        actions: 12,
        credits: 1.98,  // Re-charge applied (2×$0.99)
        listPrice: 0.99,
        effectiveRate: 0.79,
        discountApplied: 0.20,
        balance: 8767,
        status: 'completed',
        rechargeApplied: true,
        rechargeReason: 'Call duration exceeded 5 minutes (6m 12s)'
      },
      {
        id: 3,
        date: '2025-12-02',
        time: '13:47',
        type: 'AI Agent Digital',
        channel: 'support@acmeindustries.com',
        userGroup: 'Support Team',
        agentName: 'Support Bot Beta',
        contact: 'Amanda Foster',
        duration: '2m 15s',
        actions: 5,
        credits: 1.99,
        listPrice: 1.99,
        effectiveRate: 1.59,
        discountApplied: 0.40,
        balance: 8769,
        status: 'completed',
        rechargeApplied: false
      },
      {
        id: 4,
        date: '2025-12-02',
        time: '12:33',
        type: 'SMS/MMS',
        channel: '+1 415-782-9045',
        userGroup: 'Marketing',
        contact: '+1 415-782-9045',
        duration: '—',
        actions: 1,
        credits: 0.15,
        listPrice: 0.15,
        effectiveRate: 0.12,
        discountApplied: 0.03,
        balance: 8770,
        status: 'completed',
        rechargeApplied: false
      },
      {
        id: 5,
        date: '2025-12-02',
        time: '11:02',
        type: 'AI Agent Voice',
        channel: '(415) 923-8467',
        userGroup: 'Support Team',
        agentName: 'Support Bot Gamma',
        contact: 'David Kim',
        duration: '4m 30s',
        actions: 8,
        credits: 0.99,
        listPrice: 0.99,
        effectiveRate: 0.79,
        discountApplied: 0.20,
        balance: 8770,
        status: 'completed',
        rechargeApplied: false
      },
      {
        id: 6,
        date: '2025-12-01',
        time: '16:45',
        type: 'AI Agent Digital',
        channel: '#sales-queue',
        userGroup: 'Sales Team',
        agentName: 'Sales Bot B',
        contact: 'lisa.wong@meridiantech.io',
        duration: '5m 10s',
        actions: 14,
        credits: 3.98,  // Re-charge applied (2×$1.99)
        listPrice: 1.99,
        effectiveRate: 1.59,
        discountApplied: 0.40,
        balance: 8772,
        status: 'completed',
        rechargeApplied: true,
        rechargeReason: 'Conversation exceeded 10 actions (14 actions)'
      },
      {
        id: 6.5,
        date: '2025-12-01',
        time: '18:10',
        type: 'AI Routing Voice',
        channel: '(800) 624-7183',
        userGroup: 'Auto-Routing',
        agentName: 'Routing Bot',
        contact: '(312) 847-9023',
        duration: '1m 12s',
        actions: 3,
        credits: 0,
        listPrice: null,
        effectiveRate: 0,
        discountApplied: 0,
        balance: 8773,
        status: 'completed',
        rechargeApplied: false,
        isFree: true,
        freeReason: 'No skill execution - transferred to agent without AI action'
      },
      {
        id: 7,
        date: '2025-12-01',
        time: '15:22',
        type: 'International',
        channel: '+44 20 7946 8352',
        userGroup: 'Sales Team',
        contact: 'James Patterson',
        duration: '12m 30s',
        actions: 1,
        credits: 2.50,
        listPrice: 2.50,
        effectiveRate: 2.00,
        discountApplied: 0.50,
        balance: 8773,
        status: 'completed',
        rechargeApplied: false
      },
      {
        id: 8,
        date: '2025-12-01',
        time: '14:10',
        type: 'AI Agent Voice',
        channel: '(212) 784-5293',
        userGroup: 'Support Team',
        agentName: 'Support Bot Alpha',
        contact: 'Patricia Rodriguez',
        duration: '3m 45s',
        actions: 6,
        credits: 0.99,
        listPrice: 0.99,
        effectiveRate: 0.79,
        discountApplied: 0.20,
        balance: 8775,
        status: 'completed',
        rechargeApplied: false
      }
    ]
  },

  scenarioB: {
    // DUAL PRICING MODELS IN ONE SURFACE:
    // - Agentic AI uses TIERED RATES (new model)
    // - SMS/International/Toll-free still use CREDITS (existing model)

    // AI Agent counts per team
    teamAgentCounts: {
      'Support Team': 3,
      'Sales Team': 2,
      'Auto-Routing': 1,
      'Customer Success': 2,
      'Technical Support': 4
    },

    // === AGENTIC AI (Tiered Pricing) ===
    // Current Tier Status
    currentTier: 2,
    conversationsThisMonth: 734,
    conversationsDigital: 450,  // Digital AI Agent conversations
    conversationsVoice: 284,    // Voice AI Agent conversations
    currentSpend: 1247,
    currentSavings: 65,  // Amount saved so far this month vs Tier 1 rates
    monthlySpendLimit: 5000,
    spendPercentage: 25, // (1247/5000) * 100
    minimumCommitment: 10000, // Enterprise-focused: 10K+ credits minimum at launch
    discountApplied: 'progressive', // Discount improves automatically with volume

    // Forecasted Usage (Agentic AI)
    forecast: {
      projectedSpendByMonthEnd: 4850,
      projectedTier: 3,
      projectedDate: 'Dec 15, 2025',
      estimatedSavings: 127,
      description: 'Based on current usage, you will reach Tier 3 by Dec 15'
    },

    // Guardrails & Protection (Agentic AI)
    guardrails: {
      trueUpTrigger: {
        threshold: 120,
        thresholdPercent: '120%',
        action: 'Legal trigger for contract true-up discussion',
        description: 'If spend exceeds 120% of committed limit, triggers mandatory account review'
      },
      spendAlert: {
        threshold: 200,
        thresholdPercent: '200%',
        action: 'Mandatory notification + meeting with account manager',
        description: 'Service does not stop, but requires immediate review to prevent cost overruns'
      }
    },

    // Billable Criteria (What makes a conversation billable)
    billableCriteria: {
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
    },

    // Spend Limit Configuration
    spendLimitConfig: {
      limit: 5000,
      whenReached: {
        action: 'notify',  // Options: 'notify', 'block', 'allow_with_approval'
        notification: {
          locations: ['Email to billing admin', 'Banner in Billing page', 'Launchpad badge'],
          message: 'You have reached your monthly spend limit of $5,000'
        },
        blockOption: false,
        allowOverride: true,
        overridePermission: 'billingAdmin',
        overrideFlow: 'Billing admin can approve additional spend up to 10% over limit'
      }
    },

    // === SMS/INTERNATIONAL/TOLL-FREE/FAX (Credits - Existing Model) ===
    // Note: Domestic Unlimited Calling is NOT part of the credit pool
    otherServicesCredits: {
      totalCredits: 5000,
      used: 1234,
      available: 3766,
      allocation: {
        sms: { allocated: 2500, used: 623, remaining: 1877 },
        international: { allocated: 1500, used: 411, remaining: 1089 },
        fax: { allocated: 1000, used: 200, remaining: 800 }
      },
      renewalDate: 'Jan 1, 2026',
      note: 'SMS, International, and Fax services continue using credit-based billing. Domestic calling is billed separately as unlimited.'
    },

    // Rate Lock Policy
    rateLock: {
      locked: true,
      customDiscountsAllowed: false,
      message: 'Rates are locked and cannot be custom-discounted by Deal Desk'
    },

    // Predictability
    predictability: {
      level: 'High',
      reason: 'Rates are fixed per tier and usage type',
      impact: 'System can accurately estimate costs in Agent Builder and projections',
      affectedSurfaces: ['Agent Builder shows exact cost estimates', 'Accurate usage projections']
    },

    // Tier Structure (aligned with GA document)
    tiers: [
      {
        tier: 1,
        min: 0,
        max: 500,
        digital: 1.99,  // Base rate
        voice: 0.99,    // Base rate
        discount: 0,
        discountPercent: '0%',
        label: 'Starter'
      },
      {
        tier: 2,
        min: 501,
        max: 1000,
        digital: 1.89,  // 5% discount (1.99 × 0.95)
        voice: 0.94,    // 5% discount (0.99 × 0.95)
        discount: 0.05,
        discountPercent: '5%',
        label: 'Growing',
        current: true  // Mark current tier
      },
      {
        tier: 3,
        min: 1001,
        max: 2500,
        digital: 1.79,  // 10% discount (1.99 × 0.90)
        voice: 0.89,    // 10% discount (0.99 × 0.90)
        discount: 0.10,
        discountPercent: '10%',
        label: 'Established'
      },
      {
        tier: 4,
        min: 2501,
        max: 10000,
        digital: 1.69,  // 15% discount (1.99 × 0.85)
        voice: 0.84,    // 15% discount (0.99 × 0.85)
        discount: 0.15,
        discountPercent: '15%',
        label: 'Professional'
      },
      {
        tier: 5,
        min: 10001,
        max: 25000,
        digital: 1.59,  // 20% discount (1.99 × 0.80)
        voice: 0.79,    // 20% discount (0.99 × 0.80)
        discount: 0.20,
        discountPercent: '20%',
        label: 'Advanced'
      },
      {
        tier: 6,
        min: 25001,
        max: 50000,
        digital: 1.49,  // 25% discount (1.99 × 0.75)
        voice: 0.74,    // 25% discount (0.99 × 0.75)
        discount: 0.25,
        discountPercent: '25%',
        label: 'Premium'
      },
      {
        tier: 7,
        min: 50001,
        max: null,
        digital: 1.39,  // 30% discount (1.99 × 0.70)
        voice: 0.69,    // 30% discount (0.99 × 0.70)
        discount: 0.30,
        discountPercent: '30%',
        label: 'Enterprise'
      }
    ],

    // Progress to next tier
    conversationsToNextTier: 267,  // 1001 - 734
    nextTierThreshold: 1001,
    progressPercent: 73.4, // (734/1001) * 100

    // Budget estimates at different tiers
    budgetEstimates: {
      currentTier: {
        digital: 5319,  // $5000 / $0.94
        voice: 2646,    // $5000 / $1.89
        mixed: '~4,000' // Rough estimate for mix
      },
      nextTier: {
        digital: 5618,  // $5000 / $0.89
        voice: 2793,    // $5000 / $1.79
        mixed: '~4,200'
      }
    },

    // Top AI Agents consumption summary (realistic monthly data)
    topAgentsSummary: [
      {
        name: 'Support Bot Alpha',
        conversations: 456,
        cost: 724.32,
        previousCost: 499.20, // 45% increase
        trend: 'up'
      },
      {
        name: 'Sales Bot A',
        conversations: 382,
        cost: 589.47,
        previousCost: 526.50, // 12% increase
        trend: 'up'
      },
      {
        name: 'Support Bot Beta',
        conversations: 328,
        cost: 521.44,
        previousCost: 566.80, // 8% decrease
        trend: 'down'
      },
      {
        name: 'Sales Bot B',
        conversations: 284,
        cost: 438.26,
        previousCost: 441.00, // 1% decrease
        trend: 'flat'
      },
      {
        name: 'Support Bot Gamma',
        conversations: 217,
        cost: 344.93,
        previousCost: 289.50, // 19% increase
        trend: 'up'
      },
      {
        name: 'Marketing Bot',
        conversations: 156,
        cost: 248.04,
        previousCost: 252.00, // 2% decrease
        trend: 'flat'
      },
      {
        name: 'Routing Bot',
        conversations: 0,
        cost: 0,
        previousCost: 0,
        trend: 'flat'
      }
    ],

    // Usage History with tier transitions AND mixed billing models
    usageHistory: [
      {
        id: 1,
        date: '2025-12-02',
        time: '14:23',
        type: 'AI Agent Digital',
        billingModel: 'tiered',  // Tiered pricing
        channel: '#support-queue',
        userGroup: 'Support Team',
        agentName: 'Support Bot Alpha',
        contact: 'jennifer.martinez@techcorp.com',
        duration: '3m 24s',
        actions: 7,
        tier: 2,
        rate: 1.89,
        cost: 1.89,
        runningTotal: 1247,
        rechargeApplied: false
      },
      {
        id: 1.5,
        date: '2025-12-02',
        time: '14:18',
        type: 'AI Routing Digital',
        billingModel: 'free',  // Free routing
        channel: 'IVR System',
        userGroup: 'Auto-Routing',
        agentName: 'Routing Bot',
        contact: 'robert.chen@globalmart.com',
        duration: '0m 45s',
        actions: 2,
        tier: null,
        rate: null,
        cost: 0,
        runningTotal: 1247,
        rechargeApplied: false,
        isFree: true,
        freeReason: 'No skill execution - IVR routing only'
      },
      {
        id: 2,
        date: '2025-12-02',
        time: '14:20',
        type: 'SMS',
        billingModel: 'credits',  // Credits pricing
        channel: '+1 415-782-9045',
        userGroup: 'Marketing',
        contact: '+1 650-394-7621',
        duration: '—',
        actions: 1,
        credits: 0.15,
        cost: 0.15,
        rechargeApplied: false,
        note: 'Uses credit-based billing'
      },
      {
        id: 3,
        date: '2025-12-02',
        time: '14:15',
        type: 'AI Agent Voice',
        billingModel: 'tiered',  // Tiered pricing
        channel: '(919) 847-3201',
        userGroup: 'Sales Team',
        agentName: 'Sales Bot A',
        contact: 'Marcus Johnson',
        duration: '6m 12s',
        actions: 12,
        tier: 2,
        rate: 0.94,
        cost: 1.88,  // Re-charge applied (2×$0.94)
        runningTotal: 1246,
        rechargeApplied: true,
        rechargeReason: 'Call duration exceeded 5 minutes (6m 12s)'
      },
      {
        id: 4,
        date: '2025-12-02',
        time: '13:47',
        type: 'AI Agent Digital',
        billingModel: 'tiered',  // Tiered pricing
        channel: 'support@acmeindustries.com',
        userGroup: 'Support Team',
        agentName: 'Support Bot Beta',
        contact: 'Amanda Foster',
        duration: '2m 15s',
        actions: 5,
        tier: 2,
        rate: 1.89,
        cost: 1.89,
        runningTotal: 1244,
        rechargeApplied: false
      },
      {
        id: 5,
        date: '2025-12-01',
        time: '23:45',
        type: 'AI Agent Digital',
        billingModel: 'tiered',  // Tiered pricing
        channel: '#sales-queue',
        userGroup: 'Sales Team',
        contact: 'lisa.wong@meridiantech.io',
        duration: '5m 10s',
        actions: 14,
        tier: 2,
        rate: 1.89,
        cost: 3.78,  // Re-charge applied (2×$1.89)
        runningTotal: 1243,
        tierTransition: true,  // Crossed into Tier 2
        previousTier: 1,
        previousRate: 1.99,
        rechargeApplied: true,
        rechargeReason: 'Conversation exceeded 10 actions (14 actions)'
      },
      {
        id: 6,
        date: '2025-12-01',
        time: '22:30',
        type: 'AI Agent Voice',
        billingModel: 'tiered',  // Tiered pricing
        channel: '(415) 923-8467',
        userGroup: 'Support Team',
        contact: 'David Kim',
        duration: '4m 30s',
        actions: 8,
        tier: 1,
        rate: 0.99,
        cost: 0.99,
        runningTotal: 1242,
        rechargeApplied: false
      },
      {
        id: 6.5,
        date: '2025-12-01',
        time: '20:45',
        type: 'AI Routing Voice',
        billingModel: 'free',  // Free routing
        channel: '(800) 624-7183',
        userGroup: 'Auto-Routing',
        contact: '(312) 847-9023',
        duration: '1m 12s',
        actions: 3,
        tier: null,
        rate: null,
        cost: 0,
        runningTotal: 1242,
        rechargeApplied: false,
        isFree: true,
        freeReason: 'No skill execution - transferred to agent without AI action'
      },
      {
        id: 7,
        date: '2025-12-01',
        time: '18:30',
        type: 'International',
        billingModel: 'credits',  // Credits pricing
        channel: '+44 20 7946 8352',
        userGroup: 'Sales Team',
        contact: 'James Patterson',
        duration: '8m 15s',
        actions: 1,
        credits: 2.50,
        cost: 2.50,
        rechargeApplied: false,
        note: 'Uses credit-based billing'
      },
      {
        id: 8,
        date: '2025-12-01',
        time: '16:45',
        type: 'AI Agent Digital',
        billingModel: 'tiered',  // Tiered pricing
        channel: '#support-queue',
        userGroup: 'Support Team',
        contact: 'carlos.rivera@nexusgroup.com',
        duration: '3m 00s',
        actions: 6,
        tier: 1,
        rate: 1.99,
        cost: 1.99,
        runningTotal: 1240,
        rechargeApplied: false
      },
      {
        id: 9,
        date: '2025-12-01',
        time: '15:45',
        type: 'SMS',
        billingModel: 'credits',  // Credits pricing
        channel: '+1 206-593-4178',
        userGroup: 'Support Team',
        contact: '+1 503-821-6392',
        duration: '—',
        actions: 1,
        credits: 0.15,
        cost: 0.15,
        rechargeApplied: false,
        note: 'Uses credit-based billing'
      },
      {
        id: 10,
        date: '2025-12-01',
        time: '15:22',
        type: 'AI Agent Digital',
        billingModel: 'tiered',  // Tiered pricing
        channel: 'help@stellarventures.com',
        userGroup: 'Support Team',
        contact: 'sophia.anderson@financeplus.com',
        duration: '2m 45s',
        actions: 4,
        tier: 1,
        rate: 1.99,
        cost: 1.99,
        runningTotal: 1239,
        rechargeApplied: false
      },
      {
        id: 11,
        date: '2025-12-01',
        time: '14:10',
        type: 'AI Agent Voice',
        billingModel: 'tiered',  // Tiered pricing
        channel: '(212) 784-5293',
        userGroup: 'Support Team',
        contact: 'Patricia Rodriguez',
        duration: '3m 45s',
        actions: 6,
        tier: 1,
        rate: 0.99,
        cost: 0.99,
        runningTotal: 1238,
        rechargeApplied: false
      }
    ]
  },

  // Comparison Data for Leadership Decision
  comparison: {
    scenarioA: {
      name: 'Scenario A: Pre-Purchase Credits + Budget Allocation',
      model: 'Upfront credits with flat discount',

      predictability: {
        level: 'Low',
        description: 'Credits are a shared pool across multiple usage types',
        impact: 'Cannot accurately estimate "X credits = N conversations"'
      },

      flexibility: {
        level: 'High',
        description: 'Can allocate and reallocate credits across any usage type',
        benefits: ['Universal credit pool', 'Flexible reallocation', 'Works across all services']
      },

      uiComplexity: {
        level: 'Higher',
        description: 'Requires budget allocation UI and management',
        components: ['Budget allocation interface', 'Per-type limit settings', 'Reallocation controls']
      },

      customerMentalModel: {
        complexity: 'More Complex',
        description: 'Customer must understand credit pooling and allocation',
        learningCurve: 'Steeper - requires understanding of shared pool concept'
      },

      multiProduct: {
        alignment: 'Perfect',
        description: 'Natural fit for enterprise customers with multiple services',
        benefits: ['Single credit pool for all services', 'Unified billing view']
      },

      discounting: {
        model: 'Flat discount on credit purchase',
        flexibility: 'Low - same discount for all usage types',
        volumeIncentive: 'Upfront only'
      },

      alerts: {
        type: 'Per-type budget alerts',
        configuration: 'Soft and hard limits per usage type',
        granularity: 'High'
      },

      pros: [
        'Simple unified credit pool',
        'Works across all Dialpad services',
        'Flexible reallocation',
        'Familiar prepaid model',
        'No monthly tier resets'
      ],

      cons: [
        'Low predictability for cost estimates',
        'Requires budget allocation UI',
        'More complex customer mental model',
        'Cannot show accurate "cost per agent" in Agent Builder',
        'Use-it-or-lose-it may frustrate customers'
      ],

      bestFor: [
        'Enterprise customers with diverse usage patterns',
        'Customers using multiple Dialpad services',
        'Organizations that prefer prepaid models'
      ]
    },

    scenarioB: {
      name: 'Scenario B: Pay-As-You-Go + Dynamic Tiered Rates',
      model: 'Monthly spend limit with progressive discounts',

      predictability: {
        level: 'High',
        description: 'Fixed rates per tier and usage type',
        impact: 'Accurate cost estimates in Agent Builder and projections'
      },

      flexibility: {
        level: 'Lower',
        description: 'No credit reallocation - each usage type priced independently',
        limitations: ['No cross-service credit sharing', 'Fixed rate structure']
      },

      uiComplexity: {
        level: 'Lower',
        description: 'Simpler - just tier progress and spend limit',
        components: ['Tier progress visualization', 'Spend limit setting', 'No allocation needed']
      },

      customerMentalModel: {
        complexity: 'Simpler',
        description: 'Clear tier-based pricing like cell phone plans',
        learningCurve: 'Easier - familiar tiered discount model'
      },

      multiProduct: {
        alignment: 'Requires Extension',
        description: 'Would need separate tier systems for other services',
        challenges: ['SMS has different pricing model', 'Toll-free pricing separate', 'Harder to unify']
      },

      discounting: {
        model: 'Progressive discounts with volume',
        flexibility: 'High - improves automatically with usage',
        volumeIncentive: 'Continuous throughout month'
      },

      alerts: {
        type: 'Total spend alerts',
        configuration: 'Single monthly spend limit',
        granularity: 'Lower'
      },

      pros: [
        'High predictability for cost estimates',
        'Simple customer mental model',
        'Automatic discount improvements',
        'No budget allocation needed',
        'Accurate Agent Builder cost estimates',
        'No wasted credits'
      ],

      cons: [
        'Tier resets monthly',
        'Less flexible - no cross-service credit sharing',
        'Harder to extend to other Dialpad services',
        'May encourage end-of-month gaming',
        'Requires tier tracking infrastructure'
      ],

      bestFor: [
        'Agentic-focused customers',
        'Organizations wanting predictable costs',
        'Customers preferring pay-as-you-go models'
      ]
    },

    decisionFactors: [
      {
        factor: 'Multi-Product Strategy',
        scenarioA: 'Winner - Universal credit pool works for all services',
        scenarioB: 'Would need separate tier systems for SMS, toll-free, etc.'
      },
      {
        factor: 'Cost Predictability',
        scenarioA: 'Low - shared pool makes estimates difficult',
        scenarioB: 'Winner - Fixed rates enable accurate estimates'
      },
      {
        factor: 'Customer Experience',
        scenarioA: 'More complex but more flexible',
        scenarioB: 'Winner - Simpler mental model'
      },
      {
        factor: 'Agent Builder Integration',
        scenarioA: 'Can only show approximate costs',
        scenarioB: 'Winner - Can show exact costs'
      },
      {
        factor: 'Implementation Complexity',
        scenarioA: 'Complex - budget allocation UI needed',
        scenarioB: 'Moderate - tier tracking needed'
      }
    ],

    recommendation: {
      title: 'Leadership Decision Required',
      question: 'Should Dialpad prioritize multi-product flexibility (A) or cost predictability (B)?',
      considerations: [
        'If agentic billing must align with SMS/toll-free/international → Choose A',
        'If accurate cost estimates and simplicity are critical → Choose B',
        'Consider future Dialpad AI strategy and multi-product roadmap'
      ]
    }
  }
}
