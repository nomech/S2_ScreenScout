// Import necessary modules
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Set the port for the server to listen on
app.use(cors());
const API_KEY = process.env.VITE_APP_TMDB_TOKEN;

app.get("/allow", async (req, res) => {
    try {
        const token = await getRequestToken();
        console.log(req);
        //res.json(token);
    } catch (error) {
        console.error(error);
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}}`);
});

const authenticationUrl = "https://www.themoviedb.org/authenticate";
const createSessionUrl =
    "https://api.themoviedb.org/3/authentication/session/new";

const getOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: API_KEY,
    },
};

const getRequestToken = async () => {
    const newRequestToken =
        "https://api.themoviedb.org/3/authentication/token/new";
    try {
        const response = await fetch(newRequestToken, getOptions);

        if (!response.ok) {
            throw new Error("Failed to fetch request token from TMDB API");
        }
        const token = await response.json();

        return token.request_token;
    } catch (error) {
        console.error("An error occured:" + error);
    }
};

const authenticateWithTmdb = async () => {
    const token = await getRequestToken();
    console.log(token);

    const redirectUrl = `${authenticationUrl}/${token}?redirect_to=http://localhost:5173/settings`;

    return redirectUrl;
    //window.open(redirectUrl);
};
