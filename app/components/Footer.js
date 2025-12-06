'use client';

import { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

import Link from 'next/link';

const Footer = () => {

   

  return (
    <footer className="luxuryFooter">
      {/* Luxury Logo & About Section */}
      <div className="footerSection">
        <div className="luxuryLogo">
        <Link href="/">
          <img src="/images/footerlogofn.png" alt="Shazie Logo" className="logoImage" />

          </Link>
          <p className="aboutText">
          Al Khaira — where quality speaks for itself, and trust is built in every choice.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="footerSection">
        <h3 className="footerHeading">Quick Links</h3>
        <ul className="quickLinks">
          <li><a href="/about-us">About Us</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/term-condition">Terms & Conditions</a></li>
        </ul>
      </div>

      {/* Social Media Links */}
      <div className="footerSection">
        <h3 className="footerHeading">Follow Us</h3>
        <div className="socialMediaLinks">
          <a href="https://facebook.com" aria-label="Facebook">
            <FaFacebook className="socialIcon" />
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <FaInstagram className="socialIcon" />
          </a>
          <a href="https://whatsapp.com" aria-label="WhatsApp">
            <FaWhatsapp className="socialIcon" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
<div className="footerSection copyrightSection">
<p className="copyrightText">
  &copy; {new Date().getFullYear()} Al-Khaira. All rights reserved.
</p>

</div>

      

    </footer>
  );
};

export default Footer;