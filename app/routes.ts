import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test-socket", "routes/test-socket.tsx"),
  route("game", "routes/game.tsx")
] satisfies RouteConfig;
