# Multi-Dashboard Local Development

This stack runs a unified local portal behind Nginx on port 3000 and exposes separate dashboard services by hostname.

## Host entries

Add these entries to `/etc/hosts`:

```text
127.0.0.1 login.localhost
127.0.0.1 cloud.localhost
127.0.0.1 developer.localhost
127.0.0.1 matrix.localhost
```

## Start the stack

```bash
docker compose -f docker-compose.multi-dashboard.yml up --build
```

## Endpoints

- `http://localhost:3000`
- `http://login.localhost:3000`
- `http://cloud.localhost:3000`
- `http://developer.localhost:3000`
- `http://matrix.localhost:3000`

## Login flow

1. Open `http://localhost:3000`.
2. Choose a target dashboard.
3. Sign in through `http://login.localhost:3000`.
4. The login page seeds the local onboarding plan and redirects to the chosen dashboard host.

## Demo credentials

If the backend auth API is offline, the login page defaults to the frontend demo credentials already supported by the app:

```text
Email: demo@example.com
Password: password
```
