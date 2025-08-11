// utils/pdf.ts
export type ExportPdfOptions = {
  filename?: string;                     // Nom du fichier téléchargé
  download?: boolean;                    // true = lance le téléchargement
  returnBlob?: boolean;                  // true = renvoie aussi le Blob
  scale?: number;                        // html2canvas scale (qualité)
  background?: string;                   // couleur de fond forcée
  pagebreakMode?: Array<'css' | 'legacy' | 'avoid-all' | 'always'>; // modes pagebreak
};

export type ExportPdfResult = {
  pages: number;                         // nombre total de pages
  blob?: Blob;                           // présent si returnBlob = true
};

/**
 * Exporte un élément DOM en PDF A4, gère la pagination automatique,
 * et renvoie le nombre de pages (et le Blob si demandé).
 *
 * Exemple:
 *   const { pages } = await exportCvAsPdf(pdfRef.value, { filename: 'CV.pdf' })
 */
export async function exportCvAsPdf(
  el: HTMLElement,
  opts: ExportPdfOptions = {}
): Promise<ExportPdfResult> {
  if (!el) throw new Error('exportCvAsPdf: element is required')

  const html2pdf = (await import('html2pdf.js')).default

  const {
    filename = 'Lebenslauf.pdf',
    download = true,
    returnBlob = false,
    scale = 2,
    background = '#ffffff',
    pagebreakMode = ['css', 'legacy'],
  } = opts

  const worker = html2pdf().set({
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale,
      useCORS: true,
      backgroundColor: background,
      // Si tu veux ignorer des éléments: ignoreElements: (el) => el.classList.contains('no-print')
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: pagebreakMode },
  }).from(el)

  // 1) Génère le PDF en mémoire (sans télécharger pour l’instant)
  await worker.toPdf()

  // 2) Récupère l’instance jsPDF et le nombre de pages
  const pdf = await worker.get('pdf')
  const pages = pdf.internal.getNumberOfPages()

  // 3) Optionnel: récupérer le Blob
  let blob: Blob | undefined
  if (returnBlob) {
    // @ts-expect-error: type html2pdf pas parfait, mais fonctionne
    blob = await worker.outputPdf('blob')
  }

  // 4) Télécharger si demandé
  if (download) {
    await worker.save()
  }

  return { pages, blob }
}
