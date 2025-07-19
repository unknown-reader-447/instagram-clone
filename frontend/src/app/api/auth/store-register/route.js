import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

// Simple in-memory storage for demo (in production, use a database)
let users = [];

export async function POST(request) {
  try {
    const { email, username, fullName, password } = await request.json();

    // Basic validation
    if (!email || !username || !fullName || !password) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }

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

    // Return success response
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      message: 'Registration data stored successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Store register error:', error);
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
