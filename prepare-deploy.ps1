$deployDir = "dist_final"
$zipFile = "accounting_deploy.zip"

# 1. Cleanup
if (Test-Path $deployDir) {
    Write-Host "Cleaning up old $deployDir..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $deployDir
}
if (Test-Path $zipFile) {
    Write-Host "Removing old $zipFile..." -ForegroundColor Yellow
    Remove-Item $zipFile -Force
}

Write-Host "--- Starting Production Build ---" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check for errors." -ForegroundColor Red
    exit
}

# 2. Create Clean Structure
New-Item -ItemType Directory -Path $deployDir

Write-Host "--- Packaging Standalone App ---" -ForegroundColor Cyan

# Copy everything from standalone output
# Next.js standalone folder usually has: .next, node_modules, server.js
Copy-Item -Recurse ".next/standalone/*" $deployDir

# Copy static assets (Required for styles/images)
New-Item -ItemType Directory -Path "$deployDir/.next/static" -Force
Copy-Item -Recurse ".next/static/*" "$deployDir/.next/static"

if (Test-Path "public") {
    Copy-Item -Recurse "public" "$deployDir/public"
}

# Copy Prisma schema (Required for production migrations)
if (Test-Path "prisma") {
    New-Item -ItemType Directory -Path "$deployDir/prisma" -Force
    Copy-Item "prisma/schema.prisma" "$deployDir/prisma/"
}

# 3. Create ZIP
Write-Host "--- Zipping for Deployment ---" -ForegroundColor Cyan
# We exclude .env to avoid overwriting your production database settings on the server
Compress-Archive -Path "$deployDir/*" -DestinationPath $zipFile -Force

Write-Host "`n--- Success! ---" -ForegroundColor Green
Write-Host "Final Package: $zipFile"
Write-Host "Package Size: " -NoNewline
(Get-Item $zipFile).Length / 1MB | ForEach-Object { "{0:N2} MB" -f $_ }

Write-Host "`nTo deploy to your VPS:"
Write-Host "1. Upload '$zipFile' to /root/accounting-app"
Write-Host "2. SSH into your VPS and run:"
Write-Host "   cd /root/accounting-app && unzip -o $zipFile && pm2 restart accounting-app"


