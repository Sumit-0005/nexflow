'use server'
import { google } from 'googleapis'
import { getAuth, getClerkClient } from '@/lib/auth'

export const getFileMetaData = async () => {
  'use server'
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  )

  const { userId } = getAuth()

  if (!userId) {
    return { message: 'User not found' }
  }

  const clerk = getClerkClient()
  if (!clerk) {
    return { message: 'Clerk client unavailable in bypass mode' }
  }

  const clerkResponse = await clerk.users.getUserOauthAccessToken(
    userId,
    'oauth_google'
  )

  const accessToken = clerkResponse[0].token

  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })
  const response = await drive.files.list()

  if (response) {
    return response.data
  }
}
