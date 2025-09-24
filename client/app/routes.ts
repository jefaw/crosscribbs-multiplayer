import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/menu.tsx"),
  route("home", "routes/home.tsx"),
  route("test-socket", "routes/test-socket.tsx"),
  route("game", "routes/game.tsx", { id: "local-game" }),
  route("game/:lobbyId", "routes/game.tsx", { id: "multiplayer-game" }),
  route("multiplayer-setup", "routes/multiplayer-setup.tsx"),
  route("host-game", "routes/host-game.tsx"),
  route("join-game", "routes/join-game.tsx"),
  route("lobby/*", "routes/lobby.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
