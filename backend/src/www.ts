import { createServer } from "http";
import { App } from "./app";
import { BibleRoute } from "routes";

const PORT = process.env.PORT || 5000;

(async () => {
  const app = new App([new BibleRoute()]);

  const httpServer = createServer(app.getServer());

  httpServer.listen(PORT, () => {
    // eslint-ignore-next-line
    console.log(
      `🚀 ${
        app.getServer().settings.env === "development"
          ? "Development"
          : "Production"
      } listening on port ${PORT}`
    );
  });
})();
