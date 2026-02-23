import pool from "./config/db.js";
import bcrypt from "bcrypt";

const reset = async () => {
  const passwordBaru = "admin123";
  const hash = await bcrypt.hash(passwordBaru, 10);

  await pool.query(
    "UPDATE users SET password = $1 WHERE username = $2",
    [hash, "nayla_admin"]
  );

  console.log("Password berhasil di-reset ke admin123");
  process.exit();
};

reset();
