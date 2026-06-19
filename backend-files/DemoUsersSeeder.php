<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds - Create 3 demo users dengan role berbeda
     */
    public function run(): void
    {
        // Delete existing demo users
        User::whereIn('email', [
            'admin@example.com',
            'asisten@example.com',
            'mahasiswa@example.com',
        ])->delete();

        // Create demo users dengan 3 role berbeda
        $demoUsers = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Asisten Praktikum',
                'email' => 'asisten@example.com',
                'password' => Hash::make('password'),
                'role' => 'asisten_praktikum',
            ],
            [
                'name' => 'Mahasiswa',
                'email' => 'mahasiswa@example.com',
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
            ],
        ];

        foreach ($demoUsers as $user) {
            User::create($user);
        }

        $this->command->info('Demo users created successfully!');
        $this->command->info('3 accounts are available:');
        $this->command->info('  - admin@example.com (password: password) - Role: Admin');
        $this->command->info('  - asisten@example.com (password: password) - Role: Asisten Praktikum');
        $this->command->info('  - mahasiswa@example.com (password: password) - Role: Mahasiswa');
    }
}
