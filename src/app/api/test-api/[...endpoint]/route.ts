import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";
import { fakeUsers } from "@/libs/utils";
import type { ApiResponse, User, UserResponse, UsersResponse } from "@/types/api";

async function validateApiKey(apiKey: string, endpoint: string, request: NextRequest) {
  // Find the API key
  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey }
  })

  if (!keyRecord || !keyRecord.isActive) {
    return { valid: false, error: 'Invalid or inactive API key' }
  }

  // Optional: Log the request
  await prisma.requestLog.create({
    data: {
      apiKeyId: keyRecord.id,
      endpoint: endpoint,
      method: request.method,
    }
  }).catch(console.error) // Don't fail if logging fails

  return { valid: true }
}

async function handleRequest(
  request: NextRequest,
  { params }: { params: { endpoint: string[] } }
) {
  try {
    const apiKey = request.headers.get('x-api-key')

    if (!apiKey) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: 'API key is required. Include it in the x-api-key header.'
      }, { status: 401 })
    }
    const endpoint = params.endpoint.join('/')
    const validation = await validateApiKey(apiKey, endpoint, request)

    if (!validation.valid) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: validation.error
      }, { status: 401 })
    }

    // Handle different endpoints - only users now
    switch(endpoint) {
      case 'users': {
        const allUsers = fakeUsers();
        return NextResponse.json<UsersResponse>({
          success: true,
          data: allUsers
        });
      }

      case 'user': {
        // Single user with query param support
        const url = new URL(request.url);
        const userId = url.searchParams.get('id') || '1';
        const users = fakeUsers();
        const user = users.find((u: User) => u.id === parseInt(userId)) || users[0];
        return NextResponse.json<UserResponse>({
          success: true,
          data: user
        });
      }
      
      default:
        return NextResponse.json<ApiResponse<never>>({
          success: false,
          error: `Endpoint '${endpoint}' not found. Available endpoints: users, user`
        }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export { handleRequest as GET, handleRequest as POST, handleRequest as PUT, handleRequest as DELETE }