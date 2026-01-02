const { Bodies, Body } = require('matter-js');
const SelfModel = require('./SelfModel');
const WorldModel = require('./WorldModel');
const QLearning = require('./QLearning');
const EthicalReasoning = require('./EthicalReasoning');

// Consciousness Architecture Imports
const GlobalWorkspace = require('../consciousness/GlobalWorkspace');
const MetaCognition = require('../consciousness/MetaCognition');
const IntegrationMeasure = require('../consciousness/IntegrationMeasure');
const ConsciousnessMetrics = require('../consciousness/ConsciousnessMetrics');
const InformationPacket = require('../consciousness/InformationPacket');

class Agent {
    constructor(world, environment) {
        this.world = world;
        this.environment = environment;
        this.body = null;
        
        // Internal models (Layer 0)
        this.selfModel = new SelfModel();
        this.worldModel = new WorldModel();
        this.qLearning = new QLearning();
        this.ethicalReasoning = new EthicalReasoning();
        
        // Consciousness Architecture (Layers 1-3)
        this.globalWorkspace = new GlobalWorkspace();
        this.integrationMeasure = new IntegrationMeasure();
        this.metaCognition = new MetaCognition(this.globalWorkspace);
        this.consciousnessMetrics = new ConsciousnessMetrics(this);
        
        // Subscribe modules to Global Workspace
        this.globalWorkspace.subscribe(this.metaCognition);
        // (SelfModel and WorldModel could be subscribers in a full implementation)

        // State tracking
        this.currentAction = null;
        this.previousState = null;
        this.actionHistory = [];
        
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
        
        // Record state for Integration Measure (Phi)
        this.integrationMeasure.recordModuleState('WorldModel', worldState);
        this.integrationMeasure.recordModuleState('SelfModel', this.selfModel.currentState);
    }

    planActions() {
        if (!this.body) return;
        
        this.stepCount++;
        
        // Get current state for decision making
        const currentState = this.getCurrentState();
        
        // 1. Perception & Prediction (Bottom-Up Attention)
        const dangerousPredictions = this.worldModel.predictDangerousEvents(60);
        
        // If danger detected, submit high-salience packet to Global Workspace
        if (dangerousPredictions.length > 0) {
            this.globalWorkspace.submit(new InformationPacket(
                'WorldModel',
                { predictions: dangerousPredictions },
                0.95, // Very high salience
                0.8,
                { type: 'danger_alert', urgency: 'high' }
            ));
        }
        
        // 2. Action Generation (Coalition Formation)
        const possibleActions = this.generatePossibleActions(currentState, dangerousPredictions);
        
        // Evaluate actions and submit them as competing coalitions
        possibleActions.forEach(action => {
            const ethicalEval = this.ethicalReasoning.evaluateAction(
                action, currentState, { dangerousEvents: dangerousPredictions }
            );
            
            // Q-Learning score
            const qState = this.convertToQLearningState(currentState);
            const actionIndex = this.mapActionToIndex(action);
            const qValue = this.qLearning.getQValues(qState)[actionIndex] || 0;
            
            // Combine scores
            // Normalize qValue (-1 to 1 usually) to 0-1 for salience
            const normQ = (qValue + 1) / 2;
            const normEthical = (ethicalEval.ethicalScore + 1) / 2;
            
            let combinedScore = ethicalEval.ethicalScore * 0.7 + qValue * 0.3;
            // Boost score if it addresses the current broadcast (e.g., danger)
            if (this.globalWorkspace.currentBroadcast && 
                this.globalWorkspace.currentBroadcast.metadata.type === 'danger_alert' &&
                ethicalEval.ethicalScore > 0) {
                combinedScore += 0.5;
            }

            // Create Information Packet for this action plan
            const actionPacket = new InformationPacket(
                'ActionPlanner',
                {
                    ...action,
                    ethicalScore: ethicalEval.ethicalScore,
                    qValue: qValue,
                    reasoning: ethicalEval.reasoning
                },
                Math.max(0.1, Math.min(1.0, (combinedScore + 1) / 2)), // Normalize to 0-1 salience
                1.0,
                { type: 'action_plan', justification: ethicalEval.moralJustification }
            );
            
            this.globalWorkspace.submit(actionPacket);
        });
        
        // 3. Global Workspace Cycle (Competition & Broadcast)
        const winningPacket = this.globalWorkspace.processCycle();
        
        // 4. Action Selection based on Broadcast
        if (winningPacket && winningPacket.metadata.type === 'action_plan') {
            this.currentAction = winningPacket.content;
            
            // Log "Conscious" Decision
            if (this.stepCount % 60 === 0) {
                console.log(`Step ${this.stepCount}: Consciously selected ${this.currentAction.type} (Salience: ${winningPacket.salience.toFixed(2)})`);
                console.log(`  Justification: ${winningPacket.metadata.justification}`);
            }
        } else if (winningPacket && winningPacket.metadata.type === 'danger_alert') {
            // If danger is the conscious thought, but no action won yet,
            // we default to a safe 'wait' or 'observe' state
            this.currentAction = { type: 'wait', reason: 'observing_danger' };
        } else {
            // "Subconscious" default / Exploration
            if (Math.random() < this.qLearning.explorationRate) {
                const qState = this.convertToQLearningState(currentState);
                const randomActionIndex = this.qLearning.selectAction(qState);
                this.currentAction = this.convertIndexToAction(randomActionIndex);
            } else {
                 this.currentAction = { type: 'wait', reason: 'no_salient_action' };
            }
        }
        
        // 5. Update Higher-Order Layers
        this.metaCognition.update();
        
        // Record integration data
        this.integrationMeasure.recordModuleState('GlobalWorkspace', { 
            broadcast: this.globalWorkspace.currentBroadcast ? this.globalWorkspace.currentBroadcast.id : null,
            coalitions: this.globalWorkspace.coalitions.length 
        });
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
            'wait': 5
        };
        
        const key = action.type === 'move' ? `move_${action.direction}` : action.type;
        return actionMap[key] !== undefined ? actionMap[key] : 5;
    }

    convertIndexToAction(index) {
        const actions = [
            { type: 'move', direction: 'north' },
            { type: 'move', direction: 'south' },
            { type: 'move', direction: 'east' },
            { type: 'move', direction: 'west' },
            { type: 'block' },
            { type: 'wait' }
        ];
        
        return actions[index] || actions[5];
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
        
        // Feed outcome back to MetaCognition
        // (Layer 3: "Did I perform well?")
        this.metaCognition.recordOutcome(
            this.globalWorkspace.currentBroadcast ? this.globalWorkspace.currentBroadcast.confidence : 0.5,
            outcome.success
        );
        
        this.previousState = currentState;
        
        // Periodic learning updates
        if (this.stepCount % 100 === 0) {
            this.qLearning.replayExperiences();
        }
    }

    updateConsciousness() {
        // Legacy method - now handled by ConsciousnessMetrics and MetaCognition
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getStatus() {
        return {
            position: this.body ? this.body.position : null,
            // New Unified Metrics
            consciousness: this.consciousnessMetrics.getMetrics(),
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
