import { startServer } from "./utils/startServer";
import dotenv from "dotenv";

dotenv.config();
const port = 3000;
const app = startServer();

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
