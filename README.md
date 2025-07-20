# Internal-Model Consciousness Simulator

An educational implementation exploring Winfield & Pitt's internal-model approach to machine consciousness, focused on ethical decision-making and AI safety research.

## Overview

This Node.js simulator implements key concepts from consciousness research, creating an agent that maintains internal models of itself and its environment to make ethical safety decisions. The project serves as a research tool for studying machine consciousness, ethical reasoning, and model-based reinforcement learning in AI safety contexts.

**Research Focus**: Understanding how internal modeling contributes to machine consciousness and ethical behavior in artificial agents.

## Implementation Components

### Internal Modeling System
- **Self-Model**: Agent tracks its physical properties, capabilities, and performance history
- **World Model**: Simple neural network predicts entity movements and environmental state changes
- **Consciousness Metrics**: Quantifies self-awareness, prediction accuracy, and ethical consistency

### Ethical Decision Framework
- **Multi-Principle Reasoning**: Balances life preservation, autonomy respect, efficiency, and future welfare
- **Ethical Evaluation**: Scores potential actions against competing moral principles
- **Justification System**: Provides reasoning for ethical decisions

### Learning and Adaptation
- **Q-Learning Implementation**: Reinforcement learning for safety intervention strategies
- **Model-Based Planning**: Uses internal models to predict action outcomes
- **Experience Storage**: Maintains history for learning and self-reflection

### Simulation Environment
- **2D Physics World**: Matter.js-based environment with entities, obstacles, and hazards
- **Dynamic Scenarios**: Randomized movement patterns create emergent safety situations
- **Visual Interface**: ASCII-based real-time visualization of agent behavior

## Installation

```bash
npm install
```

## Usage

```bash
# Start basic simulation (headless)
npm start

# Run visual simulation with ASCII interface
npm run visual

# Interactive mode with real-time commands
npm run visual-interactive

# Load a pre-trained consciousness model
npm run load <model-filename>

# List available saved models
npm run list-models
```

### Interactive Commands
In interactive mode, use these commands:
- `status` - View current consciousness metrics
- `models` - List saved consciousness states
- `danger` - Create a test danger scenario
- `save` - Save current consciousness state
- `quit` - Exit simulation

## Architecture

```
src/
├── index.js                    # Main simulator entry point
├── world/
│   └── World.js               # Physics world and entity management
├── environment/
│   └── Environment.js         # Dynamic entity behavior and scenarios
├── agent/
│   ├── Agent.js              # Main agent controller and consciousness loop
│   ├── SelfModel.js          # Self-awareness and capability modeling
│   ├── WorldModel.js         # Predictive neural network for environment
│   ├── QLearning.js          # Reinforcement learning implementation
│   └── EthicalReasoning.js   # Multi-principle ethical decision system
├── visualization/
│   └── Renderer.js           # ASCII visualization and state logging
└── persistence/
    └── ModelManager.js       # Save/load consciousness states
```

## Research Implementation

### Internal Modeling Approach
Based on Winfield & Pitt's work, the agent maintains computational models of:
- **Physical Self**: Properties, capabilities, and performance limitations
- **Environmental State**: Entity positions, velocities, and predicted trajectories  
- **Action Outcomes**: Consequences of different intervention strategies

### Consciousness Framework
The simulation implements consciousness as emerging from:
1. **Self-Monitoring**: Tracking internal states and capabilities
2. **Predictive Modeling**: Anticipating environmental changes
3. **Ethical Evaluation**: Reasoning about moral implications of actions

### Experimental Scenarios
The system generates situations requiring ethical reasoning:
- Potential harm prevention (entities approaching dangers)
- Autonomy vs. safety trade-offs (intervention necessity)
- Resource allocation (multiple simultaneous risks)
- Learning from intervention outcomes

## Example Decision Process

1. **Environmental Monitoring**: World model predicts entity trajectory toward hazard
2. **Capability Assessment**: Self-model evaluates intervention possibilities
3. **Ethical Analysis**: Multi-principle framework weighs intervention options
4. **Action Selection**: Q-learning chooses optimal safety strategy
5. **Outcome Learning**: Experience updates both predictive and ethical models

## Measurement Metrics

The system quantifies consciousness development through:

- **Self-Awareness** (0-1): Accuracy of self-capability modeling
- **Predictive Accuracy** (0-1): Environmental model prediction quality  
- **Ethical Consistency** (0-1): Alignment between moral reasoning and outcomes
- **Learning Progress**: Q-value convergence and exploration/exploitation balance

## Academic Context

This implementation explores concepts from:
- **Winfield & Pitt (2014)**: "Transparent Ethical Behaviour in Autonomous Robots"
- **Machine Consciousness Research**: Internal modeling approaches to artificial consciousness
- **AI Safety**: Ethical reasoning frameworks for autonomous systems
- **Model-Based Reinforcement Learning**: Planning with learned environment models

## Educational Applications

- **Consciousness Studies**: Hands-on exploration of machine consciousness theories
- **AI Ethics**: Practical implementation of multi-principle ethical reasoning
- **Reinforcement Learning**: Model-based approaches with ethical constraints
- **Robotics**: Safety-oriented autonomous agent architectures

## Research Extensions

Potential areas for academic investigation:
- Multi-agent ethical interactions and consensus
- Natural language justification generation
- Integration with physical robotic platforms
- Comparative analysis of different consciousness metrics
- Scalability to more complex ethical scenarios

## License

MIT License - See LICENSE file for details