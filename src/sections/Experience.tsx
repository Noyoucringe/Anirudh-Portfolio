import { useEffect, useState } from 'react';
import {
  codingProfiles,
  credentials,
  education,
  experience,
} from '../data/profile';
import { Arrow, Reveal, SectionTitle } from '../components/Primitives';

function CodingProfiles() {
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!open) return;
    let subscribed = true;
    import('../lib/codingStats')
      .then((module) => module.getCodingStats())
      .then((value) => {
        if (subscribed) setStats(value);
      })
      .catch(() => {
        /* Profile links remain available offline. */
      });
    return () => {
      subscribed = false;
    };
  }, [open]);
  return (
    <details
      open
      className="coding"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        Coding profiles <span aria-hidden="true" />
      </summary>
      <ul>
        {codingProfiles.map((item) => (
          <li key={item.name}>
            <a href={item.url}>
              {item.name} <Arrow direction="up-right" />
            </a>
            <span>{stats[item.name] || item.handle}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      tabIndex={-1}
      aria-label="Experience and education"
      className="experience light-section"
    >
      <div className="container">
        <Reveal>
          <SectionTitle label="Background">
            Experience<span className="punct">.</span>
          </SectionTitle>
        </Reveal>
        <div className="timeline">
          {experience.map((role) => (
            <article key={role.organization}>
              <p className="date">{role.dates}</p>
              <div>
                <h3>{role.role}</h3>
                <p className="organization">{role.organization}</p>
              </div>
              <div className="contribution">
                <p>{role.contribution}</p>
                <span>{role.tools}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="education">
          <p className="eyebrow">Education</p>
          <div>
            <h3>{education.degree}</h3>
            <p>{education.school}</p>
          </div>
          <p className="date">{education.dates}</p>
        </div>
        <details className="education-extra">
          <summary>Secondary education</summary>
          <p>Sri Chaitanya Junior College · XII · 2024</p>
          <p>Shree Swaminarayan Gurukul International School · X · 2022</p>
        </details>
        <div className="credentials" id="credentials">
          <h3>Verified credentials</h3>
          <div className="credential-grid">
            {credentials.map((cert) => (
              <details key={cert.title}>
                <summary>{cert.title}</summary>
                <p>
                  {cert.issuer} · {cert.issued}
                </p>
                {cert.expires && <p>Expires {cert.expires}</p>}
                {cert.url && <a href={cert.url}>Verify credential ↗</a>}
              </details>
            ))}
          </div>
        </div>
        <CodingProfiles />
      </div>
    </section>
  );
}
