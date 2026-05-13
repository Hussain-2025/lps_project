import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAlbums } from "../features/gallery/api";
import { useNotices } from "../features/notices/api";

const infrastructureItems = [
  {
    title: "Art & Craft",
    description:
      "Creative studio activities such as cutting, paper folding, drawing, coloring, and clay modelling help students build imagination with confidence.",
    accentClass: "infrastructure-accent-primary",
    badge: "AC",
    image: "/slider1.jpeg",
  },
  {
    title: "School Library",
    description:
      "A reading-rich library space encourages curiosity, focused study, and the habit of independent learning across every age group.",
    accentClass: "infrastructure-accent-secondary",
    badge: "SL",
    image: "/slider2.jpeg",
  },
  {
    title: "Mind Power",
    description:
      "Mind-lab activities are designed to strengthen attention, reasoning, and the confidence students need to solve real challenges.",
    accentClass: "infrastructure-accent-ribbon-blue",
    badge: "MP",
    image: "/slider3.jpeg",
  },
  {
    title: "Sports",
    description:
      "Open play areas and guided sports activities support teamwork, discipline, fitness, and a healthy school-life balance.",
    accentClass: "infrastructure-accent-ribbon-blue-deep",
    badge: "SP",
    image: "/slider4.jpeg",
  },
  {
    title: "3D Lab",
    description:
      "Interactive science learning experiences make complex ideas easier to visualize, explore, and remember in the classroom.",
    accentClass: "infrastructure-accent-cyan",
    badge: "3D",
    image: "/slider6.jpeg",
  },
  {
    title: "Robotics",
    description:
      "Hands-on robotics sessions introduce students to practical innovation, logical thinking, and future-ready technical skills.",
    accentClass: "infrastructure-accent-blue-soft",
    badge: "RB",
    image: "/gallery2.jpeg",
  },
] as const;

const heroSlides = [
  { src: "/slider1.jpeg", alt: "Students enjoying campus life at Lovely Public School" },
  { src: "/slider2.jpeg", alt: "Leadership and guidance at Lovely Public School" },
  { src: "/slider3.jpeg", alt: "Creative learning activities at Lovely Public School" },
  { src: "/slider4.jpeg", alt: "Students on stage at Lovely Public School" },
  { src: "/slider6.jpeg", alt: "Science laboratory learning at Lovely Public School" },
] as const;

const galleryShowcaseItems = [
  {
    src: "/slider1.jpeg",
    alt: "Students enjoying campus activities",
    title: "Campus Life",
    description: "Everyday learning moments shaped by confidence, curiosity and community spirit.",
  },
  {
    src: "/slider2.jpeg",
    alt: "School leadership and mentoring",
    title: "Guidance",
    description: "A nurturing environment led by care, discipline and strong academic direction.",
  },
  {
    src: "/slider3.jpeg",
    alt: "Creative classroom activities",
    title: "Creative Learning",
    description: "Hands-on activities that help students express ideas through art and exploration.",
  },
  {
    src: "/slider4.jpeg",
    alt: "Students participating in stage performance",
    title: "Performing Arts",
    description: "Celebrating expression, confidence and joyful participation beyond the classroom.",
  },
  {
    src: "/gallery2.jpeg",
    alt: "Student with colorful painted hands",
    title: "Happy Moments",
    description: "Bright memories that reflect the school’s energy, warmth and student-first culture.",
  },
  {
    src: "/slider6.jpeg",
    alt: "Students in science laboratory",
    title: "Discovery",
    description: "Future-ready learning spaces where students observe, experiment and grow.",
  },
] as const;

const testimonials = [
  {
    quote:
      "Lovely Public Senior Secondary School is a right, safe and understanding school in every way. I am very happy with how my child has progressed and developed confidence.",
    name: "Ritu Aggarwal",
    relation: "Mother of Unnati Aggarwal",
    accentClass: "testimonial-accent-primary",
  },
  {
    quote:
      "My son joined at age 4 and now he is 11. This school has been an educational institution with excellent teachers, co-curricular activities, and a caring environment that nurtures creativity.",
    name: "Parul Suneja",
    relation: "Mother of Jagrit Suneja",
    accentClass: "testimonial-accent-secondary",
  },
  {
    quote:
      "I am very grateful for the inspiring teachers and learning experience my child has received here. The school supports academics and personality growth in a balanced way.",
    name: "Ricky Malhotra",
    relation: "Mother of Sarthak Malhotra",
    accentClass: "testimonial-accent-tertiary",
  },
  {
    quote:
      "The school has given my daughter a warm environment where discipline and encouragement go together. She enjoys learning and comes home excited to share what she discovered in class.",
    name: "Neha Khanna",
    relation: "Mother of Aanya Khanna",
    accentClass: "testimonial-accent-primary",
  },
  {
    quote:
      "We have seen steady improvement in communication, confidence and classroom participation. The teachers are approachable and genuinely invested in each child's progress.",
    name: "Sandeep Arora",
    relation: "Father of Vihaan Arora",
    accentClass: "testimonial-accent-secondary",
  },
  {
    quote:
      "Lovely Public School maintains a strong balance between academics, values and co-curricular learning. My son feels supported, challenged and happy to be part of the school community.",
    name: "Pooja Bhatia",
    relation: "Mother of Kabir Bhatia",
    accentClass: "testimonial-accent-tertiary",
  },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getVisibleTestimonials(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => testimonials[(start + offset) % testimonials.length]);
}

