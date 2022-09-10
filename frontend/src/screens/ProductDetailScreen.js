import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProduct } from '../actions/productActions'
import { FaCartPlus } from 'react-icons/fa'

const ProductDetailScreen = ({ match, history }) => {
  const productId = match.params.id
  const [qty, setQty] = useState(1)
  const [totalPrice, setTotalPrice] = useState(1)

  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { products, error, loading } = productList

  useEffect(() => {
    dispatch(listProduct())
  }, [dispatch])

  const productsObj =
    products && products.filter((product) => product._id === productId)
  const product = productsObj && productsObj[0]

  useEffect(() => {
    product && setTotalPrice(product && product.price * qty)
  }, [qty, product])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  return (
    <>
      {loading || !product ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className='container'>
          <div className='row'>
            <div className='col-6'>
              <img
                src={product.image.imagePath}
                className='img-fluid w-100'
                alt=''
              />
            </div>
            <div className='col-6 my-auto'>
              <h1 className='fs-3'> {product.name}</h1>
              <h2 className='fs-4 custom-text-color'> ${totalPrice}</h2>
              <p>
                <span> Category: {product.category} </span> <br />
                <span>
                  {' '}
                  Status:{' '}
                  {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}{' '}
                </span>{' '}
                <br />
              </p>
              <hr />
              <p>{product.description}</p>
              <hr />
              <p className='text-center'>
                <select
                  className='btn border-1 border-success btn-sm shadow-none mx-1'
                  name='qty'
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                >
                  <option value='0' disabled='disabled'>
                    QTY
                  </option>
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  className='btn btn-info bg-primary rounded-pill btn-m'
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                >
                  <FaCartPlus /> Add to Cart
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetailScreen
