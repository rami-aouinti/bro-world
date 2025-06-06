import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const { collections } = await GqlGetSitemapCollections({ first: 20 })

  const collectionUrls: SitemapUrlInput[] = collections.edges.map(({ node }) => ({
    loc: `/collection/${node.handle}`,
    lastmod: node.updatedAt,
  }))

  const { products } = await GqlGetSitemapProducts({ first: 100 })

  const productUrls: SitemapUrlInput[] = products.edges.map(({ node }) => ({
    loc: `/product/${node.handle}`,
    lastmod: node.updatedAt,
  }))

  return [
    ...collectionUrls,
    ...productUrls,
    { loc: '/about', lastmod: new Date(Date.now()) },
    { loc: '/', lastmod: new Date(Date.now()) },
  ] satisfies SitemapUrlInput[]
})
