# Upstash Redis Setup for Instagram Clone

This guide explains how to set up Upstash Redis (via Vercel Marketplace) for persistent user credential storage in your Instagram clone project.

## What is Upstash Redis?

Upstash Redis is a serverless Redis database that provides:
- **Persistent storage** - Data survives deployments and function restarts
- **Global replication** - Fast access from any region
- **Serverless scaling** - Automatic scaling with your application
- **Simple API** - Easy to use key-value operations
- **Vercel Integration** - Seamless integration through Vercel Marketplace

## Setup Steps (Already Completed)

✅ **You've already connected Upstash Redis!**
- Database name: `upstash-kv-indigo-xylophone`
- Integration completed via Vercel Marketplace

### How You Set It Up:

1. ✅ Went to Vercel Dashboard → Integrations
2. ✅ Found Upstash in the marketplace
3. ✅ Connected it to your project
4. ✅ Created database: `upstash-kv-indigo-xylophone`

This automatically added the required environment variables to your project:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### Local Development Setup

For local development, create a `.env.local` file in your `frontend` directory:

```bash
# Copy these values from your Upstash dashboard or Vercel environment variables
KV_REST_API_URL=your_upstash_url_here
KV_REST_API_TOKEN=your_upstash_token_here
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token_here
```

**Important**: Add `.env.local` to your `.gitignore` file to keep credentials secure.

### Project Updates

The project has been updated to use Upstash Redis with the following changes:

- ✅ Added `@vercel/kv` dependency
- ✅ Updated login API (`/api/auth/store-login`) to use Upstash Redis
- ✅ Updated registration API (`/api/auth/store-register`) to use Upstash Redis
- ✅ Added user verification API (`/api/auth/verify-user`)
- ✅ Added admin API (`/api/admin/list-users`) to view stored users

## How It Works

### Data Structure

User data is stored with the following structure:

```javascript
// Key: user:email@example.com
// Value:
{
  id: "uuid-string",
  email: "email@example.com",
  username: "username",
  fullName: "Full Name",
  password: "password", // In production, this should be hashed
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}

// Key: users:list
// Value: ["email1@example.com", "email2@example.com", ...]
```

### API Endpoints

1. **POST /api/auth/store-login** - Store/update login credentials
2. **POST /api/auth/store-register** - Store registration data
3. **POST /api/auth/verify-user** - Verify user credentials

## Security Considerations

### Current Implementation
- Passwords are stored in plain text (for demo purposes)
- Basic validation is implemented

### Production Recommendations
1. **Hash passwords** using bcrypt or similar:
   ```javascript
   import bcrypt from 'bcryptjs';
   const hashedPassword = await bcrypt.hash(password, 12);
   ```

2. **Add rate limiting** to prevent brute force attacks

3. **Implement JWT tokens** for session management

4. **Add input sanitization** and validation

5. **Use HTTPS** in production (Vercel provides this automatically)

## Testing the Setup

1. Deploy your project to Vercel
2. Visit your login page
3. Enter any credentials and submit
4. Check your Vercel KV dashboard to see the stored data

## Troubleshooting

### Common Issues

1. **"KV_REST_API_URL is not defined"**
   - Ensure you've connected your KV database to your project
   - Check that environment variables are set in Vercel dashboard

2. **"Failed to store login credentials"**
   - Check the Vercel function logs for detailed error messages
   - Verify your KV database is active and accessible

3. **Local development not working**
   - Ensure `.env.local` file exists with correct KV credentials
   - Restart your development server after adding environment variables

### Getting Help

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Support](https://vercel.com/help)

## Alternative Storage Options

If Vercel KV doesn't meet your needs, consider:

1. **Vercel Postgres** - For relational data and complex queries
2. **Supabase** - Open source Firebase alternative with PostgreSQL
3. **PlanetScale** - Serverless MySQL platform
4. **MongoDB Atlas** - Cloud MongoDB service

Each option has different pricing and feature sets, so choose based on your specific requirements.
