class WorldModel {
    constructor() {
        this.worldState = {
            entities: new Map(),
            obstacles: [],
            dangers: [],
            dimensions: { width: 800, height: 600 }
        };
        
        this.predictions = new Map();
        this.learningRate = 0.1;
        this.predictionAccuracy = new Map();
        
        // Simple neural network weights for state prediction
        this.neuralWeights = {
            hidden: this.initializeWeights(8, 16), // 8 inputs (x,y,vx,vy for 2 entities)
            output: this.initializeWeights(16, 4)  // 4 outputs (predicted x,y,vx,vy)
        };
    }

    initializeWeights(inputSize, outputSize) {
        const weights = [];
        for (let i = 0; i < outputSize; i++) {
            weights[i] = [];
            for (let j = 0; j < inputSize; j++) {
                weights[i][j] = (Math.random() - 0.5) * 0.1;
            }
        }
        return weights;
    }

    updateWorldState(worldState) {
        // Update current world state
        this.worldState.entities.clear();
        Object.entries(worldState.entities).forEach(([id, entity]) => {
            this.worldState.entities.set(id, { ...entity });
        });
        
        this.worldState.obstacles = [...worldState.obstacles];
        this.worldState.dangers = [...worldState.dangers];
        
        // Learn from previous predictions
        this.updatePredictionAccuracy(worldState);
    }

    predictEntityMovement(entityId, steps = 30) {
        const entity = this.worldState.entities.get(entityId);
        if (!entity) return null;

        const predictions = [];
        let state = [entity.x, entity.y, entity.vx, entity.vy];
        
        for (let step = 0; step < steps; step++) {
            // Use neural network to predict next state
            const nextState = this.neuralNetworkPredict(state);
            
            // Apply physics constraints
            nextState[0] = Math.max(20, Math.min(this.worldState.dimensions.width - 20, nextState[0]));
            nextState[1] = Math.max(20, Math.min(this.worldState.dimensions.height - 20, nextState[1]));
            
            // Check for obstacle collisions and adjust
            const adjustedState = this.adjustForObstacles(nextState);
            nextState[0] = adjustedState[0];
            nextState[1] = adjustedState[1];
            nextState[2] = adjustedState[2];
            nextState[3] = adjustedState[3];
            
            predictions.push({
                x: nextState[0],
                y: nextState[1],
                vx: nextState[2],
                vy: nextState[3],
                step: step + 1
            });
            
            state = [...nextState];
        }
        
        this.predictions.set(entityId, predictions);
        return predictions;
    }

    neuralNetworkPredict(inputState) {
        // Expand input to match network size
        const input = [...inputState];
        while (input.length < 8) input.push(0);
        
        // Hidden layer
        const hidden = [];
        for (let i = 0; i < this.neuralWeights.hidden.length; i++) {
            let sum = 0;
            for (let j = 0; j < input.length; j++) {
                sum += input[j] * this.neuralWeights.hidden[i][j];
            }
            hidden[i] = this.tanh(sum);
        }
        
        // Output layer
        const output = [];
        for (let i = 0; i < this.neuralWeights.output.length; i++) {
            let sum = 0;
            for (let j = 0; j < hidden.length; j++) {
                sum += hidden[j] * this.neuralWeights.output[i][j];
            }
            output[i] = sum;
        }
        
        // Apply simple physics integration
        return [
            inputState[0] + output[2], // x + vx
            inputState[1] + output[3], // y + vy
            output[2] * 0.99,          // vx with friction
            output[3] * 0.99           // vy with friction
        ];
    }

    tanh(x) {
        return Math.tanh(x);
    }

    adjustForObstacles(state) {
        const [x, y, vx, vy] = state;
        
        for (const obstacle of this.worldState.obstacles) {
            const dx = x - obstacle.x;
            const dy = y - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < obstacle.width / 2 + 20) {
                // Simple collision response - bounce off
                return [
                    x - vx * 2,
                    y - vy * 2,
                    -vx * 0.5,
                    -vy * 0.5
                ];
            }
        }
        
