#!/bin/bash
set -e

# Start backend server
cd server
npm run dev &
SERVER_PID=$!

# Wait for backend to be ready, then start frontend
./node_modules/.bin/wait-on http://localhost:3000/api/health --timeout 30000

cd ../client
npx vite --host 0.0.0.0 --port 5000 &
CLIENT_PID=$!

wait $SERVER_PID $CLIENT_PID
