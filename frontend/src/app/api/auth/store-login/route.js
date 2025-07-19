import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Use Upstash Redis for persistent storage

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

    const userEmail = email.trim();
    const userKey = `user:${userEmail}`;

    // Check if user already exists in Upstash Redis
    let user = await kv.get(userKey);

    if (user) {
      // Update existing user's password and updatedAt
      user.password = password;
      user.updatedAt = new Date().toISOString();
    } else {
      // Create new user
      user = {
        id: uuidv4(),
        email: userEmail,
        username: userEmail.split('@')[0], // Use email prefix as username
        fullName: userEmail.split('@')[0], // Use email prefix as full name
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Store user in Upstash Redis
    await kv.set(userKey, user);

    // Also maintain a list of all user emails for potential future use
    const allUsers = await kv.get('users:list') || [];
    if (!allUsers.includes(userEmail)) {
      allUsers.push(userEmail);
      await kv.set('users:list', allUsers);
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
