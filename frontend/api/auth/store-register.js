import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// File paths for Vercel deployment
const DATA_DIR = '/tmp';
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data file exists
const ensureDataFile = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
  }
};

// Read users from file
const readUsers = () => {
  try {
    ensureDataFile();
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Write users to file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
    throw new Error('Failed to save user data');
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email, username, fullName, password } = req.body;

    // Basic validation
    if (!email || !username || !fullName || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Read existing users
    const users = readUsers();

    // Check if user already exists
    let user = users.find(u => u.email === email.trim());
    
    if (user) {
      // Update existing user
      user.username = username.trim();
      user.fullName = fullName.trim();
      user.password = password;
      user.updatedAt = new Date().toISOString();
    } else {
      // Create new user
      const newUser = {
        id: uuidv4(),
        email: email.trim(),
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(newUser);
      user = newUser;
    }

    // Save users to file
    writeUsers(users);

    // Return success response
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      message: 'Registration data stored successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Store register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
