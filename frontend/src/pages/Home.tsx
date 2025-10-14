import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Brain, Users, Trophy, ArrowRight, BookOpen, Zap, Award, CheckCircle, Rocket, ChevronRight, Star, TrendingUp, UserCircle, Quote, ChevronLeft } from 'lucide-react';

// Custom hook for counting animation
const useCountAnimation = (end, duration = 2000, shouldStart = true) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = Date.now();
    const endValue = parseInt(end.toString().replace(/\D/g, ''));
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCount);
      }
    };
    
    rafRef.current = requestAnimationFrame(updateCount);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
};

// Typing animation component
const TypingAnimation = ({ text, className = "", delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Hide cursor after typing is complete
      setTimeout(() => setShowCursor(false), 1000);
    }
  }, [currentIndex, text, speed, isTyping]);

  // Cursor blink animation
  useEffect(() => {
    if (showCursor && isTyping) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isTyping]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && currentIndex < text.length && isTyping && (
        <span className="inline-block animate-pulse">|</span>
      )}
    </span>
  );
};

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsInView, setStatsInView] = useState(false);
  const [sectionsInView, setSectionsInView] = useState({});
  const location = useLocation();

  // Scroll to top when component mounts or location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    setIsVisible(true);
    
    // Set up intersection observers for animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      });
    }, observerOptions);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setSectionsInView(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    // Observe stats section
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    // Observe other sections
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => {
      sectionObserver.observe(section);
    });

    return () => {
      statsObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { number: "10000", suffix: "+", label: "Active Learners", icon: Star },
    { number: "500", suffix: "+", label: "Companies Recruited", icon: Users },
    { number: "2000", suffix: "+", label: "Successful Placements", icon: Trophy },
    { number: "95", suffix: "%", label: "Success Rate", icon: TrendingUp }
  ];

  const whyFeatures = [
    { icon: Code, title: "Coding Practice (DSA)", desc: "Easy, Medium & Hard coding challenges with detailed solutions. Master data structures and algorithms." },
    { icon: Brain, title: "Aptitude, Reasoning & Verbal", desc: "Prepare for placement tests with comprehensive topic-wise practice questions and mock tests." },
    { icon: BookOpen, title: "Interview Preparation", desc: "Revise OS, DBMS, OOPs, System Design & more with real interview questions from top companies." },
    { icon: Trophy, title: "Hackathons & Competitions", desc: "Stay updated with live contests & coding events. Gain exposure and stand out to recruiters." },
    { icon: Rocket, title: "Placement Roadmap", desc: "A comprehensive step-by-step guide to help you land your dream job with confidence." }
  ];

  const features = [
    {
      icon: Code,
      number: "1",
      title: "Coding Practice – Data Structures & Algorithms",
      description: "Sharpen your coding skills with hundreds of DSA problems",
      topics: [
        "Arrays, Strings, Linked Lists, Stacks, Queues",
        "Trees, Graphs, Recursion, Backtracking",
        "Dynamic Programming, Greedy, Sorting & Searching"
      ],
      footer: "🎯 Suitable for beginners to advanced coders preparing for coding rounds & online assessments.",
      link: "/coding",
      gradient: "from-white-50 to-white-100",
      image: "https://img.freepik.com/premium-vector/boy-coding-with-laptop-illustration_418302-2379.jpg",
      imageAlt: "Coding Practice Dashboard"
    },
    {
      icon: Brain,
      number: "2",
      title: "Aptitude, Reasoning & Verbal",
      description: "Crack placement tests with ARV practice questions",
      topics: [
        "Quantitative Aptitude (Percentages, Probability, Algebra, etc.)",
        "Logical Reasoning (Puzzles, Data Interpretation, Seating Arrangements)",
        "Verbal Ability (Grammar, Vocabulary, Reading Comprehension)"
      ],
      footer: "💡 Perfect for campus placements, competitive exams, and company aptitude tests.",
      link: "/arv",
      gradient: "from-white-50 to-white-100",
      image: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20211116123009/Quantitative-Aptitude-Concepts-Questions-and-Explanation.png",
      imageAlt: "Aptitude Test Interface"
    },
    {
      icon: BookOpen,
      number: "3",
      title: "Interview Preparation",
      description: "Prepare like a pro with real interview questions",
      topics: [
        "Operating Systems (processes, threads, scheduling, deadlocks)",
        "DBMS (SQL queries, transactions, normalization)",
        "Object-Oriented Programming (OOPs concepts, design patterns)",
        "System Design (scalable architectures, low-level & high-level design)",
        "Computer Networks (OSI model, TCP/IP, routing)"
      ],
      footer: "✅ Tailored for product-based companies, FAANG interviews, and service companies.",
      link: "/interview",
      gradient: "from-white-50 to-white-100",
      image: "https://codequotient.com/blog/wp-content/uploads/2022/12/How-To-Practice-Coding-Interview-Amazing-Tips-Included-To-Crack-Best-MNCs.jpg",
      imageAlt: "Interview Preparation Resources"
    },
    {
      icon: Trophy,
      number: "4",
      title: "Hackathons & Competitions",
      description: "Participate in real-world coding challenges",
      topics: [
        "Online hackathons & coding contests",
        "Company-hosted recruitment challenges",
        "Competitive programming events"
      ],
      footer: "🏆 Gain exposure, build projects, and stand out to recruiters.",
      link: "/hackathons",
      gradient: "from-white-50 to-white-100",
      image: "https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg",
      imageAlt: "Hackathon Competition"
    }
  ];

  const roadmapSteps = [
    {
      step: "Step 1",
      title: "Enroll & Get Started",
      description: "Sign up on CodersPlace and set your personalized learning path.",
      icon: UserCircle
    },
    {
      step: "Step 2",
      title: "Build Coding Foundations",
      description: "Solve DSA problems from beginner to advanced level systematically.",
      icon: Code
    },
    {
      step: "Step 3",
      title: "Practice Aptitude & Reasoning",
      description: "Strengthen aptitude, logical reasoning & verbal skills with mock tests.",
      icon: Brain
    },
    {
      step: "Step 4",
      title: "Revise Core Subjects",
      description: "Prepare OS, DBMS, OOPs, Networking, and System Design thoroughly.",
      icon: BookOpen
    },
    {
      step: "Step 5",
      title: "Compete & Showcase Skills",
      description: "Join hackathons & coding competitions to gain visibility and experience.",
      icon: Trophy
    },
    {
      step: "Step 6",
      title: "Land Your Dream Job",
      description: "Be fully prepared for campus placements, off-campus drives, and product-based company interviews.",
      icon: Award
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "PS",
      text: "CodersPlace was instrumental in my FAANG journey. The DSA problems and system design questions helped me crack Google's interview on my first attempt!",
      company: "Google"
    },
    {
      name: "Rahul Verma",
      role: "SDE-2 at Amazon",
      image: "RV",
      text: "The interview preparation section is a goldmine! Real questions from top companies with detailed explanations. I landed my dream job at Amazon thanks to CodersPlace.",
      company: "Amazon"
    },
    {
      name: "Ananya Das",
      role: "Product Engineer at Microsoft",
      image: "AD",
      text: "From campus placements to Microsoft - CodersPlace guided me every step. The roadmap feature kept me on track and the ARV practice was perfect for aptitude tests.",
      company: "Microsoft"
    },
    {
      name: "Karthik Reddy",
      role: "Hackathon Winner",
      image: "KR",
      text: "Won 3 major hackathons after practicing on CodersPlace. The competition section keeps me updated with all events, and the community support is amazing!",
      company: "Multiple Wins"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Typing Animation */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <TypingAnimation 
                text="Master Your " 
                speed={60}
              />
              <span className="text-indigo-600">
                <TypingAnimation 
                  text="Coding" 
                  delay={800}
                  speed={60}
                />
              </span>
              <TypingAnimation 
                text=" & " 
                delay={1300}
                speed={60}
              />
              <span className="text-indigo-600">
                <TypingAnimation 
                  text="Interview Skills" 
                  delay={1500}
                  speed={60}
                />
              </span>
            </h1>
            
            <div className="overflow-hidden">
              <p className={`mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                CodersPlace is your one-stop platform for coding practice, aptitude training, interview preparation, and hackathons. Designed for students & professionals to crack placements and excel in competitive programming.
              </p>
            </div>
            
            <div className={`mt-10 transition-all duration-1000 delay-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Button size="lg" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-all group">
                <Link to="/coding" className="flex items-center">
                  Start Practicing Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Stats with Counting Animation */}
            <div id="stats-section" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const animatedValue = useCountAnimation(stat.number, 2500, statsInView);
                return (
                  <div 
                    key={index} 
                    className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                      statsInView ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 tabular-nums">
                      <span className="inline-block min-w-[100px]">
                        {animatedValue.toLocaleString()}{stat.suffix}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why CodersPlace Section - Simplified */}
      <section id="why-section" className="py-20 bg-gray-50 animate-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 transform ${
            sectionsInView['why-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why <span className="text-indigo-600">CodersPlace?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to excel in placements and competitive programming
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all bg-white ${
                    sectionsInView['why-section'] 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{
                    transitionDelay: sectionsInView['why-section'] ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-base">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Feature Sections - Number animation removed */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            const sectionId = `feature-${index}`;
            return (
              <div key={index} id={sectionId} className="space-y-6 animate-section">
                <div className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-1000 transform ${
                  sectionsInView[sectionId] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    <span className="text-indigo-600">{feature.number}.</span> {feature.title}
                  </h2>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </div>

                <div className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 transition-all duration-1000 transform ${
                  sectionsInView[sectionId] ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                }`}>
                  <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`space-y-6 ${!isEven ? 'md:order-2' : ''}`}>
                      <ul className="space-y-4">
                        {feature.topics.map((topic, idx) => (
                          <li 
                            key={idx} 
                            className={`flex items-start transition-all duration-500 transform ${
                              sectionsInView[sectionId] 
                                ? 'translate-x-0 opacity-100' 
                                : '-translate-x-10 opacity-0'
                            }`}
                            style={{
                              transitionDelay: sectionsInView[sectionId] ? `${idx * 150 + 300}ms` : '0ms'
                            }}
                          >
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <ChevronRight className="w-4 h-4 text-white" />
                            </div>
                            <span className="ml-3 text-gray-700 text-base leading-relaxed">{topic}</span>
                          </li>
                        ))}
                      </ul>
                      <p className={`text-sm text-gray-700 italic pl-2 border-l-4 border-indigo-400 transition-all duration-700 transform ${
                        sectionsInView[sectionId] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                      }`}
                      style={{
                        transitionDelay: sectionsInView[sectionId] ? '800ms' : '0ms'
                      }}>
                        {feature.footer}
                      </p>
                      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105 transition-all group">
                        <Link to={feature.link} className="flex items-center">
                          Explore {feature.title.split(' ')[0]}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>

                    {/* Image Section */}
                    <div className={`flex justify-center ${!isEven ? 'md:order-1' : ''}`}>
                      <div className={`w-full max-w-md relative group transition-all duration-1000 transform ${
                        sectionsInView[sectionId] 
                          ? 'translate-x-0 opacity-100 scale-100' 
                          : `${isEven ? 'translate-x-10' : '-translate-x-10'} opacity-0 scale-90`
                      }`}
                      style={{
                        transitionDelay: sectionsInView[sectionId] ? '400ms' : '0ms'
                      }}>
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white transform transition-transform duration-300 group-hover:scale-105">
                          <img 
                            src={feature.image} 
                            alt={feature.imageAlt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          
                          <div 
                            className="hidden w-full aspect-square bg-white/60 backdrop-blur-sm items-center justify-center"
                            style={{ display: 'none' }}
                          >
                            <Icon className="w-40 h-40 text-gray-300" strokeWidth={1.5} />
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-4 italic">
                          {feature.imageAlt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap-section" className="py-20 bg-gradient-to-b from-indigo-50 via-blue-50 to-white animate-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${
            sectionsInView['roadmap-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Roadmap to <span className="text-indigo-600">Placement Success</span>
            </h2>
            <p className="text-lg text-gray-600">
              Follow this comprehensive path to crack placements with confidence
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-300 transition-all duration-[2000ms] origin-top ${
              sectionsInView['roadmap-section'] ? 'scale-y-100' : 'scale-y-0'
            }`}></div>

            <div className="space-y-12">
              {roadmapSteps.map((step, index) => {
                const Icon = step.icon;
                const isLeft = index % 2 === 0;
                return (
                  <div 
                    key={index} 
                    className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} transition-all duration-700 transform ${
                      sectionsInView['roadmap-section'] 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-10 opacity-0'
                    }`}
                    style={{
                      transitionDelay: sectionsInView['roadmap-section'] ? `${index * 200}ms` : '0ms'
                    }}
                  >
                    {/* Timeline dot */}
                    <div className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center z-10 border-4 border-white shadow-lg transition-all duration-500 ${
                      sectionsInView['roadmap-section'] ? 'scale-100' : 'scale-0'
                    }`}
                    style={{
                      transitionDelay: sectionsInView['roadmap-section'] ? `${index * 200 + 300}ms` : '0ms'
                    }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                      <Card className="bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all transform hover:scale-105">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4 md:hidden mb-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-indigo-600 mb-2">{step.step}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="hidden md:block w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`mt-16 text-center transition-all duration-1000 transform ${
            sectionsInView['roadmap-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            transitionDelay: sectionsInView['roadmap-section'] ? '1500ms' : '0ms'
          }}>
            <Button size="lg" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-all group">
              <Link to="/coding" className="flex items-center">
                Start Your Roadmap Now
                <Rocket className="ml-2 w-5 h-5 animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="testimonials-section" className="py-20 bg-gray-50 animate-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 transform ${
            sectionsInView['testimonials-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Success <span className="text-indigo-600">Stories</span>
            </h2>
            <p className="text-lg text-gray-600">
              Thousands of learners trust CodersPlace to achieve their career goals
            </p>
          </div>

          {/* Testimonial Slider */}
          <div className={`relative max-w-4xl mx-auto mb-16 transition-all duration-1000 transform ${
            sectionsInView['testimonials-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-indigo-100 transform hover:scale-[1.02] transition-transform duration-300">
              <Quote className="w-12 h-12 text-indigo-200 mb-6" />
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8 italic transition-opacity duration-500">
                "{testimonials[currentTestimonial].text}"
              </p>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonials[currentTestimonial].image}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                  <div className="text-indigo-600 text-sm font-semibold">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 transition-colors transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-indigo-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 transition-colors transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-indigo-600" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentTestimonial ? 'bg-indigo-600 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { text: "Placed in FAANG & top product companies" },
              { text: "Won hackathons & global coding challenges" },
              { text: "Cleared campus placements with confidence" }
            ].map((achievement, index) => (
              <Card 
                key={index}
                className={`border-2 border-indigo-200 bg-white hover:shadow-lg transition-all transform hover:scale-105 ${
                  sectionsInView['testimonials-section'] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                }`}
                style={{
                  transitionDelay: sectionsInView['testimonials-section'] ? `${index * 150 + 500}ms` : '0ms'
                }}
              >
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">{achievement.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className={`text-center text-lg text-gray-700 mt-12 font-medium transition-all duration-1000 transform ${
            sectionsInView['testimonials-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            transitionDelay: sectionsInView['testimonials-section'] ? '1000ms' : '0ms'
          }}>
            Start your journey today and be our next success story!
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower.png')] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-orange-500">
              Ready to Ace Your Next Interview?
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of students & professionals building their careers with <span className="font-semibold text-white">CodersPlace</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              size="lg" 
              asChild 
              className=" text-indigo-700 font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:scale-105 text-lg px-10 py-6 rounded-xl"
            >
              <Link to="/coding">🚀 Start Now</Link>
            </Button>
            <Button  
              size="lg" 
              asChild 
              className=" text-indigo-700 font-semibold shadow-lg hover:bg-white transition-all hover:-translate-y-1 hover:scale-105 text-lg px-10 py-6 rounded-xl"
            >
              <Link to="/interview">📘 View Guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;