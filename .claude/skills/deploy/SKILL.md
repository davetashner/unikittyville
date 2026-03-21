---
name: deploy
description: Deploy the unikittyville game to norahtashner.com. Syncs game code and audio assets from the unikittyville repo to the deployment repo and S3.
allowed-tools: Read, Bash, Grep, Glob
---

# Deploy Unikittyville to norahtashner.com

Deploy the game from `/Users/dave/Development/unikittyville` to the site at `/Users/dave/Development/norahtashner.com`.

## Architecture

- **Site repo:** `~/Development/norahtashner.com` (Vite/React, deploys via GitHub Actions on push to main)
- **Game location in site:** `public/games/unikittyville/`
- **CI behavior:** S3 sync **excludes** `games/unikittyville/assets/*` — audio assets must be uploaded directly to S3
- **S3 bucket:** `norahtashner.com`
- **Audio files (.mp3) are gitignored** in the site repo — they live only on S3

## Deployment Steps

### 1. Sync game code (JS + HTML)

```bash
rsync -av --exclude='.DS_Store' \
  ~/Development/unikittyville/index.html \
  ~/Development/unikittyville/game.js \
  ~/Development/unikittyville/drawing.js \
  ~/Development/unikittyville/ui.js \
  ~/Development/unikittyville/levels.js \
  ~/Development/unikittyville/interiors.js \
  ~/Development/norahtashner.com/public/games/unikittyville/
```

### 2. Sync assets to local deployment repo (excluding source WAVs)

```bash
rsync -av --delete --exclude='.DS_Store' --exclude='source/' \
  ~/Development/unikittyville/assets/ \
  ~/Development/norahtashner.com/public/games/unikittyville/assets/
```

### 3. Upload audio assets directly to S3

```bash
aws s3 sync \
  ~/Development/norahtashner.com/public/games/unikittyville/assets/ \
  s3://norahtashner.com/games/unikittyville/assets/ \
  --exclude "*.DS_Store" --exclude "source/*" \
  --content-type "audio/mpeg" \
  --cache-control "public, max-age=31536000"
```

### 4. Commit and push code changes to trigger CI

```bash
cd ~/Development/norahtashner.com
git add public/games/unikittyville/
git commit -s -m "deploy: update unikittyville game"
git push origin main
```

CI will build the site and sync to S3 (excluding game assets which were already uploaded in step 3). It also invalidates the CloudFront cache.

### 5. Verify

After push, optionally check CI status:

```bash
gh run list --repo davetashner/norahtashner.com --limit 1
```

## Notes

- Always sync assets to S3 **before** pushing code, so audio is available when the new code goes live
- The `--delete` flag on asset rsync removes old files no longer in the source repo
- Source `.wav` files should never be uploaded to S3 (excluded via `--exclude 'source/*'`)
- If only code changed (no new audio), step 3 will be a no-op (S3 sync skips unchanged files)
