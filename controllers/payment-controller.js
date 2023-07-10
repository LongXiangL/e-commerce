const { Order, Payment } = require('../models')

const paymentController = {
  postPayment: (req, res, next) => {
    const { amount, last3number, orderId } = req.body
    Order.findByPk(orderId)
      .then(order => {
        if (!order) {
          return res.status(404).send('Order not found')
        }
        Payment.create({
          OrderId: orderId,
          amount,
          last3number
        })
          .then(() => {
            return Order.update(
              { payment_status: '-1' },
              { where: { id: orderId } }
            )
          })
          .then(() => {
            return res.redirect(`/order/${orderId}`)
          })
      })
      .catch(err => next(err))
  }

}

module.exports = paymentController
