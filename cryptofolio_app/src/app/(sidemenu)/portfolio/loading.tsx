import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";


export default function Loading() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px] bg-zinc-800" />
        <Skeleton className="h-4 w-[300px] bg-zinc-800" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 bg-zinc-800 mb-2" />
              <Skeleton className="h-3 w-20 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-zinc-900/50 border-zinc-800 h-[300px]">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-zinc-800" />
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <Skeleton className="h-[200px] w-full bg-zinc-800/50 rounded-lg" />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-zinc-900/50 border-zinc-800 h-[300px]">
          <CardHeader>
            <Skeleton className="h-5 w-32 bg-zinc-800" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
                <Skeleton className="h-4 w-32 bg-zinc-800" />
                <Skeleton className="h-4 w-12 bg-zinc-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
