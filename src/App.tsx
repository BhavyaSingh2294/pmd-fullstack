import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import FacultyDashboard from "@/pages/FacultyDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      {/* Public login */}
      <Route path="/login" element={<Login />} />

      {/* Student dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <PrivateRoute requiredRole="student">
            <StudentDashboard />
          </PrivateRoute>
        }
      />

      {/* Faculty dashboard */}
      <Route
        path="/faculty-dashboard"
        element={
          <PrivateRoute requiredRole="faculty">
            <FacultyDashboard />
          </PrivateRoute>
        }
      />

      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;































// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "@/context/AuthContext";
// import { PrivateRoute } from "@/components/PrivateRoute";
// import Login from "@/pages/Login";
// import StudentDashboard from "@/pages/StudentDashboard";
// import FacultyDashboard from "@/pages/FacultyDashboard";
// import NotFound from "@/pages/NotFound";

// const queryClient = new QueryClient();

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public login */}
//       <Route path="/login" element={<Login />} />

//       {/* Student dashboard */}
//       <Route
//         path="/student-dashboard"
//         element={
//           <PrivateRoute requiredRole="student">
//             <StudentDashboard />
//           </PrivateRoute>
//         }
//       />

//       {/* Faculty dashboard */}
//       <Route
//         path="/faculty-dashboard"
//         element={
//           <PrivateRoute requiredRole="faculty">
//             <FacultyDashboard />
//           </PrivateRoute>
//         }
//       />

//       {/* Default redirect to login */}
//       <Route path="/" element={<Navigate to="/login" replace />} />

//       {/* Catch-all */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AuthProvider>
//           <AppRoutes />
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
