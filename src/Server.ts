import app from "./App";
import { AppDataSource } from "./Data-source";
import { PORT } from "./utils/Constant";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error", err);
  });
