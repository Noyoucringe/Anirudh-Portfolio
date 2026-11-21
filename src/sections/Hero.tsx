import { Action } from '../components/Primitives';
export default function Hero() {
  return (
    <section
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
      </div>
    </section>
  );
}
