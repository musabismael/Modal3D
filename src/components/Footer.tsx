import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    gsap.from(footerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#landmarks">Landmarks</a></li>
            <li><a href="#culture">Culture</a></li>
          </ul>
        </div>
        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <p>Email: info@uae-tourism.com</p>
          <p>Phone: +971 123 456 789</p>
        </div>
        <div className={styles.social}>
          <h3>Follow Us</h3>
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Twitter">TW</a>
          <a href="#" aria-label="Instagram">IG</a>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; 2023 UAE Tourism. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
