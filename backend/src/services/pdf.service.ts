export const pdfService = {
  async generateReceipt() {
    throw new Error("PDF receipt generation is reserved for ERP phase 2");
  },
  async generateMarksheet() {
    throw new Error("PDF marksheet generation is reserved for ERP phase 2");
  },
};

