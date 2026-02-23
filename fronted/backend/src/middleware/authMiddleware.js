import jwt from "jsonwebtoken";

// Fungsi untuk ambil secret, memastikan .env sudah terbaca
const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET belum di-set di .env");
  }
  return process.env.JWT_SECRET;
};

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Format token salah" });
    }

    const token = parts[1];

    // Verifikasi token dengan secret yang konsisten
    const decoded = jwt.verify(token, getSecret());

    req.user = decoded; // simpan payload token
    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // tampilkan alasan error
    return res.status(401).json({ message: "Token tidak valid" });
  }
};