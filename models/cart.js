'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Cart.belongsToMany(models.Product, {
        through: models.CartItem,
        foreignKey: 'CartId',
        as: 'cartProducts'
      })
      Cart.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Cart.init({
    OrderId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts'
  })
  return Cart
}
