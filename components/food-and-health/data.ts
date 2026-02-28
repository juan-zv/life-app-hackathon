export interface SubscriptionItem {
  name: string
  cycle: string
  price: number
  dueDate: string
}

export interface FoodItem {
  name: string
  price: number
  amount: number
  renewThreshold: number
}

export type ContentItems = SubscriptionItem | FoodItem

export interface DashboardSection {
  id: string
  user_id: string
  name: string
  content: {
    items: ContentItems[]
  }
}

export const mockDashboardData: DashboardSection[] = []
