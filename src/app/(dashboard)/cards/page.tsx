'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2,
  Plus,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  QrCode,
  Smartphone,
  Palette,
  Wifi,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Profile, Card as CardType } from '@/types/database'

interface CardDesign {
  id: string
  name: string
  price: number
  image: string
  description: string
  material: string
  popular?: boolean
}

const cardDesigns: CardDesign[] = [
  {
    id: 'classic-black',
    name: 'Classic Black',
    price: 15,
    image: '/cards/classic-black.png',
    description: 'Elegant matte black PVC card with NFC chip',
    material: 'PVC',
    popular: true,
  },
  {
    id: 'classic-white',
    name: 'Classic White',
    price: 15,
    image: '/cards/classic-white.png',
    description: 'Clean matte white PVC card with NFC chip',
    material: 'PVC',
  },
  {
    id: 'metal-black',
    name: 'Metal Black',
    price: 45,
    image: '/cards/metal-black.png',
    description: 'Premium black metal card with engraved details',
    material: 'Metal',
    popular: true,
  },
  {
    id: 'metal-silver',
    name: 'Metal Silver',
    price: 45,
    image: '/cards/metal-silver.png',
    description: 'Premium brushed silver metal card',
    material: 'Metal',
  },
  {
    id: 'wood',
    name: 'Bamboo Wood',
    price: 35,
    image: '/cards/wood.png',
    description: 'Eco-friendly bamboo card with laser engraving',
    material: 'Bamboo',
  },
  {
    id: 'transparent',
    name: 'Transparent',
    price: 25,
    image: '/cards/transparent.png',
    description: 'Modern clear acrylic card with frosted details',
    material: 'Acrylic',
  },
]

