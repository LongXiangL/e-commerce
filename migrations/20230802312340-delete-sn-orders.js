'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'sn')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'sn', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  }
}
