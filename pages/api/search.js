export default async function handler(req, res) {
  const url = new URL('https://canvas.instructure.com/api/v1/accounts/search')
  try {
    url.search = new URLSearchParams(req.query)
    const realResult = await fetch(url)
    const json = await realResult.json()
    const link = realResult.headers.get('Link')
    res.setHeader('Link', link)
    res.status(realResult.status).json(json)
  } catch (e) {
    res.status(500).json(e)
  }
}
