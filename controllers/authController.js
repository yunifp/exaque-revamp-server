const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.loginUser(email, password);

    const oneDay = 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: oneDay,
      path: "/"
    });

    return res.success({ user: user }, "Login berhasil.", 200);
  } catch (error) {
    return res.error(error.message, 401);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/"
    });

    return res.success(null, "Logout berhasil.", 200);
  } catch (error) {
    return res.error(error.message, 500);
  }
};

const getMyProfile = (req, res) => {
  if (!req.user) {
    return res.error("User tidak ditemukan di sesi ini.", 404);
  }

  return res.success({ user: req.user }, "Profil berhasil diambil.", 200);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.error("Email wajib diisi.", 400);
    }

    await authService.requestPasswordReset(email);
    return res.success(
      null,
      "Jika email Anda terdaftar, Anda akan menerima link reset password."
    );
  } catch (error) {
    return res.error(error.message, 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.error("Password baru wajib diisi.", 400);
    }
    if (!token) {
      return res.error("Token tidak valid.", 400);
    }

    const result = await authService.resetPassword(token, password);
    return res.success(null, result.message);
  } catch (error) {
    return res.error(error.message, 400);
  }
};

module.exports = {
  login,
  logout,
  getMyProfile,
  forgotPassword,
  resetPassword,
};