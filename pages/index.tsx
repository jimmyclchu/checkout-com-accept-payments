import { ChangeEvent, useState, useEffect } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react'
import { products } from '@/utils/demoProducts'
import { Pay3dResponse, PaymentFormState } from '@/utils/types'

export default function Checkout() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isNameValid, setIsNameValid] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isPaymentFormValid, setIsPaymentFormValid] = useState<PaymentFormState>({
    cardNumber: null,
    expDate: null,
    cvv: null
  })

  useEffect(() => {
    console.log(isPaymentFormValid)
  }, [isPaymentFormValid])

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
    setIsNameValid(validateName(event.target.value))
  }

  function validateName(name: string) {
    return name.length > 0
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setIsEmailValid(validateEmail(event.target.value))
  }

  function validateEmail(email: string) {
    // Regular expression to match email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  function validateForm(): boolean {
    setIsNameValid(validateName(name))
    setIsEmailValid(validateEmail(email))

    const isNameNotEmpty = name.length != 0
    const isEmailNotEmpty = email.length != 0

    if (isPaymentFormValid.cardNumber != true) {
      validatePaymentForm(PaymentFormField.CardNumber, false)
    }
    if (isPaymentFormValid.expDate != true) {
      validatePaymentForm(PaymentFormField.ExpiryDate, false)
    }
    if (isPaymentFormValid.cvv != true) {
      validatePaymentForm(PaymentFormField.CVV, false)
    }
    
    if (isEmailValid && isNameValid && isNameNotEmpty && isEmailNotEmpty && isPaymentFormValid.cardNumber && isPaymentFormValid.expDate && isPaymentFormValid.cvv) {
      return true
    }

    return false
  }

  function processPayment() {
    setIsProcessingPayment(!isProcessingPayment)
  }

  enum PaymentFormField {
    CardNumber = "card-number",
    ExpiryDate = "expiry-date",
    CVV = "cvv"
  }

  function validatePaymentForm(element: PaymentFormField, isValid: boolean) {

    switch (element) {
      case PaymentFormField.CardNumber:
        setIsPaymentFormValid(p => {
          return {...p, cardNumber: isValid}
        })
        break
      case PaymentFormField.ExpiryDate:
        setIsPaymentFormValid(p => {
          return {...p, expDate: isValid}
        })
        break
      case PaymentFormField.CVV:
        setIsPaymentFormValid(p => {
          return {...p, cvv: isValid}
        })
        break
    }
  }

  async function complete3dsPayment(token: string) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    }
  
    const response = await fetch('/api/pay3d', requestOptions)
    const responseBody: Pay3dResponse = await response.json()
  
    router.push(responseBody.redirection_url)
  }
  
  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
      <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block" aria-hidden="true" />

      <header className="relative mx-auto max-w-7xl bg-indigo-900 py-6 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:bg-transparent lg:px-8 lg:pb-10 lg:pt-16">
        <div className="mx-auto flex max-w-2xl px-4 lg:w-full lg:max-w-lg lg:px-0">
          <a href="#">
            <span className="sr-only">Checkout.com</span>
            <img
              src="https://publicsectorshow.co.uk/wp-content/uploads/2021/03/LOGO_Checkout_DarkBlue-e1616162580519.png"
              alt=""
              className="h-8 w-auto lg:hidden"
            />
            <img
              src="https://publicsectorshow.co.uk/wp-content/uploads/2021/03/LOGO_Checkout_DarkBlue-e1616162580519.png"
              alt=""
              className="hidden h-8 w-auto lg:block"
            />
          </a>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-indigo-900 pb-12 pt-6 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <dl>
              <dt className="text-sm font-medium">Amount due</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-white">$36.00</dd>
            </dl>

            <ul role="list" className="divide-y divide-white divide-opacity-10 text-sm font-medium">
              {products.map((product) => (
                <li key={product.id} className="flex items-start space-x-4 py-6">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-white">{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <p className="flex-none text-base font-medium text-white">{product.price}</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 text-sm font-medium">
              <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                <dt className="text-base">Total</dt>
                <dd className="text-base">$36.00</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0 text-black"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Payment and shipping details
          </h2>

          <div>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <div>
                <h3 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                  Contact information
                </h3>

                <div className="mt-6">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={handleNameChange}
                      autoComplete="name"
                      className={`block w-full rounded-md sm:text-sm shadow-sm ${isNameValid ? ' border-gray-300 focus:border-indigo-500 focus:ring-indigo-500' : 'border-0 text-red-900 ring-1 ring-inset ring-red-500 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500'}`}
                    />
                  </div>
                  { !isNameValid &&
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      Name is empty.
                    </p>
                  }
                </div>

                <div className="mt-6">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email-address"
                      name="email-address"
                      value={email}
                      onChange={handleEmailChange}
                      autoComplete="email"
                      className={`block w-full rounded-md sm:text-sm shadow-sm ${isEmailValid ? ' border-gray-300 focus:border-indigo-500 focus:ring-indigo-500' : 'border-0 text-red-900 ring-1 ring-inset ring-red-500 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500'}`}
                    />
                  </div>
                </div>
                { !isEmailValid &&
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    Not a valid email address.
                  </p>
                }
              </div>

              <Frames
                config={{
                  debug: true,
                  publicKey: process.env.NEXT_PUBLIC_CHECKOUT_COM_PUBLIC_KEY as string,
                  cardholder: {
                    name: name,
                    billingAddress: {
                      addressLine1: "123 High St.",
                      addressLine2: "Flat 456",
                      city: "London",
                      zip: "SW1A 1AA",
                      country: "GB",
                    }
                  },
                  localization: {
                    cardNumberPlaceholder: '42424242',
                    expiryMonthPlaceholder: '',
                    expiryYearPlaceholder: '',
                    cvvPlaceholder: '',
                  },
                  style: {
                    base: {
                      height: '36px',
                      display: 'block',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      padding: '8px 12px',
                      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                      color: 'rgb(0, 0, 0)',
                      fontWeight: '400',
                      letterSpacing: 'normal',
                    },
                    focus: {
                      border: '2px solid #6366f1',
                      color: 'black'
                    },
                    valid: {
                    },
                    invalid: {
                      color: '#7f1d1d',
                      borderColor: '#ef4444'
                    },
                    placeholder: {
                      base: {
                        color: 'gray',
                      },
                    },
                  },
                }}
                ready={() => {
                  
                }}
                frameActivated={(e) => {
                  
                }}
                frameFocus={(e) => {}}
                frameBlur={(e) => {}}
                frameValidationChanged={(e) => {
                  validatePaymentForm(e.element as PaymentFormField, e.isValid && !e.isEmpty)
                }}
                paymentMethodChanged={(e) => {}}
                cardValidationChanged={(e) => {}}
                cardSubmitted={() => {
                  processPayment()
                }}
                cardTokenized={(e) => {
                  processPayment()
                  complete3dsPayment(e.token)
                }}
                cardTokenizationFailed={(e) => {
                  processPayment()
                }}
                cardBinChanged={(e) => {}}
              >
                <div className="mt-10">
                  <h3 id="payment-heading" className="text-lg font-medium text-gray-900">
                    Payment details
                  </h3>

                  <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                    <div className="col-span-3 sm:col-span-4">
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                        Card number
                      </label>
                      <div className="mt-1">
                        <CardNumber />
                      </div>
                      { isPaymentFormValid.cardNumber === false &&
                        <p className="mt-2 text-sm text-red-600" id="email-error">
                          Not a valid card number.
                        </p>
                      }
                    </div>

                    <div className="col-span-2 sm:col-span-3">
                      <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                        Expiration date (MM/YY)
                      </label>
                      <div className="mt-1">
                        <ExpiryDate />
                      </div>
                      { isPaymentFormValid.expDate === false &&
                        <p className="mt-2 text-sm text-red-600" id="email-error">
                          Not a valid expiration date.
                        </p>
                      }
                    </div>

                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                        CVC
                      </label>
                      <div className="mt-1">
                        <Cvv />
                      </div>
                      { isPaymentFormValid.cvv === false &&
                        <p className="mt-2 text-sm text-red-600" id="email-error">
                          Not a valid CVV.
                        </p>
                      }
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      disabled={isProcessingPayment}
                      onClick={() => {
                        if (validateForm()) {
                          Frames.submitCard()
                        }
                      }}
                    >
                      { isProcessingPayment ? "Processing..." : "Pay now"}
                    </button>
                  </div>
                </div>
              </Frames>
              </div>

          </div>
        </section>
      </main>
    </div>
  )
}
