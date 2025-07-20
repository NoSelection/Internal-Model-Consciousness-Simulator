import random
from collections import deque
from typing import Deque, List, Tuple
import torch
import torch.nn.functional as F

from .world_model import WorldModel


class Agent:
    def __init__(self, state_dim: int, action_dim: int, device=None):
        self.action_dim = action_dim
        self.q_table = {}
        self.model = WorldModel(state_dim, action_dim)
        self.memory: Deque[Tuple[Tuple[int, int, int, int], int, Tuple[int, int, int, int]]] = deque(maxlen=10000)
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=1e-3)

    def _state_key(self, state):
        return tuple(state)

    def choose_action(self, state, epsilon=0.1):
        if random.random() < epsilon:
            return random.randrange(self.action_dim)
        key = self._state_key(state)
        q_values = self.q_table.get(key)
        if q_values is None:
            return random.randrange(self.action_dim)
        return int(max(range(self.action_dim), key=lambda a: q_values[a]))

    def update_q(self, state, action, reward, next_state, alpha=0.1, gamma=0.95):
        key = self._state_key(state)
        next_key = self._state_key(next_state)
        if key not in self.q_table:
            self.q_table[key] = [0.0] * self.action_dim
        if next_key not in self.q_table:
            self.q_table[next_key] = [0.0] * self.action_dim
        max_next = max(self.q_table[next_key])
        old = self.q_table[key][action]
        self.q_table[key][action] = old + alpha * (reward + gamma * max_next - old)

    def remember(self, state, action, next_state):
        self.memory.append((state, action, next_state))

    def train_model(self, batch_size=32, epochs=1):
        if len(self.memory) < batch_size:
            return
        batch = random.sample(self.memory, batch_size)
        states = torch.tensor([b[0] for b in batch], dtype=torch.float32, device=self.device)
        actions = torch.tensor([b[1] for b in batch], dtype=torch.long, device=self.device)
        next_states = torch.tensor([b[2] for b in batch], dtype=torch.float32, device=self.device)
        action_onehot = F.one_hot(actions, num_classes=self.action_dim).float()
        pred_next = self.model(states, action_onehot)
        loss = F.mse_loss(pred_next, next_states)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

    def predict_next_state(self, state, action):
        self.model.eval()
        with torch.no_grad():
            s = torch.tensor([state], dtype=torch.float32, device=self.device)
            a = F.one_hot(torch.tensor([action], device=self.device), num_classes=self.action_dim).float()
            pred = self.model(s, a)
            return tuple(pred[0].cpu().numpy())
