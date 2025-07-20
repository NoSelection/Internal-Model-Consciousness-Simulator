# Internal Model Consciousness Simulator

This project implements a very small demonstration of an "internal-model" agent inspired by Winfield & Pitt's work. The environment is a simple 2-D grid world containing:

- A robot agent
- A moving person
- A fixed ditch representing danger

The agent attempts to keep the person away from the ditch. It learns a world model that predicts state transitions and uses a Q-learning approach with model updates.

## Usage

Run training and a short test:

```bash
python3 main.py
```

Dependencies are minimal and listed in `requirements.txt`.
