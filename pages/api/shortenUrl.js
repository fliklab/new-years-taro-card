export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { originalURL } = req.body
      const domain = 'link.techbukket.com'
      const data = {
        domain,
        originalURL,
      }

      const response = await fetch('https://api.short.io/links/public', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'pk_Oe2pyivhy1wQwfdp', //SHORT_IO_API_KEY
        },
        body: JSON.stringify(data),
      })

      const jsonData = await response.json()

      res.status(200).json(jsonData)
    } catch (error) {
      res.status(500).json({ error: '서버에서 오류가 발생했습니다.' })
    }
  } else {
    res.status(405).json({ error: 'POST 요청만 허용됩니다.' })
  }
}
