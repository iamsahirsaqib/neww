'use client';

import Link from 'next/link';
import { FiXCircle } from 'react-icons/fi';

const AboutUsPage = () => {
  return (
    <div className="aboutUsOverlay">
      <div className="aboutUsContainer">
        <Link href="/" aria-label="Go to Home" className="closeButton">
          <FiXCircle size={30} />
        </Link>

        <h1 className="aboutTitle">
          Welcome to <span className="storeName">Al-Khaira</span>
        </h1>

        <section className="aboutSection">
          <h2>Who We Are</h2>
          <p>
          Al-Khaira is your trusted destination for premium apparel, accessories, and lifestyle products for everyone. We pride ourselves on delivering high-quality, stylish products that suit all occasions and tastes.
          </p>
        </section>

        <section className="aboutSection">
          <h2>What We Offer</h2>
          <ul>
            <li>
              <strong>Clothing for All</strong>
              <br />
              Tailored formal and casual wear for men, women, and kids — shirts, pants, dresses, coats, and suits crafted to keep you looking sharp.
            </li>
            <li>
              <strong>Luxury Accessories</strong>
              <br />
              Watches, wallets, belts, bags, and more to complete your look.
            </li>
            <li>
              <strong>Home & Lifestyle Products</strong>
              <br />
              Trendy seasonal collections including decor, gadgets, and essentials that keep you ahead of the curve.
            </li>
          </ul>
        </section>

        <section className="aboutSection">
          <h2>Seamless Delivery Experience</h2>
          <p>
            We ensure quick and secure delivery right to your doorstep anywhere in the UAE. Your orders are carefully packed and inspected. Pay only when your order arrives with our trusted Cash on Delivery option.
          </p>
        </section>

        <section className="aboutSection">
          <h2>Our Quality Commitment</h2>
          <p>
            Every product goes through strict quality checks to ensure you receive only the best from Shazie.
          </p>
        </section>

        <section className="aboutSection">
          <h2>Why Choose Al-Khaira?</h2>
          <ul>
            <li>Wide range of premium products for the entire family</li>
            <li>Competitive prices with no upfront payment required</li>
            <li>Reliable customer support ready to assist you</li>
            <li>A seamless shopping experience tailored just for you</li>
          </ul>
        </section>

        <footer className="aboutFooter">
          <p>
            Thank you for trusting <strong>Al-Khaira</strong> — your partner in style and quality.
          </p>
          <p>
            <em>Shop confidently. Live stylishly.</em>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AboutUsPage;
