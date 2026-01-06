// BuboIQ Pricing Configuration

export const PLAN_LIMITS = {
  Starter: {
    included: 10,
    overage: 2.00
  },
  Pro: {
    included: 50,
    overage: 1.50
  },
  Team: {
    included: 200,
    overage: 1.00
  }
};

export const PLAN_PRICING = {
  Starter: {
    monthly: 0,
    annual: 0
  },
  Pro: {
    monthly: 49,
    annual: 490
  },
  Team: {
    monthly: 199,
    annual: 1990
  }
};

export const ADDON_PRICING = {
  Security: {
    monthly: 15,
    annual: 150
  },
  DR: {
    monthly: 10,
    annual: 100
  },
  Remote: {
    monthly: 5,
    annual: 50
  }
};

export const PRICE_IDS = {
  core: {
    Pro: 'price_pro_monthly',
    Team: 'price_team_monthly'
  },
  addons: {
    Security: 'price_addon_security',
    DR: 'price_addon_dr',
    Remote: 'price_addon_remote'
  }
};
