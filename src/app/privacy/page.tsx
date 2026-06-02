import React from 'react'
import { FloatingParticles } from '@/components/magicui/floating-particles'
import SiteNav from '@/components/SiteNav'

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles count={30} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,80,255,0.18) 0%, rgba(0,200,255,0.08) 60%, transparent 100%)' }} />
      <SiteNav />
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: June 2, 2026</p>

        <div className="space-y-10 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you use GGLoadout, we collect the following information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white/80">Account information:</strong> Your Google account email and profile name, collected when you sign in via Google OAuth.</li>
              <li><strong className="text-white/80">Game details you enter:</strong> Game name, genre, gameplay description, tone, features, and target audience that you provide when generating copy.</li>
              <li><strong className="text-white/80">Generated content:</strong> The AI-generated store copy, if you choose to save it to your account.</li>
              <li><strong className="text-white/80">Usage data:</strong> Number of generations per day, to enforce plan limits.</li>
              <li><strong className="text-white/80">Payment information:</strong> Processed exclusively by Paddle. We do not store credit card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and improve the Service</li>
              <li>To authenticate your account and enforce usage limits</li>
              <li>To process subscription payments via Paddle</li>
              <li>To store saved generations in your account</li>
              <li>To send transactional emails (e.g. payment confirmations via Paddle)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. Data Storage</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL database) hosted on AWS infrastructure. Account data and saved generations are stored in our database with row-level security — only you can access your own data.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white/80">Google OAuth</strong> — for account sign-in</li>
              <li><strong className="text-white/80">Supabase</strong> — for database and authentication</li>
              <li><strong className="text-white/80">Google Gemini AI</strong> — for generating copy (your game details are sent to Google&apos;s API to produce the output)</li>
              <li><strong className="text-white/80">Paddle</strong> — for payment processing and subscription management</li>
              <li><strong className="text-white/80">Vercel</strong> — for hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Data Sharing</h2>
            <p>We do not sell or share your personal data with third parties for marketing purposes. Data is only shared with third-party services as described above, to the extent necessary to provide the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Saved generations are stored until you delete them or close your account. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:hello@ggloadout.com" className="text-white/60 hover:text-white underline">hello@ggloadout.com</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Cookies</h2>
            <p>We use session cookies for authentication purposes only. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify users of significant changes by updating the date at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Contact</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:hello@ggloadout.com" className="text-white/60 hover:text-white underline">hello@ggloadout.com</a>.</p>
          </section>
        </div>
      </main>
      <footer className="relative z-10 border-t border-white/[0.07] py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-white/40 text-sm">© 2026 GGLoadout</span>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="/terms" className="hover:text-white/70">Terms of Service</a>
            <a href="/refund" className="hover:text-white/70">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
