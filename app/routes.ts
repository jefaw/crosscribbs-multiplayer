import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/menu.tsx"),
  route("home.tsx", "routes/home.tsx"),
  route("test-socket", "routes/test-socket.tsx"),
  route("game", "routes/game.tsx"),
  route("multiplayer-setup", "routes/multiplayer-setup.tsx"),
  route("host-game", "routes/host-game.tsx"),
  route("join-game", "routes/join-game.tsx"),
  route("lobby/:gameId", "routes/lobby.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
