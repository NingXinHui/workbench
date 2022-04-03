import HsOidcClient from './hs-oidc-client'
const hsOidcClient = new HsOidcClient()
export function signIn(tenant,tenantPlat){
  hsOidcClient.signIn(tenant,tenantPlat)
}
export function signOut(tenant,tenantPlat,id_token_hint){
  hsOidcClient.signOut(tenant,tenantPlat,id_token_hint)
}