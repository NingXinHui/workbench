import Oidc from 'oidc-client'
// 设置环境变量
let mgr = new Oidc.UserManager({
  userStore: new Oidc.WebStorageStateStore(), // 不用改
  authority: 'http://dev-hangzhou.oauth.saas.huansi.net', // oauth2的测试连接地址，正服:http://oauth.saas.huansi.net
  client_id: 'web-common-localhost client', // oidc该app注册分配的client_id
  redirect_uri: 'http://localhost:8000/signin-oidc', // oidc登录成功后重定向的地址
  response_type: 'id_token token', // 登录成功 后返回的参数,
  scope: 'openid profile UserRight', // oidc为app 分配的权限,
  post_logout_redirect_uri: 'http://localhost:8000/signout-oidc', // 注销登录后的回调地址
  silent_redirect_uri: '', // 暂时没用到
  accessTokenExpiringNotificationTime: 10,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  extraQueryParams: {
    // 跳转到oidc网站时的额外参数
    nonce: new Date().valueOf()
  },
  loadUserInfo: true
})
mgr.events.addUserLoaded(function (user) {
  console.log('New User Loaded：', arguments)
  console.log('Acess_token: ', user.access_token)
})
mgr.events.addAccessTokenExpiring(function () {
  console.log('AccessToken Expiring：', arguments)
})

mgr.events.addAccessTokenExpired(function () {
  console.log('AccessToken Expired：', arguments)
  alert('Session expired. Going out!')
  mgr
    .signoutRedirect()
    .then(function (resp) {
      console.log('signed out', resp)
    })
    .catch(function (err) {
      console.log(err)
    })
})

mgr.events.addSilentRenewError(function () {
  console.error('Silent Renew Error：', arguments)
})

mgr.events.addUserSignedOut(function () {
  alert('Going out!')
  console.log('UserSignedOut：', arguments)
  mgr
    .signoutRedirect()
    .then(function (resp) {
      console.log('signed out', resp)
    })
    .catch(function (err) {
      console.log(err)
    })
})
Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.INFO

export default class SecurityService {
  constructor () {}
  // Check if there is any user logged in
  getSignedIn (tenant, tenantPlat) {
    let self = this
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then(function (user) {
          if (user == null) {
            self.signIn(tenant, tenantPlat)
            return resolve(false)
          } else {
            return resolve(true)
          }
        })
        .catch(function (err) {
          console.log(err)
          return reject(err)
        })
    })
  }

  // Redirect of the current window to the authorization endpoint.可传入参数
  signIn (tenant, tenantPlat) {
    const parms = {
      tenant: tenant,
      tenantPlat: tenantPlat,
      nonce: new Date().valueOf()
    }
    // 由于租户和平台可能随时切换,所以这里要动态设置_extraQueryParams
    mgr._settings._extraQueryParams = parms
    mgr.signinRedirect(parms).catch(function (err) {
      console.log(err)
    })
  }

  // Redirect of the current window to the end session endpoint,可以传入额外参数
  signOut (tenant, tenantPlat, id_token_hint) {
    const parms1 = {
      id_token_hint: id_token_hint //登录成功后url上会带过来id_token,注销时必须带上这个
    }
    const parms2 = {
      tenant: tenant || '',
      tenantPlat: tenantPlat,
      nonce: new Date().valueOf()
    }
    // 由于租户和平台可能随时切换,所以这里要动态设置_extraQueryParams
    mgr._settings._extraQueryParams = parms2
    mgr
      .signoutRedirect(parms1)
      .then(function (resp) {
        console.log('signed out', resp)
      })
      .catch(function (err) {
        console.log(err)
      })
  }
}
