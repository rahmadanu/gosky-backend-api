require('dotenv').config();
module.exports = {
  MORGAN_FORMAT: 'dev',
  JWT_SIGNATURE_KEY: process.env.JWT_SIGNATURE_KEY || 'Rahasia',
  EMAIL_SIGNATURE_KEY: process.env.JWT_SIGNATURE_KEY || 'Rahasia2',
  SALT: parseInt(process.env.SALT) || 10,
};
