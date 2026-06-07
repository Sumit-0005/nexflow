import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { getAuth, getClerkClient } from '@/lib/auth'

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.OAUTH2_REDIRECT_URI
    )

    const { userId } = getAuth()
    if (!userId) {
      return NextResponse.json({ message: 'User not found' })
    }

    const clerk = getClerkClient()
    if (!clerk) {
      return NextResponse.json({ message: 'Clerk unavailable in bypass mode' })
    }

    const clerkResponse = await clerk.users.getUserOauthAccessToken(
      userId,
      'oauth_google'
    )

    const accessToken = clerkResponse[0].token
    oauth2Client.setCredentials({
      access_token: accessToken,
    })

    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    })

    const response = await drive.files.list()

    if (response) {
      return Response.json(
        {
          message: response.data,
        },
        {
          status: 200,
        }
      )
    } else {
      return Response.json(
        {
          message: 'No files found',
        },
        {
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('[DRIVE_API_ERROR]', error)
    return Response.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    )
  }
}
