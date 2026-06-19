#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Plant Management System - Laravel Backend Setup ===${NC}\n"

# Check if Laravel project exists
if [ ! -d "backend" ]; then
    echo -e "${YELLOW}Creating new Laravel project...${NC}"
    composer create-project laravel/laravel backend
    cd backend
else
    echo -e "${YELLOW}Using existing Laravel project...${NC}"
    cd backend
fi

echo -e "\n${BLUE}Step 1: Setting up environment${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
    echo -e "${GREEN}✓ Environment configured${NC}"
else
    echo -e "${GREEN}✓ Environment already exists${NC}"
fi

echo -e "\n${BLUE}Step 2: Installing dependencies${NC}"
composer install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "\n${BLUE}Step 3: Setting up database${NC}"
if [ ! -f "database/database.sqlite" ]; then
    touch database/database.sqlite
    echo -e "${GREEN}✓ SQLite database created${NC}"
else
    echo -e "${GREEN}✓ Database already exists${NC}"
fi

echo -e "\n${BLUE}Step 4: Running migrations${NC}"
php artisan migrate --force
echo -e "${GREEN}✓ Migrations completed${NC}"

echo -e "\n${BLUE}Step 5: Installing Sanctum${NC}"
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --force
php artisan migrate --force
echo -e "${GREEN}✓ Sanctum installed${NC}"

echo -e "\n${BLUE}Step 6: Installing CORS${NC}"
composer require fruitcake/laravel-cors
php artisan vendor:publish --tag="cors" --force
echo -e "${GREEN}✓ CORS configured${NC}"

echo -e "\n${BLUE}Step 7: Creating demo user${NC}"
php artisan tinker <<EOF
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password'),
]);
echo 'Demo user created successfully!';
exit;
EOF

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "\nYou can now start the Laravel server with:"
echo -e "${YELLOW}cd backend && php artisan serve${NC}"
echo -e "\nLaravel will run at: ${YELLOW}http://localhost:8000${NC}"
echo -e "\nDemo credentials:"
echo -e "  Email: ${YELLOW}admin@example.com${NC}"
echo -e "  Password: ${YELLOW}password${NC}"
