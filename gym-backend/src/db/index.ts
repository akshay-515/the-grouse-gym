import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
    connectionString:config.dataBaseUrl,
    ssl: process.env.NODE_ENV === "production" 
        ? { rejectUnauthorized: false } 
        : false
})

pool.on("connect", () => {
    console.log("Postgres connected successfully");
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(1);
});

export const db = pool;