export default function CardsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cards, setCards] = useState<CardType[]>([])
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<CardDesign | null>(null)
  const [ordering, setOrdering] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })

  const supabase = createClient()

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profileData } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single()

      if (profileData) {
        const p = profileData as Profile
        setProfile(p)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: cardsData } = await (supabase as any)
          .from('cards')
          .select('*')
          .eq('profile_id', p.id)
          .order('created_at', { ascending: false })

        if (cardsData) {
          setCards(cardsData as CardType[])
        }
      }
    } catch (error) {
      console.error('Error loading cards:', error)
      toast.error('Failed to load cards')
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!profile || !selectedDesign) return

    // Validate shipping info
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
      toast.error('Please fill in all shipping details')
      return
    }

    setOrdering(true)

    try {
      // Create card order (in production, integrate with Stripe + fulfillment)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('cards')
        .insert({
          profile_id: profile.id,
          status: 'pending',
          design_id: selectedDesign.id,
          shipping_address: shippingInfo,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Order placed! We\'ll notify you when it ships.')
      setCards([data as CardType, ...cards])
      setOrderDialogOpen(false)
      setSelectedDesign(null)
      setShippingInfo({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      })
    } catch (error) {
      console.error('Error ordering card:', error)
      toast.error('Failed to place order')
    } finally {
      setOrdering(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'printed':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'printed':
        return 'bg-blue-500/20 text-blue-500'
      case 'shipped':
        return 'bg-purple-500/20 text-purple-500'
      case 'delivered':
        return 'bg-green-500/20 text-green-500'
      default:
        return 'bg-slate-500/20 text-slate-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">NFC Cards</h1>
          <p className="text-slate-400">Order and manage your physical NFC cards</p>
        </div>
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Order Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Order NFC Card</DialogTitle>
              <DialogDescription className="text-slate-400">
                Choose a design and enter shipping details
              </DialogDescription>
            </DialogHeader>

            {!selectedDesign ? (
              <div className="grid gap-4 md:grid-cols-3">
                {cardDesigns.map((design) => (
                  <Card
                    key={design.id}
                    className={`cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 bg-white/5 border-white/10`}
                    onClick={() => setSelectedDesign(design)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-[1.586/1] bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mb-3 flex items-center justify-center">
                        <CreditCard className="h-12 w-12 text-white/50" />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">{design.name}</h3>
                        {design.popular && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{design.material}</p>
                      <p className="text-lg font-bold text-white">${design.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Design */}
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-32 aspect-[1.586/1] bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-white/50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{selectedDesign.name}</h3>
                    <p className="text-sm text-slate-400">{selectedDesign.description}</p>
                    <p className="text-lg font-bold text-white mt-2">${selectedDesign.price}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDesign(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Change
                  </Button>
                </div>

                {/* Shipping Form */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-slate-300">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address" className="text-slate-300">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-300">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-slate-300">State</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-slate-300">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Button */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedDesign(null)
                      setOrderDialogOpen(false)
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {ordering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order - ${selectedDesign.price}</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/10">
        <CardContent className="py-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Palette className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-medium text-white mb-1">Choose Design</h3>
              <p className="text-sm text-slate-400">Pick from our premium card options</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-medium text-white mb-1">We Print & Program</h3>
              <p className="text-sm text-slate-400">Cards are customized with your profile</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-medium text-white mb-1">Fast Shipping</h3>
              <p className="text-sm text-slate-400">Delivered to your door in days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wifi className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-medium text-white mb-1">Tap & Share</h3>
              <p className="text-sm text-slate-400">Works with any NFC-enabled phone</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Cards */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
            All Cards ({cards.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-blue-600">
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600">
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {cards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Card key={card.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="aspect-[1.586/1] bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mb-4 flex items-center justify-center relative">
                      <CreditCard className="h-16 w-16 text-white/30" />
                      <div className="absolute top-2 right-2">
                        <Wifi className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">
                        {cardDesigns.find(d => d.id === card.design_id)?.name || 'Custom Card'}
                      </h3>
                      <Badge className={getStatusColor(card.status)}>
                        {getStatusIcon(card.status)}
                        <span className="ml-1 capitalize">{card.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      Ordered {new Date(card.created_at).toLocaleDateString()}
                    </p>
                    {card.nfc_uid && (
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        NFC: {card.nfc_uid}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No cards yet</h3>
                <p className="text-slate-400 mb-4">
                  Order your first NFC card to start sharing your profile with a tap
                </p>
                <Button
                  onClick={() => setOrderDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Order Your First Card
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {cards.filter(c => c.status === 'delivered').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.filter(c => c.status === 'delivered').map((card) => (
                <Card key={card.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="aspect-[1.586/1] bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mb-4 flex items-center justify-center">
                      <CreditCard className="h-16 w-16 text-white/30" />
                    </div>
                    <h3 className="font-medium text-white mb-2">
                      {cardDesigns.find(d => d.id === card.design_id)?.name || 'Custom Card'}
                    </h3>
                    <Badge className="bg-green-500/20 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No active cards</h3>
                <p className="text-slate-400">
                  Cards become active once they&apos;re delivered
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {cards.filter(c => ['pending', 'printed', 'shipped'].includes(c.status)).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.filter(c => ['pending', 'printed', 'shipped'].includes(c.status)).map((card) => (
                <Card key={card.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="aspect-[1.586/1] bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mb-4 flex items-center justify-center">
                      <CreditCard className="h-16 w-16 text-white/30" />
                    </div>
                    <h3 className="font-medium text-white mb-2">
                      {cardDesigns.find(d => d.id === card.design_id)?.name || 'Custom Card'}
                    </h3>
                    <Badge className={getStatusColor(card.status)}>
                      {getStatusIcon(card.status)}
                      <span className="ml-1 capitalize">{card.status}</span>
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No pending orders</h3>
                <p className="text-slate-400">
                  All your cards have been delivered
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* NFC Info */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            How NFC Cards Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-400">
          <p>
            NFC (Near Field Communication) cards contain a small chip that stores your profile URL.
            When someone taps their phone on your card, it automatically opens your profile.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">iPhone</h4>
                <p className="text-sm">Hold the top of the phone near the card</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Android</h4>
                <p className="text-sm">Hold the center-back of the phone near the card</p>
              </div>
            </div>
          </div>
          <p className="text-sm">
            <strong className="text-white">No app required</strong> - recipients just tap and go!
            Your profile opens instantly in their browser.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
