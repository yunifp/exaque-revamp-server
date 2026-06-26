"use strict";
const nodemailer = require("nodemailer");

// 1. Buat 'Transporter' Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Mengirim email reset password.
 * (Tidak ada perubahan, tetap menggunakan template inline sederhana)
 */
const sendResetPasswordEmail = async (userEmail, userName, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: "Permintaan Reset Password Akun Exaque",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Halo ${userName},</h2>
        <p>Kami menerima permintaan untuk mereset password akun Exaque Anda.</p>
        <p>Silakan klik tombol di bawah ini untuk melanjutkan:</p>
        <a href="${resetUrl}" style="background-color: #a60046; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>Jika Anda tidak bisa mengklik tombol, silakan salin dan tempel URL ini di browser Anda:</p>
        <p>${resetUrl}</p>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
        <br>
        <p>Terima kasih,</p>
        <p>Tim Exaque</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email reset password terkirim ke: ${userEmail}`);
  } catch (error) {
    console.error(`Gagal mengirim email ke ${userEmail}:`, error);
    throw new Error("Gagal mengirim email reset password.");
  }
};

/**
 * Mengirim notifikasi inquiry baru ke Admin
 * Menggunakan template dari admin.html
 */
const sendInquiryToAdmin = async (inquiryData) => {
  // Template HTML Admin (Minified version of admin.html)
  const adminHtmlTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alert Admin - Exaque</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Poppins', Arial, sans-serif; }
        .data-row td { padding: 12px 15px; border-bottom: 1px solid #eeeeee; vertical-align: top; }
        .data-label { color: #888888; font-size: 13px; font-weight: 600; width: 140px; white-space: nowrap; }
        .data-value { color: #2c2c2c; font-size: 14px; font-weight: 500; line-height: 1.5; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .content-padding { padding: 20px !important; }
            .data-label { width: 100px; white-space: normal; }
        }
    </style>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border-top: 5px solid #a60046; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <tr>
                        <td class="content-padding" style="padding: 40px 40px 20px 40px;">
                            <h2 style="color: #a60046; font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">Prospek Baru Masuk</h2>
                            <p style="color: #555555; font-size: 14px; margin: 0;">Halo Admin, berikut adalah detail permintaan baru dari website:</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-padding" style="padding: 0 40px 40px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbfbfb; border: 1px solid #eeeeee; border-radius: 6px;">
                                <tr class="data-row"><td class="data-label">Nama Depan</td><td class="data-value">{nama_depan}</td></tr>
                                <tr class="data-row"><td class="data-label">Nama Belakang</td><td class="data-value">{nama_belakang}</td></tr>
                                <tr class="data-row"><td class="data-label">Email</td><td class="data-value" style="color: #a60046;">{email}</td></tr>
                                <tr class="data-row"><td class="data-label">Perusahaan</td><td class="data-value">{perusahaan}</td></tr>
                                <tr class="data-row"><td class="data-label">Jabatan</td><td class="data-value">{jabatan}</td></tr>
                                <tr class="data-row"><td class="data-label">Profil User</td><td class="data-value">{kategori_profil}</td></tr>
                                <tr class="data-row">
                                    <td class="data-label" style="border-bottom: none;">Kebutuhan</td>
                                    <td class="data-value" style="border-bottom: none;">{pesan_user}</td>
                                </tr>
                            </table>
                            <div style="margin-top: 30px; text-align: center;">
                                <a href="mailto:{email}?subject=Re:%20Permintaan%20Informasi%20Exaque" style="background-color: #2c2c2c; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; font-weight: 600; display: inline-block;">Balas Email User</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #eeeeee; padding: 15px; font-size: 11px; color: #888888;">Sistem Notifikasi Otomatis Exaque</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // Replace placeholder dengan data asli
  const filledHtml = adminHtmlTemplate
    .replace(/{nama_depan}/g, inquiryData.first_name || "-")
    .replace(/{nama_belakang}/g, inquiryData.last_name || "-")
    .replace(/{email}/g, inquiryData.email)
    .replace(/{perusahaan}/g, inquiryData.company || "-")
    .replace(/{jabatan}/g, inquiryData.job_title || "-")
    .replace(/{kategori_profil}/g, inquiryData.user_persona || "-")
    .replace(
      /{pesan_user}/g,
      inquiryData.message || inquiryData.service_needed
    );

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER_ADMIN, // Kirim ke Admin
    subject: `[Lead Baru] ${inquiryData.service_needed} - ${inquiryData.first_name}`,
    html: filledHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Notifikasi inquiry terkirim ke admin: ${process.env.EMAIL_USER_ADMIN}`
    );
  } catch (error) {
    console.error("Gagal mengirim email notifikasi admin:", error);
  }
};

/**
 * Mengirim email konfirmasi ke Pelanggan
 * Menggunakan template dari user.html
 */
const sendConfirmationToCustomer = async (inquiryData) => {
  // Template HTML User (Minified version of user.html)
  const userHtmlTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permintaan Diterima - Exaque</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Poppins', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; width: 100%; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .content-padding { padding: 30px 20px !important; }
            .header-padding { padding: 25px 20px !important; }
        }
    </style>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" class="header-padding" style="background-color: #a60046; padding: 35px;">
                            <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: 2px;">EXAQUE</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-padding" style="padding: 50px 50px; text-align: center;">
                            <div style="margin-bottom: 30px;">
                                <div style="display: inline-block; width: 60px; height: 60px; background-color: #e8f5e9; border-radius: 50%; line-height: 60px;">
                                    <span style="color: #2e7d32; font-size: 30px; line-height: 60px; font-weight: bold;">&#10003;</span>
                                </div>
                            </div>
                            <h2 style="color: #2c2c2c; font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">Halo, {nama_user}</h2>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                                Terima kasih telah menghubungi kami. Permintaan Anda untuk <strong style="color: #a60046;">"Kebutuhan IT / Demo"</strong> telah berhasil kami terima.
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center; color: #555555; font-size: 14px; line-height: 1.5;">
                                        Tim kami sedang meninjau permintaan Anda.<br>
                                        Kami akan menghubungi Anda kembali dalam waktu<br>
                                        <strong>1-2 hari kerja.</strong>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #2c2c2c; font-size: 16px; font-weight: 600; margin: 0;">
                                Salam hangat,<br>Tim Exaque
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #2c2c2c; padding: 20px;">
                            <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
                                &copy; 2025 EXAQUE. Celebrating 9th Anniversary.<br>
                                <a href="https://www.exaque.com" style="color: #ffffff; text-decoration: none;">www.exaque.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
                <div style="height: 40px;"></div>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // Replace placeholder dengan data asli
  const filledHtml = userHtmlTemplate.replace(
    /{nama_user}/g,
    inquiryData.first_name
  );

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: inquiryData.email, // Kirim ke Pelanggan
    subject: "Permintaan Anda Telah Kami Terima - Exaque",
    html: filledHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email konfirmasi terkirim ke: ${inquiryData.email}`);
  } catch (error) {
    console.error("Gagal mengirim email konfirmasi pelanggan:", error);
  }
};

module.exports = {
  sendResetPasswordEmail,
  sendInquiryToAdmin,
  sendConfirmationToCustomer,
};
