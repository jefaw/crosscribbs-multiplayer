import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/menu.tsx"),
  route("home.tsx", "routes/home.tsx"),
  route("test-socket", "routes/test-socket.tsx"),
  route("game", "routes/game.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
