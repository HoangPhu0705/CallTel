const Staff = require('../models/Staff');
const bcrypt = require("bcrypt");


class StaffService {
    async createdStaffDefault(newStaff) {
        try {
            const staff = await Staff.create(newStaff);
            console.log(staff);
            return staff;
        } catch (error) {
            console.log(error);
            return null;
        }
       
    }
    async createdStaffByList(listStaff) {
        for (const staff of listStaff) {
            try {
                await Staff.create(staff);
                console.log(`Inserted staff: ${staff.fullname}`);
            } catch (error) {
                console.error(`Error inserting staff: ${staff.fullname}`, error.message);
                continue
            }
        }
    }

    async findByIdAndUpdate(id, data) {
        try {
            const staff = await Staff.findByIdAndUpdate(id, data, { new: true });
            return staff;
        } catch (error) {
            console.error('Error updating staff by ID:', error.message);
            return null;
        }
    }


    async getAllStaff(page, limit) {
        try {
            const staffs = await Staff.find().skip((page - 1) * limit).limit(limit).lean();
            const totalStaffs = await Staff.countDocuments();
            const totalPages = Math.ceil(totalStaffs / limit);
            const pages = [];
            for(let i = 1; i <= totalPages; i++){
                pages.push({
                    number: i,
                    isActive: i === page
                });
            }
            return {
                staffs,
                pagination: {
                    prevPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null,
                    pages: pages
                }
            };
        } catch (error) {
            console.error('Error retrieving all staff members:', error.message);
        }
    }


    async getAllEmployee(page, limit) {
        try {
            const staffs = await Staff.find({role: 'staff'}).skip((page - 1) * limit).limit(limit).lean();
            const totalStaffs = await Staff.countDocuments();
            const totalPages = Math.ceil(totalStaffs / limit);
            const pages = [];
            for(let i = 1; i <= totalPages; i++){
                pages.push({
                    number: i,
                    isActive: i === page
                });
            }
            return {
                staffs,
                pagination: {
                    prevPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null,
                    pages: pages
                }
            };
        } catch (error) {
            console.error('Error retrieving all staff members:', error.message);
        }
    }

    async findStaffById(id) {
        try {
            const staff = await Staff.findById(id).lean();
            return staff;
        } catch (error) {
            console.error('Error finding staff by ID:', error.message);
        }
    }
    async changeStatus(id){
        try {
            const staff = await Staff.findByIdAndUpdate(id,{status : 'on'});
            return staff;
        } catch (error) {
            console.error('Error set status staff by ID:', error.message);
            return null;
        }
    }
    async changePassword(id,password){
        try {
            const salt = bcrypt.genSaltSync(10);
            const newpassword =  bcrypt.hashSync(password, salt);
            const staff = await Staff.findByIdAndUpdate(id,{password : newpassword});
            return staff;
        } catch (error) {
            console.error('Error set new Password staff by ID:', error.message);
            return null;
        }
    }

    



}


module.exports = new StaffService();
