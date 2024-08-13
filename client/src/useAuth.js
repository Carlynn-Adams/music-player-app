import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
      axios
        .post("https://melodica-music-player-app.netlify.app/login", {
          code,
        })
        .then(({ data }) => {
          const { accessToken, refreshToken, expiresAt } = data;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // Calculate expiresIn based on the expiresAt value
          const expiresIn = Math.floor(
            (new Date(expiresAt) - new Date()) / 1000
          );
          setExpiresIn(expiresIn);

          window.history.pushState({}, null, "/");
        })
        .catch(() => {
          window.location.href = "/";
        });
    }, [code]);

    useEffect(() => {
      if (!refreshToken || !expiresIn) return;
      const interval = setInterval(() => {
        axios
          .post("https://melodica-music-player-app.netlify.app/refresh", {
            refreshToken,
          })
          .then(({ data }) => {
            const { accessToken, expiresAt } = data;

            // Calculate newExpiresIn based on the expiresAt value
            const newExpiresIn = Math.floor(
              (new Date(expiresAt) - new Date()) / 1000
            );

            setAccessToken(accessToken);

            if (newExpiresIn !== expiresIn) {
              setExpiresIn(newExpiresIn);
            }
          })
          .catch((error) => {
            console.error(error);
            window.location.href = "/";
          });
      }, (expiresIn - 60) * 1000);

      return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}