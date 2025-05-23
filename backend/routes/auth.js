import express from 'express';
const router = express.Router();
import { compare } from 'bcrypt';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

router.post('/register', async (req, res) => {
  const { userName, contrasenia } = req.body;

  if (!userName || !contrasenia) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const trimmedUsername = userName.trim();
    const trimmedPassword = contrasenia.trim();
    const hashedPassword = await hash(trimmedPassword, 10);

    const result = await pool.query(
      'INSERT INTO usuario ("userName", contrasenia) VALUES ($1, $2) RETURNING idusuario',
      [trimmedUsername, hashedPassword]
    );

    res.status(201).json({ userId: result.rows[0].idusuario, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in POST /api/auth/register:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const {userName,contrasenia } = req.body;

  console.log("Received login request:", { userName, contrasenia });
  if(!userName|| !contrasenia){
    return res.status(400).json({error:'Username and password are required'})
  }
  try {
    //const res1= await pool.query('UPDATE usuario SET contrasenia=TRIM(contrasenia)');
    const result = await pool.query('SELECT idusuario, contrasenia,"userName" FROM usuario WHERE "userName" = $1',[userName]);
    console.log("Database result:", result.rows); // Agregar este log

    if (result.rows.length > 0) {
      const user = result.rows[0];
      //const user1=res1.rows[0];
       //console.log("aaaaaaa", user1); 
       console.log("User found:", user); // Agregar este log
       console.log("Comparing passwords:", { received: contrasenia, stored: contrasenia }); // Agregar este log
            
      //const isMatch = await compare(contrasenia, user.contrasenia);
      const isMatch=(contrasenia.trim()=== user.contrasenia.trim());
       console.log("Password match:", isMatch); 
            
      if (!isMatch) {
          console.log("Password mismatch");
               
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: user.idusuario },process.env.JWT_SECRET ||'your_jwt_secret', { expiresIn: '1h' });
      console.log("send", { userId:user.idusuario,token});//user, token });
      // Return user ID and token
      res.json({ userId: user.idusuario, token });
    } else {
      console.log("User not found"); // Agregar este log
           
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error in POST /api/auth/login:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;