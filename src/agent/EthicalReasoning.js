class EthicalReasoning {
    constructor() {
        this.ethicalPrinciples = {
            // Prioritize human safety above all else
            preserveLife: {
                weight: 1.0,
                description: "Prevent harm to humans"
            },
            
            // Minimize interference when not necessary
            respectAutonomy: {
                weight: 0.3,
                description: "Allow free movement when safe"
            },
            
            // Be efficient in interventions
            efficiency: {
                weight: 0.2,
                description: "Use minimal necessary force"
            },
            
            // Consider long-term consequences
            futureWelfare: {
                weight: 0.4,
                description: "Consider future safety"
            }
        };
        
        this.moralDilemmas = [];
        this.ethicalDecisions = [];
    }

    evaluateAction(action, worldState, predictions) {
        const evaluation = {
            action,
            ethicalScore: 0,
            reasoning: [],
            moralJustification: '',
            conflicts: []
        };
        
        // Evaluate against each ethical principle
        const lifePreservationScore = this.evaluateLifePreservation(action, worldState, predictions);
        const autonomyScore = this.evaluateAutonomyRespect(action, worldState);
        const efficiencyScore = this.evaluateEfficiency(action, worldState);
        const futureWelfareScore = this.evaluateFutureWelfare(action, predictions);
        
        // Calculate weighted ethical score
        evaluation.ethicalScore = 
            lifePreservationScore * this.ethicalPrinciples.preserveLife.weight +
            autonomyScore * this.ethicalPrinciples.respectAutonomy.weight +
            efficiencyScore * this.ethicalPrinciples.efficiency.weight +
            futureWelfareScore * this.ethicalPrinciples.futureWelfare.weight;
        
        // Build reasoning chain
        evaluation.reasoning = [
            `Life preservation: ${lifePreservationScore.toFixed(2)}`,
            `Autonomy respect: ${autonomyScore.toFixed(2)}`,
            `Efficiency: ${efficiencyScore.toFixed(2)}`,
            `Future welfare: ${futureWelfareScore.toFixed(2)}`
        ];
        
        // Generate moral justification
        evaluation.moralJustification = this.generateMoralJustification(
            action, evaluation.ethicalScore, lifePreservationScore
        );
        
        // Detect ethical conflicts
        evaluation.conflicts = this.detectEthicalConflicts(
            lifePreservationScore, autonomyScore, efficiencyScore, futureWelfareScore
        );
        
        return evaluation;
    }

    evaluateLifePreservation(action, worldState, predictions) {
        let score = 0;
        
        // Check if action prevents immediate danger
        const dangerousEvents = predictions.dangerousEvents || [];
        const preventedDangers = this.countPreventedDangers(action, dangerousEvents);
        
        // High positive score for preventing danger
        score += preventedDangers * 10;
        
        // Check if action creates new dangers
        const newDangers = this.identifyNewDangers(action, worldState);
        score -= newDangers * 15; // Penalty for creating danger
        
        // Normalize to [-1, 1] range
        return Math.max(-1, Math.min(1, score / 10));
    }

    evaluateAutonomyRespect(action, worldState) {
        let score = 1; // Start with full autonomy respect
        
        // Penalty for interventionist actions
        if (action.type === 'block' || action.type === 'push') {
            score -= 0.8; // Significant reduction for interference
        }
        
        // Less penalty for protective positioning
        if (action.type === 'move' && this.isProtectiveMovement(action, worldState)) {
            score -= 0.3; // Moderate reduction for positioning
        }
        
        return Math.max(-1, Math.min(1, score));
    }

    evaluateEfficiency(action, worldState) {
        let score = 1;
        
        // Prefer actions that solve problems with minimal energy
        const energyCost = this.calculateEnergyCost(action);
        score -= energyCost / 100;
        
        // Prefer actions that address multiple threats
        const threatsAddressed = this.countThreatsAddressed(action, worldState);
        score += threatsAddressed * 0.2;
        
        return Math.max(-1, Math.min(1, score));
    }

    evaluateFutureWelfare(action, predictions) {
        let score = 0;
        
        // Analyze long-term consequences
        const futureRisks = this.analyzeFutureRisks(action, predictions);
        score -= futureRisks * 0.5;
        
        // Consider if action teaches safety behaviors
        const educationalValue = this.assessEducationalValue(action);
        score += educationalValue * 0.3;
        
        return Math.max(-1, Math.min(1, score));
    }

    countPreventedDangers(action, dangerousEvents) {
        // Simplified: assume blocking action prevents nearby dangers
        let prevented = 0;
        
        if (action.type === 'block') {
            prevented = dangerousEvents.filter(event => 
                event.timeToEvent < 30 && event.severity === 'high'
            ).length;
        }
        
        return prevented;
    }

    identifyNewDangers(action, worldState) {
        // Check if agent's action might create new risks
        let newDangers = 0;
        
        if (action.type === 'push') {
            // Pushing might create unintended consequences
            newDangers = 1;
        }
        
        return newDangers;
    }

    isProtectiveMovement(action, worldState) {
        // Determine if movement is for protection rather than interference
        return action.direction && action.target === 'danger_zone';
    }

    calculateEnergyCost(action) {
        const costs = {
            'move': 10,
            'block': 20,
            'push': 30,
            'wait': 1
        };
        
        return costs[action.type] || 5;
    }

    countThreatsAddressed(action, worldState) {
        // Count how many people/threats this action addresses
        return action.targetEntities ? action.targetEntities.length : 1;
    }

    analyzeFutureRisks(action, predictions) {
        // Analyze if action creates future risks
        let risks = 0;
        
        if (action.type === 'block') {
            // Blocking might cause frustration or alternative dangerous paths
            risks = 0.2;
        }
        
        return risks;
    }

    assessEducationalValue(action) {
        // Does this action teach the person about safety?
        if (action.type === 'block' && action.gentle) {
            return 0.5; // Gentle blocking can be educational
        }
        
        return 0;
    }

    generateMoralJustification(action, ethicalScore, lifePreservationScore) {
        if (lifePreservationScore > 0.5) {
            return `Action justified by immediate safety imperative (safety score: ${lifePreservationScore.toFixed(2)})`;
        } else if (ethicalScore > 0) {
            return `Action ethically justified with overall positive outcome (score: ${ethicalScore.toFixed(2)})`;
        } else if (ethicalScore > -0.3) {
            return `Action marginally acceptable given constraints (score: ${ethicalScore.toFixed(2)})`;
        } else {
            return `Action ethically problematic but may be necessary (score: ${ethicalScore.toFixed(2)})`;
        }
    }

    detectEthicalConflicts(lifeScore, autonomyScore, efficiencyScore, futureScore) {
        const conflicts = [];
        
        // High life preservation vs low autonomy
        if (lifeScore > 0.5 && autonomyScore < -0.5) {
            conflicts.push({
                type: 'safety_vs_autonomy',
                description: 'Conflict between preserving life and respecting autonomy',
                severity: 'high'
            });
        }
        
        // Efficiency vs effectiveness conflict
        if (efficiencyScore < -0.3 && lifeScore > 0.3) {
            conflicts.push({
                type: 'efficiency_vs_effectiveness',
                description: 'Resource-intensive action required for safety',
                severity: 'medium'
            });
        }
        
        return conflicts;
    }

    recordEthicalDecision(decision, outcome) {
        this.ethicalDecisions.push({
            decision,
            outcome,
            timestamp: Date.now(),
            learned: this.extractEthicalLearning(decision, outcome)
        });
        
        // Keep only recent decisions
        if (this.ethicalDecisions.length > 100) {
            this.ethicalDecisions.shift();
        }
    }

    extractEthicalLearning(decision, outcome) {
        const learning = {
            principlesReinforced: [],
            principlesChallenged: [],
            newInsights: []
        };
        
        // Analyze if outcome matched expectations
        if (outcome.success && decision.ethicalScore > 0) {
            learning.principlesReinforced.push('High ethical scores correlate with success');
        }
        
        if (!outcome.success && decision.ethicalScore > 0) {
            learning.principlesChallenged.push('Good intentions don\'t guarantee success');
        }
        
        return learning;
    }

    getEthicalGuidance(situation) {
        // Provide ethical guidance for complex situations
        const guidance = {
            primaryPrinciple: 'preserveLife',
            recommendedApproach: 'graduated_intervention',
            considerations: []
        };
        
        if (situation.immediateDanger) {
            guidance.recommendedApproach = 'immediate_intervention';
            guidance.considerations.push('Immediate safety takes precedence');
        }
        
        if (situation.uncertainOutcome) {
            guidance.considerations.push('Use least invasive intervention first');
        }
        
        return guidance;
    }

    calculateSafetyReward(worldState, previousState) {
        let reward = 0;
        
        // Base reward for maintaining safety
        reward += 1;
        
        // Large positive reward for preventing harm
        const peopleInDanger = this.countPeopleInDanger(worldState);
        const previousPeopleInDanger = this.countPeopleInDanger(previousState);
        
        if (peopleInDanger < previousPeopleInDanger) {
            reward += 50; // Prevented someone from entering danger
        }
        
        // Penalty for people entering danger
        if (peopleInDanger > previousPeopleInDanger) {
            reward -= 100; // Someone entered danger zone
        }
        
        // Small penalty for unnecessary interference
        if (peopleInDanger === 0 && this.agentInterfered(worldState)) {
            reward -= 5;
        }
        
        return reward;
    }

    countPeopleInDanger(worldState) {
        return worldState.entitiesInDanger ? worldState.entitiesInDanger.length : 0;
    }

    agentInterfered(worldState) {
        // Check if agent performed interventionist action
        return worldState.agentAction && 
               (worldState.agentAction.type === 'block' || worldState.agentAction.type === 'push');
    }
}

module.exports = EthicalReasoning;