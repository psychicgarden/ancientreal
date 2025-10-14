#!/bin/bash

# Switch from private to public repository
echo "🔄 Switching to public repository..."

# Update remote URL to public repo
git remote set-url origin https://github.com/psychicgarden/ancientreal.git

# Verify the change
echo "✅ Remote URL updated to:"
git remote -v

# Push to public repo
echo "📤 Pushing to public repository..."
git push -u origin main

echo "🎉 Successfully switched to public repository!"
echo "New repo: https://github.com/psychicgarden/ancientreal"