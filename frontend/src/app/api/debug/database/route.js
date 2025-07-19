import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Get the list of all users
    const usersList = await kv.get('users:list') || [];
    
    // Get all user data
    const allData = {};
    
    // Add users list to debug data
    allData['users:list'] = usersList;
    
    // Get each individual user
    for (const email of usersList) {
      const userKey = `user:${email}`;
      const userData = await kv.get(userKey);
      allData[userKey] = userData;
    }
    
    // Get some database stats
    const stats = {
      totalUsers: usersList.length,
      userEmails: usersList,
      databaseKeys: Object.keys(allData),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Database debug information',
      stats: stats,
      rawData: allData
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Debug database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error accessing database',
      error: error.message
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
