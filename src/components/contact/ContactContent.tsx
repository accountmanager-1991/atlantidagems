"use client";

import { useApp } from "@/components/providers/AppProvider";
import { BRAND } from "@/lib/constants";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactContent() {
  const { t } = useApp();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.contact.badge}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.contact.title}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="font-heading text-xl tracking-[0.08em] text-ocean mb-6 normal-case">
              {t.contact.badge}
            </h2>
            <p className="font-body text-base text-ocean/70 leading-relaxed mb-8">
              {t.contact.meta}
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                  Email
                </h3>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                >
                  {BRAND.email}
                </a>
              </div>
              <div>
                <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                  Phone
                </h3>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                >
                  {BRAND.phone}
                </a>
              </div>
              <div>
                <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                  {t.footer.quickLinks}
                </h3>
                <div className="flex gap-4">
                  <a
                    href={BRAND.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href={BRAND.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={BRAND.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                  >
                    Pinterest
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
