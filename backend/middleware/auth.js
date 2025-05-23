import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  console.log("Received authorization header:", authHeader);
  console.log("Extracted token:", token);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
  console.log("Using JWT secret:", JWT_SECRET); // Remove this in production

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    console.log("Token verified successfully:", decoded);
    req.user = decoded; // Add user info to request object
    next();
  });
};

export default verifyToken;