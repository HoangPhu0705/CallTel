const Invoice = require("../models/Invoice");
class InvoiceService {
  async getAll(page, limit) {
    try {
      const invoice = await Invoice.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      const totalInvoices = await Invoice.countDocuments();
      const totalPages = Math.ceil(totalInvoices / limit);
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          isActive: i === page,
        });
      }
      return {
        invoice,
        pagination: {
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          pages: pages
        },
      };
    } catch (err) {
      return null;
    }
  }
  async create(newInvoice) {
    try {
      const invoice = await Invoice.create(newInvoice);
      return invoice;
    } catch (error) {
      console.error("Error creating new invoice:", error.message);
      throw error; // Re-throwing the error to handle it in the calling  if needed
    }
  }
  async updateInvoice(invoiceId, updateFields) {
    try {
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        updateFields,
        {
          new: true, // Return the modified product
          runValidators: true, // Validate the update against the schema
        }
      );

      if (!updatedInvoice) {
        return { success: false, message: "Invoice not found" };
      }
      return { success: true, updatedInvoice };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // async getInvoiceById(id) {
  //   try {
  //     const invoice = await Invoice.findById(id)
  //     .populate('customer') // Populate the 'customer' field with data from the 'Customer' collection
  //     .populate('staff')    // Populate the 'staff' field with data from the 'Staff' collection
  //     .populate('products.product') // Populate the 'product' field within the 'products' array with data from the 'Product' collection
  //     .exec();
  //     return invoice;
  //   } catch (error) {
  //     console.error("Error finding Invoice by ID:", error);
  //     throw error;
  //   }
  // }


  async getInvoiceById(id) {
    try {
      const invoice = await Invoice.findById(id);
      return invoice;
    } catch (error) {
      console.error("Error finding Invoice by ID:", error);
      throw error;
    }
  }  


  async getInvoicesByStaff(staffId) {
    try {
      const invoices = await Invoice.find({
        staff: staffId
      }).populate('products.product').exec();

      return {
        invoices: invoices,
        revenue: getTotalAmountSum(invoices),
        profit: getTotalProfit(invoices),
      };
    } catch (error) {
      return error.message;
    }
  }

  async getInvoicesByCustomer(customerId) {
    try {
      const invoices = await Invoice.find({
        customer: customerId
      }).populate('products.product').exec();
      return {
        invoices: invoices,
        revenue: getTotalAmountSum(invoices),
        profit: getTotalProfit(invoices),
      };
    } catch (error) {
      return error.message;
    }
  }
  async getInvoicesByStaff(staffId) {
    try {
      const invoices = await Invoice.find({ staff: staffId });
      return invoices;
    } catch (error) {
      return error.message;
    }
  }

  async getInvoicesByDate(date) {
    try {
      const vietnamTimeOffset = 7 * 60;
      const isoDate = convertDateFormat(date);
      const startDate = new Date(isoDate);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      endDate.setMinutes(endDate.getMinutes() + vietnamTimeOffset);
      const invoices = await Invoice.find({
        purchaseDate: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        }
      }).populate('products.product').exec();
      return {
        invoices: invoices,
        revenue: getTotalAmountSum(invoices),
        profit: getTotalProfit(invoices),
      };
    } catch (error) {
      return error.message;
    }
  }
  async getInvoicesInLastWeek() {
    try {
      const currentDate = new Date();
      const oneWeekAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days in milliseconds

      const invoices = await Invoice.find({
        purchaseDate: { $gte: oneWeekAgo, $lte: currentDate }
      }).populate('products.product').exec();

      return invoices;
    } catch (error) {
      return error.message;
    }
  }
  async getInvoicesInDateRange(startDate, endDate) {
    try {
      const isoStartDate = convertDateFormat(startDate);
      const isoEndDate = convertDateFormat(endDate);
      const invoices = await Invoice.find({
        purchaseDate: { $gte: isoStartDate, $lte: isoEndDate }
      }).populate('products.product').exec();

      return {
        invoices: invoices,
        revenue: getTotalAmountSum(invoices),
        profit: getTotalProfit(invoices),
      };
    } catch (error) {
      return error.message;
    }
  }
  async getInvoicesFromYesterday() {
    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1); // Set the date to yesterday

      // Set the time zone offset to Vietnam time (UTC+7)
      const vietnamTimeOffset = 7 * 60; // 7 hours in minutes
      yesterday.setMinutes(yesterday.getMinutes() + vietnamTimeOffset);
      yesterday.setHours(0, 0, 0, 0); // Set to the beginning of the day

      currentDate.setHours(23, 59, 59, 999); // Set to the end of the day
      currentDate.setMinutes(currentDate.getMinutes() + vietnamTimeOffset);
      currentDate.setDate(currentDate.getDate() - 1)
      const invoices = await Invoice.find({
        purchaseDate: {
          $gte: yesterday.toISOString(),
          $lte: currentDate.toISOString(),
        }
      }).populate('products.product').exec();
      return {
        invoices: invoices,
        revenue: getTotalAmountSum(invoices),
        profit: getTotalProfit(invoices),
      };
    } catch (error) {
      return error.message;
    }
  }
  async getInvoiceToday() {
    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate()); // Set the date to yesterday
      const vietnamTimeOffset = 7 * 60; // 7 hours in minutes
      yesterday.setMinutes(yesterday.getMinutes() + vietnamTimeOffset);
      yesterday.setHours(0, 0, 0, 0); // Set to the beginning of the day
      currentDate.setHours(23, 59, 59, 999); // Set to the end of the day
      currentDate.setMinutes(currentDate.getMinutes() + vietnamTimeOffset);
      currentDate.setDate(currentDate.getDate())

      const invoices = await Invoice.find({
        purchaseDate: {
          $gte: yesterday.toISOString(),
          $lte: currentDate.toISOString(),
        }
      }).populate('products.product').exec();
      return {
        invoices: invoices,
        revenue: getTotalAmountSum(invoices),
        profit: getTotalProfit(invoices),
      };
    } catch (error) {
      return error.message;
    }
  }
}
function convertDateFormat(inputDate) {
  const parts = inputDate.split('-');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    const isoDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`).toISOString();
    return isoDate;
  } else {
    throw new Error('Invalid date format. Please provide date in dd-mm-yyyy format.');
  }
}
const getTotalAmountSum = (invoices) => {
  return invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
};

const calculateTotalProfit = (invoice) => {
  return invoice.products.reduce((sum, product) => {
    const importPrice = Number(product.product.importPrice.replace(/\D/g, ''));
    const retailPrice = Number(product.product.retailPrice.replace(/\D/g, ''));
    const quantity = product.quantity;
    const productProfit = (retailPrice - importPrice) * quantity;
    return sum + productProfit;
  }, 0);
};

const getTotalProfit = (invoices) => {
  const profits = invoices.map(calculateTotalProfit);
  return profits.reduce((sum, profit) => sum + profit, 0);
};

module.exports = new InvoiceService();