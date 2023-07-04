const { Cart } = require('../models')

const cartController = {
  getCart: (req, res, next) => {
    Cart.findOne({ include: 'cartProduct' })
      .then(cart => {
        let totalPrice = 0
        if (cart.cartProducts.length > 0) {
          totalPrice = cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b)
        }
        console.log(cart)
        return res.render('cart', { cart: cart.toJSON(), totalPrice })
      })
      .catch(err => next(err))
  }
}
module.exports = cartController
