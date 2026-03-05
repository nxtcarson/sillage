Write-Host "=== Doppler Setup for Sillage ===" -ForegroundColor Cyan

if (-not (Get-Command doppler -ErrorAction SilentlyContinue)) {
    Write-Host "Doppler CLI not found. Install with: winget install Doppler.Doppler" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`nLogging in to Doppler..." -ForegroundColor Cyan
doppler login
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`nLinking project (create 'sillage' / 'dev' at doppler.com if needed)..." -ForegroundColor Cyan
doppler setup
if ($LASTEXITCODE -ne 0) { exit 1 }

if (Test-Path .env) {
    Write-Host "`nFound .env file. Upload to Doppler? (y/n): " -NoNewline
    $upload = Read-Host
    if ($upload -eq 'y' -or $upload -eq 'Y') {
        Write-Host "Uploading .env to Doppler..." -ForegroundColor Green
        doppler secrets upload .env
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Upload complete." -ForegroundColor Green
        } else {
            Write-Host "Upload failed." -ForegroundColor Yellow
        }
    }
}

Write-Host "`nDone. Run .\run.ps1 to start the server." -ForegroundColor Green
