import ProjectGlyph from '../components/ProjectGlyph';
import { moreProjects, selectedProjects, type Project } from '../data/projects';
import { Arrow } from '../components/Primitives';
import ProjectArt from '../components/ProjectArt';
import Disclosure from '../components/Disclosure';
import type { stages } from '../data/stages';

function Chapter({ project }: { project: Project }) {
  const id = project.id as keyof typeof stages;
  return (
    <article
      id={id === 'sentinel' ? 'sentinelai' : id}
      className={'chapter chapter-' + id}
    >
      <div className="container chapter-layout">
        <header className="chapter-title">
          <p className="instrument-label">{project.field}</p>
          <h2>{project.name}</h2>
          <p>{project.tagline}</p>
        </header>
        <ProjectArt id={id} />
        <div className="chapter-details">
          <p>{project.implementation}</p>
          <p className="chapter-stack">{project.stack.join(' · ')}</p>
          <div className="project-links">
            <a href={project.source}>
              GitHub <Arrow direction="up-right" />
            </a>
            {project.demo && (
              <a href={project.demo}>
                Live demo <Arrow direction="up-right" />
              </a>
            )}
          </div>
          <Disclosure title="Engineering notes" className="engineering-notes">
            <p>{project.result}</p>
          </Disclosure>
        </div>
      </div>
    </article>
  );
}
export default function Work() {
  return (
    <section id="work" tabIndex={-1} aria-label="Featured projects">
      {selectedProjects.map((project) => (
        <Chapter key={project.id} project={project} />
      ))}
    </section>
  );
}
export function Archive() {
  return (
    <div className="container archive-shell" id="more-projects">
      <Disclosure
        title="Explore More Projects"
        description="Five more builds, experiments, and collaborations."
        className="archive"
      >
        <div className="archive-grid">
          {moreProjects.map((project, index) => (
            <article className="archive-card" key={project.name}>
              <ProjectGlyph index={index} />
              <p className="eyebrow">{project.tech}</p>
              <h3>{project.name}</h3>
              <details>
                <summary>Project details</summary>
                <p>{project.detail}</p>
              </details>
              <div className="project-links">
                {project.url && (
                  <a href={project.url}>
                    GitHub <Arrow direction="up-right" />
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo}>
                    Live demo <Arrow direction="up-right" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Disclosure>
    </div>
  );
}
