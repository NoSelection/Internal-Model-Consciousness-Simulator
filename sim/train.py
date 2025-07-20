import time
import numpy as np
from environment import WorldEnv
from agent import QLearningAgent
from world_model import LinearWorldModel


def train(episodes=10, gui=False):
    env = WorldEnv(gui=gui)
    agent = QLearningAgent()
    model = LinearWorldModel()
    rewards = []

    for ep in range(episodes):
        state = env.reset()
        ep_reward = 0
        done = False
        while not done:
            action = agent.act(state)
            next_state, reward, done, _ = env.step(action)
            agent.update(state, action, reward, next_state, done)
            model.update(state, action, next_state)
            state = next_state
            ep_reward += reward
            if gui:
                time.sleep(0.01)
        rewards.append(ep_reward)
        print(f"Episode {ep+1}: reward={ep_reward:.2f}")
    env.close()
    return rewards


if __name__ == "__main__":
    train(episodes=5, gui=False)
