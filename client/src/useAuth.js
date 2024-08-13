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
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(res.data.expiresIn);
          window.history.pushState({}, null, "/");
        })
        .catch(() => {
          window.location = "/";
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
            const { accessToken, expiresIn } = data;
            setAccessToken(accessToken);

            // Only update expiresIn if it's different from the current value
            if (expiresIn !== expiresIn) {
              setExpiresIn(expiresIn);
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