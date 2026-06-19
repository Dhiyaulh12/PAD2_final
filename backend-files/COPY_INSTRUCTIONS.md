# 📋 Copy These Files to Your Laravel Project

After creating a fresh Laravel project, copy these files to enable **Role-Based Authentication** dengan 3 role: Admin, Asisten Praktikum, dan Mahasiswa:

## Step 1: Create Laravel Project

```bash
composer create-project laravel/laravel backend
cd backend
```

## Step 2: Copy Files from `backend-files/`

### File 1: AuthController.php
**Source:** `backend-files/AuthController.php`
**Destination:** `backend/app/Http/Controllers/AuthController.php`

This file contains the login, logout, and user endpoints.

### File 2: api-routes.php
**Source:** `backend-files/api-routes.php`
**Destination:** `backend/routes/api.php`

**IMPORTANT:** Don't replace the entire `api.php` file! Instead, add these routes to your existing file:

```php
<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Existing routes here...

// Add these auth routes:
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
});
```

### File 3: cors-config.php
**Source:** `backend-files/cors-config.php`
**Destination:** `backend/config/cors.php`

This replaces the entire cors config file after CORS is installed.

### File 4: .env.example
**Source:** `backend-files/.env.example`
**Destination:** `backend/.env` (after copying .env.example)

Use this as a reference for your `.env` file configuration.

### File 5: migration-add-role-to-users.php
**Source:** `backend-files/migration-add-role-to-users.php`
**Destination:** `backend/database/migrations/2024_01_01_000001_add_role_to_users.php`

**IMPORTANT:** Ubah timestamp `2024_01_01_000001` ke timestamp yang lebih baru agar migration berjalan setelah migration users original.

Migration ini menambahkan kolom `role` ke tabel users dengan enum: admin, asisten_praktikum, mahasiswa

### File 6: DemoUsersSeeder.php
**Source:** `backend-files/DemoUsersSeeder.php`
**Destination:** `backend/database/seeders/DemoUsersSeeder.php`

Seeder ini membuat 3 demo users:
- admin@example.com (Role: admin)
- asisten@example.com (Role: asisten_praktikum)
- mahasiswa@example.com (Role: mahasiswa)

## Step 3: Install Dependencies & Setup

```bash
# Install dependencies
composer install

# Generate app key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations (creates tables)
php artisan migrate

# Install Sanctum (token authentication)
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Install CORS
composer require fruitcake/laravel-cors
php artisan vendor:publish --tag="cors"
```

## Step 4: Run Migrations dan Create Demo Users

### Jalankan Migration (tambah role column):
```bash
php artisan migrate
```

### Jalankan Seeder untuk membuat 3 demo users:
```bash
php artisan db:seed --class=DemoUsersSeeder
```

Ini akan membuat 3 akun demo otomatis:
- **admin@example.com** (password: password) - Role: Admin
- **asisten@example.com** (password: password) - Role: Asisten Praktikum  
- **mahasiswa@example.com** (password: password) - Role: Mahasiswa

## Step 5: Verify Routes

Check that the routes are registered:

```bash
php artisan route:list | grep auth
```

You should see:
```
POST      /api/auth/login
POST      /api/auth/logout
GET       /api/auth/me
POST      /api/auth/refresh
```

## Step 6: Start Laravel

```bash
php artisan serve
```

Laravel should now run at `http://localhost:8000`

## Step 7: Test the API

### Test Login sebagai Admin:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

### Test Login sebagai Mahasiswa:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mahasiswa@example.com",
    "password": "password"
  }'
```

Expected response dengan role:

```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "1|abc123xyz..."
}
```

## ✅ Checklist

- [ ] Created fresh Laravel project
- [ ] Copied AuthController.php to app/Http/Controllers/
- [ ] Added auth routes to routes/api.php
- [ ] Updated config/cors.php
- [ ] Installed and migrated Sanctum
- [ ] Installed and configured CORS
- [ ] Created demo user (admin@example.com / password)
- [ ] Verified routes with `php artisan route:list`
- [ ] Tested login endpoint with curl
- [ ] Frontend can reach http://localhost:8000/api/auth/login

## 🚀 Ready to Go

Once all steps are complete, your Next.js frontend can connect to this Laravel backend!

Start Laravel: `php artisan serve`
Start Frontend: `pnpm dev`

Then test at: **http://localhost:3000/login**
