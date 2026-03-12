#!/bin/bash

echo "🧪 Testing Railway Deployment Configuration..."

echo "1. Checking Railway CLI..."
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI installed"
    railway --version
else
    echo "❌ Railway CLI not found"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

echo ""
echo "2. Checking project files..."
if [ -f "railway.toml" ]; then
    echo "✅ railway.toml found"
else
    echo "❌ railway.toml missing"
    exit 1
fi

if [ -f "server/Dockerfile" ]; then
    echo "✅ server/Dockerfile found"
else
    echo "❌ server/Dockerfile missing"
    exit 1
fi

if [ -f "server/package.json" ]; then
    echo "✅ server/package.json found"
else
    echo "❌ server/package.json missing"
    exit 1
fi

echo ""
echo "3. Testing local server..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend health check working"
else
    echo "❌ Backend not responding on port 5000"
    echo "Start with: cd server && npm run dev"
    exit 1
fi

echo ""
echo "4. Checking frontend build..."
if [ -f "package.json" ]; then
    echo "✅ Frontend package.json found"
    echo "Testing build command..."
    if npm run build > /dev/null 2>&1; then
        echo "✅ Frontend builds successfully"
    else
        echo "❌ Frontend build failed"
        exit 1
    fi
else
    echo "❌ Frontend package.json missing"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Ready for Railway deployment."
echo ""
echo "Next steps:"
echo "1. Run: railway login"
echo "2. Run: railway deploy"
echo "3. Set environment variables in Railway dashboard"
