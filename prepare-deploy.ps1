# Script to prepare the final deployment package
Write-Host "--- Starting Production Build ---" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check for errors." -ForegroundColor Red
    exit
}

$deployDir = "dist_final"

# Create/Clear deployment directory
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir

Write-Host "--- Packaging Standalone App ---" -ForegroundColor Cyan

# 1. Copy standalone files
Copy-Item -Recurse ".next/standalone/*" $deployDir

# 2. Copy static and public assets (Required for Next.js)
New-Item -ItemType Directory -Path "$deployDir/.next/static" -Force
Copy-Item -Recurse ".next/static/*" "$deployDir/.next/static"

if (Test-Path "public") {
    Copy-Item -Recurse "public" "$deployDir/public"
}

# 3. Copy Prisma files (Important for database)
if (Test-Path "prisma") {
    New-Item -ItemType Directory -Path "$deployDir/prisma" -Force
    Copy-Item "prisma/schema.prisma" "$deployDir/prisma/"
    if (Test-Path "prisma/dev.db") {
        Copy-Item "prisma/dev.db" "$deployDir/prisma/"
    }
}

# 4. Copy the startup script for ease of use
if (Test-Path "run_accounting_system.bat") {
    Copy-Item "run_accounting_system.bat" "$deployDir/"
}

# 5. Create a basic .env file for production
$envContent = "DATABASE_URL=`"file:./prisma/dev.db`"`nNODE_ENV=`"production`""
$envContent | Out-File -FilePath "$deployDir/.env" -Encoding utf8

Write-Host "`n--- Success! ---" -ForegroundColor Green
Write-Host "Your final package is ready in: $deployDir"
Write-Host "Total Size: " -NoNewline
(Get-ChildItem $deployDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB | ForEach-Object { "{0:N2} MB" -f $_ }
Write-Host "`nTo run the app on your server:"
Write-Host "1. Upload the contents of '$deployDir' to your server."
Write-Host "2. Run: node server.js"
