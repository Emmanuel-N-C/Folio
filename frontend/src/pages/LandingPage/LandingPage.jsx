import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Monitor, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-2xl font-bold font-serif">
              Folio
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm uppercase tracking-widest hover:underline transition-fast">
                Features
              </a>
              <a href="#how-it-works" className="text-sm uppercase tracking-widest hover:underline transition-fast">
                How It Works
              </a>
              <a href="#tech-stack" className="text-sm uppercase tracking-widest hover:underline transition-fast">
                Tech Stack
              </a>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <a href="#join">
                <Button size="sm">
                  Join Waitlist
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative border-b-4 border-black">
        <div className="absolute inset-0 texture-lines pointer-events-none" />
        <div className="absolute inset-0 texture-noise pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32 lg:py-40">
          {/* Decorative element */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-24 h-[2px] bg-black" />
            <div className="w-4 h-4 border-2 border-black" />
          </div>

          <h1 className="font-serif font-bold tracking-tighter leading-none mb-8">
            <span className="block text-6xl md:text-8xl lg:text-9xl italic">Folio</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed max-w-4xl mb-12">
            The social platform where developers showcase what they've built—with live, interactive previews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#join">
              <Button size="lg" className="w-full sm:w-auto">
                Join Waitlist
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest font-mono mb-4">The Problem</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
              Portfolios are static.<br />
              Demos are scattered.<br />
              Communities lack context.
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              Developers spend hours building amazing projects, then struggle to showcase them effectively. 
              Screenshots don't capture interactivity. GitHub READMEs don't show the experience. 
              Deployed links get lost in the noise.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="border-b-4 border-black">
        <div className="relative">
          <div className="absolute inset-0 texture-grid pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
            <div className="mb-16">
              <p className="text-xs uppercase tracking-widest font-mono mb-4">The Solution</p>
              <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                A feed of live, interactive projects
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-lg md:text-xl leading-relaxed">
                Folio embeds your projects directly in the feed using iframe previews. 
                Users can interact with your app, explore the interface, and experience your work—all 
                without leaving the platform. If a preview can't load, we fall back to screenshots and a direct link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest font-mono mb-4">How It Works</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4">
              From Upload to Interaction
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 01 */}
            <div className="group border-2 border-black p-8 transition-colors duration-100 hover:bg-black hover:text-white">
              <div className="mb-6">
                <div className="w-12 h-12 border-2 border-current flex items-center justify-center mb-4">
                  <Upload size={24} strokeWidth={1.5} />
                </div>
                <p className="text-xs uppercase tracking-widest font-mono mb-2">01</p>
                <h3 className="font-serif font-bold text-2xl mb-4">Upload Your Project</h3>
              </div>
              <p className="leading-relaxed">
                Add your project title, description, live demo URL, GitHub link, screenshots, and tech stack tags.
              </p>
            </div>

            {/* Step 02 */}
            <div className="group border-2 border-black p-8 transition-colors duration-100 hover:bg-black hover:text-white">
              <div className="mb-6">
                <div className="w-12 h-12 border-2 border-current flex items-center justify-center mb-4">
                  <Monitor size={24} strokeWidth={1.5} />
                </div>
                <p className="text-xs uppercase tracking-widest font-mono mb-2">02</p>
                <h3 className="font-serif font-bold text-2xl mb-4">Folio Embeds It</h3>
              </div>
              <p className="leading-relaxed">
                Our system attempts to load your project as an interactive iframe preview in the feed.
              </p>
            </div>

            {/* Step 03 */}
            <div className="group border-2 border-black p-8 transition-colors duration-100 hover:bg-black hover:text-white">
              <div className="mb-6">
                <div className="w-12 h-12 border-2 border-current flex items-center justify-center mb-4">
                  <Users size={24} strokeWidth={1.5} />
                </div>
                <p className="text-xs uppercase tracking-widest font-mono mb-2">03</p>
                <h3 className="font-serif font-bold text-2xl mb-4">Users Interact</h3>
              </div>
              <p className="leading-relaxed">
                Developers can click, scroll, and explore your app directly—or view screenshots if embedding isn't supported.
              </p>
            </div>

            {/* Step 04 */}
            <div className="group border-2 border-black p-8 transition-colors duration-100 hover:bg-black hover:text-white">
              <div className="mb-6">
                <div className="w-12 h-12 border-2 border-current flex items-center justify-center mb-4">
                  <MessageSquare size={24} strokeWidth={1.5} />
                </div>
                <p className="text-xs uppercase tracking-widest font-mono mb-2">04</p>
                <h3 className="font-serif font-bold text-2xl mb-4">Engage & Connect</h3>
              </div>
              <p className="leading-relaxed">
                Others can like, comment, visit your profile, and check out your GitHub repo or live deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Inverted) */}
      <section className="bg-black text-white border-b-4 border-black relative">
        <div className="absolute inset-0 texture-lines-inverted pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center md:text-left">
              <p className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-4">100%</p>
              <p className="text-lg uppercase tracking-widest font-mono">Interactive</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-4">Zero</p>
              <p className="text-lg uppercase tracking-widest font-mono">Context Loss</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-4">Live</p>
              <p className="text-lg uppercase tracking-widest font-mono">Previews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Waitlist Section */}
      <section id="join" className="border-b-4 border-black">
        <div className="relative">
          <div className="absolute inset-0 texture-diagonal pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto px-6 lg:px-12 py-24 md:py-32 text-center">
            <h2 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl italic leading-tight tracking-tight mb-8">
              Ready to showcase your work?
            </h2>
            
            <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Folio is currently in development. Join the waitlist to be notified when we launch 
              and get early access to the platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-12 text-base"
              />
              <Button size="lg" className="sm:w-auto">
                Join Waitlist
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="font-serif font-bold text-2xl mb-2">Folio</p>
              <p className="text-sm text-muted-foreground">© 2025 Folio. A portfolio project.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <a href="#features" className="text-sm uppercase tracking-widest hover:underline">
                Features
              </a>
              <a href="#how-it-works" className="text-sm uppercase tracking-widest hover:underline">
                How It Works
              </a>
              <a href="#tech-stack" className="text-sm uppercase tracking-widest hover:underline">
                Tech
              </a>
              <a href="https://github.com" className="text-sm uppercase tracking-widest hover:underline">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}