const passport = require("passport");
const staffService = require("../service/staffService");
const AdminService = require("../service/AdminService");
const AuthService = require("../service/AuthService");
const productService = require("../service/ProductService");
const imageService = require("../service/ImageService");
const invoiceService = require("../service/InvoiceService");
const multer = require('multer');
const fs = require('fs');
const Staff = require("../models/Staff");
const { log } = require("console");
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadFolder = './uploads'; // Define the folder where you want to save uploads
//         fs.mkdirSync(uploadFolder, { recursive: true }); // Create the folder if it doesn't exist
//         cb(null, uploadFolder);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
//     },
// });
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB file size limit
    }
});
class AdminController {

    //GET methods
    default(req, res) {
        res.redirect("/admin/home");
    }
    register(req, res) {
        const { username, role } = req.user;
        // const imageBuffer = Buffer.from(image.buffer, 'binary');
        // const imageBase64 = imageBuffer.toString('base64');
        res.render('home', { layout: 'admin_layout.hbs', user: { username, role } });
    }
    addProduct(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;

        res.render('product-add', { layout: 'admin_layout.hbs', name: req.user.username, user: { username, role, image, fullname, email, cardID, country } });
    }
    async addProductData(req, res) {
        upload.single('file')(req, res, async (err) => {
            imageService.saveImageToFile(req.file)
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
                    images:req.file.originalname
                };
                if (req.file) {
                    myData.imagePath = req.file.path; // Store the file path in the database
                }

                await productService.create(myData);
                req.flash('success_msg', "Created Success ");
                res.redirect("/admin/add");
            } catch (error) {
                console.log("Missing input", error);
                req.flash('error_msg', "Missing input");
                res.redirect("/admin/add");
            }
        })
    }
    async products(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const data = await productService.getAll(page, limit);
        let list = await Promise.all(data.products.map(async val => {
            const base64String = val.images;
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
                time: val.createdAt.toDateString()
            };
        }));
        await res.render('product-list', { layout: 'admin_layout.hbs', name: req.user.username, list, ...data.pagination, user: { username, role, image, fullname, email, cardID, country }, page: "admin_layout" });
    }


    removeProduct(req, res) {
        productService.remove(req.params.id);
        res.redirect("../products");
    }

    viewProfile(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;
        res.render('admin-profile', { layout: 'admin_layout.hbs', page: 'admin-profile', user: { username, role, image, fullname, email, cardID, country } });
    }

    async updateProfileImage(req, res) {

        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            if (!req.file) {
                console.log("Can't find any image file");
                res.redirect("/admin/profile");
            } else {
                console.log(req.file);

                const imageBase64 = req.file.buffer.toString('base64');
                await staffService.findByIdAndUpdate(req.user._id, { image: imageBase64 });
                req.flash('success_msg',"Profile Image Updated Successfully");
                res.redirect("/admin/profile");
            }

        });

    }

    async changePassword(req, res) {
        try {
            const { old_password, new_password, confirm_new_password } = req.body;
            const staffId = req.user._id;
            console.log(staffId);
            const result = await AdminService.changePassword(staffId, old_password, new_password, confirm_new_password);
            console.log(result);
            req.flash('success_msg',"Change password successfully");
            res.redirect('/admin/profile');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while changing the password');
        }
    }

    async viewStaff(req, res) {
        const { username, role, image, fullname, email, cardID, country } = req.user;

        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let data = await staffService.getAllEmployee(page, limit);
        data.staffs = data.staffs.map((staff, index) => {

            return { ...staff, index: index + 1, image: staff.image };
        });

        res.render('staff-list', {
            layout: 'admin_layout.hbs',
            staffs: data.staffs,
            name: req.user.username,
            ...data.pagination,
            user: { username, role, image, fullname, email, cardID, country }
        });
    }


    async lockAccount(req, res) {
        try {
            const staffId = req.params.id;
            const staff = await staffService.findStaffById(staffId);
            if (staff) {
                const newStatus = staff.status == 'on' ? 'off' : 'on';
                await staffService.findByIdAndUpdate(staffId, { status: newStatus });
                res.redirect(`/admin/employees/${staffId}`);
            } else {
                throw new Error('Staff not found');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occur when locking the account');
        }
    }
    async resetPasword(req, res) {
        try {
            const staffId = req.params.id;
            const staff = await staffService.findStaffById(staffId);
            if (staff) {
                const updateStaff = await staffService.findByIdAndUpdate(staffId,{password : ""});
                await AdminService.createMailResetPassword(updateStaff.email);
                req.flash('success_msg', "Mail Sent");
                res.redirect(`/admin/employees/${staffId}`);
            } else {
                throw new Error('Staff not found');
            }
        } catch (error) {
            console.error(err);
            res.status(500).send('An error occur when locking the account');
        }
    }

    async viewStaffDetails(req, res) {
        let staffId = req.params.id;
        let staff = await staffService.findStaffById(staffId);
        const data = await invoiceService.getInvoicesByStaff(req.params.id)
        const cloneData = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < cloneData.length; i++) {
            for (let j = 0; j < cloneData[i].products.length; j++) {
                const product = await productService.getProductById(cloneData[i].products[j].product);
                cloneData[i].products[j].productName = product.productName;
            }
            cloneData[i].purchaseDate= cloneData[i].purchaseDate.substring(0, 10);
            cloneData[i].totalAmount =cloneData[i].totalAmount.toLocaleString();
        }
        res.render('staff-details', {
            layout: 'admin_layout.hbs',
            name: req.user.username,
            staff: staff,
            image: staff.image,
            data : cloneData
        });
    }

    createPasswordPage(req, res) {
        if (req.isAuthenticated() && req.user.status == "on" && req.user.password !== "") {
            res.redirect(`/${req.user.role}/home`);
        }
        res.render('create-password', { layout: false });
    }
    async createPassword(req, res) {
        const staff = await AuthService.findUserByEmail(req.user.email);
        const { password, confirmpassword } = req.body;
        if (password !== confirmpassword) {
            res.status(400).send('password not match');
        }
        else {
            await staffService.changePassword(staff._id, password);
            await staffService.changeStatus(staff._id);
            req.flash('')
            res.redirect('/staff/home');
        }

    }
    async firstLogin(req, res) {
        try {
            const email = await AdminService.verifyToken(req.params.token);

            if (email.email) {
                const staff = await AuthService.findUserByEmail(email.email);
                req.logIn(staff, (err) => {
                    if (err) {
                        console.log("login error", err.message);
                        return res.status(500).send('Internal Server Error'); // Return to prevent further execution
                    }
                    if (req.isAuthenticated()) {
                        return res.redirect('/create-password');
                    } else {
                        return res.status(401).send('User not authenticated');
                    }
                });
            } else {
                return res.send(`Đường Link đã hết hạn ..... <a href="/login"> Gửi Lại Mail </a> `);
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).send('An error occurred'); // Return to prevent further execution
        }
    }

    async createStaff(req, res, next) {
        const { fullname, age, email, cardID, country } = req.body;
        const newStaff = {
            fullname,
            age,
            email,
            cardID,
            country
        }
        const staff = await staffService.createdStaffDefault(newStaff);

        if (staff) {
            await AdminService.createdMail(staff.email);
            req.flash('success_msg', `Created Staff ${staff.fullname}, pls check mail!`);
            res.redirect('./employees');
            // res.status(200).json('message', 'Created , Check mail');
        }
        else {
            req.flash('error_msg', `Can not create Staff`);
            console.log("Can not create Staff", staff);
            res.redirect('./employees');
        }
    }
    async editGet(req, res) {
        const item = await productService.getProductById(req.params.id)

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
            images: item.images[0],
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
}


module.exports = new AdminController();
