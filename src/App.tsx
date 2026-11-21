import ScrollRuler from './scroll/ScrollRuler';
import { lazy, Suspense, useState, useEffect } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import Work, { Archive } from './sections/Work';
import Instrument from './components/Instrument';
import About from './sections/About';
import Experience from './sections/Experience';
import Contact, { Footer } from './sections/Contact';

const Exhibition = lazy(() => import('./three/Exhibition'));
export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div id="top-marker" aria-hidden="true" />
        <Navigation />
        <ScrollRuler />
        <main id="main" tabIndex={-1}>
          <div className="story" id="home" tabIndex={-1}>
            <div className="story-stage">
              <Instrument />
            </div>
            <div className="story-copy">
              <Hero />
              <Work />
            </div>
          </div>
          <Archive />
          <About />
          <Experience />
          <Contact />
        </main>
        <Footer />
        {ready && (
          <Suspense fallback={null}>
            <Exhibition />
          </Suspense>
        )}
      </LazyMotion>
    </MotionConfig>
  );
}
