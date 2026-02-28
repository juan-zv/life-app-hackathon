export interface AssignmentItem {
  id?: string
  name: string
  dueDate: string
}

export interface DashboardSection {
  id: string
  user_id: string
  name: string
  content: {
    items: AssignmentItem[]
  }
}

export const mockDashboardData: DashboardSection[] = []
