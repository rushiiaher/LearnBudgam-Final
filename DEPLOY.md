# Deployment Guide for Ubuntu VPS (PNPM Version)

This project is configured to run on Port **3003** to avoid conflicts with other apps on your server.

## Prerequisites
- **Locally**: `pnpm` installed.
- **Server**: Node.js, `pnpm` (install via `npm install -g pnpm`), PM2, and Nginx installed.
- **Reserved Ports**: 3000, 3001, 3002 are BUSY/UNSAFE. This app uses **3003**.

## 1. Build Locally (Windows)
Because the VPS is low on RAM, **NEVER** build on the server.
Run this on your local machine:

```powershell
pnpm run build
```

## 2. Prepare Files for Upload
You need to upload specific files/folders to the server at `/var/www/learn-budgam` (or your chosen path).

**Folders to upload:**
- `.next/` (The build output)
- `public/` (Static assets)
- `package.json`
- `pnpm-lock.yaml`
- `next.config.mjs`
- `ecosystem.config.js`

**Do NOT upload:**
- `node_modules/` (Install these on the server to ensure Linux compatibility)
- `.git/`

## 3. Upload to Server (via SCP)
Replace `user` and `your_vps_ip` with actual values.

```powershell
# Example SCP commands (run from project root)
scp package.json pnpm-lock.yaml ecosystem.config.js next.config.mjs user@your_vps_ip:/var/www/learn-budgam/
scp -r .next user@your_vps_ip:/var/www/learn-budgam/
scp -r public user@your_vps_ip:/var/www/learn-budgam/
```

## 4. Install Dependencies on Server
Log in to your VPS and navigate to the folder.

```bash
cd /var/www/learn-budgam
# Install production dependencies only (saves RAM/Disk)
pnpm install --prod
```

## 5. Start Application with PM2
We use `ecosystem.config.js` to manage the process via `pnpm`.

```bash
# Start/Restart
pm2 start ecosystem.config.js
# OR if already running
pm2 reload learn-budgam

# Save process list
pm2 save
```

## 6. Configure Nginx
Create a new Nginx block: `/etc/nginx/sites-available/learn-budgam`

```nginx
server {
    listen 80;
    server_name your-domain.com; # Replace with actual domain

    location / {
        proxy_pass http://localhost:3003; # Forward to Next.js app on 3003
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/learn-budgam /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
