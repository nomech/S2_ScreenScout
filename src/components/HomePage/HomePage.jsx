import React from "react";
import { useFetch } from "../../hooks/useFetch";

const HomePage = () => {
  const { data } = useFetch(
    "https://api.themoviedb.org/3/trending/all/day?language=en-US"
  );

  const getToken = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOGM2MDMwZTU1OGY1NDViOGMwNTI5ODY0MTY1NDNmYSIsIm5iZiI6MTY3MTU2MTk2Ny43NCwic3ViIjoiNjNhMjAyZWY4ZGRjMzQxNGFhMDMwZjMyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3g3McMn73fcJa7Fj7a1ElttZTa44HgldypZVhKFHNBo",
        },
      };
      const response = await fetch(
        "https://api.themoviedb.org/3/authentication/token/new",
        options
      );

      const data = await response.json();
      console.log(data);
      
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getSessionToken = async () => {
    const authorizeUrl = "https://www.themoviedb.org/authenticate/ca93020b453a6d13a7f7bc8a6f257e1859df581f?redirect_to=http://localhost:5173/"
    window.location = authorizeUrl;
  }

  const handleClick = async () => {
    //const session = await sessionTest();

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOGM2MDMwZTU1OGY1NDViOGMwNTI5ODY0MTY1NDNmYSIsIm5iZiI6MTY3MTU2MTk2Ny43NCwic3ViIjoiNjNhMjAyZWY4ZGRjMzQxNGFhMDMwZjMyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3g3McMn73fcJa7Fj7a1ElttZTa44HgldypZVhKFHNBo'
      },
      body: JSON.stringify({ request_token: "91d84a527720cb5c4804288e3fb20f187c1fb9f2" }),
    };
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/authentication/session/new",
        options
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  
  return (
    <div>
      <p>Session Test</p>
      <button onClick={getSessionToken}>Test Button</button>
    </div>
  );
};

export default HomePage;
