param(
  [Parameter(Mandatory=$true)]
  [string]$RepoUrl
)
$ErrorActionPreference = 'Stop'
if ($RepoUrl -notmatch '^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:\.git)?$') {
  throw 'GitHub repository HTTPS URL expected. Example: https://github.com/USER/yeonmyeong-gangryeong.git'
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git for Windows is required.' }
$src = Split-Path -Parent $MyInvocation.MyCommand.Path
$dst = Join-Path $env:TEMP ('yeonmyeong-pages-' + [guid]::NewGuid().ToString('N'))
git clone $RepoUrl $dst
if ($LASTEXITCODE -ne 0) { throw 'git clone failed. Verify repository and permissions.' }
$files = @('index.html','style.css','style_v5.css','data.js','expansion.js','engine.js','pixel.js','app.js','.nojekyll')
foreach ($file in $files) { Copy-Item -LiteralPath (Join-Path $src $file) -Destination (Join-Path $dst $file) -Force }
Copy-Item -Path (Join-Path $src 'assets') -Destination $dst -Recurse -Force
Push-Location $dst
try {
 git checkout -B main
 if ($LASTEXITCODE -ne 0) { throw 'Cannot create main branch.' }
 git add --all
 if ((git status --porcelain).Length -eq 0) { Write-Host 'No changes to deploy.'; exit 0 }
 git commit -m 'Update Yeonmyeong Gangryeong web game v0.5'
 if ($LASTEXITCODE -ne 0) { throw 'git commit failed. Set git user.name and user.email.' }
 git push
 if ($LASTEXITCODE -ne 0) { throw 'git push failed. Check repository access.' }
 Write-Host 'Pushed! Pages publishes from main / root after one-time Settings > Pages configuration.'
} finally { Pop-Location }
