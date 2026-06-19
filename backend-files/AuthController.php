<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login dengan role-based access
     * 
     * Supported roles:
     * - admin: Kelola sistem, pengguna, dan laporan
     * - asisten_praktikum: Kelola praktikum dan monitoring mahasiswa
     * - mahasiswa: Akses materi dan submit laporan
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Validate role
        $validRoles = ['admin', 'asisten_praktikum', 'mahasiswa'];
        $userRole = $user->role ?? 'mahasiswa';
        
        if (!in_array($userRole, $validRoles)) {
            throw ValidationException::withMessages([
                'email' => ['Role pengguna tidak valid.'],
            ]);
        }

        // Delete existing tokens and create new one
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $userRole,
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Handle user logout dengan token deletion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }

    /**
     * Get current authenticated user dengan role info
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $userRole = $user->role ?? 'mahasiswa';

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $userRole,
            ],
        ], 200);
    }

    /**
     * Refresh authentication token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        
        // Delete existing tokens
        $user->tokens()->delete();
        
        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $token,
        ], 200);
    }
}
