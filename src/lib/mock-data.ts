// Tech Evolution Radar - Mock Data for MVP
import type { TechItem, EvolutionChain } from './tech-categories'

// Helper to generate dates relative to now
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export const MOCK_TECH_ITEMS: TechItem[] = [
  // AI / On-Device AI Evolution Chain
  {
    id: 'ai-001',
    title:
      'Breakthrough in 1-bit LLM Quantization Achieves 90% Accuracy Retention',
    summary:
      'Researchers demonstrate that extreme quantization to 1-bit weights can maintain near-full model performance, opening doors for edge deployment. This could fundamentally change how we think about model compression.',
    source: 'arxiv',
    sourceUrl: 'https://arxiv.org/abs/2024.xxxxx',
    category: 'ai',
    maturityStage: 'research',
    impactScore: 9,
    hypeVolume: 2400,
    publishedAt: daysAgo(12),
    evolutionChainId: 'chain-ondevice-ai',
    whyItMatters:
      'For businesses: Enables AI features on low-power devices without cloud costs. For engineers: New optimization techniques for model deployment pipelines.',
    isAnomaly: false,
    weeklyGrowth: 45,
    originalLanguage: 'en',
  },
  {
    id: 'ai-002',
    title:
      'Apple Releases MLX 2.0: Native Transformer Support for Apple Silicon',
    summary:
      'MLX framework now supports full transformer architectures with optimized Metal kernels, achieving 3x speedup over PyTorch on M3 chips.',
    source: 'github',
    sourceUrl: 'https://github.com/ml-explore/mlx',
    category: 'ai',
    maturityStage: 'prototype',
    impactScore: 8,
    hypeVolume: 8900,
    publishedAt: daysAgo(5),
    evolutionChainId: 'chain-ondevice-ai',
    whyItMatters:
      'For businesses: Build AI-powered Mac/iOS apps with native performance. For engineers: Familiar NumPy-like API with automatic differentiation.',
    isAnomaly: true,
    weeklyGrowth: 340,
    originalLanguage: 'en',
  },
  {
    id: 'ai-003',
    title: 'Ollama Hits 1M Daily Active Users for Local LLM Inference',
    summary:
      'The open-source tool for running LLMs locally crosses major milestone, signaling mainstream interest in private AI deployment.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=xxxxx',
    category: 'ai',
    maturityStage: 'early-adopter',
    impactScore: 7,
    hypeVolume: 12500,
    publishedAt: daysAgo(2),
    evolutionChainId: 'chain-ondevice-ai',
    whyItMatters:
      'For businesses: Privacy-first AI without data leaving premises. For engineers: Simple CLI for rapid prototyping with various models.',
    isAnomaly: true,
    weeklyGrowth: 180,
    originalLanguage: 'en',
  },

  // Quantum Computing Chain
  {
    id: 'quantum-001',
    title:
      'Google Achieves Below-Threshold Error Rates in Quantum Error Correction',
    summary:
      'Willow processor demonstrates that adding more qubits actually reduces errors, a critical milestone for practical quantum computing.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/quantum-google',
    category: 'quantum',
    maturityStage: 'research',
    impactScore: 10,
    hypeVolume: 45000,
    publishedAt: daysAgo(8),
    evolutionChainId: 'chain-quantum-error',
    whyItMatters:
      'For businesses: Timeline to quantum advantage in optimization problems shortened. For engineers: New paradigm for thinking about fault-tolerant systems.',
    isAnomaly: true,
    weeklyGrowth: 520,
    originalLanguage: 'en',
  },
  {
    id: 'quantum-002',
    title: 'IBM Releases Qiskit 2.0 with Improved Noise Mitigation',
    summary:
      'Major update to quantum SDK includes automatic error suppression and new transpiler optimizations for 1000+ qubit systems.',
    source: 'github',
    sourceUrl: 'https://github.com/Qiskit/qiskit',
    category: 'quantum',
    maturityStage: 'prototype',
    impactScore: 6,
    hypeVolume: 3200,
    publishedAt: daysAgo(15),
    evolutionChainId: 'chain-quantum-error',
    whyItMatters:
      'For businesses: Lower barrier to quantum experimentation. For engineers: Production-ready tools for hybrid classical-quantum algorithms.',
    originalLanguage: 'en',
  },

  // Robotics / Humanoid Chain
  {
    id: 'robot-001',
    title: 'Figure 02 Demonstrates Autonomous Warehouse Operations',
    summary:
      'Humanoid robot completes 8-hour shift picking and packing without human intervention, achieving 94% accuracy rate.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/figure-warehouse',
    category: 'robotics',
    maturityStage: 'early-adopter',
    impactScore: 9,
    hypeVolume: 28000,
    publishedAt: daysAgo(3),
    evolutionChainId: 'chain-humanoid-labor',
    whyItMatters:
      'For businesses: Labor shortage solution with predictable costs. For engineers: New integration challenges for robot-human workflows.',
    isAnomaly: true,
    weeklyGrowth: 290,
    originalLanguage: 'en',
  },
  {
    id: 'robot-002',
    title: 'Tesla Optimus Enters Limited Production at Fremont Factory',
    summary:
      'First batch of 100 Optimus units deployed internally for battery cell handling, marking transition from prototype to production.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=xxxxx',
    category: 'robotics',
    maturityStage: 'prototype',
    impactScore: 8,
    hypeVolume: 67000,
    publishedAt: daysAgo(6),
    evolutionChainId: 'chain-humanoid-labor',
    whyItMatters:
      'For businesses: Signals imminent disruption to manufacturing labor markets. For engineers: Vertical integration model for robotics development.',
    originalLanguage: 'en',
  },

  // Energy / Fusion Chain
  {
    id: 'energy-001',
    title: 'Commonwealth Fusion Achieves Net Energy Gain in SPARC Prototype',
    summary:
      'Private fusion company reports Q > 1.2 in latest test, validating high-field magnet approach for commercial fusion.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/fusion-breakthrough',
    category: 'energy',
    maturityStage: 'prototype',
    impactScore: 10,
    hypeVolume: 89000,
    publishedAt: daysAgo(1),
    evolutionChainId: 'chain-fusion-energy',
    whyItMatters:
      'For businesses: Clean baseload power timeline moves from decades to years. For engineers: New career opportunities in fusion engineering.',
    isAnomaly: true,
    weeklyGrowth: 890,
    originalLanguage: 'en',
  },
  {
    id: 'energy-002',
    title: 'Novel Superconductor Material Works at -70°C',
    summary:
      'Korean researchers publish reproducible results for copper-substituted lead apatite showing superconductivity at achievable temperatures.',
    source: 'arxiv',
    sourceUrl: 'https://arxiv.org/abs/2024.xxxxx',
    category: 'energy',
    maturityStage: 'research',
    impactScore: 8,
    hypeVolume: 15000,
    publishedAt: daysAgo(20),
    evolutionChainId: 'chain-superconductor',
    whyItMatters:
      'For businesses: Could revolutionize power transmission and storage. For engineers: New materials science frontier to explore.',
    originalLanguage: 'en',
  },

  // Web3 / DeFi Chain
  {
    id: 'web3-001',
    title: 'Ethereum L2 TVL Surpasses Mainnet for First Time',
    summary:
      'Combined value locked in Arbitrum, Optimism, and Base exceeds Ethereum mainnet, signaling successful scaling transition.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=xxxxx',
    category: 'web3',
    maturityStage: 'early-adopter',
    impactScore: 7,
    hypeVolume: 34000,
    publishedAt: daysAgo(4),
    evolutionChainId: 'chain-eth-scaling',
    whyItMatters:
      'For businesses: L2s now viable for enterprise blockchain applications. For engineers: Focus shifts to cross-L2 interoperability.',
    originalLanguage: 'en',
  },
  {
    id: 'web3-002',
    title: 'Zero-Knowledge Proofs Enable Private Smart Contracts on Aztec',
    summary:
      'Aztec Network launches mainnet with fully private DeFi transactions, solving blockchain privacy without sacrificing compliance.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/aztec-launch',
    category: 'web3',
    maturityStage: 'prototype',
    impactScore: 8,
    hypeVolume: 12000,
    publishedAt: daysAgo(9),
    evolutionChainId: 'chain-zk-privacy',
    whyItMatters:
      'For businesses: Compliant privacy for financial applications. For engineers: ZK circuit development becomes critical skill.',
    originalLanguage: 'en',
  },

  // Cybersecurity
  {
    id: 'security-001',
    title: 'Post-Quantum Cryptography Standards Finalized by NIST',
    summary:
      'CRYSTALS-Kyber and CRYSTALS-Dilithium officially standardized, starting the clock on quantum-safe migration.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=xxxxx',
    category: 'cybersecurity',
    maturityStage: 'early-adopter',
    impactScore: 9,
    hypeVolume: 18000,
    publishedAt: daysAgo(7),
    whyItMatters:
      'For businesses: Begin planning cryptographic inventory and migration. For engineers: Learn lattice-based cryptography fundamentals.',
    isAnomaly: false,
    weeklyGrowth: 85,
    originalLanguage: 'en',
  },
  {
    id: 'security-002',
    title: 'AI-Powered Vulnerability Scanner Finds 47 Zero-Days in One Week',
    summary:
      'Startup demonstrates LLM-based code analysis that discovered critical vulnerabilities across major open-source projects.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/ai-security',
    category: 'cybersecurity',
    maturityStage: 'prototype',
    impactScore: 8,
    hypeVolume: 9500,
    publishedAt: daysAgo(11),
    whyItMatters:
      'For businesses: Automated security auditing at scale. For engineers: AI augmentation for security research workflows.',
    originalLanguage: 'en',
  },

  // BioTech
  {
    id: 'biotech-001',
    title: 'AlphaFold 3 Predicts Protein-Drug Interactions with 95% Accuracy',
    summary:
      'DeepMind extends protein folding to molecular docking, potentially cutting drug discovery timelines by years.',
    source: 'arxiv',
    sourceUrl: 'https://arxiv.org/abs/2024.xxxxx',
    category: 'biotech',
    maturityStage: 'research',
    impactScore: 10,
    hypeVolume: 56000,
    publishedAt: daysAgo(10),
    evolutionChainId: 'chain-ai-drug-discovery',
    whyItMatters:
      'For businesses: Pharma R&D costs could drop dramatically. For engineers: Computational biology becomes mainstream tech career.',
    isAnomaly: true,
    weeklyGrowth: 210,
    originalLanguage: 'en',
  },
  {
    id: 'biotech-002',
    title: 'CRISPR Gene Therapy Cures Sickle Cell in 90% of Trial Patients',
    summary:
      'Vertex/CRISPR Therapeutics report long-term follow-up showing sustained remission, FDA approval expected within months.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/crispr-sickle',
    category: 'biotech',
    maturityStage: 'early-adopter',
    impactScore: 9,
    hypeVolume: 42000,
    publishedAt: daysAgo(14),
    evolutionChainId: 'chain-gene-therapy',
    whyItMatters:
      'For businesses: Gene therapy market entering growth phase. For engineers: Bioinformatics and delivery systems are key bottlenecks.',
    originalLanguage: 'en',
  },

  // Space
  {
    id: 'space-001',
    title: 'SpaceX Starship Completes First Orbital Refueling Test',
    summary:
      'Two Starships successfully transfer 100 tons of propellant in orbit, critical milestone for Moon and Mars missions.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=xxxxx',
    category: 'space',
    maturityStage: 'prototype',
    impactScore: 9,
    hypeVolume: 120000,
    publishedAt: daysAgo(2),
    evolutionChainId: 'chain-orbital-infra',
    whyItMatters:
      'For businesses: Space logistics becoming commercially viable. For engineers: Orbital mechanics and cryogenic systems expertise in demand.',
    isAnomaly: true,
    weeklyGrowth: 450,
    originalLanguage: 'en',
  },
  {
    id: 'space-002',
    title: 'Rocket Lab Announces Reusable Neutron with 13-ton Payload',
    summary:
      'Second reusable medium-lift rocket enters market, increasing competition and driving down launch costs further.',
    source: 'techcrunch',
    sourceUrl: 'https://techcrunch.com/2024/neutron-reveal',
    category: 'space',
    maturityStage: 'prototype',
    impactScore: 7,
    hypeVolume: 28000,
    publishedAt: daysAgo(16),
    evolutionChainId: 'chain-reusable-rockets',
    whyItMatters:
      'For businesses: More options for satellite deployment. For engineers: Reusability engineering patterns becoming standardized.',
    originalLanguage: 'en',
  },
]

