import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Ambar & Larimar Shop. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            Legal
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            Privacy Policy
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
          <p className="font-ui text-xs text-ocean/40 mt-4">
            Last Updated: March 9, 2026
          </p>
        </div>

        <div className="space-y-10 font-body text-base text-ocean/70 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              1. Introduction
            </h2>
            <p>
              Ambar & Larimar Shop (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a fine
              Caribbean jewelry company specializing in authentic Dominican Larimar and Amber
              jewelry. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website at ambarlarimarshop.com (the
              &quot;Site&quot;) or interact with our services.
            </p>
            <p className="mt-3">
              By using our Site, you consent to the practices described in this policy. If you do
              not agree, please discontinue use of the Site.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              2. Information We Collect
            </h2>
            <h3 className="font-heading text-sm tracking-[0.12em] text-gold mb-2 uppercase">
              Information You Provide
            </h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Contact details (name, email address, phone number) submitted through our contact or wholesale inquiry forms</li>
              <li>Order information and shipping details when placing a purchase</li>
              <li>Messages and correspondence you send to us via email or forms</li>
              <li>Business information provided through our wholesale program inquiry</li>
            </ul>
            <h3 className="font-heading text-sm tracking-[0.12em] text-gold mb-2 uppercase">
              Information Collected Automatically
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Usage data such as pages visited, time spent on pages, and navigation patterns</li>
              <li>Device information including browser type, operating system, and screen resolution</li>
              <li>IP address and approximate geographic location</li>
              <li>Cookies and similar tracking technologies (see Section 6)</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To process and fulfill your orders, including shipping and delivery</li>
              <li>To send follow-up communications about your order or inquiry</li>
              <li>To improve our website, products, and overall customer experience</li>
              <li>To measure the effectiveness of our marketing and advertising efforts</li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </section>

          {/* 4. Third-Party Services */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              4. Third-Party Services
            </h2>
            <p className="mb-3">
              We may share your information with trusted third-party services that help us operate
              our business:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><strong>Vercel</strong> &mdash; Website hosting and deployment</li>
              <li><strong>Google Analytics</strong> &mdash; Website traffic analysis and reporting</li>
              <li><strong>Resend</strong> &mdash; Transactional email delivery</li>
              <li><strong>Payment Processors</strong> &mdash; Secure payment handling (we do not store your payment card details)</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third parties for their
              marketing purposes.
            </p>
          </section>

          {/* 5. SMS/Text Messaging Privacy */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              5. SMS/Text Messaging Privacy
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We only send SMS messages to users who have explicitly opted in</li>
              <li>SMS data and phone numbers collected for messaging purposes are not shared with third parties for marketing</li>
              <li>You may opt out of SMS communications at any time by replying STOP to any message</li>
              <li>Standard message and data rates from your carrier may apply</li>
              <li>Message frequency varies based on your interactions and order status</li>
            </ul>
          </section>

          {/* 6. Cookies */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              6. Cookies
            </h2>
            <p className="mb-3">Our Site uses the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Essential Cookies</strong> &mdash; Required for site functionality such as cart storage and language preferences</li>
              <li><strong>Analytics Cookies</strong> &mdash; Help us understand how visitors interact with our Site to improve the user experience</li>
              <li><strong>Advertising Cookies</strong> &mdash; Used to measure the performance of marketing campaigns</li>
            </ul>
            <p className="mt-3">
              You can manage cookie preferences through your browser settings. Disabling certain
              cookies may affect site functionality.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              7. Data Retention
            </h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the
              purposes outlined in this policy, or as required by law. You may request deletion of
              your personal data at any time by contacting us at{" "}
              <a href="mailto:sales@ambarlarimarshop.com" className="text-gold hover:text-ambar transition-colors">
                sales@ambarlarimarshop.com
              </a>.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              8. Your Rights
            </h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Request portability of your data in a structured, commonly used format</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:sales@ambarlarimarshop.com" className="text-gold hover:text-ambar transition-colors">
                sales@ambarlarimarshop.com
              </a>.
            </p>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              9. Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* 10. Changes to This Policy */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated &quot;Last Updated&quot; date. Your continued use of the Site
              after any changes constitutes acceptance of the revised policy.
            </p>
          </section>

          {/* 11. Contact Us */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              11. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none pl-0 mt-3 space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:sales@ambarlarimarshop.com" className="text-gold hover:text-ambar transition-colors">
                  sales@ambarlarimarshop.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong> 809-919-4205
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <Link href="/contact" className="text-gold hover:text-ambar transition-colors">
                  ambarlarimarshop.com/contact
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
