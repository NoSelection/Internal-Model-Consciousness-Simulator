import numpy as np

class LinearWorldModel:
    """A minimal world model predicting next state as a linear function."""
    def __init__(self, state_size=2, action_size=4, lr=0.01):
        self.W = np.zeros((action_size, state_size))
        self.lr = lr

    def predict(self, state, action):
        return state + self.W[action]

    def update(self, state, action, next_state):
        pred = self.predict(state, action)
        error = next_state - pred
        self.W[action] += self.lr * error
