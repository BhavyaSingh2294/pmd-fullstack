import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchFacultyProjects, advanceProjectPhase } from "@/services/api";
import {
  MetricCard,
  DashboardHeader,
  ProjectsTable,
  ProjectLifecycleModal,
  SearchFilter,
  Project,
  ProjectPhase,
} from "@/components/dashboard";
import {
  FolderKanban,
  PlayCircle,
  CheckCircle2,
  Users,
  TrendingUp,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch projects from API
  useEffect(() => {
    async function loadData() {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchFacultyProjects(user._id);
        setProjects(data);
      } catch (err) {
        console.error("Error loading faculty projects:", err);
        toast({ title: "Error", description: "Failed to load projects. Make sure the backend is running.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?._id]);

  // Compute metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "Open" || p.status === "In Progress").length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const totalStudentsEnrolled = projects.reduce((sum, p) => sum + (p.appliedStudentIds?.length || p.enrolledCount || 0), 0);

  const uniqueDepartments = new Set<string>();
  projects.forEach((p) => p.departments?.forEach((d) => uniqueDepartments.add(String(d))));
  const crossDepartmentCount = uniqueDepartments.size;

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !departmentFilter || departmentFilter === "all" ||
        project.departments?.includes(departmentFilter);
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [projects, searchTerm, departmentFilter, statusFilter]);

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleAdvancePhase = async (project: Project) => {
    try {
      const result = await advanceProjectPhase(project._id);
      // Refresh projects
      if (user?._id) {
        const data = await fetchFacultyProjects(user._id);
        setProjects(data);
      }
      toast({ title: "Phase Advanced", description: `"${project.title}" moved to next phase` });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to advance phase", variant: "destructive" });
    }
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
        <DashboardHeader userName={user?.name || "Faculty"} userIdentifier={user?.identifier || ""} userRole="faculty" onLogout={logout} />

        {/* Overview Metrics */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title"><TrendingUp className="w-5 h-5 text-primary" /> Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Projects Posted" value={totalProjects} icon={FolderKanban} variant="primary" description="Total projects created" />
            <MetricCard title="Active Projects" value={activeProjects} icon={PlayCircle} variant="accent" description="Open or in progress" />
            <MetricCard title="Students Enrolled" value={totalStudentsEnrolled} icon={Users} variant="success" description="Total participants" />
            <MetricCard title="Completed" value={completedProjects} icon={CheckCircle2} variant="warning" description="Successfully finished" />
          </div>
        </section>

        {/* Participation Insights */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title"><Users className="w-5 h-5 text-primary" /> Participation Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="metric-card">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{(totalStudentsEnrolled / (activeProjects || 1)).toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Avg. students per project</p>
                </div>
              </div>
            </div>
            <div className="metric-card">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10 text-accent"><Building2 className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{crossDepartmentCount}</p>
                  <p className="text-sm text-muted-foreground">Departments collaborating</p>
                </div>
              </div>
            </div>
            <div className="metric-card">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-success/10 text-success"><TrendingUp className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{Math.round((completedProjects / (totalProjects || 1)) * 100)}%</p>
                  <p className="text-sm text-muted-foreground">Completion rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Projects Table */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title"><FolderKanban className="w-5 h-5 text-primary" /> My Projects</h2>
          <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} departmentFilter={departmentFilter} onDepartmentChange={setDepartmentFilter} statusFilter={statusFilter} onStatusChange={setStatusFilter} showStatusFilter showPhaseFilter={false} className="mb-4" />
          <ProjectsTable projects={filteredProjects} onViewProject={handleViewProject} onAdvancePhase={handleAdvancePhase} showAdvancePhase />
        </section>

        <ProjectLifecycleModal project={selectedProject} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
