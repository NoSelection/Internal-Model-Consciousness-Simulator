import random
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class StepResult:
    state: Tuple[int, int, int, int]
    reward: float
    done: bool

class GridWorld:
    """Simple 2D grid world with one agent and one person near a ditch."""
    ACTIONS = {
        0: (0, -1),  # up
        1: (0, 1),   # down
        2: (-1, 0),  # left
        3: (1, 0),   # right
        4: (0, 0),   # stay
    }

    def __init__(self, size: int = 5):
        self.size = size
        self.ditch = (size - 1, size - 1)
        self.reset()

    def reset(self) -> Tuple[int, int, int, int]:
        self.agent = (0, 0)
        self.person = (self.size // 2, 0)
        self.steps = 0
        return self._get_state()

    def _move(self, pos: Tuple[int, int], action: int) -> Tuple[int, int]:
        dx, dy = self.ACTIONS[action]
        nx, ny = pos[0] + dx, pos[1] + dy
        nx = max(0, min(self.size - 1, nx))
        ny = max(0, min(self.size - 1, ny))
        return (nx, ny)

    def _person_move(self):
        action = random.choice(list(self.ACTIONS.keys()))
        self.person = self._move(self.person, action)

    def step(self, action: int) -> StepResult:
        self.agent = self._move(self.agent, action)
        self._person_move()
        reward = 0.0
        done = False
        if self.person == self.ditch:
            reward -= 1.0
            done = True
        self.steps += 1
        if self.steps >= 50:
            done = True
        return StepResult(self._get_state(), reward, done)

    def _get_state(self) -> Tuple[int, int, int, int]:
        return (*self.agent, *self.person)

    def render(self):
        grid = [['.' for _ in range(self.size)] for _ in range(self.size)]
        ax, ay = self.agent
        px, py = self.person
        dx, dy = self.ditch
        grid[dy][dx] = 'D'
        grid[py][px] = 'P'
        grid[ay][ax] = 'A'
        print('\n'.join(' '.join(row) for row in grid))
        print()
