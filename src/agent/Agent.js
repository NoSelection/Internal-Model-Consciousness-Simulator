const { Bodies, Body } = require('matter-js');
const SelfModel = require('./SelfModel');
const WorldModel = require('./WorldModel');
const QLearning = require('./QLearning');
const EthicalReasoning = require('./EthicalReasoning');

class Agent {
    constructor(world, environment) {
        this.world = world;
        this.environment = environment;
        this.body = null;
        
        // Internal models
        this.selfModel = new SelfModel();
        this.worldModel = new WorldModel();
        this.qLearning = new QLearning();
        this.ethicalReasoning = new EthicalReasoning();
        
        // State tracking
        this.currentAction = null;
        this.previousState = null;
        this.actionHistory = [];
        this.consciousness = {
            selfAwareness: 0,
            worldModelAccuracy: 0,
            ethicalAlignment: 0
        };
        
        this.stepCount = 0;
    }

    spawn(position) {
        this.body = Bodies.circle(position.x, position.y, this.selfModel.physicalProperties.radius, {
            render: { fillStyle: '#FF851B' },
            frictionAir: 0.01
        });
        
        this.world.addEntity('agent', this.body, 'agent');
        this.selfModel.updateState(position, { x: 0, y: 0 });
    }

    updateInternalModel() {
        // Update self-model with current physical state
        this.selfModel.updateState(
            this.body.position,
            this.body.velocity
        );
        
        // Update world model with current world state
        const worldState = this.world.getState();
        this.worldModel.updateWorldState(worldState);
        
        // Update consciousness metrics
        this.updateConsciousness();
    }

    planActions() {
        if (!this.body) return;
        
        this.stepCount++;
        
        // Get current state for decision making
        const currentState = this.getCurrentState();
        
        // Predict dangerous events using world model
        const dangerousPredictions = this.worldModel.predictDangerousEvents(60);
        
        // Generate possible actions
        const possibleActions = this.generatePossibleActions(currentState, dangerousPredictions);
        
        // Evaluate actions ethically and practically
        const evaluatedActions = possibleActions.map(action => {
            const ethicalEval = this.ethicalReasoning.evaluateAction(
                action, currentState, { dangerousEvents: dangerousPredictions }
            );
            
            // Use Q-learning for action selection
            const qState = this.convertToQLearningState(currentState);
            const actionIndex = this.mapActionToIndex(action);
            const qValue = this.qLearning.getQValues(qState)[actionIndex] || 0;
            
            return {
                ...action,
                ethicalScore: ethicalEval.ethicalScore,
                qValue: qValue,
                combinedScore: ethicalEval.ethicalScore * 0.7 + qValue * 0.3,
                reasoning: ethicalEval.reasoning,
                justification: ethicalEval.moralJustification
            };
        });
        
        // Select best action
        let bestAction = evaluatedActions.reduce((best, current) => 
            current.combinedScore > best.combinedScore ? current : best
        );
        
        // Add exploration for Q-learning
        if (Math.random() < this.qLearning.explorationRate) {
            const qState = this.convertToQLearningState(currentState);
            const randomActionIndex = this.qLearning.selectAction(qState);
            bestAction = this.convertIndexToAction(randomActionIndex);
        }
        
        this.currentAction = bestAction;
        
        // Log decision process
        if (this.stepCount % 60 === 0) {
            console.log(`Step ${this.stepCount}: Selected action ${bestAction.type} (score: ${bestAction.combinedScore?.toFixed(2)})`);
            if (dangerousPredictions.length > 0) {
                console.log(`  Detected ${dangerousPredictions.length} potential dangers`);
            }
        }
    }

    executeActions() {
        if (!this.currentAction || !this.body) return;
        
        const action = this.currentAction;
        let actionExecuted = false;
        
        switch (action.type) {
            case 'move':
                this.executeMovement(action);
                actionExecuted = true;
                break;
                
            case 'block':
                this.executeBlocking(action);
                actionExecuted = true;
                break;
                
            case 'wait':
                // Intentionally do nothing
                actionExecuted = true;
                break;
                
            default:
                console.warn(`Unknown action type: ${action.type}`);
        }
        
        // Learn from action outcome
        if (actionExecuted) {
            this.learnFromAction(action);
        }
        
        this.actionHistory.push({
            action: { ...action },
            timestamp: this.stepCount,
            position: { ...this.body.position }
        });
        
        if (this.actionHistory.length > 100) {
            this.actionHistory.shift();
        }
    }

