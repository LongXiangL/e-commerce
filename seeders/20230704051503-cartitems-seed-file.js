'use strict'

const { Cart, Product } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await Product.findAll()
    const carts = await Cart.findAll()
    const shuffledProducts = products.sort(() => Math.random() - 0.5)// 不重複

    await queryInterface.bulkInsert('cartItems',
      Array.from({ length: 10 }).map((item, index) => ({
        // id: index + 1,
        ProductId: shuffledProducts[index].id,
        CartId: carts[Math.floor(Math.random() * 3)].id,
        quantity: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cartItems', null, {})
  }
}
