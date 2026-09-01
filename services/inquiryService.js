const inquiryRepository = require("../repositories/inquiryRepository");
const emailService = require("./emailService");
const waService = require("./waService");
const { Op } = require("sequelize"); 

const createInquiry = async (inquiryData) => {
  try {
    
    const newInquiry = await inquiryRepository.createInquiry(inquiryData);

    // Kirim Notifikasi WA ke Admin
    try {
      await waService.sendInquiryWhatsApp(newInquiry);
    } catch (waError) {
      console.error("Gagal mengirim WA Inquiry:", waError.message);
    }
    
    try {
      const service = newInquiry.service_needed;

      if (
        service === "Berbicara Dengan Sales" ||
        service === "Bantuan Teknis"
      ) {
        
        await emailService.sendInquiryToAdmin(newInquiry);
      } else if (
        service === "Permintaan Demo" ||
        service === "Lokasi Kantor Exaque"
      ) {
        
        await emailService.sendInquiryToAdmin(newInquiry);
        await emailService.sendConfirmationToCustomer(newInquiry);
      }
    } catch (emailError) {
      
      
      console.error(
        "Gagal menjalankan alur email inquiry:",
        emailError.message
      );
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
