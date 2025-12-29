$ErrorActionPreference = "Stop"

# --- CONFIGURATION ---
# Replace 'YOUR_VPS_IP' with your actual server IP address (e.g., 123.45.67.89)
$ServerUser = "root"
$ServerIP = "69.62.84.118"
$RemotePath = "/var/www/learnBudgam/"
# ---------------------

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan

# 1. Build Locally
Write-Host "`n📦 Step 1: Building project locally..." -ForegroundColor Yellow
pnpm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed! Fix errors and try again."
    exit 1
}

# 2. Upload Files
$Destination = "$($ServerUser)@$($ServerIP):$($RemotePath)"
Write-Host "`nuwu Step 2: Uploading files to $Destination..." -ForegroundColor Yellow
Write-Host "   (You might be asked for your VPS password)" -ForegroundColor Gray

# Upload Config Files & Assets
scp package.json pnpm-lock.yaml next.config.mjs ecosystem.config.js $Destination
scp -r public $Destination

# Upload Build Artifacts (The heavy part)
# separating this helps see progress better usually
scp -r .next $Destination

# 3. Success Message
Write-Host "`n✅ Upload Complete!" -ForegroundColor Green
Write-Host "--------------------------------------------------------"
Write-Host "Now, allow the changes to take effect by running this on your VPS:" -ForegroundColor White
Write-Host "   pm2 reload learn-budgam" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------"
