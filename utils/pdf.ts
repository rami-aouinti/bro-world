export async function exportCvAsPdf(el: HTMLElement){
  const html2pdf = (await import('html2pdf.js')).default
  const opt = {
    margin: 0,
    filename: 'Lebenslauf.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  return html2pdf().set(opt).from(el).save()
}
