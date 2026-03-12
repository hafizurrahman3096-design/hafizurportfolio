import { useState, useEffect } from "react";
import { mongoApi } from "@/lib/mongoApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ApiTest = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const testApiConnection = async () => {
    setLoading(true);
    setTestResult("Testing API connection...");
    
    try {
      // Test projects endpoint
      const projectsData = await mongoApi.getProjects();
      setProjects(projectsData);
      
      // Test profile endpoint
      const profileData = await mongoApi.getProfile();
      setProfile(profileData);
      
      setTestResult("✅ API connection successful!");
    } catch (error) {
      console.error("API test failed:", error);
      setTestResult("❌ API connection failed");
    } finally {
      setLoading(false);
    }
  };

  const testContactForm = async () => {
    setLoading(true);
    setTestResult("Testing contact form...");
    
    try {
      const testInquiry = {
        name: "Test User",
        email: "test@example.com",
        projectType: "website" as const,
        message: "This is a test message from API test component"
      };
      
      await mongoApi.addInquiry(testInquiry);
      setTestResult("✅ Contact form test successful!");
    } catch (error) {
      console.error("Contact form test failed:", error);
      setTestResult("❌ Contact form test failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testApiConnection} disabled={loading}>
              {loading ? "Testing..." : "Test API Connection"}
            </Button>
            <Button onClick={testContactForm} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test Contact Form"}
            </Button>
          </div>
          
          {testResult && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-mono">{testResult}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {projects.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Projects from API ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project._id} className="p-3 border rounded-lg">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex gap-2 mt-2">
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-primary/10 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Profile from API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {profile.full_name}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Location:</strong> {profile.location}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
