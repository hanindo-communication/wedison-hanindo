#!/bin/bash

# Script to revert Logo component to backup version
# Run this if the new logo causes issues

echo "Reverting Logo component to backup version..."

# Check if backup exists
if [ ! -f "app/components/ui/Logo.backup.tsx" ]; then
    echo "Error: Logo.backup.tsx not found!"
    exit 1
fi

# Copy backup to main Logo file
cp app/components/ui/Logo.backup.tsx app/components/ui/Logo.tsx

echo "✅ Logo component reverted successfully!"
echo "Please restart your development server if it's running."
