const dayjs = require('dayjs')
function equal (a, b, options) {
  if (a === b) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
module.exports = {
  equal,
  currentYear: () => dayjs().year() // 取得當年年份作為 currentYear 的屬性值，並導出
}
