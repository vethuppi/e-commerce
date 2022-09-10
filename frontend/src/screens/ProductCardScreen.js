import React from 'react'
import { FaInfo } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import placeHolder from '../no-image-available.webp'

const ProductScreen = ({ currentItems }) => {
  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  return (
    <div className='row g-3'>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
            <div className='card text-center border-0 shadow'>
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.image ? item.image.imagePath : placeHolder}
                  alt='product image'
                  className='img-card-top img-fluid'
                />{' '}
              </Link>
              <div className='card-body'>
                <p className='card-text'>
                  <span className='fw-light '>{item.category}</span> <br />
                  <Link to={`/product/${item._id}`}>
                    <span className='fw-bold fs-6'>{item.name}</span>
                  </Link>{' '}
                  <br />
                </p>
                <div className='btn-group'>
                  <button className='btn  btn-info bg-primary  btn-sm rounded-pill'>
                    <span className='fw-lighter fs-6'>
                      ${addDecimal(item.price)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ProductScreen
