import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Monitor, Users, MessageSquare, Github, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How does the live preview work?",
      answer: "Folio attempts to embed your deployed project as an interactive iframe directly in the feed. Users can click, scroll, and interact with your app without leaving the platform. If embedding isn't supported (due to X-Frame-Options or CSP headers), we automatically fall back to displaying your screenshots and a direct link to your live site."
    },
    {
      question: "What projects can I showcase?",
      answer: "Any web-based project with a live URL! This includes React apps, Vue projects, static sites, full-stack applications, portfolios, games, tools, and more. As long as it's deployed and accessible via a URL, you can share it on Folio."
    },
    {
      question: "Is Folio free to use?",
      answer: "Yes! Folio is completely free to use. Create an account, upload unlimited projects, interact with the community, and showcase your work without any cost."
    },
    {
      question: "Can I edit my projects after posting?",
      answer: "Absolutely. You can edit your project details, update screenshots, change the live demo URL, modify tech stack tags, and update descriptions at any time from your profile."
    },
    {
      question: "How do I get my project featured?",
      answer: "Projects that receive significant engagement (likes, comments, views) and demonstrate high-quality work are automatically surfaced in the Trending section. Focus on creating great projects and engaging with the community!"
    },
    {
      question: "What tech stack does Folio use?",
      answer: "Folio is built with React + Vite on the frontend, Spring Boot + PostgreSQL on the backend, with AWS S3 for media storage. It's a full-stack project showcasing modern web development practices."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                <span className="font-serif font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-serif font-bold">Folio</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm uppercase tracking-widest hover:underline transition-fast font-mono">
                Features
              </a>
              <a href="#how-it-works" className="text-sm uppercase tracking-widest hover:underline transition-fast font-mono">
                How It Works
              </a>
              <a href="#faq" className="text-sm uppercase tracking-widest hover:underline transition-fast font-mono">
                FAQ
              </a>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Get Started
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden w-10 h-10 border-2 border-black flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t-2 border-black py-6 space-y-4">
              <a 
                href="#features" 
                className="block text-sm uppercase tracking-widest font-mono hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="block text-sm uppercase tracking-widest font-mono hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#faq" 
                className="block text-sm uppercase tracking-widest font-mono hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-4 space-y-3">
                <Link to="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
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
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-16 border-t border-black/20">
            <p className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-6">
              Built for developers, by developers
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-2">
                <Github size={20} strokeWidth={1.5} />
                <span className="text-sm font-mono">Open Source</span>
              </div>
              <div className="h-4 w-[2px] bg-black/20" />
              <div>
                <span className="text-sm font-mono">100% Free</span>
              </div>
              <div className="h-4 w-[2px] bg-black/20" />
              <div>
                <span className="text-sm font-mono">Live Previews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-b-4 border-black" id="features">
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

      {/* FAQ Section */}
      <section id="faq" className="border-b-4 border-black">
        <div className="relative">
          <div className="absolute inset-0 texture-diagonal pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto px-6 lg:px-12 py-24 md:py-32">
            <div className="mb-16">
              <p className="text-xs uppercase tracking-widest font-mono mb-4">FAQ</p>
              <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-2 border-black">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-black hover:text-white transition-colors duration-100"
                  >
                    <h3 className="font-serif font-bold text-xl pr-4">{faq.question}</h3>
                    <ChevronDown 
                      size={24} 
                      strokeWidth={2}
                      className={`flex-shrink-0 transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 border-t-2 border-black pt-6">
                      <p className="text-lg leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b-4 border-black">
        <div className="relative">
          <div className="absolute inset-0 texture-grid pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto px-6 lg:px-12 py-24 md:py-32 text-center">
            <h2 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl italic leading-tight tracking-tight mb-8">
              Ready to showcase your work?
            </h2>
            
            <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Join Folio today and start sharing your projects with a community of developers 
              who appreciate great work.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/app/feed">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Projects
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted-foreground font-mono">
              No credit card required • Free forever • Open source
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
                  <span className="font-serif font-bold text-lg">F</span>
                </div>
                <p className="font-serif font-bold text-2xl">Folio</p>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The social platform for developers to showcase interactive projects.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono mb-4">Product</h4>
                <div className="space-y-2">
                  <a href="#features" className="block text-sm hover:underline">Features</a>
                  <a href="#how-it-works" className="block text-sm hover:underline">How It Works</a>
                  <a href="#faq" className="block text-sm hover:underline">FAQ</a>
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono mb-4">Account</h4>
                <div className="space-y-2">
                  <Link to="/register" className="block text-sm hover:underline">Sign Up</Link>
                  <Link to="/login" className="block text-sm hover:underline">Login</Link>
                  <Link to="/app/feed" className="block text-sm hover:underline">Browse Feed</Link>
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono mb-4">Project</h4>
                <div className="space-y-2">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">
                    GitHub
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">
                    Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t-2 border-black pt-8">
            <p className="text-sm text-muted-foreground text-center font-mono">
              © 2025 Folio. A portfolio project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}