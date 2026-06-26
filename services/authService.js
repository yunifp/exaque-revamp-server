const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
const emailService = require("./emailService");

/**
 * Memvalidasi kredensial user dan membuat token JWT.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
const loginUser = async (email, password) => {
  
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("Email tidak ditemukan.");
  }

  
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Password salah.");
  }

  
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", 
  });

  return { token, user: payload };
};
const requestPasswordReset = async (email) => {
  
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    
    
    throw new Error("Gagal mengirim email.");
  }

  
  const resetToken = crypto.randomBytes(32).toString("hex");

  
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  
  const expires = new Date(Date.now() + 3600000); 

  
  await userRepository.updateUserById(user.id, {
    reset_password_token: hashedToken,
    reset_password_expires: expires,
  });

  
  await emailService.sendResetPasswordEmail(user.email, user.name, resetToken);

  return { message: "Email reset password telah dikirim." };
};
const resetPassword = async (token, newPassword) => {
  
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  
  
  const user = await userRepository.findUserByResetToken(hashedToken);
  if (!user) {
    throw new Error("Token tidak valid atau sudah kedaluwarsa.");
  }

  
  user.password = newPassword; 
  user.reset_password_token = null; 
  user.reset_password_expires = null;

  
  
  
  await user.save();

  return { message: "Password berhasil direset." };
};

module.exports = {
  loginUser,
  requestPasswordReset, 
  resetPassword,
};
