import pybullet as p
import pybullet_data
import numpy as np

class WorldEnv:
    def __init__(self, gui=False):
        self.gui = gui
        if gui:
            p.connect(p.GUI)
        else:
            p.connect(p.DIRECT)
        p.setAdditionalSearchPath(pybullet_data.getDataPath())
        self.reset()

    def reset(self):
        p.resetSimulation()
        p.setGravity(0, 0, -10)
        plane = p.loadURDF("plane.urdf")
        # Create a simple agent as a cylinder
        self.agent = p.loadURDF("sphere2.urdf", basePosition=[0, 0, 0.5])
        # Danger zone: a red box representing a ditch
        self.danger = p.loadURDF("cube.urdf", basePosition=[2, 0, 0.1], globalScaling=1)
        p.changeVisualShape(self.danger, -1, rgbaColor=[1, 0, 0, 1])
        # Some obstacles
        self.obstacles = []
        box = p.loadURDF("cube.urdf", basePosition=[1, 1, 0.1])
        self.obstacles.append(box)
        self.step_ctr = 0
        return self.get_state()

    def get_state(self):
        pos, orn = p.getBasePositionAndOrientation(self.agent)
        return np.array(pos[:2])

    def step(self, action):
        # actions: 0=up,1=down,2=left,3=right
        dx = [0, 0, -0.1, 0.1][action]
        dy = [0.1, -0.1, 0, 0][action]
        pos, _ = p.getBasePositionAndOrientation(self.agent)
        new_pos = [pos[0] + dx, pos[1] + dy, pos[2]]
        p.resetBasePositionAndOrientation(self.agent, new_pos, [0, 0, 0, 1])
        p.stepSimulation()
        self.step_ctr += 1
        done = False
        reward = -0.01
        # Check danger zone proximity
        d_pos, _ = p.getBasePositionAndOrientation(self.danger)
        if np.linalg.norm(np.array(new_pos[:2]) - np.array(d_pos[:2])) < 0.5:
            reward -= 1
        if self.step_ctr > 100:
            done = True
        return self.get_state(), reward, done, {}

    def close(self):
        p.disconnect()
