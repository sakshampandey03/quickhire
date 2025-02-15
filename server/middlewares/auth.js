import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifies the token
    req.user = await User.findById(decoded.id).select('-password');// ensures that password field is excluded
    next(); //passes control to next middleware or router handle
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};