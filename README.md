## Skull Online

[Skull Online](https://skull.thomasbuchholz.dev) is on online version of the game [Skull and Roses](https://www.ultraboardgames.com/skull-and-roses/game-rules.php) built with React, Phaser, and Express.

## How to Run

Make sure [Node.js](https://nodejs.org/en/) is installed, then clone and cd into the repository.

```
git clone https://github.com/OKThomas1/Skull-Online.git
cd Skull-Online
```

### Backend

To run the backend, execute:

```
cd server
npm install
npm start
```

### Frontend

To run the frontend, run `cd react` then create a .env file and set `REACT_APP_API_ENDPOINT` to your server endpoint (see [.env.example](react/.env.example))

Once that is done, execute:

```
npm install
npm start
```