export const MOCK_EVOLUTION_CHAINS: EvolutionChain[] = [
  {
    id: 'chain-ondevice-ai',
    name: 'On-Device AI',
    description:
      'The evolution from cloud-dependent AI to fully local inference on consumer devices',
    category: 'ai',
    items: ['ai-001', 'ai-002', 'ai-003'],
    currentStage: 'early-adopter',
    trajectory: 'rising',
    createdAt: daysAgo(30),
  },
  {
    id: 'chain-quantum-error',
    name: 'Quantum Error Correction',
    description:
      'Progress toward fault-tolerant quantum computing through error correction breakthroughs',
    category: 'quantum',
    items: ['quantum-001', 'quantum-002'],
    currentStage: 'research',
    trajectory: 'rising',
    createdAt: daysAgo(60),
  },
  {
    id: 'chain-humanoid-labor',
    name: 'Humanoid Labor Automation',
    description: 'General-purpose humanoid robots entering the workforce',
    category: 'robotics',
    items: ['robot-001', 'robot-002'],
    currentStage: 'prototype',
    trajectory: 'rising',
    createdAt: daysAgo(90),
  },
  {
    id: 'chain-fusion-energy',
    name: 'Commercial Fusion',
    description:
      'The race to achieve economically viable fusion power generation',
    category: 'energy',
    items: ['energy-001'],
    currentStage: 'prototype',
    trajectory: 'rising',
    createdAt: daysAgo(120),
  },
  {
    id: 'chain-ai-drug-discovery',
    name: 'AI-Driven Drug Discovery',
    description:
      'Machine learning accelerating pharmaceutical research and development',
    category: 'biotech',
    items: ['biotech-001'],
    currentStage: 'research',
    trajectory: 'rising',
    createdAt: daysAgo(45),
  },
  {
    id: 'chain-orbital-infra',
    name: 'Orbital Infrastructure',
    description:
      'Building the foundation for permanent human presence in space',
    category: 'space',
    items: ['space-001'],
    currentStage: 'prototype',
    trajectory: 'rising',
    createdAt: daysAgo(180),
  },
]

// Aggregate stats for dashboard
export const MOCK_STATS = {
  totalSignals: MOCK_TECH_ITEMS.length,
  anomaliesThisWeek: MOCK_TECH_ITEMS.filter((i) => i.isAnomaly).length,
  activeChains: MOCK_EVOLUTION_CHAINS.length,
  topCategory: 'ai' as const,
  avgImpactScore:
    Math.round(
      (MOCK_TECH_ITEMS.reduce((sum, i) => sum + i.impactScore, 0) /
        MOCK_TECH_ITEMS.length) *
        10,
    ) / 10,
}

// Data for radar chart (time vs impact with hype as bubble size)
export const getRadarData = () => {
  return MOCK_TECH_ITEMS.map((item) => ({
    id: item.id,
    title: item.title.slice(0, 40) + '...',
    x: Math.floor(
      (new Date().getTime() - item.publishedAt.getTime()) /
        (1000 * 60 * 60 * 24),
    ), // days ago
    y: item.impactScore,
    z: Math.log10(item.hypeVolume) * 20, // normalized bubble size
    category: item.category,
    maturity: item.maturityStage,
    isAnomaly: item.isAnomaly,
  }))
}
