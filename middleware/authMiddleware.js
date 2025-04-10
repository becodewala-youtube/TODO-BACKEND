import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // Check for the token in the Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.user = await User.findById(decoded.userId).select('-password'); // Attach user to request object

      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error(error);  // Log the error for debugging purposes
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } 
  // Check for the token in cookies if it's not in headers
  else if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt; // Get the token from cookies

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.user = await User.findById(decoded.userId).select('-password'); // Attach user to request object

      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error(error);  // Log the error for debugging purposes
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
