const { Cart, CartItem, Product } = require('../models')

const cartController = {
  getCart: (req, res, next) => {
    return Cart.findOne({
      include: 'cartProducts'
    })
      .then(cart => {
        const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

        const cartProducts = cart.cartProducts.map(product => {
          const { id, name, quantity, price, image } = product
          return { id, name, quantity, price, image }
        })
        res.locals.getCart = cartProducts
        res.locals.totalPrice = totalPrice
        console.log('打印機', cartProducts, totalPrice)

        return next()
      })
      .catch(err => next(err))
  }

}
module.exports = cartController
