import { NextApiRequest, NextApiResponse } from 'next'

interface Pay3dRequestBody {
  token: string
}

interface Pay3dResponseBody {
  redirection_url: string
}

const baseURL: string = process.env.NODE_ENV === 'production'
  ? process.env.PROD_BASE_URL as string
  : process.env.DEV_BASE_URL as string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pay3dResponseBody>
) {
  if (req.method === 'POST') {
    try {
      const { token } = req.body as Pay3dRequestBody

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          success_url: `${baseURL}/api/payment-handler/success`,
          failure_url: `${baseURL}/api/payment-handler/failure`
        })
      }

      console.log(requestOptions)

      const response = await fetch('https://integrations-cko.herokuapp.com/pay3d', requestOptions)
      const responseBody: Pay3dResponseBody = await response.json()

      console.log(responseBody)
      res.status(200).json(responseBody)
    } catch (error) {
      res.status(500).json({ redirection_url: '' })
    }
  } else {
    res.status(405).json({ redirection_url: '' })
  }
}
