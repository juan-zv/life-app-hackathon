export interface Macro {
  name: string
  current: number
  total: number
  unit: string
  color: string
}

export interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  time: string
  completed: boolean
}

export interface FoodHealthData {
  dailySummary: {
    calories: {
      current: number
      goal: number
    }
    macros: Macro[]
    hydration: {
      current: number // in glasses (8oz)
      goal: number
    }
  }
  meals: {
    breakfast: Meal[]
    lunch: Meal[]
    dinner: Meal[]
    snacks: Meal[]
  }
  weight: {
    current: number
    goal: number
    history: { date: string; value: number }[]
  }
}

export const mockFoodHealthData: FoodHealthData = {
  dailySummary: {
    calories: {
      current: 1450,
      goal: 2200,
    },
    macros: [
      { name: "Protein", current: 110, total: 180, unit: "g", color: "bg-blue-500" },
      { name: "Carbs", current: 150, total: 250, unit: "g", color: "bg-green-500" },
      { name: "Fats", current: 45, total: 70, unit: "g", color: "bg-yellow-500" },
    ],
    hydration: {
      current: 4,
      goal: 8,
    },
  },
  meals: {
    breakfast: [
      {
        id: "1",
        name: "Oatmeal with Berries",
        calories: 350,
        protein: 12,
        carbs: 45,
        fats: 6,
        time: "08:00 AM",
        completed: true,
      },
      {
        id: "2",
        name: "Black Coffee",
        calories: 5,
        protein: 0,
        carbs: 1,
        fats: 0,
        time: "08:15 AM",
        completed: true,
      },
    ],
    lunch: [
      {
        id: "3",
        name: "Grilled Chicken Salad",
        calories: 450,
        protein: 40,
        carbs: 15,
        fats: 20,
        time: "12:30 PM",
        completed: true,
      },
    ],
    dinner: [
      {
        id: "4",
        name: "Salmon with Asparagus",
        calories: 550,
        protein: 45,
        carbs: 10,
        fats: 25,
        time: "07:00 PM",
        completed: false, // Planned
      },
    ],
    snacks: [
      {
        id: "5",
        name: "Greek Yogurt",
        calories: 120,
        protein: 15,
        carbs: 8,
        fats: 0,
        time: "03:30 PM",
        completed: false,
      },
    ],
  },
  weight: {
    current: 175,
    goal: 165,
    history: [
      { date: "2024-02-20", value: 177 },
      { date: "2024-02-28", value: 175 },
    ],
  },
}
