const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  multiply: function (a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      return a * b
    }
  },
  formatTime: function (a) {
    return dayjs(a).locale('zh-tw').format('YYYY/MM/DD (dd) a HH:mm:ss')
  }
}
