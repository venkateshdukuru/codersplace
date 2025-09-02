// src/pages/Hackathons.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users } from "lucide-react";
import codingBanner from "@/assets/coding.png"; // 👈 your uploaded hero image

// Utility to format INR
const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

// Dummy Data
const upcomingEvents = [
  {
    id: 1,
    name: "AI & ML Hackathon 2025",
    date: "15 Sep 2025",
    location: "Bengaluru, India",
    prize: 500000,
    participants: 320,
  },
  {
    id: 2,
    name: "Blockchain Builders Challenge",
    date: "22 Sep 2025",
    location: "Hyderabad, India",
    prize: 300000,
    participants: 210,
  },
  {
    id: 3,
    name: "Sustainability & Green Tech Hackathon",
    date: "30 Sep 2025",
    location: "Delhi, India",
    prize: 200000,
    participants: 150,
  },
];

const pastEvents = [
  {
    id: 1,
    name: "FinTech Innovation Hackathon",
    date: "10 Aug 2025",
    location: "Pune, India",
    prize: 100000,
    participants: 180,
  },
  {
    id: 2,
    name: "HealthTech Hackathon",
    date: "25 Jul 2025",
    location: "Chennai, India",
    prize: 150000,
    participants: 250,
  },
];

const Hackathons: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-12 lg:px-20">
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              Unlock <span className="text-blue-600">Opportunities</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Join exciting hackathons, compete with the best, and win amazing
              rewards while leveling up your skills.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Button className="rounded-xl px-6 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white">
                Find Hackathons
              </Button>
              <Button
                variant="outline"
                className="rounded-xl px-6 py-3 text-lg font-medium"
              >
                Host Hackathon
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center flex-1 mb-10 md:mb-0">
            <img
              src={codingBanner}
              alt="Hackathon Banner"
              className="w-full max-w-md h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Hackathons */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          🔥 Upcoming Hackathons
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
            >
              <CardContent className="p-5 space-y-3 bg-white">
                {/* Tags */}
                <div className="flex gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                    Offline
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md">
                    Free
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-500">{event.location}</p>

                {/* Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-500" /> {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <Trophy className="w-4 h-4" /> Prize Pool:{" "}
                  {formatINR(event.prize)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-purple-500" />{" "}
                  {event.participants} participants expected
                </div>

                {/* Button */}
                <Button className="mt-4 w-full rounded-xl text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Hackathons */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          🏆 Past Hackathons
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <Card
              key={event.id}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
            >
              <CardContent className="p-5 space-y-3 bg-white">
                {/* Tags */}
                <div className="flex gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                    Completed
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-500">{event.location}</p>

                {/* Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" /> {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <Trophy className="w-4 h-4" /> Prize Pool:{" "}
                  {formatINR(event.prize)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-purple-500" />{" "}
                  {event.participants} participants joined
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hackathons;