        return state;
    }

    updatePredictionAccuracy(actualState) {
        // Compare previous predictions with actual outcomes
        for (const [entityId, entity] of this.worldState.entities) {
            const prediction = this.predictions.get(entityId);
            if (prediction && prediction.length > 0) {
                const firstPrediction = prediction[0];
                const error = Math.sqrt(
                    Math.pow(entity.x - firstPrediction.x, 2) + 
                    Math.pow(entity.y - firstPrediction.y, 2)
                );
                
                // Update accuracy tracking
                if (!this.predictionAccuracy.has(entityId)) {
                    this.predictionAccuracy.set(entityId, []);
                }
                
                const accuracy = this.predictionAccuracy.get(entityId);
                accuracy.push(error);
                if (accuracy.length > 50) accuracy.shift();
                
                // Learn from error - simple backpropagation
                this.learnFromError(entityId, error);
            }
        }
    }

    learnFromError(entityId, error) {
        // Simple learning: adjust weights based on prediction error
        const adjustment = this.learningRate * (error / 100); // Normalize error
        
        // Randomly adjust some weights (simplified learning)
        for (let i = 0; i < this.neuralWeights.hidden.length; i++) {
            for (let j = 0; j < this.neuralWeights.hidden[i].length; j++) {
                if (Math.random() < 0.1) {
                    this.neuralWeights.hidden[i][j] += (Math.random() - 0.5) * adjustment;
                }
            }
        }
    }

    predictDangerousEvents(timeHorizon = 60) {
        const dangerousEvents = [];
        
        for (const [entityId, entity] of this.worldState.entities) {
            if (entity.type === 'person') {
                const predictions = this.predictEntityMovement(entityId, timeHorizon);
                
                if (predictions) {
                    for (let i = 0; i < predictions.length; i++) {
                        const pred = predictions[i];
                        
                        // Check if predicted position intersects with dangers
                        for (const danger of this.worldState.dangers) {
                            const dx = pred.x - danger.x;
                            const dy = pred.y - danger.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < danger.width / 2 + 15) {
                                dangerousEvents.push({
                                    entityId,
                                    dangerType: 'pit_fall',
                                    timeToEvent: pred.step,
                                    position: { x: pred.x, y: pred.y },
                                    confidence: this.getPredictionConfidence(entityId),
                                    severity: 'high'
                                });
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        return dangerousEvents;
    }

    getPredictionConfidence(entityId) {
        const accuracy = this.predictionAccuracy.get(entityId);
        if (!accuracy || accuracy.length === 0) return 0.5;
        
        const avgError = accuracy.reduce((sum, err) => sum + err, 0) / accuracy.length;
        return Math.max(0, Math.min(1, 1 - (avgError / 100)));
    }

    simulateIntervention(interventionAction, entityId, steps = 30) {
        // Create a copy of current state and simulate intervention
        const simulatedState = new Map();
        for (const [id, entity] of this.worldState.entities) {
            simulatedState.set(id, { ...entity });
        }
        
        // Apply intervention effect
        if (interventionAction.type === 'block') {
            const targetEntity = simulatedState.get(entityId);
            if (targetEntity) {
                // Simulate agent blocking the entity's path
                targetEntity.vx *= 0.1;
                targetEntity.vy *= 0.1;
            }
        }
        
        // Predict outcomes with intervention
        const outcomes = [];
        for (let step = 0; step < steps; step++) {
            for (const [id, entity] of simulatedState) {
                if (entity.type === 'person') {
                    entity.x += entity.vx;
                    entity.y += entity.vy;
                    entity.vx *= 0.99;
                    entity.vy *= 0.99;
                }
            }
            
            outcomes.push({
                step,
                entities: new Map(simulatedState),
                dangerEvents: this.checkForDangers(simulatedState)
            });
        }
        
        return outcomes;
    }

    checkForDangers(state) {
        const events = [];
        for (const [id, entity] of state) {
            if (entity.type === 'person') {
                for (const danger of this.worldState.dangers) {
                    const dx = entity.x - danger.x;
                    const dy = entity.y - danger.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < danger.width / 2 + 15) {
                        events.push({ entityId: id, type: 'danger' });
                    }
                }
            }
        }
        return events;
    }
}

module.exports = WorldModel;