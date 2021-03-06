const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-82f24-firebase-adminsdk-81nme-bae291ab4f.json')
const databaseURL = 'https://fcm-82f24.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-82f24/messages:send'
const deviceToken =
  'dFKAHXPzaJk1CFCX7Cp0E5:APA91bEKPj1dLp_fjgrFkMBxKNF09rdD1E-_uI6wGb98B5t-lMB_AIwFXYlPpHjTVhAVnQMf7I1alj0nfo_YF8NtG1kf_S2F_LHzJvttfgv0QLruLqN2uqx1UvYItGDyoXOL-DF0phVQ'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()