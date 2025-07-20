import random
from internal_model_simulator.environment import GridWorld
from internal_model_simulator.agent import Agent


def run_episode(env: GridWorld, agent: Agent, train: bool = True):
    state = env.reset()
    total_reward = 0.0
    done = False
    while not done:
        action = agent.choose_action(state)
        result = env.step(action)
        if train:
            agent.update_q(state, action, result.reward, result.state)
            agent.remember(state, action, result.state)
            agent.train_model()
        state = result.state
        total_reward += result.reward
    return total_reward


def main(episodes=100):
    env = GridWorld()
    agent = Agent(state_dim=4, action_dim=5)
    for ep in range(episodes):
        reward = run_episode(env, agent, train=True)
        if (ep + 1) % 10 == 0:
            print(f"Episode {ep+1}: reward={reward:.2f}")

    # Test the learned policy
    test_reward = run_episode(env, agent, train=False)
    print(f"Test reward: {test_reward:.2f}")
    env.render()

if __name__ == "__main__":
    main()
