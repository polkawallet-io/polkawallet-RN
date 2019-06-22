const noop = () => {}

export const setJSExceptionHandler = (customHandler = noop, allowedInDevMode = false) => {
  if (typeof allowedInDevMode !== 'boolean' || typeof customHandler !== 'function') {
    return
  }
  const allowed = allowedInDevMode ? true : !__DEV__
  if (allowed) {
    // !!! 关键代码
    // 设置错误处理函数
    // Pivotal code: Set up error handlers
    global.ErrorUtils.setGlobalHandler(customHandler)
    // 改写 console.error，保证报错能被 ErrorUtils 捕获并调用错误处理函数处理
    // Rewrite console.error to ensure that the error is caught by ErrorUtils and handled by the error handler function
    console.error = (message, error) => global.ErrorUtils.reportError(error)
  }
}

export const getJSExceptionHandler = () => global.ErrorUtils.getGlobalHandler()

export default {
  setJSExceptionHandler,
  getJSExceptionHandler
}
