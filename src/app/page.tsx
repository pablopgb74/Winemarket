// src/app/page.tsx
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Wine, Users, Truck, Shield, Star, Sparkles } from "lucide-react"

const features = [
  {
    icon: Wine,
    title: "Expert Curation",
    description: "Monthly selections hand-picked by certified sommeliers with years of experience.",
  },
  {
    icon: Users,
    title: "Meet the Sommeliers",
    description: "Learn the story behind each bottle directly from the experts who chose them.",
  },
  {
    icon: Truck,
    title: "Delivered to Your Door",
    description: "Temperature-controlled shipping to all major US states. Adult signature required.",
  },
  {
    icon: Shield,
    title: "Satisfaction Guaranteed",
    description: "Not happy with a bottle? We'll make it right. That's our Zappos-style promise.",
  },
]

const stats = [
  { value: "50+", label: "Certified Sommeliers" },
  { value: "500+", label: "Unique Selections" },
  { value: "10k+", label: "Happy Members" },
  { value: "98%", label: "Satisfaction Rate" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-wine-50 via-white to-wine-50">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wine-50 text-wine-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Now shipping to 30+ US states</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-wine-950 leading-tight mb-6">
              Wine Curated by
              <br />
              <span className="text-wine-600">World-Class Sommeliers</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-600 mb-10 max-w-2xl mx-auto">
              Monthly boxes of 6 or 12 bottles, hand-selected with personal tasting notes, pairing suggestions, and the story behind every wine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" variant="wine" className="w-full sm:w-auto text-lg px-8 py-4" asChild>
                <Link href="/auth/signin?role=customer">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-4" asChild>
                <Link href="/auth/signin?role=sommelier">Become a Sommelier Partner</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-dark-500 text-sm">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> No commitment</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Cancel anytime</span>
              <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Free shipping on 12-bottle</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-wine-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-wine-950 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-wine-300 mb-2">{stat.value}</div>
                <div className="text-dark-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-wine-950 mb-4">
              Why Wine Marketplace?
            </h2>
            <p className="text-xl text-dark-600 max-w-2xl mx-auto">
              We're not just another wine club. We're a platform where sommeliers share their passion and expertise directly with you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-wine-600 mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-dark-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-wine-950 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center relative">
              <div className="absolute left-1/2 top-10 -translate-x-1/2 w-full h-1 bg-wine-200 hidden md:block" />
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-wine-100 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-wine-600">1</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-wine-950 mb-2">Browse Selections</h3>
              <p className="text-dark-600">Explore monthly curated boxes from sommeliers worldwide. Filter by region, style, price, or sommelier.</p>
            </div>
            <div className="text-center relative">
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-wine-100 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-wine-600">2</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-wine-950 mb-2">Subscribe or Buy Once</h3>
              <p className="text-dark-600">Choose a monthly subscription for the best value, or purchase individual boxes. Flexible, no commitment.</p>
            </div>
            <div className="text-center relative">
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-wine-100 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-wine-600">3</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-wine-950 mb-2">Enjoy & Discover</h3>
              <p className="text-dark-600">Receive temperature-controlled deliveries with tasting notes, pairing guides, and the sommelier's personal story.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-wine-950 text-white">
        <div className="container text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to Discover Your Next Favorite Wine?
          </h2>
          <p className="text-xl text-wine-200 mb-10 max-w-2xl mx-auto">
            Join thousands of wine lovers receiving expertly curated selections every month. Your first box ships free.
          </p>
          <Button size="lg" variant="wine" className="text-lg px-10 py-4" asChild>
            <Link href="/auth/signin?role=customer">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wine-950 text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-serif text-2xl font-bold text-wine-300 mb-4">Wine Marketplace</h3>
              <p className="text-wine-200 max-w-sm">
                Connecting wine lovers with world-class sommeliers. Every bottle tells a story.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-wine-200">
                <li><Link href="/selections" className="hover:text-white">Browse Selections</Link></li>
                <li><Link href="/sommeliers" className="hover:text-white">Meet Sommeliers</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Sommeliers</h4>
              <ul className="space-y-2 text-wine-200">
                <li><Link href="/become-sommelier" className="hover:text-white">Become a Partner</Link></li>
                <li><Link href="/sommelier-dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-wine-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-wine-400 text-sm">&copy; 2024 Wine Marketplace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-wine-400 hover:text-white">Privacy</a>
              <a href="#" className="text-wine-400 hover:text-white">Terms</a>
              <a href="#" className="text-wine-400 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}