import React from 'react'
import { FaCartPlus, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'

const Navigation = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const logoutHandler = () => {
    dispatch(logout())
  }

  const authLinks = (
    <ul className='navbar-nav mr-right mb-2 mb-lg-0'>
      <li className='nav-item dropdown'>
        <span
          className='nav-link dropdown-toggle'
          id='navbarDropdown'
          role='button'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          {userInfo && userInfo.name}
        </span>
        <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
          <li>
            <Link to='/profile' className='dropdown-item'>
              Profile
            </Link>
          </li>
          <li>
            <Link to='/' onClick={logoutHandler} className='dropdown-item'>
              Logout
            </Link>
          </li>
        </ul>
      </li>

      {userInfo && userInfo.isAdmin && (
        <li className='nav-item dropdown'>
          <span
            className='nav-link dropdown-toggle'
            id='navbarDropdown'
            role='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            Admin
          </span>
          <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
            <li>
              <Link to='/admin/product' className='dropdown-item'>
                Product
              </Link>
            </li>
            <li>
              <Link to='/admin/order' className='dropdown-item'>
                Order
              </Link>
            </li>
            <li>
              <Link to='/admin/users' className='dropdown-item'>
                Users
              </Link>
            </li>
            <li>
              <Link to='/admin/users/logs' className='dropdown-item'>
                Users Log
              </Link>
            </li>
          </ul>
        </li>
      )}
    </ul>
  )

  const guestLinks = (
    <ul className='navbar-nav mr-right mb-2 mb-lg-0'>
      <li className='nav-item'>
        <Link to='/register' className='nav-link'>
          Register
        </Link>
      </li>
      <li className='nav-item'>
        <Link to='/login' className='nav-link'>
          Login
        </Link>
      </li>
    </ul>
  )

  return (
    <div className='sticky-top bg-light mb-2'>
      {/* <div className=' p-2 container '>
        <div className='text-left p-2 '>
          <FaPhoneAlt /> <a href='tel:+252615301507'>+252 61 530 1507</a> -{' '}
          <FaEnvelope />{' '}
          <a href='mailto:ahmaat19@gmail.com'>ahmaat19@gamil.com</a>
        </div>
      </div> */}
      

      <nav className='navbar navbar-expand-md navbar-light bg-light shadow-sm '>
        
        <div className='container'>
          <Link className='navbar-brand fw-bold fs-5' to='/'>
            Vethuppi
          </Link>

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav ml-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <Link
                  className='nav-link active'
                  aria-current='page'
                  to='/cart'
                >
                  <FaCartPlus fontSize='20px' />{' '}
                  <sup>{cartItems && cartItems.length}</sup>
                </Link>
              </li>
              {userInfo ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navigation
