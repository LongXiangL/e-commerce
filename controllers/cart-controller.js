const { Cart, CartItem, Product } = require('../models')

const cartController = {
  getCart: (req, res, next) => {
    return Cart.findOne({
      include: [{
        model: Product,
        as: 'cartProducts',
        through: CartItem
      }]
    })
      .then(cart => {
        const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

        const cartProducts = cart.cartProducts.map(product => {
          const { id, name, quantity, price, image } = product
          const CartItem = product.CartItem.dataValues
          return { id, name, quantity, price, image, CartItem }
        })
        res.locals.getCart = cartProducts
        res.locals.totalPrice = totalPrice

        return next()
      })
      .catch(err => next(err))
  }

}
module.exports = cartController
