/**
 * Sends audio blob to Gemini API for transcription and formatting.
 * Uses the gemini-2.5-flash model with inline audio data.
 * Includes automatic retry with exponential backoff for transient errors (503, 429).
 */

const MAX_RETRIES = 3
const RETRYABLE_STATUSES = new Set([429, 500, 503]) // rate-limit, server error, overloaded

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
1. Detect the language spoken in the audio.
2. If there is no speech, only ambient noise, or the audio is silent, return EXACTLY the text: SILENCE_DETECTED
3. Otherwise, transcribe the audio accurately and format it into a clean, professional job note.
4. Write the ENTIRE note — including all section headers — in the SAME language that was spoken in the audio. Do NOT translate to English.
5. Use the following sections where relevant, translated into the detected language:
   - A one-sentence job summary.
   - Bullet points of tasks completed.
   - List of any parts or materials mentioned.
   - Any outstanding next steps or follow-up actions.
   - Any other relevant notes.

Return ONLY the formatted note or the silence flag. Do not include any preamble, language label, or explanation.`,
          },
        ],
      },
    ],
  }

  let lastError = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let response

    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
    } catch (networkError) {
      // Pure network failure (offline, DNS, etc.) — don't retry
      throw new Error('Network error — please check your connection and try again.')
    }

    if (response.ok) {
      const data = await response.json()
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const trimmedText = rawText.trim()

      if (trimmedText.includes('SILENCE_DETECTED') || trimmedText === '') {
        throw new Error('No speech was detected in the recording. Please try speaking clearly or moving closer to your microphone.')
      }

      return trimmedText
    }

    // Retryable status — wait and try again
    if (RETRYABLE_STATUSES.has(response.status)) {
      const err = await response.json().catch(() => ({}))
      lastError = err?.error?.message || `API error ${response.status}`

      if (attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s …
        const delay = Math.pow(2, attempt - 1) * 1000
        await sleep(delay)
        continue
      }
    } else {
      // Non-retryable error (e.g. 400 bad request, 401 auth)
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `API error ${response.status}`)
    }
  }

  // All retries exhausted
  throw new Error(`The AI service is temporarily busy. Please wait a moment and try again. (${lastError})`)
}
