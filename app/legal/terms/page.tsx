import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | ImageGen AI",
  description: "Terms of Service for ImageGen AI - User agreement and conditions",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:underline mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using ImageGen AI ("Service"), you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to
              these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p>
              ImageGen AI provides an AI-powered image generation and
              transformation service. We use advanced AI models to apply
              artistic styles to your uploaded images.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-2">3.1 Registration</h3>
            <p>
              You must create an account to use certain features. You are
              responsible for maintaining the confidentiality of your account
              credentials.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              3.2 Account Security
            </h3>
            <p>
              You are responsible for all activities under your account. Notify
              us immediately of any unauthorized access.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              3.3 Account Termination
            </h3>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these Terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Subscription Plans and Billing
            </h2>
            <h3 className="text-xl font-semibold mb-2">4.1 Plans</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Free Plan:</strong> 3 generations per month
              </li>
              <li>
                <strong>Pro Plan:</strong> $19/month for 75 generations
              </li>
              <li>
                <strong>Studio Plan:</strong> $49/month for 175 generations
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Billing</h3>
            <p>
              Subscriptions are billed monthly in advance. Payments are
              processed securely through Stripe. All fees are non-refundable
              except as required by law.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              4.3 Cancellation
            </h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes
              effect at the end of the current billing period. No refunds for
              partial months.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              4.4 Price Changes
            </h3>
            <p>
              We reserve the right to modify pricing with 30 days' notice.
              Existing subscribers will be grandfathered at their current rate
              for 6 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Usage Limits</h2>
            <p>
              Generation limits reset on the first day of each calendar month
              (UTC). Unused generations do not roll over. We reserve the right
              to enforce fair use policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Acceptable Use Policy
            </h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Generate images depicting violence, hate, or adult content</li>
              <li>Violate intellectual property rights</li>
              <li>Use the service for spam or malicious purposes</li>
              <li>Attempt to reverse engineer or exploit the service</li>
              <li>Share account credentials with others</li>
              <li>Use automated tools to abuse the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>
            <h3 className="text-xl font-semibold mb-2">7.1 Your Content</h3>
            <p>
              You retain all rights to images you upload. By uploading, you
              grant us a license to process and store your images to provide the
              service.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              7.2 Generated Images
            </h3>
            <p>
              You own the generated images created from your uploads. You may
              use them for personal or commercial purposes. We do not claim
              ownership of your generated content.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              7.3 Our Service
            </h3>
            <p>
              The ImageGen AI platform, including all software, designs, and
              trademarks, is our intellectual property. You may not copy,
              modify, or distribute our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Content Moderation
            </h2>
            <p>
              We use automated and manual moderation to prevent misuse. We
              reserve the right to remove content that violates our policies
              without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Service Availability
            </h2>
            <p>
              We strive for 99.9% uptime but do not guarantee uninterrupted
              service. We may perform maintenance with reasonable notice.
              Service interruptions do not entitle refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
              WE DO NOT GUARANTEE SPECIFIC RESULTS OR QUALITY OF GENERATED
              IMAGES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES
              ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims
              arising from your use of the service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              13. Dispute Resolution
            </h2>
            <p>
              Any disputes shall be resolved through binding arbitration in
              accordance with the rules of the American Arbitration Association.
              You waive the right to participate in class actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of [Your Jurisdiction],
              without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              15. Changes to Terms
            </h2>
            <p>
              We may modify these Terms at any time. Material changes will be
              notified via email. Continued use after changes constitutes
              acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">16. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <ul className="list-none space-y-2 mt-4">
              <li>Email: legal@imagegen.ai</li>
              <li>Support: support@imagegen.ai</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
