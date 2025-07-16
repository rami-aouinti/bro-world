// server/api/cron/grok-news.ts
import { getRedisClient } from '~/server/utils/redis'
import { useGroq } from '~/composables/useGroq'

export default defineEventHandler(async () => {
  const redis = await getRedisClient()

  const { askGroq } = useGroq()
  const prompt = 'Give me the top tech news headlines in short bullet points' // ou ta traduction

  try {
    const response = await askGroq(prompt)

    if (!response) throw new Error('Empty response from Groq')

    const news = response
      .split('\n')
      .map((line) => line.trim())
      .filter((line) =>
        line.length > 0 &&
        !line.toLowerCase().includes('news headlines') &&
        !line.toLowerCase().startsWith('here are')
      )

    await redis.set('grok:news', JSON.stringify(news), 'EX', 300)

    return { status: 'ok', saved: news.length }
  } catch (error: any) {
    console.error('Cron Groq Error:', error)
    return { status: 'error', message: error.message }
  }
})
