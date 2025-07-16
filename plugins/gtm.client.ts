export default defineNuxtPlugin(() => {
  if (process.dev) return // Ne pas injecter en développement

  if (process.client) {
    // Inject GTM script
    const script = document.createElement('script')
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-N632XHTD');`
    script.type = 'text/javascript'
    document.head.appendChild(script)

    // Inject noscript iframe (fallback si JS désactivé)
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N632XHTD"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    document.body.appendChild(noscript)
  }
})
