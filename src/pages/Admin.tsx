import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trash2, Mail, Globe, Brain, Calendar, Plus, User, FolderKanban, LogOut, Save, X, Upload, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { mongoApi } from "@/lib/mongoApi";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  _id: string;
  name: string;
  email: string;
  projectType: "website" | "ml" | "other";
  message: string;
  createdAt: string;
  status: "new" | "read" | "contacted";
}

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
}

interface Profile {
  full_name: string;
  bio: string;
  email: string;
  location: string;
  avatar_url: string;
}

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile>({
    full_name: "Hafizur Rahman",
    bio: "Web Developer & ML Enthusiast passionate about creating beautiful and functional digital experiences.",
    email: "rahmanhafizur31928@gmail.com",
    location: "Bangladesh",
    avatar_url: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    type: "web",
    tags: "",
    live_url: "",
    github_url: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      setIsAuthenticated(true);
      fetchProjects();
      loadSubmissions();
      loadProfile();
      loadProfilePhoto();
    }
    setLoading(false);
  }, [navigate]);

  const loadProfilePhoto = async () => {
    try {
      const data = await mongoApi.getProfile();
      if (data?.profile_photo_url) {
        setProfilePhotoUrl(data.profile_photo_url);
      }
    } catch (err) {
      console.error("Error loading profile photo:", err);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Photo upload is currently disabled in MongoDB migration.
      // You would typically upload to Cloudinary/S3 here and then update the profile.
      toast({
        title: "Photo upload disabled",
        description: "MongoDB photo upload is not yet implemented.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await mongoApi.getInquiries();
      setSubmissions(data || []);
    } catch (err) {
      console.error("Error loading submissions:", err);
    }
  };
  const loadProfile = async () => {
    try {
      const data = await mongoApi.getProfile();
      if (data) {
        setProfile(data);
        setProfileForm(data);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await mongoApi.getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const saveProfile = async () => {
    try {
      const data = await mongoApi.updateProfile(profileForm);
      setProfile(data);
      setIsEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile saved successfully.",
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    }
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title and description.",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      title: newProject.title,
      description: newProject.description,
      type: newProject.type,
      tags: newProject.tags.split(",").map((t) => t.trim()).filter(Boolean),
      live_url: newProject.live_url || null,
      github_url: newProject.github_url || null,
    };

    try {
      await mongoApi.addProject(projectData);
      toast({
        title: "Success",
        description: "Project added successfully.",
      });
      setNewProject({
        title: "",
        description: "",
        type: "web",
        tags: "",
        live_url: "",
        github_url: "",
      });
      setIsAddingProject(false);
      fetchProjects();
    } catch (err) {
      console.error("Error adding project:", err);
      toast({
        title: "Error",
        description: "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await mongoApi.deleteProject(id);
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await mongoApi.deleteInquiry(id);
      loadSubmissions();
    } catch (err) {
      console.error("Error deleting submission:", err);
    }
  };

  const updateStatus = async (id: string, status: Submission["status"]) => {
    try {
      await mongoApi.updateInquiry(id, { status });
      loadSubmissions();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("adminToken");
    toast({
      title: "Signed Out",
      description: "You have been logged out.",
    });
    navigate("/");
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case "web":
        return <Globe className="w-4 h-4" />;
      case "ml":
        return <Brain className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-primary/20 text-primary";
      case "read":
        return "bg-muted text-muted-foreground";
      case "contacted":
        return "bg-green-500/20 text-green-500";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground text-sm">
                Manage your portfolio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Inquiries ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            {submissions.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No inquiries yet</p>
                <p className="text-muted-foreground text-sm">
                  Project submissions will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((submission) => (
                    <div
                      key={submission._id}
                      className="glass-card p-6 hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {getProjectIcon(submission.projectType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{submission.name}</h3>
                              <Badge
                                className={`text-xs font-mono ${getStatusColor(
                                  submission.status
                                )}`}
                              >
                                {submission.status}
                              </Badge>
                            </div>
                            <a
                              href={`mailto:${submission.email}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {submission.email}
                            </a>
                            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                              {submission.message}
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(submission.createdAt).toLocaleDateString()}
                              </div>
                              <Badge variant="secondary" className="text-xs font-mono">
                                {submission.projectType}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={submission.status}
                            onChange={(e) =>
                              updateStatus(
                                submission._id,
                                e.target.value as Submission["status"]
                              )
                            }
                            className="text-xs bg-background/50 border border-border rounded-lg px-2 py-1"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="contacted">Contacted</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSubmission(submission._id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddingProject(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {isAddingProject && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">New Project</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingProject(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="Project title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select
                      value={newProject.type}
                      onChange={(e) =>
                        setNewProject({ ...newProject, type: e.target.value })
                      }
                      className="w-full bg-background border border-border rounded-lg px-3 py-2"
                    >
                      <option value="web">Web Development</option>
                      <option value="ml">Machine Learning</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                    placeholder="Project description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newProject.tags}
                    onChange={(e) =>
                      setNewProject({ ...newProject, tags: e.target.value })
                    }
                    placeholder="React, TypeScript, Tailwind"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Live URL (optional)</Label>
                    <Input
                      value={newProject.live_url}
                      onChange={(e) =>
                        setNewProject({ ...newProject, live_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL (optional)</Label>
                    <Input
                      value={newProject.github_url}
                      onChange={(e) =>
                        setNewProject({ ...newProject, github_url: e.target.value })
                      }
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <Button onClick={addProject} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Project
                </Button>
              </div>
            )}

            {projects.length === 0 && !isAddingProject ? (
              <div className="glass-card p-12 text-center">
                <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No projects yet</p>
                <p className="text-muted-foreground text-sm">
                  Add your first project to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project._id} className="glass-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getProjectIcon(project.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(project._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="glass-card p-6 space-y-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    {profilePhotoUrl ? (
                      <img
                        src={profilePhotoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isUploadingPhoto ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium">Profile Photo</p>
                  <p className="text-sm text-muted-foreground">
                    Click on the photo to change it
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploadingPhoto ? "Uploading..." : "Upload New Photo"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Your Profile</h3>
                {isEditingProfile ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm(profile);
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveProfile}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileForm.full_name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, full_name: e.target.value })
                      }
                      placeholder="Your name"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      placeholder="your@email.com"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, location: e.target.value })
                      }
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileForm.avatar_url}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, avatar_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {profile.avatar_url || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Bio</Label>
                  {isEditingProfile ? (
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;