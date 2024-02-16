const InvoiceService = require("../service/InvoiceService");

class InvoiceController {
    async getAllInvoices(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit =  10;
            const result = await InvoiceService.getAll(page,limit);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createInvoice(req, res) {
        try {
            const newInvoice = req.body; // Assuming the request body contains the new invoice data
            const result = await InvoiceService.create(newInvoice);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateInvoice(req, res) {
        try {
            const { invoiceId } = req.params;
            const updateFields = req.body;
            const result = await InvoiceService.updateInvoice(invoiceId, updateFields);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getInvoiceById(req, res) {
        try {
            const { invoiceId } = req.params;
            const result = await InvoiceService.getInvoiceById(invoiceId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getInvoicesByStaff(req, res) {
        try {
            const { staffId } = req.params;
            const result = await InvoiceService.getInvoicesByStaff(staffId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Implement other methods similarly for other service functions
    async getInvoicesByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const result = await InvoiceService.getInvoicesByCustomer(customerId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getInvoicesByDate(req, res) {
        try {
            const  date  = req.query.date;
            console.log(date);
            const invoices = await InvoiceService.getInvoicesByDate(date);
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getInvoicesInLastWeek(req, res) {
        try {
            const invoices = await InvoiceService.getInvoicesInLastWeek();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Route to get invoices in the last week

    async getInvoicesInDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const invoices = await InvoiceService.getInvoicesInDateRange(startDate, endDate);
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getInvoicesFromYesterday(req, res) {
        try {
            const invoices = await InvoiceService.getInvoicesFromYesterday();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getInvoiceToday(req,res){
        try {
            const invoices = await InvoiceService.getInvoiceToday();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Route to get invoices from yesterday

}
module.exports = new InvoiceController()