export function HomePage() {
  const notices = useNotices({ page: 1, includeUnpublished: false });
  const albums = useAlbums();
  const hasData = (notices.data?.data?.length ?? 0) > 0 || (albums.data?.length ?? 0) > 0;
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  function goHero(delta: number) {
    setActiveSlide((current) => (current + delta + heroSlides.length) % heroSlides.length);
  }

  function goTestimonial(delta: number) {
    setActiveTestimonial((current) => (current + delta + testimonials.length) % testimonials.length);
  }

  const visibleTestimonials = getVisibleTestimonials(activeTestimonial, 3);

  return (
    <div>
      <section aria-roledescription="carousel" aria-label="School highlights" className="hero hero-page hero-slider-panel">
        <div className="hero-slider-viewport">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              alt={activeSlide === index ? slide.alt : ""}
              aria-hidden={activeSlide !== index}
              className={`hero-slider-image ${activeSlide === index ? "active" : ""}`}
              src={slide.src}
            />
          ))}
          <div className="hero-slider-scrim" aria-hidden="true" />
          <div className="hero-slider-content">
            <div className="container hero-slider-inner">
              <div className="hero-copy hero-copy--slider">
                <p className="eyebrow eyebrow--on-dark">Est. 1966 · CBSE Affiliated</p>
                <h1>Welcome to the new digital gateway for Lovely Public School.</h1>
                <p className="lead lead--on-dark">
                  Discover admissions, notices, gallery updates and ERP access in one clean, modern portal built for
                  students, parents and the school community.
                </p>
                <div className="button-row">
                  <Link className="button button-primary" to="/admission">
                    Apply Now
                  </Link>
                  <Link className="button button-secondary button-secondary--on-dark" to="/contact">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <button
            aria-label="Previous slide"
            className="hero-slider-arrow hero-slider-arrow--prev"
            onClick={() => goHero(-1)}
            type="button"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            className="hero-slider-arrow hero-slider-arrow--next"
            onClick={() => goHero(1)}
            type="button"
          >
            ›
          </button>
          <div className="hero-slider-dots" role="tablist" aria-label="Hero slides">
            {heroSlides.map((slide, index) => (
              <button
                aria-current={activeSlide === index}
                aria-label={`Slide ${index + 1}`}
                className={activeSlide === index ? "active" : ""}
                key={slide.src}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            ))}
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
            <p className="eyebrow testimonials-eyebrow">Testimonials</p>
            <h2>What parents say about Lovely Public School</h2>
          </div>

          <div aria-roledescription="carousel" aria-label="Parent testimonials" className="testimonials-slider">
            <button
              aria-label="Previous testimonial"
              className="testimonials-arrow testimonials-arrow--prev"
              onClick={() => goTestimonial(-1)}
              type="button"
            >
              {"\u2039"}
            </button>
            <div className="testimonials-viewport">
              <div className="testimonials-track">
                {visibleTestimonials.map((testimonial, index) => (
                  <article
                    className={`testimonial-card ${testimonial.accentClass}`}
                    key={`${testimonial.name}-${activeTestimonial}-${index}`}
                  >
                    <span className="testimonial-quote-mark" aria-hidden="true">
                      {"\u201C"}
                    </span>
                    <p>{testimonial.quote}</p>
                    <div className="testimonial-meta">
                      <div className={`testimonial-avatar ${testimonial.accentClass}`} aria-hidden="true">
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <h3>{testimonial.name}</h3>
                        <small>{testimonial.relation}</small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <button
              aria-label="Next testimonial"
              className="testimonials-arrow testimonials-arrow--next"
              onClick={() => goTestimonial(1)}
              type="button"
            >
              {"\u203A"}
            </button>
          </div>

          <div className="testimonials-dots" aria-label="Testimonial slides">
            {testimonials.map((testimonial, index) => (
              <button
                aria-label={`Show testimonial set ${index + 1}`}
                aria-current={activeTestimonial === index}
                className={activeTestimonial === index ? "active" : ""}
                key={testimonial.name}
                onClick={() => setActiveTestimonial(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section gallery-showcase-section">
        <div className="container gallery-showcase-shell">
          <div className="gallery-showcase-header">
            <p className="eyebrow">Gallery</p>
            <h2>School moments captured in a warm, lively frame</h2>
            <p>
              A quick visual tour of campus life, creative learning and the joyful experiences that shape each school
              day at Lovely Public School.
            </p>
          </div>

          <div className="gallery-showcase-grid">
            {galleryShowcaseItems.map((item) => (
              <article className="gallery-showcase-card" key={item.title}>
                <div className="gallery-showcase-media">
                  <img alt={item.alt} src={item.src} />
                </div>
              </article>
            ))}
          </div>

          <div className="gallery-showcase-actions">
            <Link className="button button-primary" to="/gallery">
              Explore Full Gallery
            </Link>
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
