# [Caissa Bot](https://cvwoforum.netlify.app/)

## About This Project

This project is a hobby project to create and optimize a chess engine capable of defeating amateur players.

## Local Installation
> [!NOTE]
> This is the directory for the frontend of the forum. You must start the backend for the site to be fully functional.
> To start the backend, clone the repo at [Caissa Backend](https://github.com/NgoHoangNhatMinh/caissa-backend) and follow the instructions to run the app locally.

1. You need the following prerequisites:
   - [Node.js 22.13.1](https://nodejs.org/en/download)

2. Clone the repo:
   ```console
   $ git clone https://github.com/NgoHoangNhatMinh/caissa-frontend.git
   ```

3. Installing dependencies:
   ```console
   $ npm install
   ```

4. Start the Vite server:
   ```console
   $ npm run dev
   ```

5. Open the web application from the link `localhost:5173`

## User Manual
> [!NOTE]
> Backend is hosted on a free tier and may take ~30–60 seconds to cold start.
### Gameplay
- Adjust the game's difficulty by changing the search depth slider.
- Make your move and wait for the engine to response. Reponse may take longer for higher search depth.
- You can undo a move or restart the game by pressing the corresponding options.
<img width="1886" height="865" alt="image" src="https://github.com/user-attachments/assets/9f011603-63e2-48e0-8e37-9358eaacf99e" />
