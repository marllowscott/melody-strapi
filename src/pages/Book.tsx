import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Video } from "lucide-react";
import { getBookPage, STRAPI_URL, BookPage } from "@/lib/strapi";
import { useEffect } from "react";

const Book = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [pageData, setPageData] = useState<BookPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBookPage();
        if (data) {
          setPageData(data);
        }
      } catch (error) {
        console.error('Error fetching book page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mreeargb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your inquiry has been sent. I'll be in touch soon to schedule our call.",
        });
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your inquiry. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      title: "Executive Coaching – BOLD SPEAKING",
      description: "One-on-one coaching focused on confidence, communication, presence and leadership visibility.",
    },
    {
      title: "Open Programmes",
      description: "BOLD SPEAKING – Group Coaching and English Fluency & Confident Communication.",
    },
    {
      title: "Speaking Engagements",
      description: "Keynote topics on leadership confidence, communication with impact, executive presence, and leadership visibility.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 -mt-[77px] md:mt-0">
            <p className="text-primary font-semibold tracking-[0.3em] text-sm mb-4">SPEAKING & COACHING</p>
            <h1 className="text-3xl md:text-6xl font-bold text-foreground mb-6 leading-tight break-words">
              {loading ? 'Loading...' : pageData?.title || 'Melody'}
              <span className="hidden md:inline"> — </span>
              <br />
              <span className="text-primary">Confidence Coach &</span>
              <br />
              <span className="text-primary">Leadership Consultant</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-full md:max-w-2xl mx-auto">
              {loading ? 'Loading...' : pageData?.subtitle || 'Melody specialises in leadership communication, executive presence and visibility. She works with executives, professionals and emerging leaders to strengthen how they show up, communicate and influence, particularly in meetings, presentations, client engagements and other high-stakes moments.'}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-lg p-8 border-2 border-primary/20 hover:border-primary/80 transition-all duration-300 relative text-center animate-border-flash"
              >
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl font-bold text-primary animate-number-flash">{index + 1}</div>
                </div>
                <p className="text-lg text-primary leading-relaxed mb-8 max-w-full">
                  {feature.description}
                </p>
                <div>
                  <p className="font-semibold text-primary">{feature.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 md:p-12 border border-border text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Get In Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Interested in coaching or speaking? Let's discuss how we can work together.
              </p>

              <form
                action="https://formspree.io/f/mreeargb"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      className="rounded-lg bg-secondary border-border text-foreground"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      className="rounded-lg bg-secondary border-border text-foreground"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="rounded-lg bg-secondary border-border text-foreground"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground">
                    Company / Role
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    className="rounded-lg bg-secondary border-border text-foreground"
                    placeholder="Your company and title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-foreground">
                    What are your goals? *
                  </Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    required
                    rows={4}
                    className="rounded-lg bg-secondary border-border text-foreground resize-none"
                    placeholder="Tell me about your goals, challenges, or what prompted you to reach out..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-foreground">
                    Timeline
                  </Label>
                  <Input
                    id="timeline"
                    name="timeline"
                    className="rounded-lg bg-secondary border-border text-foreground"
                    placeholder="Any upcoming events or deadlines I should know about?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral" className="text-foreground">
                    How did you hear about us?
                  </Label>
                  <Input
                    id="referral"
                    name="referral"
                    className="rounded-lg bg-secondary border-border text-foreground"
                    placeholder="Referral, social media, search, etc."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-lg group"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  I typically respond within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Book;
