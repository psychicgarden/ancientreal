# Git Repository Switch Guide

## Switching to Public Repository

The project has been switched to the **public** repository for easier access and development.

**New Repository:** `https://github.com/psychicgarden/boho-shares-01-main.git`

## Solution 1: Make Repository Public (Temporary)

**Quickest fix for immediate development:**

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll down to **Danger Zone**
4. Click **Change repository visibility**
5. Select **Make public**
6. Type repository name to confirm

⚠️ **Warning**: This makes your code publicly visible. Only do this if you're comfortable with that.

## Solution 2: Set Up SSH Authentication

**For secure, permanent access:**

### Step 1: Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

### Step 2: Add SSH Key to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

1. Copy the output
2. Go to GitHub → Settings → SSH and GPG keys
3. Click **New SSH key**
4. Paste your public key
5. Save

### Step 3: Use SSH URL Instead
```bash
git clone git@github.com:psychicgarden/boho-shares-01.git
```

## Solution 3: Personal Access Token

**For HTTPS with authentication:**

### Step 1: Create Personal Access Token
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Select these scopes:
   - `repo` (Full control of private repositories)
   - `read:org`
4. Copy the token immediately (you won't see it again!)

### Step 2: Clone with Token
```bash
git clone https://YOUR_TOKEN@github.com/psychicgarden/boho-shares-01.git
```

## Solution 4: Configure Git Credentials (Cursor/IDE)

**For IDE integration:**

### Option A: Git Credential Manager
```bash
git config --global credential.helper store
git clone https://github.com/psychicgarden/boho-shares-01.git
# Enter username and personal access token when prompted
```

### Option B: Update Remote URL
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/psychicgarden/boho-shares-01.git
```

## Recommended Approach for Development

1. **For immediate testing**: Use Solution 1 (make public temporarily)
2. **For long-term**: Use Solution 2 (SSH) as it's most secure
3. **For team collaboration**: Use Solution 3 (Personal Access Token)

## Cursor Specific Setup

If you're using Cursor IDE:

1. Open Cursor settings
2. Go to **Extensions** → **Git**
3. Enable **Git: Terminal Authentication**
4. Use SSH method (Solution 2) for best results

## Verification

Test your setup:
```bash
git clone https://github.com/psychicgarden/boho-shares-01.git
cd boho-shares-01
git status
```

If this works without errors, your setup is correct!

## Security Best Practices

- ✅ Use SSH keys for personal development
- ✅ Use Personal Access Tokens with minimal required scopes
- ✅ Set token expiration dates
- ❌ Don't commit tokens or keys to repositories
- ❌ Don't make repositories public with sensitive data