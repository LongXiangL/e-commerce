'use strict'

const { Order, Product } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await Order.findAll()
    const products = await Product.findAll()

    await queryInterface.bulkInsert('OrderItems',
      Array.from({ length: 10 }).map((item, index) => ({
        OrderId: orders[Math.floor(Math.random() * 2)].id,
        ProductId: products[Math.floor(Math.random() * 10)].id,
        price: Math.floor(Math.random() * 500) + 1,
        quantity: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {})
  }
}
