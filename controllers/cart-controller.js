const { Cart, CartItem, Product } = require('../models')

const cartController = {
  getCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({
        include: 'cartProduct'
      })
      const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return ({ cart: cart.toJSON(), totalPrice })
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = cartController
