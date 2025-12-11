import { Link } from 'react-router-dom';
import { ArrowRight, Github, Menu, X, ChevronDown } from 'lucide-react';
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
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <span className="font-bold text-xl text-white">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Folio</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
              <Link to="/login">
                <Button variant="ghost" className="text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Get Started
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-6 space-y-4">
              <a 
                href="#features" 
                className="block text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="block text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#faq" 
                className="block text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-4 space-y-3">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32 lg:py-40">
        {/* Main Headline - Extra Large */}
        <div className="relative mb-8">
          <div className="absolute -left-4 top-0 w-20 h-1 bg-gray-900"></div>
          <div className="absolute -left-4 top-0 w-1 h-8 bg-gray-900"></div>
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-8 leading-[0.95] tracking-tight max-w-6xl italic">
          Folio
        </h1>
        
        <p className="text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight mb-12 max-w-4xl">
          The social platform where developers showcase what they've built—with live, interactive previews.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/register">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-900 text-gray-900 hover:bg-gray-50">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Social Proof */}
        <div className="pt-12 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Github size={18} className="text-gray-900" />
              <span className="font-medium">Open Source</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="font-medium">100% Free</div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="font-medium">Live Interactive Previews</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 md:py-32 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">The Problem</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-12">
              Portfolios are static.<br />
              Demos are scattered.<br />
              Communities lack context.
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Developers spend hours building amazing projects, then struggle to showcase them effectively. 
              Screenshots don't capture interactivity. GitHub READMEs don't show the experience. 
              Deployed links get lost in the noise.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">The Solution</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-12">
              A feed of live, interactive projects
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Folio embeds your projects directly in the feed using iframe previews. 
              Users can interact with your app, explore the interface, and experience your work—all 
              without leaving the platform. If a preview can't load, we fall back to screenshots and a direct link.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mb-20">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">How It Works</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              From Upload to Interaction
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            {/* Step 01 */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-3">01</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upload Your Project</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Add your project title, description, live demo URL, GitHub link, screenshots, and tech stack tags.
              </p>
            </div>

            {/* Step 02 */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-3">02</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Folio Embeds It</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our system attempts to load your project as an interactive iframe preview in the feed.
              </p>
            </div>

            {/* Step 03 */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-3">03</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Users Interact</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Developers can click, scroll, and explore your app directly—or view screenshots if embedding isn't supported.
              </p>
            </div>

            {/* Step 04 */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-3">04</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Engage & Connect</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Others can like, comment, visit your profile, and check out your GitHub repo or live deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern with Dropdowns */}
      <section id="faq" className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">FAQ</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-gray-200 pb-4 hover:border-gray-400 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-start justify-between text-left group py-4"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 pr-8 group-hover:text-gray-600 transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    size={24} 
                    className={`flex-shrink-0 text-gray-500 transition-transform duration-300 mt-1 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-lg text-gray-600 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-12 italic">
            Ready to showcase your work?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Join Folio today and start sharing your projects with a community of developers who appreciate great work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-lg px-8 py-6">
                Create Free Account
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/feed">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-900 text-gray-900 hover:bg-gray-50">
                Browse Projects
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            No credit card required • Free forever • Open source
          </p>
        </div>
      </section>

      {/* Footer - Dark Theme */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="font-bold text-lg text-gray-900">F</span>
                </div>
                <p className="text-2xl font-bold">Folio</p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The social platform for developers to showcase interactive projects.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Product</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-white transition-colors">How It Works</a>
                <a href="#faq" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Account</h4>
              <div className="space-y-3">
                <Link to="/register" className="block text-gray-400 hover:text-white transition-colors">Sign Up</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">Sign In</Link>
                <Link to="/feed" className="block text-gray-400 hover:text-white transition-colors">Browse Feed</Link>
              </div>
            </div>

            {/* Project */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Project</h4>
              <div className="space-y-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm text-gray-500">
              © 2025 Folio. A portfolio project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}