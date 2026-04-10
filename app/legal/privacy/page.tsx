import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ImageGen AI",
  description: "Privacy Policy for ImageGen AI - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:underline mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to ImageGen AI ("we," "our," or "us"). We respect your
              privacy and are committed to protecting your personal data. This
              privacy policy explains how we collect, use, and safeguard your
              information when you use our AI image generation service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold mb-2">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Images you upload for generation</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usage data (features used, generation history)</li>
              <li>Device information (browser type, IP address)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Error logs and performance data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our AI image generation service</li>
              <li>To process your payments and manage subscriptions</li>
              <li>To send service updates and marketing communications</li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Data Storage and Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure cloud storage with ImageKit and PostgreSQL</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication via Clerk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Image Data and AI Processing
            </h2>
            <p>
              When you upload images for generation:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Images are processed by OpenAI's DALL-E API for style
                transformation
              </li>
              <li>
                Source and generated images are stored on ImageKit CDN
              </li>
              <li>
                We retain generation history for your account management
              </li>
              <li>
                You retain all rights to your uploaded and generated images
              </li>
              <li>
                We do not use your images to train AI models without explicit
                consent
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Third-Party Services
            </h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Clerk</strong> - Authentication and user management
              </li>
              <li>
                <strong>Stripe</strong> - Payment processing
              </li>
              <li>
                <strong>OpenAI</strong> - AI image generation
              </li>
              <li>
                <strong>ImageKit</strong> - Image storage and CDN
              </li>
              <li>
                <strong>Sentry</strong> - Error tracking and monitoring
              </li>
              <li>
                <strong>Vercel</strong> - Hosting and deployment
              </li>
            </ul>
            <p className="mt-4">
              Each service has its own privacy policy governing data handling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at privacy@imagegen.ai
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active or as
              needed to provide services. You can request deletion at any time.
              Generated images are retained for 90 days after account deletion
              unless you request immediate removal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Children's Privacy
            </h2>
            <p>
              Our service is not intended for users under 13 years of age. We do
              not knowingly collect data from children. If you believe we have
              collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. International Data Transfers
            </h2>
            <p>
              Your data may be transferred to and processed in countries outside
              your residence. We ensure appropriate safeguards are in place for
              such transfers in compliance with GDPR and other regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy periodically. We will notify you
              of significant changes via email or through our service. Continued
              use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>
              For privacy-related questions or concerns, contact us at:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li>Email: privacy@imagegen.ai</li>
              <li>Support: support@imagegen.ai</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
