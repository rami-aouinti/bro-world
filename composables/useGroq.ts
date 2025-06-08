// composables/useGroq.ts
export const useGroq = () => {
  const apiKey = useRuntimeConfig().public.groqApiKey

  const askGroq = async (message: string) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // ou llama3-70b-8192
        messages: [{ role: 'user', content: message }]
      })
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content
  }

  return { askGroq }
}
