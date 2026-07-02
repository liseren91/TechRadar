export const SOURCE_META = {
  anthropic: { label: 'Anthropic', icon: '🧠' },
  openai: { label: 'OpenAI', icon: '⚪' },
  'latent-space': { label: 'Latent Space', icon: '🎙️' },
  deepmind: { label: 'Google DeepMind', icon: '🔷' },
  simonw: { label: 'Simon Willison', icon: '🧩' },
  hf: { label: 'Hugging Face', icon: '🤗' },
  meta: { label: 'Meta AI', icon: '🟦' },
  mistral: { label: 'Mistral', icon: '🌫️' },
}

export function pickDigestText(item, lang) {
  const block = (item && item[lang]) ||
    (item && item.en) || { headline: '', tweets: [] }
  return {
    headline: block.headline || '',
    tweets: Array.isArray(block.tweets) ? block.tweets : [],
  }
}
