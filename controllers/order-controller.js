const { Order, OrderItem, Product, Cart } = require('../models')

const orderController = {
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
  }
}

module.exports = orderController
