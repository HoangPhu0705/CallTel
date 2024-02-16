const AdminService = require("../service/AdminService");
const productService = require("../service/ProductService");
const staffService = require("../service/staffService");
const invoiceService = require("../service/InvoiceService");
const customerService = require("../service/CustomerService");
const multer = require('multer');
const fs = require('fs');
// const storage = multer.memoryStorage();
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        const uploadFolder = './uploads'; // Define the folder where you want to save uploads
        fs.mkdirSync(uploadFolder, { recursive: true }); // Create the folder if it doesn't exist
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB file size limit
    }
});
class StaffController {
    default(req, res) {
        res.redirect('/staff/home')
    }
    index(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;
        res.render('home', { layout: 'staff_layout.hbs', user: { username, role, image, fullname, email, cardID, country } });
    }
    async products(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const data = await productService.getAll(page, limit);
        let list = await Promise.all(data.products.map(async val => {
            // const dataURI = `data:image/png;base64,${base64String}`;
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
                images: val.images[0],
                time: val.createdAt
            };
        }));
        await res.render('product-list', { layout: 'staff_layout.hbs', user: { username, role, image, fullname, email, cardID, country }, list, ...data.pagination, page: "staff_layout" });

    }
    viewProfile(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;
        res.render('staff-profile', { layout: 'staff_layout.hbs', user: { username, role, image, fullname, email, cardID, country } });

    }

    async changePassword(req, res) {
        try {
            const { old_password, new_password, confirm_new_password } = req.body;
            const staffId = req.user._id;
            const result = await AdminService.changePassword(staffId, old_password, new_password, confirm_new_password);
            req.flash('success_msg',"Change password successfully");
            res.redirect('/staff/profile');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while changing the password');
        }
    }

    
    async updateProfileImage(req, res) {

        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            if(!req.file){
                console.log("Can't find any image file");
                res.redirect("/staff/profile");
            }else{
                const imageBase64 = req.file.buffer.toString('base64');
                await staffService.findByIdAndUpdate(req.user._id, { image: imageBase64 });
                req.flash('success_msg',"Profile Image Updated Successfully");
                res.redirect("/staff/profile");
            }

        });
        
    }


    async tranaction(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const data = await productService.getAll(page, limit);
        let list = await Promise.all(data.products.map(async val => {
            const base64String = val.images;
            const dataURI = `data:image/png;base64,${base64String}`;
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
                images: base64String[0],
                time: val.createdAt
            };
        }));

        await res.render('staff-tranaction', { layout: 'staff_layout.hbs', name: req.user.username, list, ...data.pagination, user: { username, role, image, fullname, email, cardID, country } });
    }
    previewInvoice(req, res) {
        res.render('staff-preview', { layout: 'staff_layout.hbs', name: req.user.username });
    }
    async editGet(req, res) {
        const item = await productService.getProductById(req.params.id)
        const base64String = item.images;
        const dataURI = `data:image/png;base64,${base64String}`;
        let product = {
            _id: item._id,
            productName: item.productName,
            importPrice: item.importPrice,
            retailPrice: item.retailPrice,
            brand: item.brand,
            quantityInStock: item.quantityInStock,
            quantitySold: item.quantitySold,
            ram: item.ram,
            storage: item.storage,
            color: item.color,
            images: base64String[0],
            time: item.createdAt
        }
        res.render('product-edit', { layout: 'admin_layout.hbs', name: req.user.username, product });
    }
    async editPost(req, res) {
        upload.single('file')(req, res, async (err) => {
            try {
                const myData = {
                    productName: req.body.productName,
                    brand: req.body.brand,
                    ram: Number(req.body.ram),
                    storage: Number(req.body.storage),
                    color: req.body.color,
                    quantity: Number(req.body.quantity),
                    importPrice: req.body.importPrice,
                    retailPrice: req.body.retailPrice
                };
                if (req.file)
                    myData.images = Buffer.from(imageService.convertUploadToBuffer(req.file.buffer))
                productService.updateProduct(req.params.id, myData)
                req.flash('success_msg', "Created Success ");
                res.redirect("/admin/products");
            } catch (error) {
                console.log("Missing input");
                req.flash('error_msg', "Missing input");
                res.redirect("/admin/products");
            }
        })
    }
    async addProductData(req, res) {
        upload.single('file')(req, res, async (err) => {
            try {
                const myData = {
                    productName: req.body.productName,
                    brand: req.body.brand,
                    ram: Number(req.body.ram),
                    storage: Number(req.body.storage),
                    color: req.body.color,
                    quantity: Number(req.body.quantity),
                    importPrice: req.body.importPrice,
                    retailPrice: req.body.retailPrice,
                    images: req.file.path
                };
                productService.create(myData)
                req.flash('success_msg', "Created Success ");
                res.redirect("/admin/add");
            } catch (error) {
                console.log("Missing input");
                req.flash('error_msg', "Missing input");
                res.redirect("/admin/add");
            }
        })
    }
    removeProduct(req, res) {
        productService.remove(req.params.id);
        res.redirect("../products");
    }
    async createInvoice(req, res) {
        let productArr = [];
        let idArr = req.body.productId;
        let quantity = req.body.quantity;
        let totalAmount = 0;
        let productAmount = []
        let customer = await customerService.findByPhoneNumber(req.body.cusPhone);
        if(customer == null){
            const newCustomer = {
                fullname: req.body.cusName,
                phonenumber: req.body.cusPhone,
                address: req.body.cusAddress,
            }
            customer = await customerService.create(newCustomer);
        }
        if(Array.isArray(idArr)){
            for (let i = 0; i < idArr.length; i++) {
                const id = idArr[i];
                const product = await productService.getProductById(id);
                let numericString = product.importPrice.replace(/[^\d]/g, '');
                let myNumber = parseInt(numericString, 10);
                productArr.push(product);
                totalAmount += myNumber * parseInt(quantity[i]);
                const tmp = {
                    product: id,
                    quantity: quantity[i],
                    total: parseInt(quantity[i]) * myNumber
                }
                productAmount.push(tmp)
            }
        }
        else{
            const id = idArr;
                const product = await productService.getProductById(id);
                let numericString = product.importPrice.replace(/[^\d]/g, '');
                let myNumber = parseInt(numericString, 10);
                productArr.push(product);
                totalAmount += myNumber * parseInt(quantity);
                const tmp = {
                    product: id,
                    quantity: quantity,
                    total: parseInt(quantity) * myNumber
                }
                productAmount.push(tmp)
        }
        const newInvoice = {
            customer: customer._id,
            staff: req.user.id,
            products: productAmount,
            totalAmount: totalAmount,
            amountPaid: totalAmount,
            amountPaid: req.body.moneyTake,
            status: "pending"
        }
        const invoice = await invoiceService.create(newInvoice);
        if (invoice) {
            customerService.updateTransaction(customer._id,invoice._id)
            res.redirect("./invoice/" + invoice._id); // Redirect to the newly created invoice ID
        } else {
            // Handle case when invoice is not created properly
            console.error('Failed to create invoice');
            res.status(500).send('Failed to create invoice');
        }
    }
    async invoice(req, res) {
        let products = [];
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        const customer = await customerService.getById(invoice.customer);
        const date = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        };
        const dateData = invoice.purchaseDate.toLocaleDateString('en-GB', date)
        const dueData = invoice.dueTo.toLocaleDateString('en-GB', date)
        let invoiceData = {
            _id: invoice._id,
            totalAmount: invoice.totalAmount.toLocaleString(),
            purchaseDate: dateData,
            dueTo:dueData,
            fullname: customer[0].fullname,
            phonenumber: customer[0].phonenumber,
            amountPaid:invoice.amountPaid.toLocaleString(),
            change:(invoice.amountPaid-invoice.totalAmount).toLocaleString(),
            address: customer[0].address
        }
        try {
            for (const id of invoice.products) {
                console.log("id of invoice " ,id);
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
            res.render('staff-preview', { layout: 'staff_layout.hbs', name: req.user.username, data: list, invoice: invoiceData });
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to fetch products for the invoice');
        }
    }

    async invoiceUpdate(req, res) {
        try {
            const invoice = await invoiceService.getInvoiceById(req.params.id);
            let productData = await Promise.all(invoice.products.map(async (product) => {
                const productt = await productService.getProductById(product.product.toString());
                const base64String = productt.images;
                const dataURI = `data:image/png;base64,${base64String}`;
                const data = {
                    _id: productt._id,
                    productName: productt.productName,
                    importPrice: productt.importPrice,
                    retailPrice: productt.retailPrice,
                    brand: productt.brand,
                    quantityInStock: productt.quantityInStock,
                    quantitySold: productt.quantitySold,
                    ram: productt.ram,
                    storage: productt.storage,
                    color: productt.color,
                    images: base64String[0],
                    time: productt.createdAt
                };
        
                return data;
            }));
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const data = await productService.getAll(page, limit);
            let list = await Promise.all(data.products.map(async val => {
                const base64String = val.images;
                const dataURI = `data:image/png;base64,${base64String}`;
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
                    images: base64String[0],
                    time: val.createdAt
                };
            }));

            await res.render('staff-tranaction', { layout: 'staff_layout.hbs', name: req.user.username,invoiceId:req.params.id,data: productData, list: list, ...data.pagination });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Error fetching product data');
        }
    }
    async invoiceEdit(req,res){
        let productArr = [];
        let idArr = req.body.productId;
        let quantity = req.body.quantity
        let totalAmount = 0;
        let productAmount = []
        for (let i = 0; i < idArr.length; i++) {
            const id = idArr[i];
            const product = await productService.getProductById(id);
            let numericString = product.importPrice.replace(/[^\d]/g, '');
            let myNumber = parseInt(numericString, 10);
            productArr.push(product);
            totalAmount += myNumber * parseInt(quantity[i]);
            const tmp = {
                product: id,
                quantity: quantity[i],
                total: parseInt(quantity[i]) * myNumber
            }
            productAmount.push(tmp)
        }
        const newInvoice = {
            customer: "65380a6630e279ddd349272b",
            staff: req.user.id,
            products: productAmount,
            totalAmount: totalAmount,
            amountPaid: totalAmount,
            status: "pending"
        }
        invoiceService.updateInvoice(req.params.id,newInvoice)
        res.redirect("./" + req.params.id);
    }
}
module.exports = new StaffController();
