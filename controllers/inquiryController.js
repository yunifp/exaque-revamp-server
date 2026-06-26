const inquiryService = require("../services/inquiryService");


const createInquiry = async (req, res) => {
  try {
    
    const inquiryData = req.body;

    const newInquiry = await inquiryService.createInquiry(inquiryData);

    return res.success(newInquiry, "Permintaan Anda berhasil dikirim.", 201);
  } catch (error) {
    return res.error(error.message, 400); 
  }
};


const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await inquiryService.getAllInquiries(req.query);
    return res.success(inquiries, "Inquiries berhasil diambil.");
  } catch (error) {
    return res.error(error.message, 500);
  }
};


const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await inquiryService.getInquiryById(id);
    return res.success(inquiry, "Inquiry berhasil diambil.");
  } catch (error) {
    
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};


const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.error('Field "status" wajib diisi.', 400);
    }

    const updatedInquiry = await inquiryService.updateInquiryStatus(id, status);
    return res.success(updatedInquiry, "Status inquiry berhasil diperbarui.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    if (error.message.includes("tidak valid")) {
      return res.error(error.message, 400);
    }
    return res.error(error.message, 500);
  }
};


const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await inquiryService.deleteInquiry(id);
    return res.success(null, "Inquiry berhasil dihapus.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};
