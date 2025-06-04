# ScreenScout

ScreenScout is a responsive web application for discovering, searching, and managing your favorite movies and TV shows. Built with React and Vite, it uses The Movie Database (TMDB) API for media content and Firebase for user authentication and watchlist management.

## Live Demo

-   [![Netlify Deployment](https://img.shields.io/badge/Deploy-on%20Netlify-brightgreen)](https://screenscout.netlify.app/)
-   https://screenscout.netlify.app/

## GitHub Repository

-   [![GitHub Repository](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/nomech/S2_ScreenScout)
-   https://github.com/nomech/S2_ScreenScout

## Figma design

-   [![Figma design](https://img.shields.io/badge/Design-Figma-pink)](https://www.figma.com/design/OcwiQHpnAMp7bTA80f6wOJ/S2-Final-project?node-id=0-1&m=dev)
-   https://www.figma.com/design/OcwiQHpnAMp7bTA80f6wOJ/S2-Final-project?node-id=0-1&m=dev

## Description

ScreenScout allows users to:

-   Register and log in securely
-   Browse trending movies and TV shows
-   Search for movies, TV shows, and people
-   View detailed information, cast, and genres for each media item
-   Add movies and TV shows to a personal watchlist
-   Manage their profile and watchlist

## Technologies

-   **React** Assignment requirement
-   **Vite** Chosen as the build tool and development server for its fast hot module replacement and minimal configuration.
-   **Netlify** Due to its simple integration with static sites, continuous deployment from GitHub, and free hosting tier.
-   **Firebase** Firestore Easy to use and covers the requirements for this app
-   **TMDB API** Contains the data needed for this app such as movies and tv-shows
-   **Cloudinary** Hosts the images for the user profiles
-   **CSS Modules**

## Resources

-   **[TMDB API Docs](https://developer.themoviedb.org/)**
-   **[Firebase Docs](https://firebase.google.com/docs/)**
-   **[Cloudinary Docs](https://cloudinary.com/documentation)**
-   **[React Docs](https://react.dev/)**
-   **[Vite Docs](https://vitejs.dev/)**
-   **[Click Outside to Close - React Hook](https://www.youtube.com/watch?v=HfZ7pdhS43s)**

## Environment Variables
To run this project locally, you need to create a `.env` file in the root directory and add the following environment variables:
 
```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```


## License

This project is for educational purposes only.
