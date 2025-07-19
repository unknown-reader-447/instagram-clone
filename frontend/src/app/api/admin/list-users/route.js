import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Get list of all user emails from Upstash Redis
    const userEmails = await kv.get('users:list') || [];
    
    if (userEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found',
        users: []
      });
    }

    // Fetch all users (without passwords for security)
    const users = [];
    for (const email of userEmails) {
      const userKey = `user:${email}`;
      const user = await kv.get(userKey);
      
      if (user) {
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        users.push(userWithoutPassword);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${users.length} users`,
      users: users,
      count: users.length
    });

  } catch (error) {
    console.error('List users error:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
