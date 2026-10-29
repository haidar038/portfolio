import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { PROJECTS } from "./data/projects";

const projectPath = (id: string) => `/projects/${id}`;

/** Pages that exist as static files, including noindex project pages and the 404 page. */
export const PRERENDER_PATHS = [
  "/",
  "/blogroll",
  "/guestbook",
  "/projects",
  ...PROJECTS.map((project) => projectPath(project.id)),
  "/404",
];

/** Indexable pages only; excludes noindex project pages and the 404 page. */
export const SITEMAP_PATHS = [
  "/",
  "/blogroll",
  "/guestbook",
  "/projects",
  ...PROJECTS.filter((project) => project.status !== "In Development").map(
    (project) => projectPath(project.id),
  ),
];

/**
 * Render one URL. React 19 hoists Helmet's title/meta/link/script tags to the
 * start of the output; the prerender script splits them from the root markup.
 */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <div id="root">
        <App />
      </div>
    </StaticRouter>,
  );
}
