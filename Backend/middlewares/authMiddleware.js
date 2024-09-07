const jwt = require('jsonwebtoken');
const JWT_SECRET = 'D6VmLwO7DwwAraQU2yLIwsYE6tga1coQ'; // Ensure this matches the signing 

const requireSignIn = async (req, res, next) => {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Assuming Bearer token
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = requireSignIn;
