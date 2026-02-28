import { ExternalLink, CheckCircle2, XCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { CartResult } from "./types"

interface CartResultsProps {
  result: CartResult;
}

export function CartResults({ result }: CartResultsProps) {
  const foundCount = result.found.length
  const notFoundCount = result.notFound.length
  const totalCount = result.totalRequested

  return (
    <div className="space-y-6">
      {/* Success Card / Link */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart is Ready
          </CardTitle>
          <CardDescription>
            Found {foundCount} items out of {totalCount} requested.
            {result.estimatedTotal > 0 && (
              <span className="ml-2 font-medium text-foreground">
                Est. Total: ${result.estimatedTotal.toFixed(2)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <Button asChild className="w-full sm:w-auto" size="lg">
            <a href={result.cartUrl} target="_blank" rel="noopener noreferrer">
              Open Walmart Cart <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Found Items List */}
      {foundCount > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Found Items ({foundCount})
          </h3>
          <div className="grid gap-4">
            {result.found.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Image Placeholder */}
                  <div className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-medium text-lg">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium line-clamp-2 text-sm sm:text-base">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {item.name}
                        </a>
                      </h4>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        ${item.price}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Matched for: <span className="font-medium text-foreground">{item.searchedItem}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {foundCount > 0 && notFoundCount > 0 && <Separator />}

      {/* Not Found Items List */}
      {notFoundCount > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Not Found ({notFoundCount})
          </h3>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.notFound.map((name, i) => (
                  <li key={i} className="text-destructive font-medium">
                    {name}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Tip: Try manually adding these items once you open the cart link.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
