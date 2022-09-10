import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveBillingAddress } from '../actions/cartActions'
import { createOrder } from '../actions/orderActions'
import Message from '../components/Message'
import { removeAllFromCart } from '../actions/productActions'

const CheckoutScreen = ({ history }) => {
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [mobile, setMobile] = useState('')

  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems, billingAddress } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cartCity = billingAddress ? billingAddress.city : ''
  const cartAddress = billingAddress ? billingAddress.address : ''
  const cartMobile = billingAddress ? billingAddress.mobile : ''

  useEffect(() => {
    setCity(cartCity)
    setAddress(cartAddress)
    setMobile(cartMobile)
  }, [cartCity, cartAddress, cartMobile])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(saveBillingAddress({ address, city, mobile }))

    const totalPrice = cartItems
      .reduce((acc, item) => acc + item.qty * item.price, 0)
      .toFixed(2)

    if (billingAddress) {
      dispatch(
        createOrder({
          orderItems: cartItems,
          billingAddress: {
            city,
            address,
            mobile,
          },
          totalPrice,
          userInfo,
        })
      )
    }
  }

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      dispatch(removeAllFromCart())
      history.push(`/order/${order._id}`)
    }

    // eslint-disable-next-line
  }, [history, success])

  return (
    <div className='container'>
      {error && <Message variant='danger'>{error}</Message>}
      <div className='row'>
        <div className='col-lg-8 col-md-6 col-sm-12 col-12 mx-auto'>
          <h5>Billing Details</h5> <hr />
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className='mb-3'>
              <label htmlFor='city' className='form-label'>
                City
              </label>
              <select
                type='text'
                className='form-control'
                id='city'
                name='city'
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value=''>---------</option>
                <option value='Mogadishu'>Mogadishu</option>
                <option value='Hargeisa'>Hargeisa</option>
                <option value='Kismayo'>Kismayo</option>
                <option value='Balatweyn'>Balatweyn</option>
                <option value='Baydhabo'>Baydhabo</option>
              </select>
            </div>
            <div className='mb-3'>
              <label htmlFor='address' className='form-label'>
                Billing Address
              </label>
              <input
                type='text'
                className='form-control'
                id='address'
                name='address'
                placeholder='Address'
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='mobile' className='form-label'>
                Mobile Number
              </label>
              <input
                type='number'
                min='0'
                className='form-control'
                id='mobile'
                name='mobile'
                placeholder='Mobile Number'
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className='mb-3 text-end'>
              <button className='btn btn info bg-primary rounded-pill'>
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CheckoutScreen
