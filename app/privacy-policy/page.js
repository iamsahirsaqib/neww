'use client';

import Link from 'next/link';
import { FiXCircle } from 'react-icons/fi';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacyOverlay">
      <div className="privacyContainer">
        {/* Cross icon linked to Home page */}
        <Link href="/" aria-label="Go to Home" className="closeButton">
          <FiXCircle size={30} />
        </Link>

        <h1 className="privacyTitle">Privacy Policy</h1>

        <section className="privacySection">
          <p>
            At <strong>Al-Khaira</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
          </p>
        </section>

        <section className="privacySection">
          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> Name, email, phone number, shipping address, and payment details.</li>
            <li><strong>Usage Data:</strong> How you interact with our website, including pages visited and time spent.</li>
            <li><strong>Cookies:</strong> We use cookies to improve your browsing experience and personalize content.</li>
          </ul>
        </section>

        <section className="privacySection">
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process and deliver your orders accurately and on time.</li>
            <li>To communicate with you regarding your orders, offers, and updates.</li>
            <li>To improve our website and customer service based on your feedback and usage.</li>
            <li>To ensure security and prevent fraudulent activities.</li>
          </ul>
        </section>

        <section className="privacySection">
          <h2>Data Protection</h2>
          <p>
            We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="privacySection">
          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal data. You may also opt out of marketing communications at any time.
          </p>
        </section>

        <section className="privacySection">
          <h2>Third-Party Services</h2>
          <p>
            We may share your information with trusted third-party partners only to facilitate order fulfillment, payment processing, and delivery services. These partners are obligated to keep your data confidential.
          </p>
        </section>

        <section className="privacySection">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. We encourage you to review this page periodically for any changes.
          </p>
        </section>

        <footer className="privacyFooter">
          <p>© {new Date().getFullYear()} Al-Khaira. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
