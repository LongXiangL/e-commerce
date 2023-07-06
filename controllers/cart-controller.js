const { Cart, CartItem, Product } = require('../models')

const cartController = {
  getCart: (req, res, next) => {
    if (req.user) {
      return Cart.findOne({
        include: [{
          model: Product,
          as: 'cartProducts',
          through: CartItem
        }],
        where: { UserId: req.user.id }
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
    } else {
      req.flash('warning_msg', '請先登入~')
      return res.redirect('/users/login')
    }
  },
  postCart: (req, res, next) => {
    const { productId } = req.body

    Product.findByPk(productId)
      .then(addProduct => {
        // 檢查商品庫存
        if (addProduct.inventory === 0) {
          req.flash('warning_msg', `商品Id:${productId} 已經沒有庫存了!`)
          return res.redirect('back')
        }

        let cartPromise
        let cart

        // 尋找購物車或創建新購物車
        if (req.user) {
          cartPromise = Cart.findOrCreate({
            where: { UserId: req.user.id || 0 }
          })
        } else {
          req.flash('warning_msg', '請先登入~')
          return res.redirect('/users/login')
        }

        return cartPromise
          .then(([userCart]) => {
            cart = userCart

            // 尋找購物車中的商品或創建新商品
            return CartItem.findOrCreate({
              where: {
                CartId: cart.id,
                ProductId: productId
              },
              defaults: {
                quantity: 1
              }
            })
          })
          .then(([product, created]) => {
            if (!created) {
              // 檢查商品數量是否超過庫存
              if (product.quantity + 1 > addProduct.inventory) {
                req.flash('warning_msg', `商品Id:${productId} 庫存剩下${addProduct.inventory}件!`
                )
                return res.redirect('back')
              }
              product.quantity += 1
            }
            return product.save()
          })
      })
      .catch(err => next(err))
  }

}
module.exports = cartController
