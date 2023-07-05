'use strict'

const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: ['0', '1'] } })
    const shuffledUsers = users.sort(() => Math.random() - 0.5)

    await queryInterface.bulkInsert('Carts',
      Array.from({ length: 3 }).map((item, index) => ({
        // id: index + 1,
        UserId: shuffledUsers[index].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {})
  }
}
