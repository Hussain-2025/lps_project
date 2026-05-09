import { Link } from "react-router-dom";

function StaticPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
}) {
  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="page-intro">
          <p className="eyebrow">LPSNLP School</p>
          <h1>{title}</h1>
          <p className="lead">{intro}</p>
        </div>
        {sections.map((section) => (
          <article className="card surface-card reading-card" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <StaticPage
      title="About the School"
      intro="A school profile shaped by history, community trust, and a more future-ready learning environment."
      sections={[
        {
          heading: "Mission and vision",
          body:
            "The school’s public presence should reflect a balance of academic rigor, personal growth, and accessible communication for families.",
        },
        {
          heading: "Principal's message",
          body:
            "This section can highlight leadership, values, and school direction while remaining easy to update in future content phases.",
        },
        {
          heading: "Management and legacy",
          body:
            "The school’s identity is rooted in New Layal Pur, Delhi, with a long-standing institutional story beginning in 1966.",
        },
      ]}
    />
  );
}

export function AcademicsPage() {
  return (
    <StaticPage
      title="Academics"
      intro="A clear overview of CBSE-oriented academic structure, classroom culture, and assessment approach."
      sections={[
        {
          heading: "Curriculum and classes",
          body:
            "The frontend lays out curriculum, classes offered, and academic expectations in a parent-friendly format.",
        },
        {
          heading: "Teaching methodology",
          body:
            "This page is designed to support future content updates around pedagogy, subject offerings, and student support.",
        },
        {
          heading: "Assessment and exams",
          body:
            "Assessment details, academic cycles, and exam communication can be expanded as ERP result features come online later.",
        },
      ]}
    />
  );
}

export function ActivitiesPage() {
  return (
    <StaticPage
      title="Activities"
      intro="School life extends beyond the classroom through events, competitions, sports, and cultural participation."
      sections={[
        {
          heading: "Sports and competitions",
          body:
            "This section showcases energy, discipline, and school spirit with room for event updates and achievements.",
        },
        {
          heading: "Cultural activities",
          body:
            "The page supports storytelling around annual functions, clubs, and creative student participation.",
        },
        {
          heading: "Educational trips",
          body:
            "Trip highlights and experiential learning can be paired later with gallery albums and notices.",
        },
      ]}
    />
  );
}

export function ERPPlaceholderPage({ title }: { title: string }) {
  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="card feature-panel">
          <p className="eyebrow">ERP Module</p>
          <h1>{title}</h1>
          <p className="lead">
            This route is ready in the app shell and will be connected to attendance, fees,
            results, and timetable APIs once those backend modules are implemented.
          </p>
          <Link className="button button-secondary" to="/">
            Back to public site
          </Link>
        </div>
      </div>
    </section>
  );
}
