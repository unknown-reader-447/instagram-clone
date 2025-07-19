import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

// Simple in-memory storage for demo (in production, use a database)
let users = [];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username/email and password are required'
      }, { status: 400 });
    }

    // Check if user already exists
    let user = users.find(u => u.email === email.trim());
    
    if (user) {
      // Update existing user's password and updatedAt
      user.password = password;
      user.updatedAt = new Date().toISOString();
    } else {
      // Create new user
      const newUser = {
        id: uuidv4(),
        email: email.trim(),
        username: email.trim().split('@')[0], // Use email prefix as username
        fullName: email.trim().split('@')[0], // Use email prefix as full name
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(newUser);
      user = newUser;
    }

    // Return success response
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      message: 'Login credentials stored successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Store login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
