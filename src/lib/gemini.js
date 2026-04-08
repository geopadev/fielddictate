/**
 * Sends audio blob to Gemini API for transcription and formatting.
 * Uses the gemini-2.0-flash model with inline audio data.
 */
export async function transcribeAndFormat(audioBlob) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY in .env.local')

  // Convert blob to base64
  const arrayBuffer = await audioBlob.arrayBuffer()
  const base64Audio = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )

  const mimeType = audioBlob.type || 'audio/webm'

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `You are an AI assistant for field technicians (plumbers, electricians, HVAC techs).
The audio above is a voice note recorded in the field.

Please:
1. Transcribe the audio accurately.
2. Format the transcription into a clean, professional job note with the following sections where relevant:
   - **Job Summary**: One sentence overview.
   - **Work Performed**: Bullet points of tasks completed.
   - **Parts / Materials Used**: List any mentioned parts or materials.
   - **Next Steps / Follow-up**: Any outstanding actions.
   - **Notes**: Any other relevant information.

Return ONLY the formatted note. Do not include any preamble or explanation.`,
          },
        ],
      },
    ],
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Gemini API error')
  }

  const data = await response.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return rawText.trim()
}
