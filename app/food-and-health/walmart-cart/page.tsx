"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { GroceryForm, CartResults, useWalmartCart } from "@/app/walmart-cart";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, RefreshCw, ShoppingCart, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FoodItem {
  id?: string;
  name: string;
  amount: number;
  renewThreshold: number;
}

export default function WalmartCartPage() {
  const { result, error, isLoading: isCartLoading, submit } = useWalmartCart();
  const { userId, isLoaded } = useAuth()
  
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [manualInput, setManualInput] = useState("")

  useEffect(() => {
    if (!isLoaded || !userId) return

    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend1.study-with-me.org/categories/${userId}`)
        if (response.ok) {
          const result = await response.json()
          const foodSection = result.find((section: any) => section.name === "Food")
          if (foodSection?.content?.items) {
            setFoodItems(foodSection.content.items)
            // Pre-select items that are below threshold
            const lowStock = foodSection.content.items
              .filter((item: FoodItem) => item.amount <= item.renewThreshold)
              .map((item: FoodItem) => item.name)
            setSelectedItems(lowStock)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [isLoaded, userId])

  const handleCheckboxChange = (itemName: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemName])
    } else {
      setSelectedItems(prev => prev.filter(item => item !== itemName))
    }
  }

  const handleManualSubmit = () => {
    const manualItems = manualInput
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
    
    // Combine selected items from inventory and manual input
    // Ensure uniqueness if needed, or just allow duplicates
    const allItems = [...new Set([...selectedItems, ...manualItems])]
    
    if (allItems.length > 0) {
      submit(allItems)
    }
  }

  const lowStockItems = foodItems.filter(item => item.amount <= item.renewThreshold)
  const otherItems = foodItems.filter(item => item.amount > item.renewThreshold)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Grocery Cart</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Automatically build your Walmart cart based on your pantry inventory.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>From Your Pantry</span>
                {isLoadingData && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </CardTitle>
              <CardDescription>
                Select items from your inventory to replenish.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Low Stock Section */}
              {lowStockItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Low Stock Items
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lowStockItems.map((item, idx) => (
                      <div key={`low-${idx}`} className="flex items-center space-x-2 border p-3 rounded-md bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20">
                        <Checkbox 
                          id={`item-${idx}`} 
                          checked={selectedItems.includes(item.name)}
                          onCheckedChange={(checked) => handleCheckboxChange(item.name, checked as boolean)}
                        />
                        <Label htmlFor={`item-${idx}`} className="flex-1 cursor-pointer font-medium">
                          {item.name}
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {item.amount} left (Renew at {item.renewThreshold})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lowStockItems.length > 0 && otherItems.length > 0 && <Separator />}

              {/* Other Items Section */}
              {otherItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Other Inventory</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {otherItems.map((item, idx) => (
                      <div key={`other-${idx}`} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id={`other-item-${idx}`} 
                          checked={selectedItems.includes(item.name)}
                          onCheckedChange={(checked) => handleCheckboxChange(item.name, checked as boolean)}
                        />
                        <Label htmlFor={`other-item-${idx}`} className="flex-1 cursor-pointer">
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {foodItems.length === 0 && !isLoadingData && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No food items found in your inventory.
                  <br />
                  <span className="text-sm">Add items in the Food Dashboard to see them here.</span>
                </div>
              )}

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Additions</CardTitle>
              <CardDescription>
                Add any extra items that aren't in your tracked inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Textarea 
                placeholder="Paper towels&#10;Dish soap&#10;Batteries"
                className="min-h-[120px]"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleManualSubmit}
            disabled={isCartLoading || (selectedItems.length === 0 && !manualInput.trim())}
          >
            {isCartLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Generate Walmart Cart Link
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          <Card className="h-full border-2 border-primary/10 bg-muted/10">
            <CardHeader>
              <CardTitle>Cart Results</CardTitle>
              <CardDescription>
                Your generate cart link and item details will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <CartResults result={result} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
                  <p>Select items and click "Generate" to build your cart.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
