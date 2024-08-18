import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Culture.module.css';

gsap.registerPlugin(ScrollTrigger);

const Culture: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    gsap.from(contentRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.culture}>
      <div ref={contentRef} className={styles.content}>
        <h2>Emirati Culture</h2>
        <p>The UAE's culture is a unique blend of traditional Arab values and modern cosmopolitan influences.</p>
        <ul>
          <li>Traditional dress: Kandura for men and Abaya for women</li>
          <li>Arabic coffee and dates: A symbol of hospitality</li>
          <li>Falconry: An ancient Bedouin tradition</li>
          <li>Modern art scene: Louvre Abu Dhabi and numerous galleries</li>
        </ul>
      </div>
    </section>
  );
};

export default Culture;
