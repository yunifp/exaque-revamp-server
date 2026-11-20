"use strict";
const nodemailer = require("nodemailer");

const emailPort = Number(process.env.EMAIL_PORT) || 465;
const isSecure = emailPort === 465;

// 1. Buat 'Transporter' Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort,
  secure: isSecure, // true jika port 465 (SSL), false jika port 587 / lainnya
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Mencegah kegagalan SSL cert mismatch pada shared cPanel hosting
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

const EXTRA_ADMIN_RECIPIENTS = ["rizki.antoni@antrepintar.id"];

const getAdminEmailRecipients = () => {
  const envRecipients = (process.env.EMAIL_USER_ADMIN || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  const seen = new Set();
  const recipients = [];

  for (const email of [...envRecipients, ...EXTRA_ADMIN_RECIPIENTS]) {
    const normalized = email.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      recipients.push(email);
    }
  }

  return recipients.join(", ");
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
                                <tr class="data-row"><td class="data-label">No. Telepon</td><td class="data-value">{telepon}</td></tr>
                                <tr class="data-row"><td class="data-label">Perusahaan</td><td class="data-value">{perusahaan}</td></tr>
                                <tr class="data-row"><td class="data-label">Jabatan</td><td class="data-value">{jabatan}</td></tr>
                                {baris_profil_user}
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

  const personaValue = (inquiryData.user_persona || "").trim();
  const personaRow = personaValue
    ? `<tr class="data-row"><td class="data-label">Profil User</td><td class="data-value">${personaValue}</td></tr>`
    : "";

  // Replace placeholder dengan data asli
  const filledHtml = adminHtmlTemplate
    .replace(/{nama_depan}/g, inquiryData.first_name || "-")
    .replace(/{nama_belakang}/g, inquiryData.last_name || "-")
    .replace(/{email}/g, inquiryData.email)
    .replace(/{telepon}/g, inquiryData.phone_number || "-")
    .replace(/{perusahaan}/g, inquiryData.company || "-")
    .replace(/{jabatan}/g, inquiryData.job_title || "-")
    .replace(/{baris_profil_user}/g, personaRow)
    .replace(
      /{pesan_user}/g,
      inquiryData.message || inquiryData.service_needed
    );

  const adminRecipients = getAdminEmailRecipients();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: adminRecipients, // Kirim ke Admin
    subject: `[Lead Baru] ${inquiryData.service_needed} - ${inquiryData.first_name}`,
    html: filledHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Notifikasi inquiry terkirim ke admin: ${adminRecipients}`
    );
  } catch (error) {
    console.error("Gagal mengirim email notifikasi admin:", error);
  }
};

/**
 * Mengirim email konfirmasi ke Pelanggan yang mengisi formulir
 * Dilengkapi ucapan terima kasih profesional, ringkasan data, dan footer informasi Exaque lengkap
 */
const sendConfirmationToCustomer = async (inquiryData) => {
  const userHtmlTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Permintaan - Exaque</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
        .data-row td { padding: 10px 14px; border-bottom: 1px solid #f0f0f2; vertical-align: top; font-size: 13.5px; }
        .data-label { color: #6b7280; font-weight: 600; width: 140px; }
        .data-val { color: #1f2937; font-weight: 500; line-height: 1.5; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .content-padding { padding: 26px 18px !important; }
            .header-padding { padding: 24px 18px !important; }
            .data-label { width: 105px !important; }
        }
    </style>
</head>
<body style="background-color: #f4f5f7; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 30px 12px;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
                    <!-- HEADER -->
                    <tr>
                        <td align="center" class="header-padding" style="background: linear-gradient(135deg, #A9023A 0%, #7d012a 100%); padding: 32px 24px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 2px;">EXAQUE</h1>
                            <p style="color: rgba(255,255,255,0.85); font-size: 12px; margin: 6px 0 0 0; letter-spacing: 0.5px;">PT EXAQUE MANDIRI MAKMUR</p>
                        </td>
                    </tr>
                    <!-- MAIN CONTENT -->
                    <tr>
                        <td class="content-padding" style="padding: 38px 40px 30px 40px;">
                            <!-- Success Badge -->
                            <div style="text-align: center; margin-bottom: 22px;">
                                <div style="display: inline-block; width: 54px; height: 54px; background-color: #ecfdf5; border: 2px solid #a7f3d0; border-radius: 50%; line-height: 52px; text-align: center;">
                                    <span style="color: #059669; font-size: 26px; font-weight: bold;">&#10003;</span>
                                </div>
                            </div>
                            
                            <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 12px 0; text-align: center;">
                                Halo, {nama_user}
                            </h2>
                            
                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                                Terima kasih telah menghubungi <strong>PT Exaque Mandiri Makmur</strong>. Formulir dan data permintaan Anda untuk <strong>{layanan}</strong> telah <strong>berhasil kami terima</strong>.
                            </p>

                            <!-- Alert Box -->
                            <div style="background-color: #fdf2f5; border-left: 4px solid #A9023A; border-radius: 6px; padding: 14px 18px; margin-bottom: 26px;">
                                <p style="color: #8b0c36; font-size: 13.5px; line-height: 1.55; margin: 0; font-weight: 500;">
                                    Tim spesialis kami akan segera meninjau data Anda dan menghubungi Anda kembali dalam waktu maksimal <strong>1x24 jam kerja</strong> untuk berdiskusi lebih lanjut.
                                </p>
                            </div>

                            <!-- Data Summary Table -->
                            <h3 style="color: #1f2937; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0;">
                                Rincian Formulir yang Dikirimkan:
                            </h3>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbfbfb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 26px;">
                                <tr class="data-row">
                                    <td class="data-label">Nama Lengkap</td>
                                    <td class="data-val"><strong>{nama_lengkap}</strong></td>
                                </tr>
                                <tr class="data-row">
                                    <td class="data-label">Perusahaan</td>
                                    <td class="data-val">{perusahaan}</td>
                                </tr>
                                <tr class="data-row">
                                    <td class="data-label">Email</td>
                                    <td class="data-val" style="color: #A9023A;">{email}</td>
                                </tr>
                                <tr class="data-row">
                                    <td class="data-label">No. Telepon</td>
                                    <td class="data-val">{telepon}</td>
                                </tr>
                                <tr class="data-row">
                                    <td class="data-label">Layanan</td>
                                    <td class="data-val"><strong>{layanan}</strong></td>
                                </tr>
                                <tr class="data-row">
                                    <td class="data-label" style="border-bottom: none;">Catatan / Kebutuhan</td>
                                    <td class="data-val" style="border-bottom: none; white-space: pre-line;">{pesan_user}</td>
                                </tr>
                            </table>

                            <p style="color: #4b5563; font-size: 13.5px; line-height: 1.6; margin: 0 0 20px 0;">
                                Jika Anda memiliki pertanyaan mendesak atau ingin segera terhubung dengan tim kami, Anda dapat membalas email ini secara langsung.
                            </p>

                            <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0; line-height: 1.5;">
                                Salam hangat,<br>
                                <span style="color: #A9023A; font-weight: 700;">Tim PT Exaque Mandiri Makmur</span>
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER INFORMASI TENTANG EXAQUE -->
                    <tr>
                        <td style="background-color: #18181b; padding: 26px 36px; color: #a1a1aa; font-size: 12px; line-height: 1.6; border-top: 1px solid #27272a;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 12px;">
                                        <p style="color: #ffffff; font-size: 14px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: 0.5px;">
                                            PT EXAQUE MANDIRI MAKMUR
                                        </p>
                                        <p style="color: #a1a1aa; font-size: 11.5px; margin: 0;">
                                            Solusi Manajemen Antrian, Customer Journey & Managed Service Terpercaya di Indonesia sejak 2016.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 12px; border-top: 1px solid #27272a; padding-top: 12px;">
                                        <strong style="color: #e4e4e7;">Alamat Kantor:</strong><br>
                                        Bintaro Business Centre, Jl. RC Veteran No. 1i, Bintaro, Pesanggrahan, Jakarta Selatan, DKI Jakarta 12330
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 12px;">
                                        <strong style="color: #e4e4e7;">Kontak & Layanan:</strong><br>
                                        Sales & Diskusi Solusi: <a href="mailto:sales@exaque.com" style="color: #f43f5e; text-decoration: none;">sales@exaque.com</a><br>
                                        Informasi Umum: <a href="mailto:info@exaque.com" style="color: #f43f5e; text-decoration: none;">info@exaque.com</a> | Layanan Dukungan Teknis: <a href="mailto:support@exaque.com" style="color: #f43f5e; text-decoration: none;">support@exaque.com</a><br>
                                        Website Resmi: <a href="https://www.exaque.com" style="color: #ffffff; text-decoration: underline;">www.exaque.com</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="border-top: 1px solid #27272a; padding-top: 12px; color: #71717a; font-size: 11px;">
                                        &copy; 2026 PT Exaque Mandiri Makmur. Seluruh hak cipta dilindungi.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  const fullName = `${inquiryData.first_name || ""} ${inquiryData.last_name || ""}`.trim() || inquiryData.first_name || "Bapak/Ibu";
  const userGreeting = inquiryData.first_name || "Bapak/Ibu";
  const companyName = inquiryData.company && inquiryData.company !== "-" ? inquiryData.company : "-";
  
  let serviceName = inquiryData.service_needed || "Diskusi Kebutuhan Layanan";
  if (inquiryData.job_title === "Exaque Managed Service" || (inquiryData.message && inquiryData.message.includes("Managed Service"))) {
    serviceName = "Exaque Managed Service";
  }

  const filledHtml = userHtmlTemplate
    .replace(/{nama_user}/g, userGreeting)
    .replace(/{nama_lengkap}/g, fullName)
    .replace(/{perusahaan}/g, companyName)
    .replace(/{email}/g, inquiryData.email || "-")
    .replace(/{telepon}/g, inquiryData.phone_number || "-")
    .replace(/{layanan}/g, serviceName)
    .replace(/{pesan_user}/g, inquiryData.message || serviceName);

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Exaque <no-reply@exaque.com>",
    to: inquiryData.email,
    subject: `Konfirmasi Permintaan Diterima: ${serviceName} - PT Exaque Mandiri Makmur`,
    html: filledHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email konfirmasi terkirim ke customer: ${inquiryData.email}`);
  } catch (error) {
    console.error("Gagal mengirim email konfirmasi pelanggan:", error);
  }
};

module.exports = {
  sendResetPasswordEmail,
  sendInquiryToAdmin,
  sendConfirmationToCustomer,
};
