import React from 'react'
import { FloatingParticles } from '@/components/magicui/floating-particles'
import SiteNav from '@/components/SiteNav'

export default function RefundPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles count={30} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,80,255,0.18) 0%, rgba(0,200,255,0.08) 60%, transparent 100%)' }} />
      <SiteNav />
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Refund Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: June 2, 2026</p>

        <div className="space-y-10 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Merchant of Record</h2>
            <p>All payments for GGLoadout Pro are processed by <strong className="text-white/80">Paddle.com</strong>, our authorised Merchant of Record. Paddle handles all billing, invoicing, and refund processing on our behalf.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Subscription Cancellation</h2>
            <p>You may cancel your Pro subscription at any time. Upon cancellation, you will retain Pro access until the end of your current billing period. No further charges will be made after cancellation. We do not offer partial refunds for unused time within a billing period.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. Refund Eligibility</h2>
            <p className="mb-3">We offer refunds in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You were charged in error (duplicate charges, technical billing failures)</li>
              <li>You request a refund within <strong className="text-white/80">7 days</strong> of your first subscription charge and have not made more than 10 generations during that period</li>
              <li>The Service was unavailable for more than 24 consecutive hours during your billing period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Non-Refundable Situations</h2>
            <p className="mb-3">Refunds will not be issued in the following cases:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You changed your mind after using the Service</li>
              <li>You forgot to cancel before a renewal date</li>
              <li>The AI-generated copy did not meet your expectations (AI output is inherently subjective)</li>
              <li>Requests made more than 7 days after a charge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. How to Request a Refund</h2>
            <p>To request a refund, contact us at <a href="mailto:hello@ggloadout.com" className="text-white/60 hover:text-white underline">hello@ggloadout.com</a> with your account email and the reason for your request. We will respond within 3 business days. Approved refunds are processed by Paddle and typically appear within 5–10 business days depending on your payment method.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Contact</h2>
            <p>For refund or billing questions, email us at <a href="mailto:hello@ggloadout.com" className="text-white/60 hover:text-white underline">hello@ggloadout.com</a>.</p>
          </section>
        </div>
      </main>
      <footer className="relative z-10 border-t border-white/[0.07] py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-white/40 text-sm">© 2026 GGLoadout</span>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="/terms" className="hover:text-white/70">Terms of Service</a>
            <a href="/privacy" className="hover:text-white/70">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
