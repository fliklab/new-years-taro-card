import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  const { receiver, relation, sender, topic, interest } = req.body

  // 기본값 설정
  const safeReceiver = receiver || ''
  const safeRelation = relation || ''
  const safeSender = sender || ''
  const safeTopic = topic || ''
  const safeInterest = interest || '일반적인' // 사용자의 관심사 추가

  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `"${safeTopic}"에 몰입하고 있는 ${safeRelation} ${safeReceiver}를 위해 ${safeTopic} 관련 새해 운세를 30자 이내로 작성해줘. 유쾌함이 담긴 친근하고 따뜻하고 긍정적인 미래를 암시하도록하라. 적절한 메시지를 찾기 어렵다면 일반적인 새해문구로 대신하라.`,
      },
    ]

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      max_tokens: 100,
    })

    res.status(200).json({
      param: req.body,
      result: chatCompletion,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
