# EasyPanel Configuration for Prime Luthieria

## Application Settings
- **Name**: prime-luthieria
- **Port**: 3000
- **Environment**: production

## Environment Variables
```
NODE_ENV=production
PORT=3000
```

## Health Check
- **Path**: `/`
- **Interval**: 30s
- **Timeout**: 10s

## Build Command
```bash
npm install --production
```

## Start Command
```bash
npm start
```

## Dockerfile
The project includes a Dockerfile for containerization.

## Storage
The application uses local JSON files for data storage located in the `/config` directory.

## Domain Configuration
Configure your domain to point to the EasyPanel instance and ensure SSL is enabled.

## Additional Notes
- The application serves static files from the `/public` directory
- Admin panel is available at `/admin/login` (credentials: admin/prime123)
- No database required - uses JSON file storage
