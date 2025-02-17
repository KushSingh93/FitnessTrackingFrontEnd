import { lazy } from "react";

export const privateRoutes = [
  { path: "/dashboard", Component: lazy(() => import("../screens/dashboard")) },
  { path: "/analysis", Component: lazy(() => import("../screens/analysis")) },
  { path: "/profile", Component: lazy(() => import("../screens/profile")) },
];

export const publicRoutes = [
  { path: "/signup", Component: lazy(() => import("../screens/auth/signup")) },
  { path: "/login", Component: lazy(() => import("../screens/auth/login")) },
];
