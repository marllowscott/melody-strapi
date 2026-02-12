import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import React from "react";
import { getHomepage, STRAPI_URL } from "@/lib/strapi";

interface HeroButton {
  id: number;
  text: string;
  link: string;
}

interface HomepageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroButtons: HeroButton[];
  heroImages: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    }[];
  };
  heroBackgroundType?: 'image' | 'local' | 'color';
  heroBackgroundColor?: string;
  heroOverlayColor?: string;
  heroOverlayOpacity?: number;
  heroLocalImage?: string;
}

// Fallback data when CMS is offline
const FALLBACK_DATA: HomepageData = {
  id: 0,
  heroTitle: "Show up with confidence.\nCommunicate with clarity.\nLead with presence.",
  heroSubtitle: "We support leaders, professionals and client-facing teams to communicate effectively in high-stakes environments — strengthening leadership communication, executive presence and professional visibility.",
  heroButtons: [
    { id: 1, text: "Request a Conversation", link: "/contact" },
    { id: 2, text: "Our Work", link: "/services" }
  ],
  heroImages: {
    data: []
  }
};

const Hero = () => {
  const [currentImage, setCurrentImage] = useState('/roll-1.svg');
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const images = ['/roll-1.svg', '/roll-2.svg', '/roll-3.svg'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % 3;
      setCurrentImage(images[index]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomepage();
        if (data) {
          setHomepageData(data);
        } else {
          // Use fallback data if CMS is offline
          setHomepageData(FALLBACK_DATA);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setHomepageData(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get headline lines from CMS or fallback
  const heroLines = homepageData?.heroTitle 
    ? homepageData.heroTitle.split('\n')
    : ["Show up with confidence.", "Communicate with clarity.", "Lead with presence."];
  
  const fullText = heroLines.join('\n');
  const [letterStates, setLetterStates] = useState<boolean[]>(() => new Array(fullText.length).fill(false));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setLetterStates(prev => {
          const newStates = [...prev];
          newStates[currentIndex] = true;
          return newStates;
        });
        setCurrentIndex(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (currentIndex === fullText.length) {
      const timer = setTimeout(() => {
        setLetterStates(new Array(fullText.length).fill(false));
        setCurrentIndex(0);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText.length]);

  const getButtonVariant = (index: number) => {
    return index === 0 ? 'default' : 'outline';
  };

  // Determine hero background based on CMS settings
  const getHeroBackground = () => {
    const backgroundType = homepageData?.heroBackgroundType || 'local';
    
    if (backgroundType === 'color' && homepageData?.heroBackgroundColor) {
      return { backgroundColor: homepageData.heroBackgroundColor };
    }
    
    if (backgroundType === 'image' && homepageData?.heroImages?.data?.length) {
      const imageUrl = homepageData.heroImages.data[0]?.attributes?.url;
      if (imageUrl) {
        return { 
          backgroundImage: `url(${imageUrl.startsWith('http') ? imageUrl : `${STRAPI_URL}${imageUrl}`})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      }
    }
    
    if (backgroundType === 'local' || !backgroundType) {
      return { backgroundImage: `url(${currentImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    
    return { backgroundColor: '#1a1a1a' }; // Default fallback
  };

  return (
    <section className="relative min-h-[100vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background - Dynamic based on CMS settings */}
      {homepageData?.heroBackgroundType === 'color' ? (
        <div 
          className="absolute inset-0 z-0"
          style={{ backgroundColor: homepageData.heroBackgroundColor || '#1a1a1a' }}
        />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={getHeroBackground()}
        />
      )}
      
      {/* Background Overlay - Navy blue with adjustable opacity */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          backgroundColor: homepageData?.heroOverlayColor || '#060621',
          opacity: homepageData?.heroOverlayOpacity ?? 0.88
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl">
          <div className="max-w-4xl lg:mr-12 text-center md:text-left">
            {/* Main Headline */}
            <h1 className="hidden md:block text-4xl md:text-5xl lg:text-5xl font-bold leading-[0.95] mb-8 opacity-0 animate-fade-up delay-100">
              {homepageData?.heroTitle ? (
                homepageData.heroTitle.split('\n').map((line: string, lineIndex: number) => (
                  <React.Fragment key={lineIndex}>
                    <span className={lineIndex === 1 || lineIndex === 2 ? 'text-primary' : 'text-foreground'}>
                      {line}
                    </span>
                    {lineIndex < homepageData.heroTitle.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              ) : (
                <>
                  <span className="text-foreground">Show up with confidence.</span>
                  <br />
                  <span className="text-primary">Communicate with clarity.</span>
                  <br />
                  <span className="text-primary">Lead with presence.</span>
                </>
              )}
            </h1>

            <h1 className="block md:hidden text-3xl font-light leading-[0.95] mb-8 opacity-0 animate-fade-up delay-100">
              {heroLines.map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line.split('').map((char, charIndex) => {
                    const globalIndex = heroLines.slice(0, lineIndex).reduce((acc, l) => acc + l.length, 0) + charIndex;
                    return (
                      <span key={globalIndex} className={letterStates[globalIndex] ? 'text-primary font-bold' : 'text-foreground'}>
                        {char}
                      </span>
                    );
                  })}
                  {lineIndex < heroLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-full md:max-w-2xl leading-relaxed mb-12 opacity-0 animate-fade-up delay-200">
              {loading ? 'Loading...' : homepageData?.heroSubtitle || FALLBACK_DATA.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-center opacity-0 animate-fade-up delay-300 mb-[10px]">
              {!loading && homepageData?.heroButtons ? (
                homepageData.heroButtons.map((button, index) => (
                  <Button
                    key={button.id}
                    asChild
                    size="lg"
                    variant={getButtonVariant(index) as 'default' | 'outline'}
                    className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-7 py-6 group"
                  >
                    <Link to={button.link.startsWith('http') ? button.link : button.link}>
                      {button.text}
                    </Link>
                  </Button>
                ))
              ) : loading ? (
                <>
                  <Button
                    disabled
                    size="lg"
                    className="rounded-lg bg-primary text-primary-foreground font-semibold text-lg px-7 py-6"
                  >
                    Loading...
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-7 py-6 group"
                  >
                    <Link to="/contact">
                      Request a Conversation
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-lg border-primary text-foreground hover:bg-secondary hover:text-foreground font-semibold text-lg px-8 py-6"
                  >
                    <Link to="/services">Our Work</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Inline Illustration */}
          <div className="hidden lg:flex relative w-[500px] h-auto mt-8 lg:mt-0 justify-center items-center">
            <img 
              src={homepageData?.heroImages?.data?.[0]?.attributes?.url 
                ? (homepageData.heroImages.data[0].attributes.url.startsWith('http') 
                    ? homepageData.heroImages.data[0].attributes.url 
                    : `${STRAPI_URL}${homepageData.heroImages.data[0].attributes.url}`)
                : currentImage
              }
              alt="Hero illustration" 
              className="w-full h-auto transition-subtle rounded-[7px]"
              style={{ borderRadius: '7px' }}
            />
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