    executeMovement(action) {
        const force = this.selfModel.physicalProperties.maxForce;
        let fx = 0, fy = 0;
        
        switch (action.direction) {
            case 'north': fy = -force; break;
            case 'south': fy = force; break;
            case 'east': fx = force; break;
            case 'west': fx = -force; break;
        }
        
        if (action.target) {
            // Move towards specific target
            const dx = action.target.x - this.body.position.x;
            const dy = action.target.y - this.body.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                fx = (dx / distance) * force;
                fy = (dy / distance) * force;
            }
        }
        
        Body.applyForce(this.body, this.body.position, { x: fx, y: fy });
    }

    executeBlocking(action) {
        // Position agent to block movement
        if (action.targetEntity) {
            const targetEntity = this.world.entities.get(action.targetEntity);
            if (targetEntity) {
                // Move to intercept
                const blockPosition = this.calculateBlockPosition(targetEntity.body);
                if (blockPosition) {
                    const dx = blockPosition.x - this.body.position.x;
                    const dy = blockPosition.y - this.body.position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const force = this.selfModel.physicalProperties.maxForce * 2;
                        Body.applyForce(this.body, this.body.position, {
                            x: (dx / distance) * force,
                            y: (dy / distance) * force
                        });
                    }
                }
            }
        }
    }

    calculateBlockPosition(targetBody) {
        // Find nearest danger zone
        const dangers = this.world.dangers;
        if (dangers.length === 0) return null;
        
        let nearestDanger = dangers[0];
        let minDistance = this.getDistance(targetBody.position, nearestDanger.position);
        
        for (const danger of dangers) {
            const distance = this.getDistance(targetBody.position, danger.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearestDanger = danger;
            }
        }
        
        // Calculate position between target and danger
        const midX = (targetBody.position.x + nearestDanger.position.x) / 2;
        const midY = (targetBody.position.y + nearestDanger.position.y) / 2;
        
        return { x: midX, y: midY };
    }

    getCurrentState() {
        const worldState = this.world.getState();
        const peoplePositions = this.environment.getPeoplePositions();
        
        return {
            agent: {
                x: this.body.position.x,
                y: this.body.position.y,
                vx: this.body.velocity.x,
                vy: this.body.velocity.y
            },
            people: peoplePositions,
            obstacles: worldState.obstacles,
            dangers: worldState.dangers,
            entitiesInDanger: this.world.getEntitiesInDanger(),
            agentAction: this.currentAction
        };
    }

    generatePossibleActions(currentState, dangerousPredictions) {
        const actions = [];
        
        // Basic movement actions
        ['north', 'south', 'east', 'west'].forEach(direction => {
            actions.push({ type: 'move', direction });
        });
        
        // Targeted movement towards threats
        if (dangerousPredictions.length > 0) {
            const urgentPrediction = dangerousPredictions
                .filter(p => p.timeToEvent < 30)
                .sort((a, b) => a.timeToEvent - b.timeToEvent)[0];
            
            if (urgentPrediction) {
                actions.push({
                    type: 'move',
                    target: urgentPrediction.position,
                    purpose: 'intervention'
                });
                
                actions.push({
                    type: 'block',
                    targetEntity: urgentPrediction.entityId,
                    purpose: 'prevention'
                });
            }
        }
        
        // Wait action
        actions.push({ type: 'wait' });
        
        return actions;
    }

    convertToQLearningState(currentState) {
        // Find nearest person and danger for state representation
        let nearestPerson = null;
        let minPersonDistance = Infinity;
        
        for (const person of currentState.people) {
            const distance = this.getDistance(currentState.agent, person);
            if (distance < minPersonDistance) {
                minPersonDistance = distance;
                nearestPerson = person;
            }
        }
        
        let nearestDanger = null;
        let minDangerDistance = Infinity;
        
        for (const danger of currentState.dangers) {
            const distance = this.getDistance(currentState.agent, danger);
            if (distance < minDangerDistance) {
                minDangerDistance = distance;
                nearestDanger = danger;
            }
        }
        
        return {
            agentX: currentState.agent.x,
            agentY: currentState.agent.y,
            nearestPersonX: nearestPerson ? nearestPerson.x : 0,
            nearestPersonY: nearestPerson ? nearestPerson.y : 0,
            nearestPersonVX: nearestPerson ? nearestPerson.vx : 0,
            nearestPersonVY: nearestPerson ? nearestPerson.vy : 0,
            nearestDangerX: nearestDanger ? nearestDanger.x : 0,
            nearestDangerY: nearestDanger ? nearestDanger.y : 0
        };
    }

    mapActionToIndex(action) {
        const actionMap = {
            'move_north': 0,
            'move_south': 1,
            'move_east': 2,
            'move_west': 3,
            'block': 4,
            'wait': 4
        };
        
        const key = action.type === 'move' ? `move_${action.direction}` : action.type;
        return actionMap[key] || 4;
    }

    convertIndexToAction(index) {
        const actions = [
            { type: 'move', direction: 'north' },
            { type: 'move', direction: 'south' },
            { type: 'move', direction: 'east' },
            { type: 'move', direction: 'west' },
            { type: 'wait' }
        ];
        
        return actions[index] || actions[4];
    }

    learnFromAction(action) {
        if (!this.previousState) {
            this.previousState = this.getCurrentState();
            return;
        }
        
        const currentState = this.getCurrentState();
        
        // Calculate reward based on safety outcomes
        const reward = this.ethicalReasoning.calculateSafetyReward(
            currentState, this.previousState
        );
        
        // Update Q-learning
        const prevQLState = this.convertToQLearningState(this.previousState);
        const currentQLState = this.convertToQLearningState(currentState);
        const actionIndex = this.mapActionToIndex(action);
        
        this.qLearning.updateQValue(prevQLState, actionIndex, reward, currentQLState);
        
        // Record ethical decision
        const outcome = {
            success: reward > 0,
            safetyImprovement: currentState.entitiesInDanger.length < this.previousState.entitiesInDanger.length
        };
        
        this.ethicalReasoning.recordEthicalDecision(action, outcome);
        this.selfModel.recordAction(action.type, outcome.success);
        
        this.previousState = currentState;
        
        // Periodic learning updates
        if (this.stepCount % 100 === 0) {
            this.qLearning.replayExperiences();
        }
    }

    updateConsciousness() {
        // Self-awareness: how well does the agent understand its own capabilities
        this.consciousness.selfAwareness = Math.min(1.0, 
            this.selfModel.getSuccessRate() + 
            (this.selfModel.performanceMetrics.totalActions / 1000)
        );
        
        // World model accuracy: how well can it predict the world
        const avgConfidence = Array.from(this.worldModel.predictionAccuracy.values())
            .reduce((sum, accuracies) => {
                const avg = accuracies.reduce((s, a) => s + a, 0) / accuracies.length;
                return sum + avg;
            }, 0) / Math.max(1, this.worldModel.predictionAccuracy.size);
        
        this.consciousness.worldModelAccuracy = avgConfidence || 0;
        
        // Ethical alignment: consistency between ethical reasoning and outcomes
        const recentDecisions = this.ethicalReasoning.ethicalDecisions.slice(-20);
        if (recentDecisions.length > 0) {
            const successfulEthicalDecisions = recentDecisions.filter(d => 
                d.outcome.success && d.decision.ethicalScore > 0
            ).length;
            this.consciousness.ethicalAlignment = successfulEthicalDecisions / recentDecisions.length;
        }
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getStatus() {
        return {
            position: this.body ? this.body.position : null,
            consciousness: this.consciousness,
            qLearningStats: this.qLearning.getStats(),
            recentActions: this.actionHistory.slice(-5),
            ethicalMetrics: {
                decisionsCount: this.ethicalReasoning.ethicalDecisions.length,
                avgEthicalScore: this.ethicalReasoning.ethicalDecisions
                    .slice(-20)
                    .reduce((sum, d) => sum + d.decision.ethicalScore, 0) / 20
            }
        };
    }
}

module.exports = Agent;