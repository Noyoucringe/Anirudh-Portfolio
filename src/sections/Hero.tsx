import { Action } from '../components/Primitives';
export default function Hero() {
  return (
    <section
      id="home"
      className="core-hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="container core-layout">
        <div className="core-copy">
          <p className="instrument-label">Computer science undergraduate</p>
          <h1 id="hero-title">
            Meghamsh
            <br />
            <em>Anirudh.</em>
          </h1>
          <p>
            I study computer science at KLH and build full-stack applications.
            My interests span machine learning, distributed systems, and
            fintech.
          </p>
          <div className="core-actions">
            <Action href="#work" direction="down">
              Explore my work
            </Action>
          </div>
        </div>
        <a
          className="hero-laptop"
          href="#sentinelai"
          aria-label="Explore SentinelAI, shown on the laptop screen"
        >
          <div className="laptop-lid">
            <img
              src="/art/sentinel-dashboard.webp"
              alt="SentinelAI security dashboard"
            />
          </div>
          <div className="laptop-deck" aria-hidden="true">
            <div className="laptop-keys" />
            <div className="laptop-trackpad" />
          </div>
        </a>
      </div>
    </section>
  );
}
