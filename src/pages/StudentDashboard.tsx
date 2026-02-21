import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchStudentProjects, fetchAvailableProjects, applyToProject } from "@/services/api";
import {
  MetricCard,
  DashboardHeader,
  ProjectCard,
  ProjectLifecycleModal,
  SearchFilter,
  Project,
  ProjectPhase,
} from "@/components/dashboard";
import {
  FolderKanban,
  PlayCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [enrolledProjects, setEnrolledProjects] = useState<Project[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrowseExpanded, setIsBrowseExpanded] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");

  // Browse section filters
  const [browseSearchTerm, setBrowseSearchTerm] = useState("");
  const [browseDepartmentFilter, setBrowseDepartmentFilter] = useState("");
  const [browsePhaseFilter, setBrowsePhaseFilter] = useState("");

  // Fetch data from API
  useEffect(() => {
    async function loadData() {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const [enrolled, available] = await Promise.all([
          fetchStudentProjects(user._id),
          fetchAvailableProjects(),
        ]);
        setEnrolledProjects(enrolled);
        setAvailableProjects(available);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        toast({ title: "Error", description: "Failed to load projects. Make sure the backend is running.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?._id]);

  // Compute metrics
  const currentPhaseProject = enrolledProjects.find((p) => p.status === "In Progress");
  const completedProjects = enrolledProjects.filter((p) => p.status === "Completed");
  const activeProjects = enrolledProjects.filter((p) => p.status !== "Completed");

  // Filter enrolled projects
  const filteredEnrolledProjects = useMemo(() => {
    return activeProjects.filter((project) => {
      const matchesSearch = !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || departmentFilter === "all" ||
        project.departments?.includes(departmentFilter);
      const matchesPhase = !phaseFilter || phaseFilter === "all" || project.currentPhase === phaseFilter;
      return matchesSearch && matchesDepartment && matchesPhase;
    });
  }, [activeProjects, searchTerm, departmentFilter, phaseFilter]);

  // Filter available projects
  const filteredAvailableProjects = useMemo(() => {
    return availableProjects.filter((project) => {
      const matchesSearch = !browseSearchTerm ||
        project.title.toLowerCase().includes(browseSearchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(browseSearchTerm.toLowerCase());
      const matchesDepartment = !browseDepartmentFilter || browseDepartmentFilter === "all" ||
        project.departments?.includes(browseDepartmentFilter);
      const matchesPhase = !browsePhaseFilter || browsePhaseFilter === "all" || project.currentPhase === browsePhaseFilter;
      return matchesSearch && matchesDepartment && matchesPhase;
    });
  }, [availableProjects, browseSearchTerm, browseDepartmentFilter, browsePhaseFilter]);

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleApply = async () => {
    if (!selectedProject?._id) return;
    try {
      await applyToProject(selectedProject._id);
      toast({ title: "Applied!", description: `Successfully applied to "${selectedProject.title}"` });
      // Refresh data
      if (user?._id) {
        const [enrolled, available] = await Promise.all([
          fetchStudentProjects(user._id),
          fetchAvailableProjects(),
        ]);
        setEnrolledProjects(enrolled);
        setAvailableProjects(available);
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to apply", variant: "destructive" });
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          userName={user?.name || "Student"}
          userIdentifier={user?.identifier || ""}
          userRole="student"
          onLogout={logout}
        />

        {/* Overview Metrics */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">
            <FolderKanban className="w-5 h-5 text-primary" />
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Enrolled Projects" value={enrolledProjects.length} icon={FolderKanban} variant="primary" description="Total projects joined" />
            <MetricCard title="Current Phase" value={currentPhaseProject?.currentPhase?.split(" ")[0] || "—"} icon={PlayCircle} variant="accent" description={currentPhaseProject?.title?.slice(0, 25) + "..." || "No active project"} />
            <MetricCard title="Completed" value={completedProjects.length} icon={CheckCircle2} variant="success" description="Successfully finished" />
            <MetricCard title="Available Projects" value={availableProjects.length} icon={Search} variant="warning" description="Open for applications" />
          </div>
        </section>

        {/* My Active Projects */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">
            <PlayCircle className="w-5 h-5 text-primary" />
            My Active Projects
          </h2>
          <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} departmentFilter={departmentFilter} onDepartmentChange={setDepartmentFilter} phaseFilter={phaseFilter} onPhaseChange={setPhaseFilter} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEnrolledProjects.map((project, index) => (
              <div key={project._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProjectCard project={project} onClick={() => handleViewProject(project)} />
              </div>
            ))}
          </div>
          {filteredEnrolledProjects.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-border/50">
              <p className="text-muted-foreground">
                {activeProjects.length === 0 ? "You haven't enrolled in any projects yet." : "No projects match your search criteria."}
              </p>
            </div>
          )}
        </section>

        {/* Browse Projects */}
        <section className="dashboard-section">
          <button onClick={() => setIsBrowseExpanded(!isBrowseExpanded)} className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground font-sans">Browse Available Projects</h2>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">{availableProjects.length} available</span>
            </div>
            {isBrowseExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          <div className={cn("overflow-hidden transition-all duration-300", isBrowseExpanded ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0")}>
            <SearchFilter searchTerm={browseSearchTerm} onSearchChange={setBrowseSearchTerm} departmentFilter={browseDepartmentFilter} onDepartmentChange={setBrowseDepartmentFilter} phaseFilter={browsePhaseFilter} onPhaseChange={setBrowsePhaseFilter} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAvailableProjects.map((project, index) => (
                <div key={project._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProjectCard project={project} onClick={() => handleViewProject(project)} showApplyButton onApply={() => { setSelectedProject(project); setIsModalOpen(true); }} />
                </div>
              ))}
            </div>
            {filteredAvailableProjects.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground">No available projects match your search criteria.</p>
              </div>
            )}
          </div>
        </section>

        <ProjectLifecycleModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApply={handleApply}
          showApplyButton={selectedProject ? availableProjects.some((p) => p._id === selectedProject._id) : false}
        />
      </div>
    </div>
  );
}
