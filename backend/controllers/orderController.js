import asyncHandler from 'express-async-handler'
import OrderModel from '../models/orderModel.js'

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, billingAddress, totalPrice, userInfo } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new OrderModel({
      orderItems: orderItems,
      user: userInfo._id,
      billingAddress,
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id }).sort({
    createdAt: -1,
  })
  res.json(orders)
})

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 })
  res.json(orders)
})

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const order = await OrderModel.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// export {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   getMyOrders,
//   getOrders,
//   updateOrderToDelivered,
// }
