<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Jika tabel users sudah ada, tambahkan kolom role
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                // Tambahkan kolom role jika belum ada
                if (!Schema::hasColumn('users', 'role')) {
                    $table->enum('role', ['admin', 'asisten_praktikum', 'mahasiswa'])
                        ->default('mahasiswa')
                        ->after('email');
                }
            });
        } else {
            // Buat tabel users baru dengan role
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->enum('role', ['admin', 'asisten_praktikum', 'mahasiswa'])
                    ->default('mahasiswa');
                $table->rememberToken();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop role column jika ada
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'role')) {
                    $table->dropColumn('role');
                }
            });
        }
    }
};
