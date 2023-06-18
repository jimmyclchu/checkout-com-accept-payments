export interface PaymentDetailsProps {
  paymentDetails: any,
  ctxId: any
}

export interface PaymentDetailsData {
  id: string,
  source: {
    type: string,
    expiry_month: number,
    expiry_year: number,
    last4: number,
    scheme: string,
    name: string,
    card_type: string,
    billing_address: {
      address_line1: string,
      address_line2: string,
      city: string,
      zip: string,
      country: string,
    },
  },
  approved: boolean
}

export interface Pay3dResponse {
  redirection_url: string
}

export interface QueryParams {
  result: string,
  'cko-session-id': string
}

export interface PaymentFormState {
  cardNumber: boolean | null;
  expDate: boolean | null;
  cvv: boolean | null;
}