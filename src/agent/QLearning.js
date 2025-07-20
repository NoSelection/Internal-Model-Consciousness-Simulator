class QLearning {
    constructor(stateSize = 64, actionSize = 5) {
        this.stateSize = stateSize;
        this.actionSize = actionSize;
        this.learningRate = 0.1;
        this.discountFactor = 0.95;
        this.explorationRate = 1.0;
        this.explorationDecay = 0.995;
        this.minExplorationRate = 0.01;
        
        // Q-table: state -> action values
        this.qTable = new Map();
        
        // Action space
        this.actions = [
            { type: 'move', direction: 'north' },
            { type: 'move', direction: 'south' },
            { type: 'move', direction: 'east' },
            { type: 'move', direction: 'west' },
            { type: 'block', direction: 'stay' }
        ];
        
        this.experienceBuffer = [];
        this.maxExperiences = 10000;
    }

    discretizeState(continuousState) {
        // Convert continuous world state to discrete state representation
        const {
            agentX, agentY,
            nearestPersonX, nearestPersonY,
            nearestPersonVX, nearestPersonVY,
            nearestDangerX, nearestDangerY
        } = continuousState;
        
        // Discretize positions into grid cells
        const gridSize = 50;
        const agentGridX = Math.floor(agentX / gridSize);
        const agentGridY = Math.floor(agentY / gridSize);
        const personGridX = Math.floor(nearestPersonX / gridSize);
        const personGridY = Math.floor(nearestPersonY / gridSize);
        
        // Discretize velocities
        const velScale = 10;
        const personVelX = Math.floor((nearestPersonVX + 5) * velScale);
        const personVelY = Math.floor((nearestPersonVY + 5) * velScale);
        
        // Create state hash
        return `${agentGridX},${agentGridY},${personGridX},${personGridY},${personVelX},${personVelY}`;
    }

    getQValues(state) {
        const stateKey = this.discretizeState(state);
        if (!this.qTable.has(stateKey)) {
            // Initialize Q-values for new state
            const qValues = new Array(this.actionSize).fill(0);
            this.qTable.set(stateKey, qValues);
        }
        return this.qTable.get(stateKey);
    }

    selectAction(state) {
        // Epsilon-greedy action selection
        if (Math.random() < this.explorationRate) {
            // Explore: random action
            return Math.floor(Math.random() * this.actionSize);
        } else {
            // Exploit: best known action
            const qValues = this.getQValues(state);
            let bestAction = 0;
            let bestValue = qValues[0];
            
            for (let i = 1; i < qValues.length; i++) {
                if (qValues[i] > bestValue) {
                    bestValue = qValues[i];
                    bestAction = i;
                }
            }
            
            return bestAction;
        }
    }

    updateQValue(state, action, reward, nextState) {
        const stateKey = this.discretizeState(state);
        const nextStateKey = this.discretizeState(nextState);
        
        const currentQValues = this.getQValues(state);
        const nextQValues = this.getQValues(nextState);
        
        // Find max Q-value for next state
        const maxNextQ = Math.max(...nextQValues);
        
        // Q-learning update rule
        const currentQ = currentQValues[action];
        const newQ = currentQ + this.learningRate * (
            reward + this.discountFactor * maxNextQ - currentQ
        );
        
        currentQValues[action] = newQ;
        
        // Store experience for replay
        this.addExperience({
            state: stateKey,
            action,
            reward,
            nextState: nextStateKey,
            done: false
        });
        
        // Decay exploration rate
        this.explorationRate = Math.max(
            this.minExplorationRate,
            this.explorationRate * this.explorationDecay
        );
    }

    addExperience(experience) {
        this.experienceBuffer.push(experience);
        if (this.experienceBuffer.length > this.maxExperiences) {
            this.experienceBuffer.shift();
        }
    }

    replayExperiences(batchSize = 32) {
        if (this.experienceBuffer.length < batchSize) return;
        
        // Sample random batch
        const batch = [];
        for (let i = 0; i < batchSize; i++) {
            const randomIndex = Math.floor(Math.random() * this.experienceBuffer.length);
            batch.push(this.experienceBuffer[randomIndex]);
        }
        
        // Replay experiences
        batch.forEach(experience => {
            const { state, action, reward, nextState } = experience;
            
            if (!this.qTable.has(state)) {
                this.qTable.set(state, new Array(this.actionSize).fill(0));
            }
            if (!this.qTable.has(nextState)) {
                this.qTable.set(nextState, new Array(this.actionSize).fill(0));
            }
            
            const currentQValues = this.qTable.get(state);
            const nextQValues = this.qTable.get(nextState);
            const maxNextQ = Math.max(...nextQValues);
            
            const currentQ = currentQValues[action];
            const newQ = currentQ + this.learningRate * (
                reward + this.discountFactor * maxNextQ - currentQ
            );
            
            currentQValues[action] = newQ;
        });
    }

    getActionFromIndex(actionIndex) {
        return this.actions[actionIndex] || this.actions[0];
    }

    // Save/load Q-table for persistence
    saveQTable() {
        const data = {};
        for (const [state, qValues] of this.qTable) {
            data[state] = qValues;
        }
        return JSON.stringify(data);
    }

    loadQTable(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.qTable.clear();
            for (const [state, qValues] of Object.entries(data)) {
                this.qTable.set(state, qValues);
            }
        } catch (error) {
            console.error('Error loading Q-table:', error);
        }
    }

    getStats() {
        return {
            statesExplored: this.qTable.size,
            experiencesStored: this.experienceBuffer.length,
            explorationRate: this.explorationRate,
            averageQValue: this.getAverageQValue()
        };
    }

    getAverageQValue() {
        if (this.qTable.size === 0) return 0;
        
        let totalQ = 0;
        let count = 0;
        
        for (const qValues of this.qTable.values()) {
            for (const q of qValues) {
                totalQ += q;
                count++;
            }
        }
        
        return count > 0 ? totalQ / count : 0;
    }
}

module.exports = QLearning;