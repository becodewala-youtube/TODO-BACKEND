import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Create a JWT token, signed with userId and JWT_SECRET, with a 30-day expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });

  // Set the JWT as a cookie
  res.cookie('jwt', token, {
    httpOnly: true,  // Ensures the cookie cannot be accessed via JavaScript (prevents XSS attacks)
    secure: process.env.NODE_ENV !== 'development', // Ensures cookie is sent only over HTTPS in production
    sameSite: 'strict',  // Ensures the cookie is sent only in a first-party context (protects against CSRF)
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time: 30 days in milliseconds
  });
};

export default generateToken;
