const Staff = require('../models/Staff');
const bcrypt = require('bcrypt');
class AuthService {
    async findUserByUsername (username) {
        const user = await Staff.findOne({ username : username });
        if (!user) {
            return null;
        }
        return user;
    };
    
    
    
    async findUserByID (id, callback) {
      await Staff.findById(id).then(user => {
          if (!user) {
              callback(new Error('Người dùng không tồn tại.'));
          } else {
              callback(null, user);
          }
      }).catch(err => {
          callback(err);
      });
    };
    
    async comparePassword(password, hashedPassword) {
        if (await bcrypt.compare(password, hashedPassword)) {
          return true;
        }else {
          return false;
        }
        
    }
    async findUserByEmail(email){
        try {
            const staff = await Staff.findOne({email : email}).lean();
            return staff;
        } catch (error) {
            console.error('Error finding staff by ID:', error.message);
            return null;
        }
    }   
}


module.exports = new AuthService();
