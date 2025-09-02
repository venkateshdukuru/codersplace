import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import InterviewPractice from "@/components/practice/InterviewPractice";
import { Lock } from "lucide-react";
const API_BASE = "http://localhost:5000/api";

const Interview = () => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [practiceMode, setPracticeMode] = useState<any>(null);

  // Load categories
  useEffect(() => {
    axios.get(`${API_BASE}/categories`).then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setSelectedCategory(res.data[0].id);
      }
    });
  }, []);

  // Load topics when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    axios.get(`${API_BASE}/topics/${selectedCategory}`).then((res) => {
      setTopics(res.data);
    });
  }, [selectedCategory]);

  // Load questions when category/level changes
  useEffect(() => {
    if (!selectedCategory) return;
    const url =
      selectedLevel === "all"
        ? `${API_BASE}/questions?category=${selectedCategory}`
        : `${API_BASE}/questions?category=${selectedCategory}&level=${selectedLevel}`;

    axios.get(url).then((res) => {
      setQuestions(res.data);
    });
  }, [selectedCategory, selectedLevel]);

  const handlePracticeStart = (question: any) => {
    if (!isAuthenticated) return;
    setPracticeMode(question);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="p-8 max-w-lg mx-auto">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">Authentication Required</CardTitle>
          <CardDescription>
            Please log in to access interview practice questions and solutions.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Technical Interview Preparation</h1>
          <p className="text-muted-foreground mt-2">
            Practice questions fetched from backend for OS, DBMS, System Design, and Languages.
          </p>
        </div>

        {/* Tabs for Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-6">
            {categories.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((c) => (
            <TabsContent key={c.id} value={c.id}>
              {/* Topics */}
              <h2 className="text-xl font-semibold mb-4">{c.label} Topics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {topics.map((t: any) => (
                  <Card key={t.id} className="p-4">
                    <p className="font-medium">{t.name}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Level Filter */}
        <div className="flex gap-4 mb-8">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginners</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setSelectedLevel("all")}>Clear</Button>
        </div>

        {/* Questions */}
        <h2 className="text-2xl font-bold mb-4">
          Questions ({questions.length})
        </h2>
        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q.id} className="p-6">
              <CardContent>
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{q.title}</h3>
                    <p className="text-muted-foreground mb-2">{q.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge>{q.difficulty}</Badge>
                      <Badge variant="outline">{q.topic}</Badge>
                      <Badge variant="secondary">{q.level}</Badge>
                    </div>
                  </div>
                  <Button onClick={() => handlePracticeStart(q)}>Practice</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {practiceMode && (
        <InterviewPractice
          question={practiceMode}
          onClose={() => setPracticeMode(null)}
        />
      )}
    </div>
  );
};

export default Interview;
