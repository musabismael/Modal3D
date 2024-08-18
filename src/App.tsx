import React, { useState } from "react";
import "./App.css";
import Modal3D from "./Modal3D";

function App() {
  const [familyName, setFamilyName] = useState("");
  const [hasSon, setHasSon] = useState(false);
  const [hasDaughter, setHasDaughter] = useState(false);
  const [hasWife, setHasWife] = useState(false);
  const [hasOther, setHasOther] = useState(false);

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>Family Information</h2>
        <form>
          <label>
            Family Name:
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={hasSon}
                onChange={(e) => setHasSon(e.target.checked)}
              />
              Son
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasDaughter}
                onChange={(e) => setHasDaughter(e.target.checked)}
              />
              Daughter
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasWife}
                onChange={(e) => setHasWife(e.target.checked)}
              />
              Wife
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasOther}
                onChange={(e) => setHasOther(e.target.checked)}
              />
              Other Family Member
            </label>
          </div>
        </form>
      </div>
      <div className="map-container">
        <Modal3D
          hasSon={hasSon}
          hasDaughter={hasDaughter}
          hasWife={hasWife}
          hasOther={hasOther}
        />
      </div>
    </div>
  );
}

export default App;
// App.tsx
// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Header from './components/Header.tsx';
// import Hero from './components/Hero.tsx';
// import About from './components/About.tsx';
// import Landmarks from './components/Landmarks';
// import Culture from './components/Culture';
// import Footer from './components/Footer';
// import styles from './App.module.css';

// gsap.registerPlugin(ScrollTrigger);

// const App: React.FC = () => {
//   const sectionsRef = useRef<HTMLDivElement[]>([]);

//   useEffect(() => {
//     sectionsRef.current.forEach((section, index) => {
//       gsap.from(section, {
//         opacity: 0,
//         y: 50,
//         duration: 1,
//         scrollTrigger: {
//           trigger: section,
//           start: 'top 80%',
//           end: 'bottom 20%',
//           toggleActions: 'play none none reverse',
//         },
//       });
//     });
//   }, []);

//   return (
//     <div className={styles.app}>
//       <Header />
//       <main>
//         <Hero />
//         <About ref={(el) => (sectionsRef.current[0] = el!)} />
//         <Landmarks ref={(el) => (sectionsRef.current[1] = el!)} />
//         <Culture ref={(el) => (sectionsRef.current[2] = el!)} />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default App;

