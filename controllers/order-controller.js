const { Order, OrderItem, Product } = require('../models')

const orderController = {
  getOrders: (req, res, next) => {
    Order.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.user.id },
      include: 'orderProducts'
    })
      .then(ordersHavingProducts => {
        return Order.findAll({
          raw: true,
          nest: true,
          where: { UserId: req.user.id }
        })
          .then(orders => {
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
      })
      .then(orders => {
        if (orders) {
          res.render('orders', { orders })
        } else {
          req.flash('warning_msg', '訂單內還沒有東西~')
          return res.redirect('/products')
        }
      })
      .catch(err => next(err))
  }
}

module.exports = orderController
