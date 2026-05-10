import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAlbums } from "../features/gallery/api";
import { useNotices } from "../features/notices/api";

const infrastructureItems = [
  {
    title: "Art & Craft",
    description:
      "Creative studio activities such as cutting, paper folding, drawing, coloring, and clay modelling help students build imagination with confidence.",
    accentClass: "infrastructure-accent-orange",
    badge: "AC",
    image: "/slider1.jpeg",
  },
  {
    title: "School Library",
    description:
      "A reading-rich library space encourages curiosity, focused study, and the habit of independent learning across every age group.",
    accentClass: "infrastructure-accent-gold",
    badge: "SL",
    image: "/slider2.jpeg",
  },
  {
    title: "Mind Power",
    description:
      "Mind-lab activities are designed to strengthen attention, reasoning, and the confidence students need to solve real challenges.",
    accentClass: "infrastructure-accent-sunset",
    badge: "MP",
    image: "/slider3.jpeg",
  },
  {
    title: "Sports",
    description:
      "Open play areas and guided sports activities support teamwork, discipline, fitness, and a healthy school-life balance.",
    accentClass: "infrastructure-accent-lilac",
    badge: "SP",
    image: "/slider4.jpeg",
  },
  {
    title: "3D Lab",
    description:
      "Interactive science learning experiences make complex ideas easier to visualize, explore, and remember in the classroom.",
    accentClass: "infrastructure-accent-green",
    badge: "3D",
    image: "/slider6.jpeg",
  },
  {
    title: "Robotics",
    description:
      "Hands-on robotics sessions introduce students to practical innovation, logical thinking, and future-ready technical skills.",
    accentClass: "infrastructure-accent-cyan",
    badge: "RB",
    image: "/gallery2.jpeg",
  },
] as const;

const campusSlides = [
  { src: "/slider1.jpeg", alt: "Students enjoying school activity" },
  { src: "/slider2.jpeg", alt: "Principal in school office" },
  { src: "/slider3.jpeg", alt: "Students painting in activity area" },
  { src: "/slider4.jpeg", alt: "Young students on stage performance" },
  { src: "/slider6.jpeg", alt: "Students in science laboratory" },
  { src: "/gallery2.jpeg", alt: "Student with colorful painted hands" },
] as const;

const testimonials = [
  {
    quote:
      "Lovely Public Senior Secondary School is a right, safe and understanding school in every way. I am very happy with how my child has progressed and developed confidence.",
    name: "Ritu Aggarwal",
    relation: "Mother of Unnati Aggarwal",
    accentClass: "testimonial-accent-orange",
  },
  {
    quote:
      "My son joined at age 4 and now he is 11. This school has been an educational institution with excellent teachers, co-curricular activities, and a caring environment that nurtures creativity.",
    name: "Parul Suneja",
    relation: "Mother of Jagrit Suneja",
    accentClass: "testimonial-accent-gold",
  },
  {
    quote:
      "I am very grateful for the inspiring teachers and learning experience my child has received here. The school supports academics and personality growth in a balanced way.",
    name: "Ricky Malhotra",
    relation: "Mother of Sarthak Malhotra",
    accentClass: "testimonial-accent-red",
  },
] as const;

