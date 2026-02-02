import app from "./app";
import { AppDataSource } from "./data-source";
import { PORT } from "./utils/constant";

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
