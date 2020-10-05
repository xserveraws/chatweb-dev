let vm = this
window.fbAsyncInit = () => {
  FB.init({
    appId: process.env.FB_APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v2.8',
  })
  FB.getLoginStatus(function (response) {
    vm.statusChangeCallback(response)
  })
}
;(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) {
    return
  }
  js = d.createElement(s)
  js.id = id
  js.src = '//connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')
