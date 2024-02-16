const Customer = require("../models/Customer") 
const Invoice = require("../models/Invoice");

const mongoose = require('mongoose');
class CustomerService{
    created(newCustomer) {
        Customer.create(newCustomer).then((customer) => {
        })
            .catch((error) => {
                console.error('Error creating new staff member:',  error.message);
            });
    }

    async create(newCustomer) {
        try {
            const customer = await Customer.create(newCustomer);
            return customer;
        } catch (error) {
            console.error('Error creating new customer:',  error.message);
            throw error;
        }
    }


    async createdByList(listCustomer) {
        for (const customer of listCustomer) {
            try {
                await Customer.create(customer);
            } catch (error) {
                console.error(`Error inserting staff: ${customer.fullname}`, error.message);
                continue
            }
        }
    }   
    async findByPhoneNumber(phonenumber){
        const customer =  await Customer.findOne({phonenumber : phonenumber}).then((customer) => {
            return customer;
        }).catch((err) => {
            console.log("find fail : ", err.message);
            return null
        })
        return customer;
    }



    async getCustomerInvoices(customerId, page = 1, limit = 10){
        try {
            const skip = (page - 1) * limit;
            const invoices = await Invoice.find({customer: customerId})
                .skip(skip)
                .limit(limit)
                .lean();
            const totalInvoices = await Invoice.countDocuments({customer: customerId});
            const totalPages = Math.ceil(totalInvoices / limit);
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push({
                    number: i,
                    isActive: i === page,
                });
            }
            return {
                invoices,
                pagination: {
                    prevPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null,
                    pages: pages
                },
            };
        } catch (err) {
            console.log("find fail : ", err.message);
            return null;
        }
    }


    
    async findAll(page, limit){
        try {
            const customers = await Customer.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            const totalCustomers = await Customer.countDocuments();
            const totalPages = Math.ceil(totalCustomers / limit);
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push({
                    number: i,
                    isActive: i === page,
                });
            }
            return {
                customers,
                pagination: {
                    prevPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null,
                    pages: pages
                },
            };
        } catch (err) {
            console.log("find fail : ", err.message);
            return null;
        }
    }


    async getById(id){
        const customer =  await Customer.find(id).then((customers) => {
            return customers;
        }).catch((err) => {
            console.log("find fail : ", err.message);
            return null
        })
        return customer;
    }
    
    async updateTransaction(cusid, invoiceId) {
        try {
          const customer = await Customer.findById(cusid);
          if (!customer) {
            console.log('Customer not found');
            return;
          }
          customer.transactionHistories.push(invoiceId);
          const updatedCustomer = await customer.save();
        } catch (error) {
        }
    }
} 

module.exports = new CustomerService();