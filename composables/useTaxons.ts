export function buildTaxonTree(flatTaxons: any[], locale: string = 'en_US') {
  const taxonMap = new Map<string, any>()
  const result: any[] = []

  // Étape 1 : créer une map avec les taxons enrichis
  for (const taxon of flatTaxons) {
    const translatedName = taxon.translations?.[locale]?.name ?? taxon.code
    taxonMap.set(taxon['@id'], {
      id: taxon.id,
      ref: taxon['@id'],
      name: translatedName,
      children: [],
      parentId: taxon.parent, // peut être null ou un @id
    })
  }

  // Étape 2 : construire l'arbre
  for (const taxon of taxonMap.values()) {
    if (taxon.parentId && taxonMap.has(taxon.parentId)) {
      taxonMap.get(taxon.parentId).children.push(taxon)
    } else {
      result.push(taxon)
    }
  }

  return result
}
