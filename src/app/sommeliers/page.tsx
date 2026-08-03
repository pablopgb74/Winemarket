// src/app/sommeliers/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Wine, Users, Star, Award, MapPin, Instagram, Twitter, ExternalLink } from "lucide-react"
import Link from "next/link"

const sommeliers = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Master Sommelier",
    headline: "15 years curating exceptional wine programs for 3-Michelin restaurants",
    avatar: "/avatars/sarah.jpg",
    certifications: ["MS", "CMS", "WSET Diploma"],
    specialties: ["Jura", "Oxidative Whites", "Food Pairing"],
    yearsExperience: 15,
    languages: ["EN", "FR", "ES"],
    instagram: "@sarahchenwine",
    twitter: "@sarahchenms",
    website: "sarahchenwine.com",
    selectionsCount: 24,
    subscribersCount: 1247,
    rating: 4.9,
    isVerified: true,
    isActive: true,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Certified Sommelier",
    headline: "Burgundy specialist with a passion for discoverer hidden village gems",
    avatar: "/avatars/marcus.jpg",
    certifications: ["CMS", "WSET Level 3", "Burgundy Master"],
    specialties: ["White Burgundy", "Chardonnay", "Premier Cru"],
    yearsExperience: 10,
    languages: ["EN", "FR"],
    instagram: "@marcusjohnsonwine",
    twitter: "",
    website: "",
    selectionsCount: 18,
    subscribersCount: 892,
    rating: 4.8,
    isVerified: true,
    isActive: true,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "WSET Level 3",
    headline: "Natural wine advocate bringing low-intervention gems to your table",
    avatar: "/avatars/elena.jpg",
    certifications: ["WSET Level 3", "Natural Wine Certification"],
    specialties: ["Natural Wines", "Low ABV", "Orange Wines"],
    yearsExperience: 8,
    languages: ["EN", "ES", "IT"],
    instagram: "@elenarodriguezwine",
    twitter: "@elenanaturalwine",
    website: "elenawine.com",
    selectionsCount: 12,
    subscribersCount: 567,
    rating: 4.7,
    isVerified: true,
    isActive: true,
  },
  {
    id: 4,
    name: "David Park",
    title: "Master Sommelier",
    headline: "Champagne & sparkling wine expert, former head sommelier at Per Se",
    avatar: "/avatars/david.jpg",
    certifications: ["MS", "Champagne Master", "CMS"],
    specialties: ["Champagne", "Sparkling", "Grower Champagne"],
    yearsExperience: 20,
    languages: ["EN", "FR", "KR"],
    instagram: "@davidparksomm",
    twitter: "",
    website: "davidparkwine.com",
    selectionsCount: 31,
    subscribersCount: 2156,
    rating: 4.9,
    isVerified: true,
    isActive: true,
  },
  {
    id: 5,
    name: "James Wilson",
    title: "Certified Sommelier",
    headline: "Italian wine specialist focusing on native varieties and traditional producers",
    avatar: "/avatars/james.jpg",
    certifications: ["CMS", "Italian Wine Scholar"],
    specialties: ["Barolo", "Brunello", "Native Italian Varieties"],
    yearsExperience: 12,
    languages: ["EN", "IT"],
    instagram: "@jameswilsonwine",
    twitter: "@jameswilsoncms",
    website: "",
    selectionsCount: 15,
    subscribersCount: 423,
    rating: 4.6,
    isVerified: true,
    isActive: true,
  },
  {
    id: 6,
    name: "Lisa Thompson",
    title: "WSET Diploma",
    headline: "West Coast specialist highlighting sustainable and biodynamic producers",
    avatar: "/avatars/lisa.jpg",
    certifications: ["WSET Diploma", "Sustainable Winegrowing NZ"],
    specialties: ["Oregon Pinot", "CA Chardonnay", "Biodynamic"],
    yearsExperience: 9,
    languages: ["EN"],
    instagram: "@lisathompsonwine",
    twitter: "",
    website: "lisathompsonwine.com",
    selectionsCount: 11,
    subscribersCount: 389,
    rating: 4.8,
    isVerified: false,
    isActive: true,
  },
]

export default function SommeliersPage() {
  return (
    <div className="min-h-screen bg-dark-50">
      <section className="bg-wine-950 text-white py-20">
        <div className="container text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Meet Our Sommeliers
          </h1>
          <p className="text-xl text-wine-200 max-w-2xl mx-auto">
            Certified experts sharing their lifetime of wine knowledge. Each sommelier brings a unique perspective and curated selections you won't find anywhere else.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sommeliers.map((sommelier) => (
              <Card key={sommelier.id} className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-wine-100 to-wine-200">
                  <div className="absolute inset-0 flex items-center justify-center text-wine-300">
                    <Wine className="w-16 h-16" />
                  </div>
                  {sommelier.isVerified && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <p className="text-sm font-medium text-dark-900">{sommelier.title}</p>
                  </div>
                  <CardTitle className="text-lg">{sommelier.name}</CardTitle>
                  <p className="text-sm text-dark-600 line-clamp-2 mt-2">{sommelier.headline}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {sommelier.certifications.map((cert) => (
                      <span key={cert} className="px-2 py-1 text-xs bg-wine-50 text-wine-700 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sommelier.specialties.map((specialty) => (
                      <span key={specialty} className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-wine-950">{sommelier.selectionsCount}</p>
                      <p className="text-xs text-dark-500">Selections</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-wine-950">{sommelier.subscribersCount.toLocaleString()}</p>
                      <p className="text-xs text-dark-500">Subscribers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-wine-950 flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {sommelier.rating}
                      </p>
                      <p className="text-xs text-dark-500">Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-500 pt-2 border-t">
                    <MapPin className="w-4 h-4" />
                    <span>{sommelier.yearsExperience} years exp</span>
                    <span className="text-dark-300">•</span>
                    <span>{sommelier.languages.join(", ")}</span>
                  </div>
                  {sommelier.instagram && (
                    <div className="flex items-center gap-2 pt-2">
                      <a href={`https://instagram.com/${sommelier.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-wine-600 hover:text-wine-800">
                        <Instagram className="w-4 h-4" />
                        {sommelier.instagram}
                      </a>
                      {sommelier.twitter && (
                        <a href={`https://twitter.com/${sommelier.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-wine-600 hover:text-wine-800">
                          <Twitter className="w-4 h-4" />
                          {sommelier.twitter}
                        </a>
                      )}
                      {sommelier.website && (
                        <a href={`https://${sommelier.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-wine-600 hover:text-wine-800">
                          <ExternalLink className="w-4 h-4" />
                          {sommelier.website}
                        </a>
                      )}
                    </div>
                  )}
                  <Button variant="wine" className="w-full" asChild>
                    <Link href={`/sommeliers/${sommelier.id}`}>View Profile & Selections</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More Sommeliers</Button>
          </div>
        </div>
      </section>

      {/* Become a Sommelier CTA */}
      <section className="bg-wine-950 text-white py-16 border-t border-wine-800">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-4">Are You a Certified Sommelier?</h2>
          <p className="text-xl text-wine-200 mb-8">
            Join our community of expert curators. Share your passion, build your following, and earn recurring revenue from your monthly selections.
          </p>
          <Button variant="wine" size="lg" asChild>
            <Link href="/auth/signin?role=sommelier">Apply to Become a Partner</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

// Need to import CheckCircle
import { CheckCircle } from "lucide-react"