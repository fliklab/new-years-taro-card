// pages/api/createNewYearImage.js

import OpenAI from 'openai'

export default async function handler(req, res) {
  // 환경 변수에서 OpenAI API 키를 로드합니다.
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // POST 요청의 본문에서 prompt를 추출합니다.
  const { topic } = req.body

  // 유효성 검사: prompt가 제공되었는지 확인합니다.
  if (!topic) {
    return res.status(400).json({ error: 'No prompt provided' })
  }
  const prompt = `${topic}과 관련된 새해 인사와 관련된 타로카드 이미지를 만들어주세요.`

  try {
    // DALL-E를 사용하여 이미지를 생성합니다.
    const response = await openai.images.generate({
      model: 'dall-e-3', // 모델 지정
      prompt, // 사용자가 제공한 설명
      n: 1,
      size: '1024x1792',
    })

    // 생성된 이미지의 URL을 응답으로 반환합니다.
    console.log(response)
    res.status(200).json({ result: response })
  } catch (error) {
    // 에러 처리
    console.error('Error:', error)
    res.status(500).json({ error: 'Image generation failed' })
  }
}
