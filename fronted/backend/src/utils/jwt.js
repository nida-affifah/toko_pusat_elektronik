import jwt from "jsonwebtoken";

const getSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET belum di-set di .env");
  return process.env.JWT_SECRET;
};

export const generateToken = (user) => jwt.sign({ id_user: user.id_user, role: user.role }, getSecret(), { expiresIn: "1d" });
export const verifyToken = (token) => jwt.verify(token, getSecret());