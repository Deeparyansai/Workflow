
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');

// JWT Secret Key
const JWT_SECRET = 'D6VmLwO7DwwAraQU2yLIwsYE6tga1coQ';


// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validations
    if (!name) {
      return res.status(400).send({ message: 'Name is required' });
    }
    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).send({ message: 'Password is required' });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'User already registered',
      });
    }

    // Hash password and save user
    const hashedPassword = await hashPassword(password);

    const newUser = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: 'Registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validations
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: 'Email and password are required',
        });
      }
  
      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Email is not registered',
        });
      }
  
      // Compare password
      const isMatch = await comparePassword(password, user.password);
      
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: 'Invalid password',
        });
      }
  
      // Generate JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  
      res.status(200).send({
        success: true,
        message: 'Login successful',
        user: {
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error in login',
        error: error.message,
      });
    }
  };
  

module.exports = {
  registerUser,
  loginUser,
};
