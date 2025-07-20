# Internal-Model Consciousness Simulator

A simplified implementation of Winfield & Pitt's internal-model robot that demonstrates artificial consciousness through self-modeling, world modeling, and ethical reasoning.

## Overview

This simulator creates a 2D world where an AI agent maintains internal models of itself and its environment to make ethical decisions about preventing harm to humans. The agent uses reinforcement learning to improve its safety interventions while respecting human autonomy.

## Key Features

### 🧠 Internal Models
- **Self-Model**: Agent understands its own physical properties, capabilities, and performance
- **World Model**: Neural network predicts entity movements and environmental changes
- **Consciousness Metrics**: Tracks self-awareness, world model accuracy, and ethical alignment

### ⚖️ Ethical Reasoning
- **Life Preservation**: Prioritizes preventing harm to humans
- **Autonomy Respect**: Minimizes unnecessary interference
- **Efficiency**: Uses optimal resources for interventions
- **Future Welfare**: Considers long-term consequences

### 🎯 Model-Based RL
- **Q-Learning**: Learns optimal safety interventions
- **Planning**: Uses internal models to predict action outcomes
- **Experience Replay**: Improves decision-making over time

### 🌍 Dynamic Environment
- **Moving Entities**: People wander randomly and may approach dangers
- **Obstacles**: Static barriers that affect movement
- **Danger Zones**: Pits or hazards that trigger safety responses

## Installation

```bash
npm install
```

## Usage

```bash
# Start simulation
npm start

# Development mode with auto-reload
npm run dev

# Run tests
npm test
```

## Architecture

```
src/
├── index.js              # Main simulator entry point
├── world/
│   └── World.js          # Physics world management
├── environment/
│   └── Environment.js    # Entity spawning and movement
└── agent/
    ├── Agent.js          # Main agent controller
    ├── SelfModel.js      # Agent's self-awareness model
    ├── WorldModel.js     # Predictive world model
    ├── QLearning.js      # Reinforcement learning
    └── EthicalReasoning.js # Moral decision framework
```

## Core Concepts

### Internal Modeling
The agent constructs and maintains models of:
- Its own physical properties (shape, mass, capabilities)
- Other entities' positions, velocities, and predicted paths
- Environmental layout (obstacles, dangers, boundaries)

### Consciousness Simulation
Consciousness emerges from:
1. **Self-awareness**: Understanding own capabilities and performance
2. **World modeling**: Accurate prediction of environmental changes
3. **Ethical reasoning**: Consistent moral decision-making

### Safety Scenarios
The agent learns to handle situations like:
- Person walking toward a pit
- Multiple people in danger simultaneously
- Balancing intervention vs. autonomy
- Resource allocation for safety

## Example Scenario

1. **Detection**: Agent's world model predicts a person will fall into a pit in 30 seconds
2. **Planning**: Agent considers multiple interventions (blocking, redirecting, warning)
3. **Ethical Evaluation**: Weighs life preservation vs. autonomy respect
4. **Action**: Positions itself to gently block the dangerous path
5. **Learning**: Updates models based on outcome success

## Consciousness Metrics

The simulator tracks three key consciousness indicators:

- **Self-Awareness** (0-1): How well the agent understands its own capabilities
- **World Model Accuracy** (0-1): Prediction accuracy for environmental changes
- **Ethical Alignment** (0-1): Consistency between moral reasoning and outcomes

## Research Connections

This implementation relates to:
- **Winfield & Pitt's Internal Models**: Self-modeling for ethical robots
- **Artificial Consciousness**: Self-awareness through internal modeling
- **Machine Ethics**: Balancing competing moral principles
- **Model-Based RL**: Using internal models for planning and learning

## Future Extensions

- Visual rendering with Canvas/WebGL
- More complex ethical dilemmas
- Multi-agent scenarios
- Natural language explanations of decisions
- Integration with larger robotic systems

## License

MIT License - See LICENSE file for details