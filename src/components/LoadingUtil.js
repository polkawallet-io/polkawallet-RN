const LoadingUtil = {
  showLoading(timeOut = 30000) {
    global.LoadingTip = true
    global.mLoadingComponentRef && global.mLoadingComponentRef.showLoading()
    this.timerLoading = setTimeout(() => {
      this.dismissLoading()
    }, timeOut)
  },
  dismissLoading() {
    global.LoadingTip = false
    global.mLoadingComponentRef && global.mLoadingComponentRef.dismissLoading()
    this.timerLoading && clearTimeout(this.timerLoading)
  }
}

export default LoadingUtil
