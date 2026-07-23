# Multi-Dashboard Local Development

This stack runs a unified local portal behind Nginx on port 3000 and exposes each dashboard on its own localhost port.

## Start the stack

For local runs, you can either rely on the development defaults baked into the multi-dashboard compose file, or copy the shared template first if you want to override passwords and other settings:

```bash
cp .env.example .env
```

```bash
docker compose -f docker-compose.multi-dashboard.yml up --build
```

That default command now starts only the core multi-dashboard login flow and its required backend dependencies. The five dashboard hosts now use a prebuilt static webapp image, so local startup no longer depends on `npm install` completing inside each frontend container.

Optional stacks are behind profiles:

```bash
docker compose -f docker-compose.multi-dashboard.yml --profile observability up --build
docker compose -f docker-compose.multi-dashboard.yml --profile logging up --build
docker compose -f docker-compose.multi-dashboard.yml --profile tools up --build
docker compose -f docker-compose.multi-dashboard.yml --profile devtools up --build
```

## Endpoints

- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3003`
- `http://localhost:3004`

Port mapping:

- `3000` home portal
- `3001` login service
- `3002` cloud dashboard
- `3003` developer dashboard
- `3004` matrix dashboard

## Login flow

1. Open `http://localhost:3000`.
2. Choose a target dashboard.
3. Sign in through `http://localhost:3001`.
4. The login page seeds the local onboarding plan and redirects to the chosen dashboard port.

## Demo credentials

If the backend auth API is offline, the login page defaults to the frontend demo credentials already supported by the app:

```text
Email: demo@example.com
Password: password
```
