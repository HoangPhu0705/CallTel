const CustomerService = require("../service/CustomerService");
const invoiceService = require("../service/InvoiceService");
const productService = require("../service/ProductService");



class CustomerController{
    async getByPhoneNumber(req,res){
        const phoneNumber = req.query.phonenumber;
        const customer = await CustomerService.findByPhoneNumber(phoneNumber);
        if (customer) {
            res.status(200).json({data : customer   });
        }else{
            res.status(404).json({error : "not found "});
        }
    }

    async getCustomer(req, res){
        const { username, role, image, fullname, email, cardID, country } = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const data = await CustomerService.findAll(page, limit);
        
        res.render('staff-customers', {layout: 'staff_layout', customers: data.customers, ...data.pagination,  user: { username, role, image, fullname, email, cardID, country }});
    }

    async getCustomerInvoice(req, res){

        const customerID = req.params.id;
        const data = await CustomerService.getCustomerInvoices(customerID);
        res.render('customer-history', {layout: 'staff_layout', invoices: data.invoices, ...data.pagination, page: "staff_layout"});
    }

    async adminGetCustomer(req, res){
        const { username, role, image, fullname, email, cardID, country } = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const data = await CustomerService.findAll(page, limit);
        
        res.render('staff-customers', {layout: 'admin_layout', customers: data.customers, ...data.pagination,  user: { username, role, image, fullname, email, cardID, country }});
    }

    async adminGetCustomerInvoice(req, res){

        const customerID = req.params.id;
        const data = await CustomerService.getCustomerInvoices(customerID);
        res.render('customer-history', {layout: 'admin_layout', invoices: data.invoices, ...data.pagination, page: "admin_layout"});
    }


    async invoice(req, res) {
        let products = [];
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        const customer = await CustomerService.getById(invoice.customer);
        const date = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        };
        const dateData = invoice.purchaseDate.toLocaleDateString('en-GB', date)
        const dueData = invoice.dueTo.toLocaleDateString('en-GB', date)
        let invoiceData = {
            _id: invoice._id,
            totalAmount: invoice.totalAmount,
            purchaseDate: dateData,
            dueTo:dueData,
            fullname: customer[0].fullname,
            phonenumber: customer[0].phonenumber,
            amountPaid:invoice.amountPaid,
            change:invoice.amountPaid-invoice.totalAmount,
            address: customer[0].address
        }
        try {
            for (const id of invoice.products) {
                const product = await productService.getProductById(id.product.toString());
                const productWithDetails = { ...product.toObject(), quantity: id.quantity, total: id.total };
                products.push(productWithDetails);
            }
            let list = await Promise.all(products.map(async val => {
                return {
                    _id: val._id,
                    productName: val.productName,
                    importPrice: val.importPrice,
                    retailPrice: val.retailPrice,
                    brand: val.brand,
                    quantityInStock: val.quantityInStock,
                    quantitySold: val.quantitySold,
                    ram: val.ram,
                    storage: val.storage,
                    color: val.color,
                    time: val.createdAt,
                    amount: val.quantity,
                    total: val.total
                };
            }));
            res.render('admin-invoice', { layout: 'admin_layout', name: req.user.username, data: list, invoice: invoiceData });
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to fetch products for the invoice');
        }
    }

}

module.exports = new CustomerController();