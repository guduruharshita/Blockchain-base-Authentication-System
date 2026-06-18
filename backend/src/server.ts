import { createApp } from "./app";
import { config } from "./config";

const app  = createApp();
const port = parseInt(config.PORT, 10);

app.listen(port, () => {
  console.log(`AuthChain API listening on http://localhost:${port}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
