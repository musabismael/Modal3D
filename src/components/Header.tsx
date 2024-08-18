// Header.tsx
import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    gsap.from(`.${styles.header}`, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <img src="/uae-logo.svg" alt="UAE Logo" />
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#landmarks">Landmarks</a></li>
          <li><a href="#culture">Culture</a></li>
        </ul>
      </nav>
      <div className={styles.langSwitch}>
        <button>EN</button>
        <button>عربي</button>
      </div>
    </header>
  );
};

export default Header;
