/**
 * 将变量名转换为肉串形式：@huavue/build -> huavue-build
 * Convert the variable name to a kebab: @huavue/build -> huavue-build
 */
export function kebabCase(varName: string) {
  const nameArr = varName.split('/')
  return nameArr.map((item) => item.toLowerCase()).join('-')
}

/**
 * 将变量名转换为驼峰形式：@huavue/build -> huavueBuild
 * Convert the variable names to camel case form: @huavue/build -> huavueBuild
 */
export function camelCase(varName: string, isFirstWordUpperCase = false) {
  const nameArr = varName.split('/')
  return nameArr
    .map((item, index) => {
      if (index === 0 && !isFirstWordUpperCase) {
        return item.toLowerCase()
      }
      return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    })
    .join('')
}
