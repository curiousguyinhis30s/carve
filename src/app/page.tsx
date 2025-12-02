import Link from 'next/link'
import {
  Smartphone,
  QrCode,
  Users,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Smartphone,
    title: 'Tap to Connect',
    description: 'Share your profile instantly with a simple NFC tap. Works with any smartphone.',
  },
  {
    icon: QrCode,
    title: 'QR Code Fallback',
    description: 'No NFC? No problem. Every profile includes a scannable QR code.',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Manage your entire team\'s digital cards from one dashboard.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track views, taps, and engagement. Know who\'s connecting with you.',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Update your info once, and it syncs everywhere. No reprinting.',
  },
  {
    icon: Shield,
    title: 'Lead Capture',
    description: 'Collect contact info from people you meet. Sync to your CRM.',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for individuals',
    features: [
      '1 digital profile',
      'QR code sharing',
      'Basic analytics',
      'vCard download',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For professionals',
    features: [
      '3 profiles',
      'NFC card included',
      'Lead capture forms',
      'Advanced analytics',
      'Custom themes',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/user/month',
    description: 'For growing teams',
    features: [
      'Unlimited profiles',
      'Team dashboard',
      'CRM integrations',
      'Custom branding',
      'SSO authentication',
      'Bulk card orders',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Hendshake
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-400 hover:text-white transition">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-400 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition">
              Login
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
            The Future of Networking
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Digital Identity,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              One Tap Away
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Replace paper business cards with smart NFC cards. Share your contact info,
            social links, and portfolio instantly. Update anytime, from anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8" asChild>
              <Link href="/signup">
                Create Your Card <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Card Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
            <Card className="relative bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-6">
                  JD
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">John Doe</h3>
                <p className="text-slate-400 mb-1">Product Designer</p>
                <Badge variant="secondary" className="bg-white/10 text-slate-300">
                  Acme Inc.
                </Badge>
                <p className="text-slate-500 text-sm mt-4 mb-6">
                  Creating beautiful digital experiences. Let&apos;s connect!
                </p>
                <div className="space-y-3">
                  {['Email', 'LinkedIn', 'Portfolio', 'Schedule Call'].map((link) => (
                    <div
                      key={link}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    >
                      {link}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Network Smarter
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From NFC cards to analytics, we&apos;ve got you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-white/5 border-white/10 ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-slate-400 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-300">
                        <Check className="h-5 w-5 text-green-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    asChild
                  >
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Upgrade Your Networking?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join thousands of professionals who&apos;ve already made the switch.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8" asChild>
            <Link href="/signup">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold text-white">Hendshake</div>
            <div className="flex gap-8 text-slate-400">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </div>
            <p className="text-slate-500">
              &copy; {new Date().getFullYear()} Hendshake. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
