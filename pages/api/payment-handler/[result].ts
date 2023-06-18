import { NextApiRequest, NextApiResponse } from 'next'
import { QueryParams } from '@/utils/types'

const baseURL: string = process.env.NODE_ENV === 'production'
  ? process.env.PROD_BASE_URL as string
  : process.env.DEV_BASE_URL as string

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { result, 'cko-session-id': ckoSessionId } = req.query as unknown as QueryParams

  console.log(ckoSessionId)
  // Do something with the query parameters, e.g. verify the payment result

  res.redirect(`${baseURL}/orders/${ckoSessionId}`)
}
