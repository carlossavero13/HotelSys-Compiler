import { createServer } from "vite";
// Compatibility entry point: Vite resolves browser modules and bundles ANTLR.
const server = await createServer({
  server: { host: "127.0.0.1", port: 3000, open: false },
});
await server.listen();
server.printUrls();
