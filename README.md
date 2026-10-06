# LocalFind

Local business discovery and service enquiry platform, initially focused on Hyderabad.

## Run locally

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.
2. Install packages: `npm install`, `npm install --prefix server`, and `npm install --prefix client`.
3. Start both apps with `npm run dev`.

- Client: `http://localhost:5173`
- API health check: `http://localhost:5000/api/health`
