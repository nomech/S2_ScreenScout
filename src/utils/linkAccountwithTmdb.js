/* const authenticationUrl = "https://www.themoviedb.org/authenticate";
const createSessionUrl =
    "https://api.themoviedb.org/3/authentication/session/new";

const controller = new AbortController();
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
    },
    signal: controller.signal,
};

const getRequestToken = async () => {
    const newRequestToken =
        "https://api.themoviedb.org/3/authentication/token/new";
    try {
        const response = await fetch(newRequestToken, options);

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

    window.open(redirectUrl);
};
  */