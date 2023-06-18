import { GetServerSideProps } from 'next'
import { products } from '@/utils/demoProducts'
import { PaymentDetailsData, PaymentDetailsProps } from '@/utils/types'

export const getServerSideProps: GetServerSideProps<PaymentDetailsProps> =
  async ({ params }) => {
    if (!params || !params.orderId) {
      return {
        notFound: true,
      }
    }

    const { orderId } = params

    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.CHECKOUT_COM_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
  
      const response = await fetch(`https://api.sandbox.checkout.com/payments/${orderId}`, requestOptions)
      const responseBody = await response.json()
  
      const data = responseBody

      return {
        props: {
          paymentDetails: data,
          ctxId: orderId
        },
      }
    } catch (error) {
      console.error(error)
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {
        paymentDetails: null,
        ctxId: ''
      }
    }
  }

const OrderDetails: React.FC<PaymentDetailsProps> = ({ ctxId, paymentDetails }) => {
  return (
    <main className="bg-white px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-xl">
          <p className="mt-2 text-4xl font-bold tracking-tight">
            { paymentDetails.approved ? "Order paid." : "Payment declined." }
          </p>
          <p className="mt-2 text-base text-gray-500">
          { paymentDetails.approved ? "Your payment has been successfully processed." : "Your payment could not be processed." }
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Payment ID</dt>
            <dd className="mt-2 text-indigo-600">{ paymentDetails.id }</dd>
          </dl>
        </div>

        <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
          <h2 id="order-heading" className="sr-only">
            Your order
          </h2>

          <h3 className="sr-only">Items</h3>
          {products.map((product) => (
            <div key={product.id} className="flex space-x-6 border-b border-gray-200 py-10">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
              />
              <div className="flex flex-auto flex-col">
                <div>
                  <h4 className="font-medium text-gray-900">
                    <a href={product.href}>{product.name}</a>
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="mt-6 flex flex-1 items-end">
                  <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                    <div className="flex">
                      <dt className="font-medium text-gray-900">Quantity</dt>
                      <dd className="ml-2 text-gray-700">{product.quantity}</dd>
                    </div>
                    <div className="flex pl-4 sm:pl-6">
                      <dt className="font-medium text-gray-900">Price</dt>
                      <dd className="ml-2 text-gray-700">{product.price}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Your information</h3>

            <h4 className="sr-only">Contact information</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Contact information</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{ paymentDetails.source.name }</span>
                    <span className="block">test@checkout.com</span>
                    <span className="block">{ paymentDetails.source.billing_address.address_line1 }</span>
                    <span className="block">{ paymentDetails.source.billing_address.address_line2 }</span>
                    <span className="block">{ paymentDetails.source.billing_address.country }, { paymentDetails.source.billing_address.city } { paymentDetails.source.billing_address.zip }</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Payment method</dt>
                <dd className="mt-2 text-gray-700">
                  <>
                    { paymentDetails.approved
                      ? <span className="mr-1 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Aprroved
                        </span>
                      : <span className="mr-1 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          Declined
                        </span>
                    }

                    { paymentDetails.requested_on }
                  </>
                  <p className="mt-1">{ paymentDetails.source.type }, { paymentDetails.source.card_type }</p>
                  <p>{ paymentDetails.source.scheme }</p>
                  <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>{ paymentDetails.source.last4}
                  </p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">36.00</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  )
}

export default OrderDetails