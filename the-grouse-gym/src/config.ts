import dotenv from "dotenv";
dotenv.config();

const config = {
    port          : Number(process.env.PORT) || 5000,
    dataBaseUrl   : process.env.DATABASE_URL as string,
    jwt_secretUrl : process.env.JWT_SECRET as string
};

export default config;