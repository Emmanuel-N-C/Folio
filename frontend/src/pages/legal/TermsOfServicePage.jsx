import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Last Updated:</span> December 12, 2025
              </div>
              <div className="hidden sm:block">•</div>
              <div>
                <span className="font-semibold">Effective Date:</span> December 12, 2025
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <ol className="space-y-2 text-sm text-gray-700">
              <li><a href="#section-1" className="hover:text-gray-900 hover:underline">1. Acceptance of Terms</a></li>
              <li><a href="#section-2" className="hover:text-gray-900 hover:underline">2. Eligibility</a></li>
              <li><a href="#section-3" className="hover:text-gray-900 hover:underline">3. Account Registration</a></li>
              <li><a href="#section-4" className="hover:text-gray-900 hover:underline">4. User Content and Intellectual Property</a></li>
              <li><a href="#section-5" className="hover:text-gray-900 hover:underline">5. Embedded Content and Live Previews</a></li>
              <li><a href="#section-6" className="hover:text-gray-900 hover:underline">6. AI-Generated Content</a></li>
              <li><a href="#section-7" className="hover:text-gray-900 hover:underline">7. Prohibited Conduct</a></li>
              <li><a href="#section-8" className="hover:text-gray-900 hover:underline">8. Content Moderation</a></li>
              <li><a href="#section-9" className="hover:text-gray-900 hover:underline">9. Intellectual Property Rights</a></li>
              <li><a href="#section-10" className="hover:text-gray-900 hover:underline">10. Account Termination</a></li>
              <li><a href="#section-11" className="hover:text-gray-900 hover:underline">11. Disclaimers and Limitation of Liability</a></li>
              <li><a href="#section-12" className="hover:text-gray-900 hover:underline">12. Indemnification</a></li>
              <li><a href="#section-13" className="hover:text-gray-900 hover:underline">13. Privacy and Data Collection</a></li>
              <li><a href="#section-14" className="hover:text-gray-900 hover:underline">14. Changes to Terms</a></li>
              <li><a href="#section-15" className="hover:text-gray-900 hover:underline">15. Dispute Resolution</a></li>
              <li><a href="#section-16" className="hover:text-gray-900 hover:underline">16. General Provisions</a></li>
              <li><a href="#section-17" className="hover:text-gray-900 hover:underline">17. Contact Information</a></li>
              <li><a href="#section-18" className="hover:text-gray-900 hover:underline">18. Acknowledgment</a></li>
            </ol>
          </div>

          {/* Terms Content */}
          <div className="prose prose-gray max-w-none">
            
            {/* Section 1 */}
            <section id="section-1" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Folio ("we," "us," "our," or "the Platform"). By accessing or using Folio, you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use Folio.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms constitute a legally binding agreement between you and Folio. By creating an account, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <p className="text-gray-700 leading-relaxed mb-4">To use Folio, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Be at least <strong>13 years of age</strong> (or 16 years of age if you reside in the European Union)</li>
                <li>Have the legal capacity to enter into a binding contract</li>
                <li>Not be prohibited from using the Platform under applicable laws</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                If you are under 18 years of age, you represent that you have obtained parental or guardian consent to use Folio.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You may register for Folio using:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Email and password (local authentication)</li>
                <li>Third-party OAuth providers (Google, GitHub, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Account Security</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Account Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You agree to provide:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Accurate, current, and complete information during registration</li>
                <li>Updates to your information to maintain accuracy</li>
                <li>A unique username that does not impersonate others or violate trademarks</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.4 Email Verification</h3>
              <p className="text-gray-700 leading-relaxed">
                Accounts registered via email must be verified before full platform access is granted. Unverified accounts may be deleted after 30 days of inactivity.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Your Content Ownership</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain all ownership rights to the projects, descriptions, screenshots, code, and other content you post on Folio ("User Content"). You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>You own or have the necessary rights to all User Content you post</li>
                <li>Your User Content does not infringe on the intellectual property rights of any third party</li>
                <li>You have obtained all necessary permissions for any third-party materials included in your projects</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 License Grant to Folio</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By posting User Content on Folio, you grant us a <strong>worldwide, non-exclusive, royalty-free, transferable license</strong> to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Display, reproduce, and distribute your User Content on the Platform</li>
                <li>Create derivative works for the purpose of displaying your content (e.g., thumbnails, previews)</li>
                <li>Promote Folio using your User Content in marketing materials (with attribution)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This license exists only for the purpose of operating and promoting Folio and terminates when you delete your content, except where content has been shared or cached by other users.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 User Responsibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>All User Content you post</li>
                <li>Ensuring your projects do not contain malicious code, viruses, or harmful software</li>
                <li>The accuracy of project descriptions, technology tags, and links</li>
                <li>Compliance with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Embedded Content and Live Previews</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Iframe Embedding</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Folio attempts to embed your deployed projects as interactive iframes in the feed. By providing a live demo URL, you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Confirm you have the right to embed the content</li>
                <li>Acknowledge that embedding may not work due to X-Frame-Options or CSP headers</li>
                <li>Understand that Folio will fall back to screenshots if embedding fails</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Third-Party Content Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Folio is not responsible for:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>The content, security, functionality, or availability of embedded external websites</li>
                <li>Any damages, losses, or harm resulting from interaction with embedded content</li>
                <li>The accuracy or legality of third-party websites you link to</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-semibold">
                You access embedded content and external links at your own risk.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Malicious Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You may not post links to websites that:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Contain malware, viruses, or harmful code</li>
                <li>Engage in phishing, scams, or fraudulent activities</li>
                <li>Violate laws or regulations</li>
                <li>Harm users' devices or data</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI-Generated Content</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.1 AI Assistance</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Folio uses artificial intelligence (Groq API) to assist with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Generating project titles and descriptions from GitHub repositories</li>
                <li>Analyzing deployed websites to suggest content</li>
                <li>Recommending technology tags</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 AI Content Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>AI-generated content may be inaccurate, incomplete, or inappropriate.</strong> You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Reviewing all AI-generated content before publishing</li>
                <li>Editing and correcting any inaccuracies</li>
                <li>Ensuring AI-generated content complies with these Terms</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-semibold">
                Folio is not liable for any errors, omissions, or consequences arising from AI-generated content.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You may <strong>NOT</strong>:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.1 Content Violations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of privacy</li>
                <li>Upload projects containing copyrighted material without authorization</li>
                <li>Post misleading, fraudulent, or deceptive content</li>
                <li>Share malicious code, viruses, or harmful software</li>
                <li>Impersonate any person or entity</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.2 Platform Abuse</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Spam, flood, or manipulate the feed with duplicate or low-quality content</li>
                <li>Use bots, scrapers, or automated tools without authorization</li>
                <li>Attempt to hack, disrupt, or compromise the Platform's security</li>
                <li>Circumvent any access restrictions or authentication mechanisms</li>
                <li>Manipulate likes, comments, or engagement metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.3 Community Violations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Harass, bully, or intimidate other users</li>
                <li>Post hate speech or content that promotes violence or discrimination</li>
                <li>Engage in doxxing or sharing private information without consent</li>
                <li>Violate any user's intellectual property rights</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Content Moderation</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.1 Our Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Folio reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Review, monitor, and moderate all User Content</li>
                <li>Remove or disable content that violates these Terms</li>
                <li>Suspend or terminate accounts that violate these Terms</li>
                <li>Cooperate with law enforcement investigations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 User Reporting</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Users can report content that violates these Terms. We will investigate reports and take appropriate action, which may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Content removal</li>
                <li>Account warnings</li>
                <li>Temporary or permanent account suspension</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.3 No Obligation to Monitor</h3>
              <p className="text-gray-700 leading-relaxed">
                While we reserve the right to moderate content, <strong>we are not obligated to monitor all User Content</strong> and are not responsible for content posted by users.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.1 Folio's IP</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All Folio branding, logos, design, code, and features are owned by Folio and protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Copy, modify, or distribute Folio's code or design without permission</li>
                <li>Use Folio's trademarks without authorization</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.2 DMCA Compliance</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you believe content on Folio infringes your copyright, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 font-semibold mb-2">DMCA Agent:</p>
                <p className="text-gray-700">Email: <a href="mailto:folioverify@gmail.com" className="text-blue-600 hover:underline">folioverify@gmail.com</a></p>
                <p className="text-gray-700">Subject Line: "DMCA Takedown Request"</p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">Include:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Identification of the copyrighted work</li>
                <li>URL of the infringing content</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief that use is unauthorized</li>
                <li>A statement under penalty of perjury that the information is accurate</li>
                <li>Your physical or electronic signature</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We will investigate and remove infringing content in accordance with the Digital Millennium Copyright Act (DMCA).
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Account Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.1 Termination by You</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may delete your account at any time through the Settings page. Upon deletion:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Your User Content will be removed from public view</li>
                <li>Your account data will be deleted in accordance with our Privacy Policy</li>
                <li>Some data may be retained for legal or operational purposes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.2 Termination by Folio</h3>
              <p className="text-gray-700 leading-relaxed mb-4">We reserve the right to suspend or terminate your account:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>For violation of these Terms</li>
                <li>For illegal or harmful conduct</li>
                <li>At our discretion, with or without notice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.3 Effect of Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Upon termination:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Your license to use Folio ends immediately</li>
                <li>You must cease all use of the Platform</li>
                <li>Sections of these Terms that should survive (e.g., liability limitations) remain in effect</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Disclaimers and Limitation of Liability</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.1 "AS IS" Service</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                FOLIO IS PROVIDED <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Guarantees of uninterrupted, secure, or error-free service</li>
                <li>Accuracy, reliability, or completeness of content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.2 Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOLIO SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, or goodwill</li>
                <li>Service interruptions or data loss</li>
                <li>Damages arising from User Content or embedded third-party content</li>
                <li>Unauthorized access to your account or data</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-semibold">
                IN NO EVENT SHALL FOLIO'S TOTAL LIABILITY EXCEED $100 USD OR THE AMOUNT YOU PAID TO FOLIO IN THE PAST 12 MONTHS (WHICHEVER IS GREATER).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.3 Third-Party Services</h3>
              <p className="text-gray-700 leading-relaxed">
                Folio integrates with third-party services (OAuth providers, AI APIs, hosting platforms). We are not responsible for the availability, security, or performance of these services.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to <strong>indemnify, defend, and hold harmless</strong> Folio, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Your use of the Platform</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Privacy and Data Collection</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.1 Data Collection</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using Folio, you consent to the collection and use of your data as described in our <strong>Privacy Policy</strong>, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Email address, username, and profile information</li>
                <li>Projects, screenshots, and descriptions you upload</li>
                <li>Interaction data (likes, comments, views)</li>
                <li>Authentication tokens from OAuth providers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.2 Cookies and Analytics</h3>
              <p className="text-gray-700 leading-relaxed">
                We may use cookies and analytics tools to improve the Platform. See our Privacy Policy for details.
              </p>
            </section>

            {/* Section 14 */}
            <section id="section-14" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">14.1 Updates</h3>
              <p className="text-gray-700 leading-relaxed mb-4">We reserve the right to modify these Terms at any time. Changes will be effective:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Immediately upon posting for non-material changes</li>
                <li>30 days after notice for material changes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">14.2 Notification</h3>
              <p className="text-gray-700 leading-relaxed mb-4">We will notify you of material changes via:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Email to your registered address</li>
                <li>A notice on the Platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">14.3 Continued Use</h3>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of Folio after changes constitutes acceptance of the updated Terms. If you do not agree, you must stop using the Platform and delete your account.
              </p>
            </section>

            {/* Section 15 */}
            <section id="section-15" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">15.1 Informal Resolution</h3>
              <p className="text-gray-700 leading-relaxed">
                Before filing a claim, you agree to contact us at <a href="mailto:folioverify@gmail.com" className="text-blue-600 hover:underline">folioverify@gmail.com</a> to attempt informal resolution.
              </p>
            </section>

            {/* Section 16 */}
            <section id="section-16" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. General Provisions</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">16.1 Entire Agreement</h3>
              <p className="text-gray-700 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Folio.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">16.2 Severability</h3>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">16.3 No Waiver</h3>
              <p className="text-gray-700 leading-relaxed">
                Our failure to enforce any right or provision does not constitute a waiver of that right.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">16.4 Assignment</h3>
              <p className="text-gray-700 leading-relaxed">
                You may not assign or transfer these Terms. We may assign these Terms without restriction.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">16.5 Force Majeure</h3>
              <p className="text-gray-700 leading-relaxed">
                We are not liable for delays or failures due to circumstances beyond our control (e.g., natural disasters, pandemics, server outages).
              </p>
            </section>

            {/* Section 17 */}
            <section id="section-17" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">For questions about these Terms, contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:folioverify@gmail.com" className="text-blue-600 hover:underline">folioverify@gmail.com</a></p>
              </div>
            </section>

            {/* Section 18 */}
            <section id="section-18" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Acknowledgment</h2>
              <p className="text-gray-700 leading-relaxed mb-4">By creating an account on Folio, you acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>You have read and understood these Terms</li>
                <li>You agree to be bound by these Terms</li>
                <li>You are at least 13 years of age (or 16 in the EU)</li>
                <li>You will comply with all applicable laws</li>
              </ul>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-lg font-semibold">Thank you for using Folio! 🚀</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}