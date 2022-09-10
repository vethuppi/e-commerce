import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../actions/productActions'
import { FaTrash } from 'react-icons/fa'
import placeHolder from '../no-image-available.webp'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCurrentHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2)

  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const checkoutHandler = () => {
    history.push('/checkout')
  }

  return (
    <div className='container'>
      {cartItems.length === 0 ? (
        <div className='alert alert-info'>
          Your cart is empty <Link to='/'> Go Back</Link>
        </div>
      ) : (
        <table className='table table-sm table-borderless'>
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
              <th scope='col'>
                <h6> Action</h6>
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.product} className='border-button-1 my-auto'>
                <th scope='row' className='align-middle'>
                  <img
                    src={item.image ? item.image.imagePath : placeHolder}
                    alt=''
                    className='img-card-top img-fluid w-25'
                  />{' '}
                  {item.name}
                </th>
                <th className='align-middle'>${addDecimal(item.price)}</th>
                <th className='align-middle'>
                  <select
                    className='btn border-1 border-light btn-sm shadow-none mx-1 rounded-pill'
                    name='qty'
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    <option value='0'>QTY</option>
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </th>
                <th className='align-middle'>
                  ${addDecimal(item.price * item.qty)}
                </th>
                <th className='align-middle'>
                  <button
                    type='button'
                    className='btn btn-danger btn-sm '
                    onClick={() => removeFromCurrentHandler(item.product)}
                  >
                    <FaTrash /> Cancel
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className='fw-bold'>Subtotal</td>
              <td className='fw-bold'>${addDecimal(totalPrice)}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan='2'>
                {userInfo && userInfo ? (
                  <button
                    onClick={checkoutHandler}
                    className='btn btn-info bg-primary  rounded-pill'
                  >
                    Proceed To Checkout
                  </button>
                ) : (
                  <div className='alert alert-info text-center'>
                    Please <Link to='/login'> LOGIN </Link> to proceed the
                    checkout
                  </div>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}

export default CartScreen
