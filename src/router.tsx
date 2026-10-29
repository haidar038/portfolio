import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Guestbook from "./pages/Guestbook";
import Blogroll from "./pages/Blogroll";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

/**
 * Route table shared by the client router and the build-time prerenderer.
 * Pages are imported eagerly so server markup and the first client render match.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="/blogroll" element={<Blogroll />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
