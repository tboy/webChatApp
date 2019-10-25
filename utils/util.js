// 日期格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 在数组中查找是否存在传入的值
const findEqualValie = (arr, value, key) => {
  if (!arr || !value && value != 0) return
  let curt = false
  for (let i = 0; i < arr.length; i++) {
    if (key) {
      const keys = key.split('.')
      if (keys.length == 2) {
        if (arr[i][keys[0]][keys[1]] == value) {
          curt = arr[i]
        }
      } else {
        if (arr[i][key] == value) {
          curt = arr[i]
        }
      }
    } else {
      if (arr[i] == value) {
        curt = arr[i]
      }
    }
  }
  return curt;
}

/* 
*================================================================
* 解决js在 + - * /中运算精度问题
*================================================================
*/

//  判断obj是否为一个整数 
const isInteger = obj => {
  return Math.floor(obj) === obj
}

// 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
// @param floatNum { number } 小数
// @return { object }
// { times: 100, num: 314 }
const toInteger = floatNum => {
  var ret = { times: 1, num: 0 }
  var isNegative = floatNum < 0
  if (isInteger(floatNum)) {
    ret.num = floatNum
    return ret
  }
  var strfi = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len = strfi.substr(dotPos + 1).length
  var times = Math.pow(10, len)
  var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
  ret.times = times
  if (isNegative) {
    intNum = -intNum
  }
  ret.num = intNum
  return ret
}

/*
* 核心方法，实现加减乘除运算，确保不丢失精度
* 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
*
* @param a {number} 运算数1
* @param b {number} 运算数2
* @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
*
*/
const operation = (a, b, op) => {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  switch (op) {
    case 'add':
      if (t1 === t2) { // 两个小数位数相同
        result = n1 + n2
      } else if (t1 > t2) { // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2)
      } else { // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2
      }
      return result / max
    case 'subtract':
      if (t1 === t2) {
        result = n1 - n2
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2)
      } else {
        result = n1 * (t2 / t1) - n2
      }
      return result / max
    case 'multiply':
      result = (n1 * n2) / (t1 * t2)
      return result
    case 'divide':
      result = (n1 / n2) * (t2 / t1)
      return result
  }
}

// 加减乘除的四个接口
const add = (a, b) => {
  return operation(a, b, 'add');
}
const subtract = (a, b) => {
  return operation(a, b, 'subtract');
}
const multiply = (a, b) => {
  return operation(a, b, 'multiply');
}
const divide = (a, b) => {
  return operation(a, b, 'divide');
}


module.exports = {
  formatTime: formatTime,
  findEqualValie: findEqualValie,
  add,
  subtract,
  multiply,
  divide
}
