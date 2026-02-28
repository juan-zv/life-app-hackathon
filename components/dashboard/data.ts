export interface DashboardData {
  foodAndHealth: {
    calories: {
      current: number
      goal: number
      unit: string
    }
    nextMeal: {
      name: string
      label: string // e.g., "High Protein", "Low Carb"
    }
  }
  academics: {
    assignments: Array<{
      id: string
      title: string
      dueDate: string // ISO string or display text like "Today, 11:59 PM"
      priority: "high" | "medium" | "low"
    }>
    studyGoal: {
      currentHours: number
      targetHours: number
    }
  }
  subscriptions: {
    monthlySpend: {
      amount: number
      currency: string
      trend: number // percentage change, e.g., -5
    }
    upcomingRenewals: Array<{
      id: string
      serviceName: string
      amount: number
      status: "paid" | "due" | "overdue"
      renewalDate: string
    }>
  }
}

export const mockDashboardData: DashboardData = {
  foodAndHealth: {
    calories: {
      current: 1450,
      goal: 2200,
      unit: "kcal",
    },
    nextMeal: {
      name: "Grilled Salmon Salad",
      label: "High Protein",
    },
  },
  academics: {
    assignments: [
      {
        id: "1",
        title: "Calculus III Problem Set",
        dueDate: "Today, 11:59 PM",
        priority: "high",
      },
    ],
    studyGoal: {
      currentHours: 12,
      targetHours: 15,
    },
  },
  subscriptions: {
    monthlySpend: {
      amount: 124.99,
      currency: "maiden",
      trend: -5,
    },
    upcomingRenewals: [
      {
        id: "1",
        serviceName: "Netflix",
        amount: 15.99,
        status: "due",
        renewalDate: "2024-03-01",
      },
      {
        id: "2",
        serviceName: "Spotify",
        amount: 11.99,
        status: "paid",
        renewalDate: "2024-02-28",
      },
    ],
  },
}
