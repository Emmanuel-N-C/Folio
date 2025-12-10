import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Monitor, Users, MessageSquare, Github, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
                <Button variant="ghost" size="sm" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all">
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
            <div className="md:hidden border-t border-gray-200 py-6 space-y-4 animate-in fade-in slide-in-from-top">
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
                  <Button variant="outline" size="sm" className="w-full rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button size="sm" className="w-full rounded-full bg-gray-900 hover:bg-gray-800">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-60" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28 lg:py-36">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Built for developers, by developers</span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Showcase what you've <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">built</span>—with live previews.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              The social platform where developers share interactive projects. No static screenshots. No dead links. Just pure, working demos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base">
                  Get Started Free
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base border-gray-300 hover:bg-gray-50">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
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
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-28 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              Portfolios are static.<br />
              Demos are scattered.<br />
              <span className="text-gray-400">Communities lack context.</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Developers spend hours building amazing projects, then struggle to showcase them effectively. 
              Screenshots don't capture interactivity. GitHub READMEs don't show the experience. 
              Deployed links get lost in the noise.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">The Solution</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              A feed of <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">live, interactive</span> projects
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Folio embeds your projects directly in the feed using iframe previews. 
              Users can interact with your app, explore the interface, and experience your work—all 
              without leaving the platform. If a preview can't load, we fall back to screenshots and a direct link.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              From upload to interaction in <span className="text-gray-400">4 steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload size={24} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Step 01</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Project</h3>
              <p className="text-gray-600 leading-relaxed">
                Add your project title, description, live demo URL, GitHub link, screenshots, and tech stack tags.
              </p>
            </div>

            {/* Step 02 */}
            <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Monitor size={24} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Step 02</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Folio Embeds It</h3>
              <p className="text-gray-600 leading-relaxed">
                Our system attempts to load your project as an interactive iframe preview in the feed.
              </p>
            </div>

            {/* Step 03 */}
            <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Step 03</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Users Interact</h3>
              <p className="text-gray-600 leading-relaxed">
                Developers can click, scroll, and explore your app directly—or view screenshots if embedding isn't supported.
              </p>
            </div>

            {/* Step 04 */}
            <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={24} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Step 04</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Engage & Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Others can like, comment, visit your profile, and check out your GitHub repo or live deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">100%</p>
              <p className="text-lg text-gray-300 font-medium">Interactive</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">Zero</p>
              <p className="text-lg text-gray-300 font-medium">Context Loss</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">Live</p>
              <p className="text-lg text-gray-300 font-medium">Previews</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold text-lg text-gray-900 pr-4">{faq.question}</h3>
                  <ChevronDown 
                    size={24} 
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-top">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
            Ready to showcase<br />your work?
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
            Join Folio today and start sharing your projects with a community of developers 
            who appreciate great work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base">
                Create Free Account
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/feed">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base border-gray-300 hover:bg-gray-50">
                Browse Projects
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            No credit card required • Free forever • Open source
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-lg text-white">F</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">Folio</p>
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                The social platform for developers to showcase interactive projects.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
                <div className="space-y-2">
                  <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                  <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
                  <a href="#faq" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Account</h4>
                <div className="space-y-2">
                  <Link to="/register" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign Up</Link>
                  <Link to="/login" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                  <Link to="/feed" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Browse Feed</Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Project</h4>
                <div className="space-y-2">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    GitHub
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 text-center">
              © 2025 Folio. A portfolio project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}