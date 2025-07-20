# Internal Model Consciousness Simulator

This project implements a simplified robot control architecture inspired by Winfield & Pitt's work on internal models.
It uses Python and [PyBullet](https://pybullet.org) to create a 2‑D world with obstacles and a ``danger'' area. The agent
maintains:

- A self model describing its position and dynamics.
- An external model describing the locations of obstacles and hazards.
- A learned world model network that predicts future states.

The agent plans actions by rolling out internal simulations with its world model to
avoid harm to simulated ``people'' that might fall into danger. Reinforcement
learning maximizes a reward based on safety outcomes.

## Setup
Install dependencies using `pip`:

```bash
pip install pybullet numpy
```

(Optional) Install a deep learning framework such as `torch` if you wish to
experiment with neural network world models.

## Usage
Run `python sim/train.py` to start a simple training loop. The environment
renders using PyBullet's GUI when available.
