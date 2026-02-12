import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import React from "react";
import Layout from "@/components/layout/Layout";
import { getAboutPage, STRAPI_URL } from "@/lib/strapi";
import { Award, BookOpen, Users, Heart } from "lucide-react";

interface AboutPageData {
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

// Fallback static data
const fallbackValues = [
  {
    icon: Heart,
    title: "Leadership Pipeline Development",
    description: "Building strong leaders ready to take on greater responsibilities.",
  },
  {
    icon: BookOpen,
    title: "Succession Readiness and Talent Visibility",
    description: "Preparing leaders for succession and increasing their visibility within the organization.",
  },
  {
    icon: Users,
    title: "Stakeholder Confidence and Executive Readiness",
    description: "Enhancing confidence in stakeholder interactions and executive-level readiness.",
  },
  {
    icon: Award,
    title: "Team Alignment and Performance",
    description: "Aligning teams through effective communication and improving overall performance.",
  },
];

const About = () => {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutPage();
        if (data) {
          setPageData(data);
        }
      } catch (error) {
        console.error('Error fetching about page data:', error);
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
    return "/melody.png";
  };

  // Schema.org JSON-LD for Person
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Melody",
        "jobTitle": "Communication Coach",
        "description": "Professional communication coach helping executives and entrepreneurs enhance their communication skills.",
        "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        "url": window.location.href,
        "sameAs": [
          "https://www.linkedin.com/in/melody-chipo-njanji-makuwaza-65b1782a",
          "https://www.facebook.com/DialoguesWithMel",
          "https://www.instagram.com/dialogueswithmel/"
        ]
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(personSchema);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-background">
        <div className="px-6 relative z-10 w-full max-w-full h-full flex flex-col justify-center items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="text-center md:text-left -mt-[70px] md:mt-0">
              <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">
                {loading ? 'Loading...' : pageData?.subtitle || 'WHO WE SERVE'}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                {loading ? 'Loading...' : pageData?.title || 'Partners in Leadership'}
                <br />
                <span className="text-primary">Development</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our work is particularly suited to technically strong leaders whose impact depends on effective communication and presence.
              </p>
              <ul className="text-lg text-muted-foreground leading-relaxed list-none md:list-disc md:list-inside">
                <li>Corporates and financial institutions</li>
                <li>Public sector and NGOs</li>
                <li>Leadership teams and executives</li>
                <li>Professionals and emerging leaders</li>
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={getImageUrl()}
                  alt={pageData?.heroImage?.data?.attributes?.alternativeText || "Melody - Communication Coach"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto px-6 w-full max-w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">STRATEGIC OUTCOMES</p>
            <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6">
              What We Achieve
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fallbackValues.map((value, index) => (
              <div
                key={index}
                className="text-center p-8"
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-0 md:h-screen md:flex md:justify-center md:items-center bg-secondary relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Partner
              <br />
              <span className="block">?</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              If you're developing leaders, strengthening client-facing capability or looking for a speaker, we would be glad to explore how we can support your goals.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-7 py-6 group"
            >
              <Link to="/contact">Request a Conversation</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