export function HomePage() {
  const notices = useNotices({ page: 1, includeUnpublished: false });
  const albums = useAlbums();
  const hasData = (notices.data?.data?.length ?? 0) > 0 || (albums.data?.length ?? 0) > 0;
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % campusSlides.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div>
      <section className="hero hero-page">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Est. 1966 · CBSE Affiliated</p>
            <h1>Welcome to the new digital gateway for Lovely Public School.</h1>
            <p className="lead">
              Discover admissions, notices, gallery updates and ERP access in one clean, modern portal built for
              students, parents and the school community.
            </p>
            <div className="button-row">
              <Link className="button button-primary" to="/admission">
                Apply Now
              </Link>
              <Link className="button button-secondary" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hero-crest-panel">
            <div className="hero-campus-frame">
              <img alt="Lovely Public School logo" src="/logo.png" />
            </div>
            <div className="hero-admissions-card">
              <div className="hero-admissions-tag">
                <span aria-hidden="true" className="hero-admissions-icon">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 8L12 4L21 8L12 12L3 8Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M6 12L12 15L18 12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M6 16L12 19L18 16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
                <p className="eyebrow">Now Open</p>
              </div>
              <h2>Admissions for the next academic year</h2>
              <p>
                Explore our curriculum, campus support, and community-first approach to learning. Your
                next chapter starts here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section campus-slider-section">
        <div className="container campus-slider-shell">
          <div className="campus-slider-copy">
            <p className="eyebrow">Campus Moments</p>
            <h2>Learning, leadership and creativity in every frame</h2>
            <p>
              A quick glimpse into classroom, activity and cultural experiences at Lovely Public School.
            </p>
          </div>
          <div className="campus-slider-frame">
            {campusSlides.map((slide, index) => (
              <img
                key={slide.src}
                alt={slide.alt}
                className={`campus-slider-image ${activeSlide === index ? "active" : ""}`}
                src={slide.src}
              />
            ))}
            <div className="campus-slider-dots" aria-label="Campus gallery slides">
              {campusSlides.map((slide, index) => (
                <button
                  aria-label={`Show slide ${index + 1}`}
                  className={activeSlide === index ? "active" : ""}
                  key={slide.src}
                  onClick={() => setActiveSlide(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section infrastructure-section">
        <div className="container infrastructure-shell">
          <div className="infrastructure-header">
            <h2>Our School Infrastructure</h2>
            <p>
              We also carefully nurture the emotional and social skills of students to strengthen
              leadership, attentiveness, application, and investigatory thinking.
            </p>
          </div>
          <div className="infrastructure-grid">
            {infrastructureItems.map((item) => (
              <article className="infrastructure-card" key={item.title}>
                <div className={`infrastructure-badge ${item.accentClass}`}>
                  <img alt="" aria-hidden="true" className="infrastructure-badge-logo" src={item.image} />
                </div>
                <h3 className={item.accentClass}>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container testimonials-shell">
          <div className="testimonials-header">
            <p className="eyebrow">Testimonials</p>
            <h2>What parents say about Lovely Public School</h2>
          </div>

          <div className="testimonials-slider">
            {testimonials.map((testimonial, index) => (
              <article
                className={`testimonial-card ${testimonial.accentClass} ${activeTestimonial === index ? "active" : ""}`}
                key={testimonial.name}
              >
                <span className="testimonial-quote-mark" aria-hidden="true">
                  "
                </span>
                <p>{testimonial.quote}</p>
                <h3>{testimonial.name}</h3>
                <small>{testimonial.relation}</small>
              </article>
            ))}
          </div>

          <div className="testimonials-dots" aria-label="Testimonial slides">
            {testimonials.map((testimonial, index) => (
              <button
                aria-label={`Show testimonial ${index + 1}`}
                className={activeTestimonial === index ? "active" : ""}
                key={testimonial.name}
                onClick={() => setActiveTestimonial(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      {hasData || notices.isLoading || albums.isLoading ? (
        <section className="section">
          <div className="container two-column">
            <div>
              <h2>Latest notices</h2>
              <div className="stack">
                {notices.isLoading && <p>Loading notices...</p>}
                {notices.isError && <p style={{ color: "#999" }}>Unable to load notices</p>}
                {notices.data?.data?.slice(0, 3).map((notice) => (
                  <Link className="card notice-card" key={notice._id} to={`/notices/${notice._id}`}>
                    <strong>{notice.title}</strong>
                    <span>{notice.tags.join(", ") || "General notice"}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2>Featured gallery</h2>
              <div className="gallery-preview-grid">
                {albums.isLoading && <p>Loading gallery...</p>}
                {albums.isError && <p style={{ color: "#999" }}>Unable to load gallery</p>}
                {albums.data?.slice(0, 4).map((album) => (
                  <Link className="gallery-tile" key={album._id} to={`/gallery/${album._id}`}>
                    {album.coverImageUrl ? (
                      <img alt={album.title} src={album.coverImageUrl} />
                    ) : (
                      <div className="gallery-placeholder">{album.title}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
