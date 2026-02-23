import bcrypt from "bcrypt";
import pool from "./config/db.js";


const hashExistingPasswords = async () => {
  try {
    const { rows } = await pool.query(
      "SELECT id_user, password FROM users"
    );

    for (const user of rows) {
      // hanya hash kalau belum bcrypt
      if (
        !user.password.startsWith("$2b$") &&
        !user.password.startsWith("$2a$")
      ) {
        const hashed = await bcrypt.hash(user.password, 10);

        await pool.query(
          "UPDATE users SET password = $1 WHERE id_user = $2",
          [hashed, user.id_user]
        );

        console.log(`Password user ID ${user.id_user} berhasil di-hash`);
      } else {
        console.log(`User ID ${user.id_user} sudah di-hash, dilewati`);
      }
    }

    console.log("Semua password selesai di-hash!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

hashExistingPasswords();
