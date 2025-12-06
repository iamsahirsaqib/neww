'use client';

import Link from 'next/link';
import { FiXCircle } from 'react-icons/fi';

const TermsConditionsPage = () => {
  return (
    <div className="termsOverlay">
      <div className="termsContainer">
        {/* Cross icon linked to Home */}
        <Link href="/" aria-label="Go to Home" className="closeButton">
          <FiXCircle size={30} />
        </Link>

        <h1 className="termsTitle">Terms & Conditions</h1>

        <section className="termsSection">
          <p>
            Welcome to <strong>Al-Khaira</strong>. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
          </p>
        </section>

        <section className="termsSection">
          <h2>1. Use of Website</h2>
          <p>
            You agree to use the website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the website.
          </p>
        </section>

        <section className="termsSection">
          <h2>2. Product Information</h2>
          <p>
            We strive to provide accurate product descriptions and pricing. However, we do not guarantee that all information is error-free or up to date.
          </p>
        </section>

        <section className="termsSection">
          <h2>3. Orders and Payments</h2>
          <p>
            All orders are subject to acceptance and availability. Payment is collected upon delivery through Cash on Delivery or other available methods.
          </p>
        </section>

        <section className="termsSection">
          <h2>4. Delivery</h2>
          <p>
            We ensure timely delivery within the UAE. Delivery times may vary based on location and availability.
          </p>
        </section>

        <section className="termsSection">
          <h2>5. Returns and Refunds</h2>
          <p>
            Returns and refunds are handled according to our refund policy. Please contact our customer service for assistance.
          </p>
        </section>

        <section className="termsSection">
          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of Zashie or its licensors and is protected by copyright laws.
          </p>
        </section>

        <section className="termsSection">
          <h2>7. Limitation of Liability</h2>
          <p>
          Al-Khaira is not liable for any damages resulting from the use or inability to use our website or products.
          </p>
        </section>

        <section className="termsSection">
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the website indicates acceptance of the updated terms.
          </p>
        </section>

        <footer className="termsFooter">
          <p>© {new Date().getFullYear()} Al-Khaira. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
