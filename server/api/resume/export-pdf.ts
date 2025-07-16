import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const { url } = await readBody<{ url: string }>(event)
  const config = useRuntimeConfig()
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  const urlResume = `${config.public.siteUrl}/${url}`
  await page.goto(urlResume, {
    waitUntil: 'networkidle0'
  })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  })

  await browser.close()

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"'
    }
  })
})
