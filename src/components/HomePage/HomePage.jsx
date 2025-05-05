import React from "react";
import { useFetch } from "../../hooks/useFetch";

const HomePage = () => {
  const { data } = useFetch(
    "https://api.themoviedb.org/3/trending/all/day?language=en-US"
  );

  const sessionTest = async () => {
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

  const handleClick = async () => {
    const session = await sessionTest();

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOGM2MDMwZTU1OGY1NDViOGMwNTI5ODY0MTY1NDNmYSIsIm5iZiI6MTY3MTU2MTk2Ny43NCwic3ViIjoiNjNhMjAyZWY4ZGRjMzQxNGFhMDMwZjMyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3g3McMn73fcJa7Fj7a1ElttZTa44HgldypZVhKFHNBo'
      },
      body: JSON.stringify({ request_token: session }),
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
      <button onClick={handleClick}>Test Button</button>
    </div>
  );
};

export default HomePage;
