// src/resetPassword.js
import bcrypt from "bcrypt";
import pool from "./config/db.js"; 

const resetPasswordsByRole = async () => {
  try {
    // Daftar role + password default
    const roles = [
      { role: "kasir", password: "kasir123" },
      { role: "admin", password: "admin123" },
      { role: "user", password: "pelanggan123" },
    ];

    for (const r of roles) {
      const hashedPassword = await bcrypt.hash(r.password, 10);

      // Update password hanya untuk user sesuai role
      const result = await pool.query(
        "UPDATE users SET password = $1 WHERE role = $2",
        [hashedPassword, r.role]
      );

      console.log(`Password role ${r.role} berhasil direset ke: ${r.password} (jumlah user: ${result.rowCount})`);
    }

    console.log("Semua password role berhasil direset!");
    process.exit(0); // keluar setelah selesai
  } catch (error) {
    console.error("Gagal reset password:", error);
    process.exit(1);
  }
};

// Jalankan reset password per role
resetPasswordsByRole();