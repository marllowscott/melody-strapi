import { useState, useEffect } from "react";
import React from "react";
import { getHomepage, STRAPI_URL } from "@/lib/strapi";

interface Testimonial {
  __component: string;
  id: number;
  quote: string;
  name: string;
  title?: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback static data
  const fallbackTestimonials = [
    {
      quote: "Working with Melody transformed my career. I went from dreading presentations to actively seeking speaking opportunities.",
      name: "Sarah Chen",
      title: "VP of Marketing, TechCorp",
    },
    {
      quote: "Melody has a rare gift for identifying exactly what's holding you back and giving you the tools to break through.",
      name: "Marcus Johnson",
      title: "Startup Founder",
    },
    {
      quote: "After just three sessions, I secured my biggest contract ever. The confidence I gained was immediately visible to my clients.",
      name: "Elena Rodriguez",
      title: "Senior Consultant",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageData = await getHomepage();
        if (homepageData?.contentSections) {
          const testimonialSections = homepageData.contentSections.filter(
            (section) => section.__component === 'sections.testimonial'
          ) as Testimonial[];
          if (testimonialSections.length > 0) {
            setTestimonials(testimonialSections);
          } else {
            setTestimonials(fallbackTestimonials.map((t, i) => ({
              __component: 'sections.testimonial',
              id: i,
              quote: t.quote,
              name: t.name,
              title: t.title,
            })));
          }
        } else {
          setTestimonials(fallbackTestimonials.map((t, i) => ({
            __component: 'sections.testimonial',
            id: i,
            quote: t.quote,
            name: t.name,
            title: t.title,
          })));
        }
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
        setTestimonials(fallbackTestimonials.map((t, i) => ({
          __component: 'sections.testimonial',
          id: i,
          quote: t.quote,
          name: t.name,
          title: t.title,
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-24 bg-secondary relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center hidden md:block" style={{ backgroundImage: 'url(/voices-of-transformation.jpg)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">CLIENT STORIES</p>
          <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6 text-center md:text-left">
            Voices of Transformation
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <div
                key={index}
                className="group bg-card rounded-lg p-8 border-2 border-primary/20 hover:border-primary/80 transition-all duration-300 relative text-center animate-border-flash"
              >
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl font-bold text-primary animate-number-flash">{index + 1}</div>
                </div>
                <div className="h-16 bg-primary/20 rounded mb-8 animate-pulse" />
                <div className="h-4 bg-primary/10 rounded mb-2 animate-pulse w-1/2 mx-auto" />
                <div className="h-3 bg-primary/10 rounded animate-pulse w-1/3 mx-auto" />
              </div>
            ))
          ) : (
            testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group bg-card rounded-lg p-8 border-2 border-primary/20 hover:border-primary/80 transition-all duration-300 relative text-center animate-border-flash"
              >
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl font-bold text-primary animate-number-flash">{index + 1}</div>
                </div>
                <p className="text-lg text-primary leading-relaxed mb-8">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                  {testimonial.title && (
                    <p className="text-sm text-primary">{testimonial.title}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
