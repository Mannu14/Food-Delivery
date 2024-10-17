const jwt = require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config();

const isLogin = async (req, res, next) => {
  const token = req.cookies.access_token;
	if (!token) {
		return res.status(401).json({ error: '*Unauthorized !please login first' }); 
	}
	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(401).json({ error: '*invalid user' }); 
		}
		req.user = user;
		next();
	});
  };

module.exports = {
    isLogin
}