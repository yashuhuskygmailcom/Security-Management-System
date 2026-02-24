#!/bin/bash

# Security Management System - Database Setup Script
echo "🛡️  Security Management System - Database Setup"
echo "================================================\n"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "   macOS: brew install mysql"
    echo "   Linux: sudo apt-get install mysql-server"
    echo "   Or visit: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ MySQL found at: $(which mysql)\n"

# Prompt for credentials
read -p "Enter MySQL username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -s -p "Enter MySQL password (press Enter for no password): " DB_PASSWORD
echo ""

# Test connection
echo "\n🔄 Testing MySQL connection..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo "✅ Connection successful!\n"
else
    echo "❌ Failed to connect. Check your credentials and try again."
    exit 1
fi

# Create database and tables
echo "📦 Creating database and tables..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" < database.sql; then
    echo "✅ Database setup completed successfully!\n"
    
    # Save credentials to .env
    echo "💾 Saving configuration to .env..."
    cat > .env << EOL
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=securitymanagementsystem
PORT=3000
EOL
    echo "✅ Configuration saved to .env\n"
    
    echo "🚀 Ready to start the application!"
    echo "   Run: npm start\n"
else
    echo "❌ Failed to create database. Check your MySQL credentials."
    exit 1
fi
