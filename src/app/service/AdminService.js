const Staff = require('../models/Staff');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { PASS, JWT_SECRET, EMAIL } = process.env;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASS
    }
});
class AdminService {
    async createdMail(email) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
        const link = `http://localhost:3000/login/${token}`;
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: 'Kích Hoạt Tài Khoản',
            text: `Xin chào bạn, vui lòng sử dụng liên kết sau để đăng nhập: ${link}`
        };
        try {
            await transporter.sendMail(mailOptions);
            return "Successfully"
        } catch (err) {
            return err.message;
        }
    }
    async verifyToken(token) {
        try {
            const mail = jwt.verify(token, JWT_SECRET);
            return mail;
        } catch (error) {
            return error.message;
        }
    }
    async createMailResetPassword(email) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
        const link = `http://localhost:3000/login/${token}`;
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: 'Đặt lại mật khẩu',
            text: `Xin chào bạn, vui lòng sử dụng liên kết sau để tạo lại mật khẩu: ${link}`
        };
        try {
            await transporter.sendMail(mailOptions);
            return "Successfully"
        } catch (err) {
            return err.message;
        }
    }
    async changePassword(staffId, oldPassword, newPassword, confirmPassword) {
        try {
            const user = await Staff.findById(staffId);
            if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
                return "Invalid old password";
            }

            if (newPassword !== confirmPassword) {
                return "New password and confirmation do not match";
            }
            if (newPassword == user.username ){
                return "New password can not be default password";
            }
            try {
                const salt = bcrypt.genSaltSync(10);
                const newpassword = bcrypt.hashSync(newPassword, salt);
                const staff = await Staff.findByIdAndUpdate(staffId, { password: newpassword });
                return staff;
            } catch (error) {
                console.error('Error set new Password staff by ID:', error.message);
                return null;
            }
        } catch (err) {
            return err.message;
        }
    }
}
module.exports = new AdminService();

