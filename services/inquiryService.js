const inquiryRepository = require("../repositories/inquiryRepository");
const emailService = require("./emailService");
const waService = require("./waService");
const { Op } = require("sequelize"); 

const createInquiry = async (inquiryData) => {
  try {
    
    const newInquiry = await inquiryRepository.createInquiry(inquiryData);

    // Kirim Notifikasi WA ke Admin secara asynchronous di background
    waService.sendInquiryWhatsApp(newInquiry).catch((waError) => {
      console.error("Gagal mengirim WA Inquiry:", waError.message);
    });

    // Kirim Notifikasi Email ke Admin secara asynchronous di background
    emailService.sendInquiryToAdmin(newInquiry).catch((emailError) => {
      console.error("Gagal mengirim email ke admin:", emailError.message);
    });

    // Kirim Notifikasi Konfirmasi Email ke Pengisi Formulir (Customer)
    if (newInquiry.email && newInquiry.email.trim() !== "") {
      emailService.sendConfirmationToCustomer(newInquiry).catch((emailError) => {
        console.error("Gagal mengirim konfirmasi email ke customer:", emailError.message);
      });
    }
    

    
    return newInquiry;
  } catch (error) {
    throw new Error(`Gagal membuat inquiry: ${error.message}`);
  }
};

const getAllInquiries = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    service_needed,
    sort = "createdAt", 
    order = "DESC", 
  } = queryParams;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = {};

  if (status) where.status = status;
  if (service_needed) where.service_needed = service_needed;
  

  const options = {
    where,
    limit: parseInt(limit),
    offset,
    order: [[sort, order]],
  };

  try {
    const { count, rows } = await inquiryRepository.findAllInquiries(options);
    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (error) {
    throw new Error(`Gagal mengambil inquiries: ${error.message}`);
  }
};

const getInquiryById = async (id) => {
  const inquiry = await inquiryRepository.findInquiryById(id);
  if (!inquiry) {
    throw new Error("Inquiry tidak ditemukan.");
  }
  return inquiry;
};

const updateInquiryStatus = async (id, status) => {
  
  const validStatuses = ["new", "contacted", "resolved", "spam"];
  if (!validStatuses.includes(status)) {
    throw new Error("Status tidak valid.");
  }

  
  const existingInquiry = await inquiryRepository.findInquiryById(id);
  if (!existingInquiry) {
    throw new Error("Inquiry tidak ditemukan.");
  }

  
  const rowsUpdated = await inquiryRepository.updateInquiryById(id, {
    status: status,
  });


  
  const updatedInquiry = await inquiryRepository.findInquiryById(id);

  return updatedInquiry; 
};

const deleteInquiry = async (id) => {
  const deletedRows = await inquiryRepository.deleteInquiryById(id);
  if (deletedRows === 0) {
    throw new Error("Inquiry tidak ditemukan.");
  }
  return { message: "Inquiry berhasil dihapus." };
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};
