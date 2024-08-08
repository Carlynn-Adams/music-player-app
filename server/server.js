const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http:localhost:3000",
      clientId: "1ec151cbb14c4aefa8e5c1819a26b419",
      clientSecret: "16f3a27c3c854b74bf4e1e31ae61b79e",
      refreshToken
    })

    spotifyApi
      .refreshAccessToken()
      .then((data) => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http:localhost:3000",
      clientId: "1ec151cbb14c4aefa8e5c1819a26b419",
      clientSecret: "16f3a27c3c854b74bf4e1e31ae61b79e",
    });
    
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(3001)