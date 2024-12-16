const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    // Tangani format khusus "id|token"
    const tokenParts = token.split('|');
    if (tokenParts.length === 2 && !isNaN(tokenParts[0])) {
      token = tokenParts[1];
    }

    // Verifikasi token menggunakan secret dari environment variable
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Validasi lebih lanjut pada payload token
      if (!decoded.id || !decoded.email || !decoded.role) {
        return res.status(400).json({
          message: "Token is missing required fields",
          requiredFields: ["id", "email", "role"],
        });
      }

      // Validasi nilai spesifik (opsional)
      if (typeof decoded.role !== 'string' || !['admin', 'user', 'teacher'].includes(decoded.role)) {
        return res.status(403).json({
          message: "Unauthorized role in token",
        });
      }

      // Validasi expiry time (opsional jika menggunakan JWT exp)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ message: "Token has expired" });
      }

      // Tambahkan data user yang di-decode ke request
      req.user = decoded;
      next(); // Lanjutkan ke handler berikutnya
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyToken;
