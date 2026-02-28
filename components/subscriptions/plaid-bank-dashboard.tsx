"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Landmark,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Account {
  account_id: string
  name: string
  official_name: string | null
  type: string
  subtype: string | null
  mask: string | null
  balances: {
    available: number | null
    current: number | null
    iso_currency_code: string | null
    limit: number | null
  }
}

interface Transaction {
  transaction_id: string
  account_id: string
  amount: number
  date: string
  name: string
  category: string[] | null
  merchant_name: string | null
  pending: boolean
}

export function PlaidBankDashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-connect via Plaid Sandbox on mount
  useEffect(() => {
    const autoConnect = async () => {
      setIsConnecting(true)
      setError(null)
      try {
        console.log("[Plaid] Connecting to sandbox...")
        const res = await fetch("/api/plaid/sandbox-connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json()
        if (data.error) {
          console.error("[Plaid] Sandbox connect error:", data.error)
          setError(data.error)
          return
        }
        console.log("[Plaid] Sandbox connect success — item_id:", data.item_id)
        setAccessToken(data.access_token)
        await Promise.all([
          fetchAccounts(data.access_token),
          fetchTransactions(data.access_token),
        ])
      } catch (err: any) {
        console.error("[Plaid] Sandbox connect failed:", err.message)
        setError(err.message || "Failed to auto-connect sandbox")
      } finally {
        setIsConnecting(false)
      }
    }
    autoConnect()
  }, [])

  const fetchAccounts = async (token: string) => {
    setIsLoadingAccounts(true)
    try {
      console.log("[Plaid] Fetching accounts...")
      const res = await fetch("/api/plaid/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      })
      const data = await res.json()
      if (data.error) {
        console.error("[Plaid] Accounts error:", data.error)
        setError(data.error)
        return
      }
      console.log("[Plaid] Accounts success:", data.accounts?.length, "accounts")
      setAccounts(data.accounts || [])
    } catch (err: any) {
      console.error("[Plaid] Accounts fetch failed:", err.message)
      setError(err.message)
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const fetchTransactions = async (token: string) => {
    setIsLoadingTransactions(true)
    try {
      console.log("[Plaid] Fetching transactions...")
      const res = await fetch("/api/plaid/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      })
      const data = await res.json()
      if (data.error) {
        console.error("[Plaid] Transactions error:", data.error)
        return
      }
      console.log("[Plaid] Transactions success:", data.transactions?.length, "transactions")
      setTransactions(data.transactions || [])
    } catch (err: any) {
      console.error("[Plaid] Transactions fetch failed:", err.message)
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balances.current || 0),
    0
  )
  const totalAvailable = accounts.reduce(
    (sum, acc) => sum + (acc.balances.available || 0),
    0
  )

  // If not connected yet, show loading card
  if (!accessToken) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            {isConnecting ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Landmark className="h-8 w-8 text-primary" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {isConnecting ? "Connecting to Bank..." : "Bank Connection"}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {isConnecting
                ? "Auto-connecting to Plaid Sandbox with test credentials..."
                : error
                  ? "Failed to connect. Check your Plaid credentials in .env.local."
                  : "Preparing to connect..."}
            </p>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Balance Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {accounts.length} account{accounts.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAvailable.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Latest Transactions</CardTitle>
            <CardDescription>
              Your most recent account activity
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTransactions(accessToken)}
            disabled={isLoadingTransactions}
          >
            {isLoadingTransactions ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 20).map((txn) => {
                const isDebit = txn.amount > 0
                return (
                  <div
                    key={txn.transaction_id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isDebit
                            ? "bg-red-100 dark:bg-red-950/30"
                            : "bg-green-100 dark:bg-green-950/30"
                        }`}
                      >
                        {isDebit ? (
                          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {txn.merchant_name || txn.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {txn.date}
                          </span>
                          {txn.pending && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDebit
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {isDebit ? "-" : "+"}$
                      {Math.abs(txn.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )
              })}
              {transactions.length > 20 && (
                <p className="text-center text-xs text-muted-foreground pt-2">
                  Showing 20 of {transactions.length} transactions
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions yet.</p>
              <p className="text-xs mt-1">
                Transactions may take a few seconds to become available.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fetchTransactions(accessToken)}
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Try again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
