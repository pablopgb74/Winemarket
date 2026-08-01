// src/app/selections/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wine, Users, Star, MapPin, Calendar, Truck } from "lucide-react"
import Link from "next/link"

const selections = [
  {
    id: 1,
    title: "October 2024: Hidden Gems from Jura",
    sommelier: "Sarah Chen, MS",
    sommelierAvatar: "/avatars/sarah.jpg",
    description: "Discover the mysterious wines of Jura - oxidative whites, light reds, and the legendary Vin Jaune. Six bottles that showcase why this tiny region captivates sommeliers worldwide.",
    theme: "Oxidative & Unique",
    boxSize: "6-bottle",
    price: 150,
    rating: 4.9,
    subscribers: 45,
    shipsAt: "2024-10-15",
    tags: ["Natural", "Oxidative", "Food-friendly"],
  },
  {
    id: 2,
    title: "September 2024: White Burgundy Under $50",
    sommelier: "Marcus Johnson, CMS",
    sommelierAvatar: "/avatars/marcus.jpg",
    description: "Premier and Village-level white Burgundies that punch way above their weight. Chardonnay lovers, this is your monthly pilgrimage.",
    theme: "Classic Burgundy",
    boxSize: "6-bottle",
    price: 180,
    rating: 4.8,
    subscribers: 62,
    shipsAt: "2024-09-15",
    tags: ["Chardonnay", "Age-worthy", "Premier Cru"],
  },
  {
    id: 3,
    title: "November 2024: Natural Reds for Thanksgiving",
    sommelier: "Elena Rodriguez, WSET 3",
    sommelierAvatar: "/avatars/elena.jpg",
    description: "Low-intervention reds that shine alongside turkey, stuffing, and cranberry sauce. Light-chilled, high-acid, maximum pleasure.",
    theme: "Holiday Pairing",
    boxSize: "12-bottle",
    price: 280,
    rating: 4.7,
    subscribers: 38,
    shipsAt: "2024-11-12",
    tags: ["Natural", "Low ABV", "Versatile"],
  },
  {
    id: 4,
    title: "December 2024: Holiday Sparkling Collection",
    sommelier: "David Park, MS",
    sommelierAvatar: "/avatars/david.jpg",
    description: "From grower Champagne to Pét-Nat, a tour of the world's most celebratory bubbles. Perfect for gifting or your own festivities.",
    theme: "Sparkling & Celebration",
    boxSize: "6-bottle",
    price: 220,
    rating: 4.9,
    subscribers: 51,
    shipsAt: "2024-12-10",
    tags: ["Champagne", "Pét-Nat", "Gift-ready"],
  },
]

export default function SelectionsPage() {
  return (
    <div className="min-h-screen bg-dark-50">
      <section className="bg-wine-950 text-white py-20">
        <div className="container text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            This Month's Curated Selections
          </h1>
          <p className="text-xl text-wine-200 max-w-2xl mx-auto">
            Hand-picked by certified sommeliers. Each box tells a story through six or twelve exceptional bottles.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {selections.map((selection) => (
              <Card key={selection.id} className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-wine-100 to-wine-200">
                  <div className="absolute inset-0 flex items-center justify-center text-wine-300">
                    <Wine className="w-16 h-16" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                    <span className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-full",
                      selection.boxSize === "6-bottle" && "bg-white/90 text-dark-900",
                      selection.boxSize === "12-bottle" && "bg-wine-900 text-white"
                    )}>
                      {selection.boxSize}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white/90 text-dark-900">
                      {selection.theme}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-wine-100 flex items-center justify-center">
                      <Wine className="w-5 h-5 text-wine-600" />
                    </div>
                    <p className="text-sm font-medium text-dark-900">{selection.sommelier}</p>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{selection.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-dark-600 text-sm mb-4 line-clamp-3 flex-1">{selection.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selection.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-wine-50 text-wine-700 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-dark-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {selection.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selection.subscribers} subscribers
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-wine-950">${selection.price}</p>
                      <p className="text-xs text-dark-500">/month</p>
                    </div>
                    <Button variant="wine" size="sm" asChild>
                      <Link href={`/selections/${selection.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More Selections</Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 border-t border-dark-200">
        <div className="container">
          <h2 className="font-serif text-3xl font-bold text-wine-950 text-center mb-12">
            How Subscriptions Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-wine-100 rounded-full flex items-center justify-center">
                <Wine className="w-8 h-8 text-wine-600" />
              </div>
              <h3 className="font-semibold text-lg text-wine-950 mb-2">Choose Your Selection</h3>
              <p className="text-dark-600">Browse monthly curated boxes from sommeliers worldwide. Filter by region, style, or price.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-wine-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-wine-600" />
              </div>
              <h3 className="font-semibold text-lg text-wine-950 mb-2">Subscribe or Buy Once</h3>
              <p className="text-dark-600">Monthly subscription for the best value, or purchase individual boxes. Cancel anytime.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-wine-100 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-wine-600" />
              </div>
              <h3 className="font-semibold text-lg text-wine-950 mb-2">Receive & Enjoy</h3>
              <p className="text-dark-600">Temperature-controlled delivery with tasting notes, pairing guides, and sommelier stories.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}