const { Order, OrderItem, Product, Cart } = require('../models')

const orderController = {
  getOrders: (req, res, next) => {
    let ordersHavingProducts
    let orders

    Order.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.user.id },
      include: 'orderProducts'
    })
      .then(foundOrdersHavingProducts => {
        ordersHavingProducts = foundOrdersHavingProducts

        return Order.findAll({
          raw: true,
          nest: true,
          where: { UserId: req.user.id }
        })
      })
      .then(foundOrders => {
        orders = foundOrders

        orders.forEach(order => {
          order.orderProducts = []
        })

        ordersHavingProducts.forEach(product => {
          const index = orders.findIndex(order => order.id === product.id)
          if (index === -1) return
          orders[index].orderProducts.push(product.orderProducts)
        })

        res.render('orders', { orders })
      })
      .catch(err => next(err))
    // },
    // getOrder: (req, res, next) => {
    //   Order.findByPk(req.params.id, {
    //     include: 'orderProducts'
    //   })
    //     .then(order => {
    //       if (order.toJSON().payment_status === '0') {
    //         const tradeData = getData(order.amount, '卡羅購物-精選商品', req.user.email)
    //         return order.update({
    //           sn: tradeData.MerchantOrderNo.toString()
    //         })
    //           .then(() => {
    //             res.render('order', { order: order.toJSON(), tradeData })
    //           })
    //       } else {
    //         const paidOrder = true
    //         res.render('order', { order: order.toJSON(), paidOrder })
    //       }
    //     })
    //     .catch(err => next(err))
  },
  fillOrderData: (req, res, next) => {
    Cart.findOne({
      where: { UserId: req.user.id },
      include: 'cartProducts'
    })
      .then(cart => {
        if (!cart || !cart.cartProducts.length) {
          req.flash('warning_msg', '購物車空空的唷!')
          return res.redirect('back')
        }

        const cartId = cart.id
        const amount = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

        res.render('orderData', { cartId, amount })
      })
      .catch(err => next(err))
  },
  postOrder: (req, res, next) => {
    let cart

    Cart.findByPk(req.body.cartId, { include: 'cartProducts' })
      .then(foundCart => {
        cart = foundCart

        // Check if all products have enough inventory
        for (const product of cart.cartProducts) {
          if (product.inventory < product.CartItem.quantity) {
            req.flash('warning_msg', `商品Id:${product.id}剩下${product.inventory}件，请重新选择数量！`)
            return res.redirect('back')
          }
        }

        // Update inventory data
        const updateInventoryPromises = cart.cartProducts.map(product => {
          const { id, CartItem } = product
          const quantity = CartItem.quantity

          return Product.findByPk(id)
            .then(foundProduct => {
              foundProduct.inventory -= quantity
              return foundProduct.save()
            })
        })

        // Create order (cart -> order)
        const createOrderPromise = Order.create({
          UserId: req.user.id,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          amount: req.body.amount,
          shipping_status: req.body.shipping_status,
          payment_status: req.body.payment_status
        })
        return Promise.all([...updateInventoryPromises, createOrderPromise])
      })
      .then(results => {
        const order = results[results.length - 1]
        console.log(order)
        // Create orderItems (cartItems -> orderItems)
        const createOrderItemsPromises = cart.cartProducts.map(product => {
          const { id, price, CartItem } = product
          const quantity = CartItem.quantity
          return OrderItem.create({
            OrderId: order.id,
            ProductId: id,
            price,
            quantity
          })
        })
        return Promise.all(createOrderItemsPromises)
      })
      .then(() => {
        // Clear cart and cartItems
        return cart.destroy()
      })
      .then(() => res.redirect('/orders'))
      .catch(err => next(err))
  }
}

module.exports = orderController
