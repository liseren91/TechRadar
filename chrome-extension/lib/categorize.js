export const CATEGORY_KEYWORDS = {
  ai: [
    'ai',
    'gpt',
    'llm',
    'machine learning',
    'neural',
    'openai',
    'anthropic',
    'claude',
    'chatgpt',
    'transformer',
    'deep learning',
    'nlp',
    'computer vision',
  ],
  quantum: ['quantum', 'qubit', 'qiskit', 'quantum computing'],
  robotics: [
    'robot',
    'humanoid',
    'autonomous',
    'tesla bot',
    'optimus',
    'drone',
  ],
  web3: [
    'blockchain',
    'crypto',
    'ethereum',
    'bitcoin',
    'defi',
    'nft',
    'web3',
    'solana',
  ],
  cybersecurity: [
    'security',
    'hack',
    'vulnerability',
    'zero-day',
    'ransomware',
    'encryption',
    'malware',
  ],
  biotech: [
    'crispr',
    'gene',
    'biotech',
    'drug',
    'fda',
    'clinical trial',
    'protein',
    'alphafold',
    'dna',
  ],
  energy: [
    'fusion',
    'solar',
    'battery',
    'renewable',
    'nuclear',
    'energy storage',
    'ev',
    'electric vehicle',
  ],
  space: [
    'spacex',
    'nasa',
    'rocket',
    'satellite',
    'starship',
    'mars',
    'moon',
    'orbit',
  ],
}

export function categorizeByKeywords(text) {
  const lowerText = (text || '').toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lowerText.includes(kw))) return category
  }
  return 'ai'
}
