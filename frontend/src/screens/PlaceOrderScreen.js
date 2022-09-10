import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'

import Message from '../components/Message'
import Loader from '../components/Loader'
import { PayPalButton } from 'react-paypal-button-v2'
import Moment from 'react-moment'
import moment from 'moment'

const PlaceOrderScreen = ({ match }) => {
  const orderId = match.params.id
  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  useEffect(() => {
    dispatch(getOrderDetails(orderId))
  }, [orderId, dispatch])

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [orderId, dispatch, successPay, order])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  return (
    <div className='container'>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        order && (
          <>
            <div className='row gy-3'>
              <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                <div className='card bg-transparent bg-secondary'>
                  <h6 className='p-3'>Order Info</h6>
                  <ul className='list-group list-group-flush'>
                    <li className='list-group-item'>
                      Order number: {order._id}
                    </li>
                    <li className='list-group-item'>
                      Date:
                      <Moment format='YYYY-MM-DD HH:mm:ss'>
                        {moment(order.createdAt)}
                      </Moment>
                    </li>
                    <li className='list-group-item'>
                      Total: ${addDecimal(order.totalPrice)}
                    </li>

                    <li
                      className={`list-group-item ${
                        !order.isPaid
                          ? 'bg-danger text-light'
                          : 'bg-info text-light'
                      }`}
                    >
                      Paid At:{' '}
                      {!order.isPaid ? (
                        'Not Paid'
                      ) : (
                        <Moment format='YYYY-MM-DD HH:mm:ss'>
                          {moment(order.paidAt && order.paidAt)}
                        </Moment>
                      )}
                    </li>
                    <li
                      className={`list-group-item ${
                        !order.isDelivered
                          ? 'bg-danger text-light'
                          : 'bg-info text-light'
                      }`}
                    >
                      Delivered At:{' '}
                      {!order.isDelivered ? (
                        'Not Delivered'
                      ) : (
                        <Moment format='YYYY-MM-DD HH:mm:ss'>
                          {moment(order.deliveredAt && order.deliveredAt)}
                        </Moment>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                <div className='card bg-transparent bg-secondary'>
                  <h6 className='p-3'>Billing Address Info</h6>
                  <ul className='list-group list-group-flush '>
                    <li className='list-group-item'>
                      City: {order.billingAddress.city}
                    </li>
                    <li className='list-group-item'>
                      Address: {order.billingAddress.address}
                    </li>
                    <li className='list-group-item'>
                      Mobile: {order.billingAddress.mobile}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='row mt-5'>
              <div className='col-lg-8 col-md-7 col-sm-12 col-12'>
                <table className='table table-sm table-borderless bg-secondary'>
                  <thead>
                    <tr>
                      <th scope='col'>
                        <h6> Product</h6>
                      </th>

                      <th scope='col'>
                        <h6>Price</h6>
                      </th>
                      <th scope='col'>
                        <h6>Quantity</h6>
                      </th>
                      <th scope='col'>
                        <h6>Total</h6>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => (
                      <tr
                        key={item.product}
                        className='border-button-1 my-auto'
                      >
                        <th scope='row' className='align-middle'>
                          <img
                            src={item.image && item.image.imagePath}
                            alt=''
                            className='img-card-top img-fluid w-25 '
                          />{' '}
                          {item.name}
                        </th>
                        <th className='align-middle'>
                          ${addDecimal(item.price)}
                        </th>

                        <th className='align-middle'>{item.qty}</th>
                        <th className='align-middle'>
                          ${addDecimal(item.price * item.qty)}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className='fw-bold'>Subtotal</td>
                      <td className='fw-bold'>
                        ${addDecimal(order.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className='col-lg-4 col-md-5 col-sm-12 col-12'>
                <div className='card border-0 bg-secondary'>
                  <div className='card-body'>
                    <div className='card-text'>
                      <p>
                        Pay via PayPal; you can pay with your credit card if you
                        don’t have a PayPal account.
                      </p>
                      {!order.isPaid && (
                        <>
                          {loadingPay && <Loader />}
                          {!sdkReady ? (
                            <Loader />
                          ) : (
                            <PayPalButton
                              amount={order.totalPrice}
                              onSuccess={successPaymentHandler}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}

export default PlaceOrderScreen
