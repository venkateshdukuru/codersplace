import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code,
  Brain,
  Users,
  Trophy,
  ArrowRight,
} from "lucide-react";
import heroImage from "@/assets/home_page.png"; // 👈 Replace with your hero image

const Home = () => {
  const features = [
    {
      icon: Code,
      title: "Data Structures & Algorithms",
      description:
        "Master DSA with problems ranging from easy to hard difficulty levels",
      link: "/coding",
    },
    {
      icon: Brain,
      title: "Aptitude, Reasoning & Verbal",
      description:
        "Comprehensive ARV preparation with topic-wise practice",
      link: "/arv",
    },
    {
      icon: Users,
      title: "Interview Preparation",
      description:
        "Technical interview questions for OS, DBMS, System Design & more",
      link: "/interview",
    },
    {
      icon: Trophy,
      title: "Hackathons & Competitions",
      description:
        "Stay updated with latest coding competitions and hackathons",
      link: "/hackathons",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Master Your{" "}
              <span className="text-blue-600">Coding & Interview Skills</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              A complete platform for students & professionals to practice
              coding, prepare for interviews, and stay ahead in competitions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link to="/coding">Start Practicing</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/interview">Interview Prep</Link>
              </Button>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="flex justify-center relative">
            <img
              src={heroImage}
              alt="Hero Banner"
              className="w-4/5 sm:w-3/4 md:w-full max-w-md rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-12">
            Everything You Need in One Place
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <Link to={feature.link}>
                        Explore <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-base sm:text-lg mb-6 md:mb-8">
            Join thousands of learners who are achieving success with CodersPlace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link to="/coding">Start Now</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/interview">View Guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
