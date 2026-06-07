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
    
    const channelId = uuidv4()

    const startPageTokenRes = await drive.changes.getStartPageToken({})
    const startPageToken = startPageTokenRes.data.startPageToken
    if (startPageToken == null) {
      throw new Error('startPageToken is unexpectedly null')
    }

    const listener = await drive.changes.watch({
      pageToken: startPageToken,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address:
          `${process.env.NGROK_URI}/api/drive-activity/notification`,
        kind: 'api#channel',
      },
    })

    if (listener.status == 200) {
      const channelStored = await db.user.updateMany({
        where: {
          clerkId: userId,
        },
        data: {
          googleResourceId: listener.data.resourceId,
        },
      })

      if (channelStored) {
        return new NextResponse('Listening to changes...')
      }
    }

    return new NextResponse('Oops! something went wrong, try again')
  } catch (error) {
    console.error('[DRIVE_ACTIVITY_API_ERROR]', error)
    return NextResponse.json(
      { message: 'Failed to setup drive activity listener' },
      { status: 500 }
    )
  }
}
