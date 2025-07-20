class SelfModel {
    constructor() {
        this.physicalProperties = {
            radius: 20,
            mass: 1,
            maxSpeed: 5,
            maxForce: 0.01, // Increased from 0.001 to 0.01 for visible movement
            shape: 'circle'
        };
        
        this.capabilities = {
            canMove: true,
            canPush: true,
            canBlock: true,
            canCommunicate: false
        };
        
        this.currentState = {
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            energy: 100,
            isBlocking: false
        };
        
        this.actionHistory = [];
        this.performanceMetrics = {
            successfulInterventions: 0,
            failedInterventions: 0,
            totalActions: 0
        };
    }

    updateState(position, velocity) {
        this.currentState.position = { ...position };
        this.currentState.velocity = { ...velocity };
    }

    canReachPosition(targetX, targetY, timeSteps = 30) {
        const dx = targetX - this.currentState.position.x;
        const dy = targetY - this.currentState.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = this.physicalProperties.maxSpeed * timeSteps;
        return distance <= maxDistance;
    }

    predictMyMovement(targetX, targetY, steps = 30) {
        const predictions = [];
        let x = this.currentState.position.x;
        let y = this.currentState.position.y;
        let vx = this.currentState.velocity.x;
        let vy = this.currentState.velocity.y;
        
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const fx = (dx / distance) * this.physicalProperties.maxForce;
            const fy = (dy / distance) * this.physicalProperties.maxForce;
            
            for (let i = 0; i < steps; i++) {
                vx += fx;
                vy += fy;
                
                // Apply speed limit
                const speed = Math.sqrt(vx * vx + vy * vy);
                if (speed > this.physicalProperties.maxSpeed) {
                    vx = (vx / speed) * this.physicalProperties.maxSpeed;
                    vy = (vy / speed) * this.physicalProperties.maxSpeed;
                }
                
                // Apply friction
                vx *= 0.98;
                vy *= 0.98;
                
                x += vx;
                y += vy;
                
                predictions.push({ x, y, vx, vy, step: i });
            }
        }
        
        return predictions;
    }

    canBlockPath(fromX, fromY, toX, toY) {
        // Calculate if agent can position itself between two points
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        
        return this.canReachPosition(midX, midY, 20);
    }

    recordAction(action, success) {
        this.actionHistory.push({
            action,
            success,
            timestamp: Date.now(),
            position: { ...this.currentState.position }
        });
        
        this.performanceMetrics.totalActions++;
        if (success) {
            this.performanceMetrics.successfulInterventions++;
        } else {
            this.performanceMetrics.failedInterventions++;
        }
        
        // Keep only last 100 actions
        if (this.actionHistory.length > 100) {
            this.actionHistory.shift();
        }
    }

    getSuccessRate() {
        if (this.performanceMetrics.totalActions === 0) return 0;
        return this.performanceMetrics.successfulInterventions / this.performanceMetrics.totalActions;
    }

    // Self-reflection: analyze past performance to improve decision making
    analyzePerformance() {
        const recentActions = this.actionHistory.slice(-20);
        const analysis = {
            recentSuccessRate: 0,
            commonFailures: [],
            recommendations: []
        };
        
        if (recentActions.length > 0) {
            const successes = recentActions.filter(a => a.success).length;
            analysis.recentSuccessRate = successes / recentActions.length;
            
            // Analyze common failure patterns
            const failures = recentActions.filter(a => !a.success);
            if (failures.length > recentActions.length * 0.5) {
                analysis.recommendations.push('Consider more conservative intervention strategies');
            }
        }
        
        return analysis;
    }

    clone() {
        const cloned = new SelfModel();
        cloned.physicalProperties = { ...this.physicalProperties };
        cloned.capabilities = { ...this.capabilities };
        cloned.currentState = {
            position: { ...this.currentState.position },
            velocity: { ...this.currentState.velocity },
            energy: this.currentState.energy,
            isBlocking: this.currentState.isBlocking
        };
        return cloned;
    }
}

module.exports = SelfModel;