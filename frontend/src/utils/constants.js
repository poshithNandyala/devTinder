// constants.js
const IS_LOCAL = window.location.hostname === "localhost";

export const API_BASE_URL = IS_LOCAL
  ? "http://localhost:3000/api"
  : "/api";

export const SOCKET_BASE_URL = IS_LOCAL
  ? "http://localhost:3000"
  : window.location.origin;
