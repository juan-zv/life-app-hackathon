import { promises as fs } from 'fs';
import path from 'path';
import Link from "next/link"
import { ExternalLink, Newspaper, CalendarDays } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type NewsItem = {
  id: number
  title: string
  description: string
  source: string
  url: string
  date: string
}

async function getNews() {
  const filePath = path.join(process.cwd(), 'public', 'news.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents) as NewsItem[];
  // If parsing fails or is empty, return empty array
  if (!Array.isArray(data)) {
      return []
  }
  return data
}

export async function Dashboard() {
  const news = await getNews()

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Today's Briefing</h2>
          <p className="text-muted-foreground mt-1">Stay updated with the latest headlines.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            <CalendarDays className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>
      
      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary">
            <div className="flex flex-col sm:flex-row">
                <div className="flex-1 p-6">
                    <div className="flex items-center justify-between gap-4 mb-2">
                         <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                            <Newspaper className="h-4 w-4" />
                            {item.source}
                         </div>
                         <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                        <Link href={item.url} target="_blank" className="hover:underline decoration-2 underline-offset-4">
                            {item.title}
                        </Link>
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                    </p>
                    
                     <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" asChild className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                           <Link href={item.url} target="_blank">
                              Read Full Story <ExternalLink className="h-3 w-3" />
                           </Link>
                        </Button>
                     </div>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}