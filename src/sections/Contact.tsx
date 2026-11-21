import { Mark, Arrow, Reveal } from '../components/Primitives';
import ContactForm from '../components/ContactForm';
import { profile } from '../data/profile';

export default function Contact() {
  return (
    <section
      id="contact"
      tabIndex={-1}
      className="contact"
      aria-labelledby="contact-title"
    >
      <div className="container contact-grid">
        <Reveal>
          <h2 id="contact-title">Contact</h2>
          <p className="contact-invite">
            I’m open to internships, engineering opportunities, and
            collaborating on practical AI and software projects.
          </p>
        </Reveal>
        <ContactForm />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <a className="wordmark" href="#home">
          <Mark />
          {profile.name}
        </a>
        <div className="social-links">
          <a href={profile.github}>GitHub</a>
          <a href={profile.linkedin}>LinkedIn</a>
          <a href={profile.resume} download>
            Résumé
          </a>
        </div>
        <a className="back-top" href="#home">
          Back to top <Arrow direction="up" />
        </a>
      </div>
    </footer>
  );
}
