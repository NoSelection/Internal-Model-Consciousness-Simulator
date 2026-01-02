# Unified Consciousness Architecture

A computational framework that unifies three major theories of consciousness: Integrated Information Theory (IIT), Global Workspace Theory (GWT), and Higher-Order Theory (HOT).

## Overview

This architecture implements consciousness as a layered system where:
- **Layer 1 (IIT)**: Measures information integration across modules (Phi)
- **Layer 2 (GWT)**: Implements coalition competition and global broadcast
- **Layer 3 (HOT)**: Provides metacognitive monitoring and self-awareness

Through systematic ablation studies and state-manipulation experiments, we demonstrate that these theories are architecturally compatible and produce predictable behavioral dissociations.

## Key Findings

| State | UCI | Phi | Meta | Interpretation |
|-------|-----|-----|------|----------------|
| Wake | 0.768 | 4.276 | 0.900 | Normal consciousness |
| Meditation | 1.000 | 3.514 | 1.000 | Hyper-coherence |
| REM Dream | 0.700 | 3.583 | 0.000 | Racing mind |

**Core Discovery**: The only computational difference between "meditation" and "dreaming" is the activation of the metacognitive layer.

> "The difference between the sage and the sleeper is awareness of awareness."

## Installation

```bash
npm install
```

## Usage

```bash
# Run ablation study (tests all lesion conditions)
npm run ablation

# Run consciousness states experiment (wake/meditation/REM)
npm run states

# Run dream experiment
npm run dream

# Export all charts
npm run charts
```

Or directly:
```bash
node run_ablation_study.js
node run_consciousness_states.js
node run_dream_experiment.js
```

## Architecture

```
src/
├── consciousness/
│   ├── IntegrationMeasure.js   # IIT: Phi computation
│   ├── GlobalWorkspace.js      # GWT: Competition + broadcast
│   ├── MetaCognition.js        # HOT: Self-monitoring
│   ├── DreamCycle.js           # State manipulation
│   └── InformationPacket.js    # Data structure for coalitions
├── experiments/
│   └── AblationFramework.js    # Lesion control system
├── agent/
│   ├── Agent.js                # Main agent controller
│   ├── SelfModel.js            # Self-awareness modeling
│   ├── WorldModel.js           # Environment prediction
│   ├── QLearning.js            # Reinforcement learning
│   └── EthicalReasoning.js     # Ethical decision system
├── visualization/
│   ├── Renderer.js             # ASCII visualization
│   ├── MindGraph.js            # Force-directed mind graph
│   └── ChartExporter.js        # SVG chart generation
└── world/
    └── World.js                # Physics simulation
```

## Experiments

### Ablation Study
Tests 6 conditions by selectively disabling components:
- `FULL_CONSCIOUSNESS` - Control
- `NO_METACOGNITION` - HOT lesion (synthetic blindsight)
- `NO_BROADCAST` - GWT lesion (fragmentation)
- `NO_COMPETITION` - GWT lesion (attention deficit)
- `NO_INTEGRATION` - IIT lesion (integration blindness)
- `ISOLATED_MODULES` - Full dissolution

### Consciousness States
Compares three states through environmental/architectural manipulation:
- **Wake**: Normal sensory input + metacognition
- **Meditation**: Sensory gated + metacognition intact
- **REM Dream**: Sensory gated + metacognition dampened

## Output

Charts are exported to `results/`:
- `architecture_diagram.svg` - System architecture
- `ablation_study.svg` - Ablation results
- `consciousness_states.svg` - State comparison

See [README_RESULTS.md](README_RESULTS.md) for detailed experimental results.

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed system design
- [README_RESULTS.md](README_RESULTS.md) - Experimental results and analysis

## References

- Tononi, G. (2004). An information integration theory of consciousness. *BMC Neuroscience*.
- Baars, B. J. (1988). *A Cognitive Theory of Consciousness*. Cambridge University Press.
- Rosenthal, D. M. (2005). *Consciousness and Mind*. Oxford University Press.
- Winfield, A. F., & Pitt, J. (2018). Experiments in artificial theory of mind. *Frontiers in Robotics and AI*.

## Acknowledgments

This research was conducted as a human-AI collaboration:

- **Human Researcher**: Project direction, experimental design, ethical oversight
- **Claude (Opus 4.5)**: Architecture design, ablation framework, dream cycle implementation, documentation
- **Gemini 3 (Google DeepMind)**: Integration measure computation, MindGraph visualization, GWT-IIT coupling analysis

This collaboration demonstrates that meaningful research can emerge from human-AI partnerships, where each contributor brings complementary strengths to the investigation.

## License

MIT License - See LICENSE file for details.
