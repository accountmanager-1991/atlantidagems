import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Ambar & Larimar Shop. Read the terms and conditions that govern your use of our website and services.",
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            Legal
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            Terms of Service
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
          <p className="font-ui text-xs text-ocean/40 mt-4">
            Last Updated: March 9, 2026
          </p>
        </div>

        <div className="space-y-10 font-body text-base text-ocean/70 leading-relaxed">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Ambar & Larimar Shop website at ambarlarimarshop.com (the
              &quot;Site&quot;) and any services offered through it, you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must
              discontinue use of the Site immediately.
            </p>
          </section>

          {/* 2. Description of Services */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              2. Description of Services
            </h2>
            <p>
              Ambar & Larimar Shop is a fine jewelry company specializing in authentic Dominican
              Larimar and Amber jewelry. Our services include retail and wholesale sales of
              handcrafted jewelry, online product browsing, order placement, and customer support.
              All jewelry is handcrafted in the Dominican Republic using ethically sourced gemstones.
            </p>
          </section>

          {/* 3. Use of the Site */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              3. Use of the Site
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Site for any unlawful purpose or in violation of any applicable laws</li>
              <li>Infringe upon the intellectual property rights of Ambar & Larimar Shop or any third party</li>
              <li>Attempt to gain unauthorized access to any portion of the Site, its servers, or connected systems</li>
              <li>Interfere with or disrupt the operation of the Site or its hosting infrastructure</li>
              <li>Submit false, misleading, or spam content through any forms on the Site</li>
              <li>Use automated tools to scrape, crawl, or extract data from the Site without written permission</li>
            </ul>
          </section>

          {/* 4. Products & Orders */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              4. Products & Orders
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All product descriptions, images, and prices are provided as accurately as possible but may contain minor variations due to the handcrafted and natural nature of our gemstones</li>
              <li>We reserve the right to limit quantities, refuse orders, or cancel orders at our discretion</li>
              <li>Prices are listed in US Dollars (USD) and are subject to change without notice</li>
              <li>Each piece of Larimar and Amber jewelry is unique — natural variations in color, pattern, and size are inherent to genuine gemstones and are not considered defects</li>
              <li>A certificate of authenticity is provided with every purchase</li>
            </ul>
          </section>

          {/* 5. SMS/Text Messaging Terms */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              5. SMS/Text Messaging Terms
            </h2>
            <p className="mb-3">
              If you opt in to receive SMS messages from Ambar & Larimar Shop:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You may receive order confirmations, shipping updates, and promotional messages</li>
              <li>Message frequency varies based on your interactions and order activity</li>
              <li><strong>Opt out:</strong> Reply STOP to any message to unsubscribe</li>
              <li><strong>Rejoin:</strong> Reply START to re-subscribe</li>
              <li><strong>Help:</strong> Reply HELP for assistance</li>
              <li>Message and data rates from your carrier may apply</li>
              <li>We are not liable for delayed or undelivered messages due to carrier issues</li>
              <li>SMS data is handled in accordance with our{" "}
                <Link href="/privacy" className="text-gold hover:text-ambar transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </section>

          {/* 6. Shipping & Returns */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              6. Shipping & Returns
            </h2>
            <p>
              Shipping timelines and return policies are detailed on our{" "}
              <Link href="/shipping-returns" className="text-gold hover:text-ambar transition-colors">
                Shipping & Returns
              </Link>{" "}
              page. By placing an order, you agree to the shipping and return terms outlined
              there. Custom or made-to-order pieces are final sale.
            </p>
          </section>

          {/* 7. Wholesale Inquiries */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              7. Wholesale Inquiries
            </h2>
            <p>
              Submitting a wholesale inquiry form does not create a binding agreement. All wholesale
              partnerships require a separate written agreement between Ambar & Larimar Shop and the
              wholesale partner, outlining pricing, minimum order quantities, payment terms, and
              other conditions.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              8. Intellectual Property
            </h2>
            <p>
              All content on this Site — including text, images, logos, product photography, design
              elements, and branding — is the property of Ambar & Larimar Shop and is protected by
              applicable copyright and intellectual property laws. You may not reproduce, distribute,
              modify, or use any content from this Site without our prior written permission.
            </p>
          </section>

          {/* 9. Disclaimer of Warranties */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              9. Disclaimer of Warranties
            </h2>
            <p>
              The Site and all products and services are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or implied. We do not
              guarantee uninterrupted access to the Site, error-free functionality, or specific
              outcomes from using our products or services.
            </p>
          </section>

          {/* 10. Limitation of Liability */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              10. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Ambar & Larimar Shop shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from
              your use of the Site or purchase of products. Our total liability for any claim shall
              not exceed the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* 11. Indemnification */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              11. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Ambar & Larimar Shop, its owners,
              employees, and affiliates from any claims, damages, losses, or expenses (including
              legal fees) arising from your violation of these Terms or your use of the Site.
            </p>
          </section>

          {/* 12. Third-Party Links */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              12. Third-Party Links
            </h2>
            <p>
              Our Site may contain links to third-party websites or services. We are not responsible
              for the content, privacy practices, or availability of these external sites. Accessing
              third-party links is at your own risk.
            </p>
          </section>

          {/* 13. Changes to These Terms */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              13. Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Updates will be posted on this
              page with a revised &quot;Last Updated&quot; date. Your continued use of the Site
              after changes are posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 14. Governing Law */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              14. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              United States. Any disputes arising from these Terms or your use of the Site shall be
              resolved through good-faith negotiation. If negotiation fails, disputes shall be
              resolved through binding arbitration in accordance with applicable rules.
            </p>
          </section>

          {/* 15. Contact Us */}
          <section>
            <h2 className="font-heading text-lg tracking-[0.08em] text-ocean mb-4 normal-case">
              15. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
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
