import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserX } from 'lucide-react'

export default function ProfileNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <UserX className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-slate-400 mb-6">
            This profile doesn&apos;t exist or may have been removed.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/signup">Create Your Own Card</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
