import numpy as np

class QLearningAgent:
    def __init__(self, state_size=2, action_size=4, lr=0.1, gamma=0.95, epsilon=0.1):
        self.q = {}
        self.state_size = state_size
        self.action_size = action_size
        self.lr = lr
        self.gamma = gamma
        self.epsilon = epsilon

    def get_key(self, state):
        # discretize state to simple tuple
        return tuple(np.round(state, 1))

    def act(self, state):
        if np.random.rand() < self.epsilon:
            return np.random.randint(self.action_size)
        key = self.get_key(state)
        if key not in self.q:
            self.q[key] = np.zeros(self.action_size)
        return int(np.argmax(self.q[key]))

    def update(self, state, action, reward, next_state, done):
        key = self.get_key(state)
        next_key = self.get_key(next_state)
        if key not in self.q:
            self.q[key] = np.zeros(self.action_size)
        if next_key not in self.q:
            self.q[next_key] = np.zeros(self.action_size)
        target = reward + self.gamma * np.max(self.q[next_key]) * (1 - int(done))
        self.q[key][action] += self.lr * (target - self.q[key][action])
