import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import React from "react";
import Layout from "@/components/layout/Layout";
import { getServicesPage, STRAPI_URL } from "@/lib/strapi";
import { Check, Sparkles, Target } from "lucide-react";

interface ServicesPageData {
  id: number;
  title: string;
  subtitle?: string;
  heroImage?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  contentSections?: any[];
}

const ClarityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-8 h-8 text-primary">
    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" strokeWidth="0.5" stroke="currentColor" />
    <circle cx="16" cy="10" r="0" fill="currentColor" strokeWidth="0.5" stroke="currentColor">
      <animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;1.75;0;0" />
    </circle>
    <circle cx="12" cy="10" r="0" fill="currentColor" strokeWidth="0.5" stroke="currentColor">
      <animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;1.75;0;0" />
    </circle>
    <circle cx="8" cy="10" r="0" fill="currentColor" strokeWidth="0.5" stroke="currentColor">
      <animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;1.75;0;0" />
    </circle>
  </svg>
);

const ConfidenceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-8 h-8 text-primary">
    <rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1" strokeWidth="0.5" stroke="#0849bf">
      <animate id="SVG7JagGz2Y" fill="freeze" attributeName="x" begin="0;SVGgDT19bUV.end" dur="0.2s" values="1;13" />
      <animate id="SVGpS1BddYk" fill="freeze" attributeName="y" begin="SVGc7yq8dne.end" dur="0.2s" values="1;13" />
      <animate id="SVGboa7EdFl" fill="freeze" attributeName="x" begin="SVG0ZX9C6Fa.end" dur="0.2s" values="13;1" />
      <animate id="SVG6rrusL2C" fill="freeze" attributeName="y" begin="SVGTOnnO5Dr.end" dur="0.2s" values="13;1" />
    </rect>
    <rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1" strokeWidth="0.5" stroke="#0849bf">
      <animate id="SVGc7yq8dne" fill="freeze" attributeName="y" begin="SVG7JagGz2Y.end" dur="0.2s" values="13;1" />
      <animate id="SVG0ZX9C6Fa" fill="freeze" attributeName="x" begin="SVGpS1BddYk.end" dur="0.2s" values="1;13" />
      <animate id="SVGTOnnO5Dr" fill="freeze" attributeName="y" begin="SVGboa7EdFl.end" dur="0.2s" values="1;13" />
      <animate id="SVGgDT19bUV" fill="freeze" attributeName="x" begin="SVG6rrusL2C.end" dur="0.2s" values="13;1" />
    </rect>
  </svg>
);

const ConnectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-8 h-8 text-primary">
    <g>
      <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.14" strokeWidth="0.5" stroke="currentColor" />
      <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.29" transform="rotate(30 12 12)" strokeWidth="0.5" stroke="currentColor" />
      <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.43" transform="rotate(60 12 12)" strokeWidth="0.5" stroke="currentColor" />
      <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.57" transform="rotate(90 12 12)" strokeWidth="0.5" stroke="currentColor" />
      <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.71" transform="rotate(120 12 12)" strokeWidth="0.5" stroke="currentColor" />
      <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.86" transform="rotate(150 12 12)" strokeWidth="0.5" stroke="currentColor" />
      <rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)" strokeWidth="0.5" stroke="currentColor" />
      <animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
    </g>
  </svg>
);

const ServicesPage = () => {
  const [pageData, setPageData] = useState<ServicesPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const benefits = [
    "Leadership Communication & Executive Presence: Strengthen how leaders communicate and show up in high-stakes environments. Ideal for executives and senior leaders.",
    "Public Speaking for Leaders: Master the art of delivering impactful presentations and speeches. Ideal for leaders who need to influence and inspire audiences.",
    "Leadership Visibility & Stakeholder Presence: Enhance visibility and build stronger stakeholder relationships. Ideal for leaders focused on influence and networking.",
    "Executive Presence [including professional image & etiquette]: Develop the gravitas and authority that commands attention. Ideal for professionals building executive presence.",
  ];

  const outcomes = [
    {
      icon: ClarityIcon,
      title: "Confident Communication for Client-Facing Teams",
      description: "Build confidence and presence in client interactions. Ideal for professionals in sales, consulting, and customer service.",
    },
    {
      icon: ConfidenceIcon,
      title: "Professional Presence & Brand Representation",
      description: "Develop the professional image and etiquette that enhances brand representation. Ideal for client-facing roles.",
    },
    {
      icon: ConnectionIcon,
      title: "Communication Under Pressure",
      description: "Maintain composure and effectiveness in high-pressure client situations. Ideal for teams dealing with challenging client engagements.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServicesPage();
        if (data) {
          setPageData(data);
        }
      } catch (error) {
        console.error('Error fetching services page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = () => {
    if (pageData?.heroImage?.data?.attributes?.url) {
      const url = pageData.heroImage.data.attributes.url;
      return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
    }
    return "/team.png";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center -mt-[77px] md:mt-0">
            <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">
              {loading ? 'Loading...' : pageData?.subtitle || 'OUR WORK'}
            </p>
            <h1 className="text-2xl md:text-5xl font-bold text-foreground mb-6 leading-tight break-words opacity-0 animate-fade-up delay-100 text-center">
              {loading ? 'Loading...' : pageData?.title || 'Practical, Application-Driven'}
              <br />
              <span className="text-primary">Programmes</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-full md:max-w-2xl mx-auto text-center break-words opacity-0 animate-fade-up delay-200">
              Our programmes are practical, application-driven and tailored to organisational context. Delivered through workshops, coaching and speaking, they are designed for immediate and sustained impact.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-24 bg-secondary">
        <div className="px-6 relative z-10 w-full max-w-full h-full flex flex-col justify-center items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="text-center md:text-left">
              <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">CORPORATE PROGRAMMES</p>
              <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6 text-center md:text-left">
                Leadership<br />
                Communication<br />
                Development
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Our programmes strengthen how leaders communicate, show up and influence, particularly where clarity, confidence and credibility are critical.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex flex-col md:flex-row items-center md:items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground text-center md:text-left break-words">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={getImageUrl()}
                  alt={pageData?.heroImage?.data?.attributes?.alternativeText || "Professional coaching team"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto px-6 w-full max-w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">CLIENT-FACING & CUSTOMER ENGAGEMENT</p>
            <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6">
              Building Confidence in Client Interactions
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Programmes designed to enhance communication and presence in client-facing roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="group bg-card rounded-lg p-8 border border-primary md:border-primary/20 md:border-2 hover:border-primary/80 transition-all duration-300 text-center animate-border-flash"
              >
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-2">{index + 1}</div>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto">
                    <outcome.icon />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {outcome.title}
                </h3>
                <p className="text-primary leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">DELIVERY FORMATS</p>
            <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6">
              Flexible Delivery Options
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl font-bold text-primary animate-number-flash">1</div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  In-Person
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interactive workshops and coaching sessions conducted face-to-face for maximum engagement and impact.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl font-bold text-primary animate-number-flash">2</div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Virtual
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Online workshops and coaching sessions delivered remotely, ensuring accessibility and convenience.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl font-bold text-primary animate-number-flash">3</div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Hybrid
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A combination of in-person and virtual delivery, offering flexibility to meet diverse organisational needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-0 md:h-screen md:flex md:justify-center md:items-center bg-none md:bg-[url('/pre-footer.png')] bg-cover bg-center relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Partner
              <br />
              <span className="block text-center">?</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              If you're developing leaders, strengthening client-facing capability or looking for a speaker, we would be glad to explore how we can support your goals.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-7 py-6 group"
            >
              <Link to="/contact">
                Request a Conversation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
