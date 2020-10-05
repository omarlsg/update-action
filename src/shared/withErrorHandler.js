const withErrorHandler = target => {
  return async (...args) => {
    try {
      await target(...args)
    } catch (error) {
      console.error(error.message)
    }
  }
}

module.exports = withErrorHandler
