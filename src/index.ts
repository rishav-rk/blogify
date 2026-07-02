import { connectDB, shutdown } from "./config/db.js";
import { Server } from "node:http";
import app from "./app.js";

let server: Server | undefined;

connectDB()
  .then((conn) => {
    console.log(
      "================ Database connected successfully ================",
    );

    server = app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

process.on("unhandledRejection", ()=>{
    shutdown(server)
})

process.on("uncaughtException", ()=>{
    shutdown(server)
})

process.on("SIGINT", () => {
  shutdown(server);
});

process.on("SIGTERM", () => {
  shutdown(server);
});
