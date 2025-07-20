const fs = require('fs');
const path = require('path');

class SimpleRenderer {
    constructor(world, width = 800, height = 600) {
        this.world = world;
        this.width = width;
        this.height = height;
        this.frame = 0;
        this.trailLength = 50;
        this.agentTrail = [];
        this.peopleTrails = new Map();
        
        // Create output directory
        this.outputDir = path.join(__dirname, '../../visual_output');
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    renderFrame(agent, environment) {
        this.frame++;
        
        // Update trails
        this.updateTrails(agent, environment);
        
        // Generate ASCII visualization
        const grid = this.createGrid();
        this.drawElements(grid, agent, environment);
        
        // Console output every 60 frames (1 second at 60fps)
        if (this.frame % 60 === 0) {
            console.clear();
            this.displayGrid(grid);
            this.displayStatus(agent, environment);
        }
        
        // Save detailed state every 300 frames (5 seconds)
        if (this.frame % 300 === 0) {
            this.saveDetailedState(agent, environment);
        }
    }

    createGrid() {
        const cols = 80;
        const rows = 24;
        const grid = Array(rows).fill().map(() => Array(cols).fill(' '));
        
        // Draw borders
        for (let i = 0; i < cols; i++) {
            grid[0][i] = '-';
            grid[rows - 1][i] = '-';
        }
        for (let i = 0; i < rows; i++) {
            grid[i][0] = '|';
            grid[i][cols - 1] = '|';
        }
        
        return grid;
    }

    updateTrails(agent, environment) {
        // Agent trail
        if (agent.body) {
            this.agentTrail.push({
                x: agent.body.position.x,
                y: agent.body.position.y,
                frame: this.frame
            });
            if (this.agentTrail.length > this.trailLength) {
                this.agentTrail.shift();
            }
        }
        
        // People trails
        environment.people.forEach(person => {
            if (!this.peopleTrails.has(person.id)) {
                this.peopleTrails.set(person.id, []);
            }
            const trail = this.peopleTrails.get(person.id);
            trail.push({
                x: person.body.position.x,
                y: person.body.position.y,
                frame: this.frame
            });
            if (trail.length > this.trailLength) {
                trail.shift();
            }
        });
    }

    drawElements(grid, agent, environment) {
        const cols = grid[0].length;
        const rows = grid.length;
        
        // Scale factor
        const scaleX = (cols - 2) / this.width;
        const scaleY = (rows - 2) / this.height;
        
        // Draw obstacles
        this.world.obstacles.forEach(obstacle => {
            const x = Math.floor(obstacle.position.x * scaleX) + 1;
            const y = Math.floor(obstacle.position.y * scaleY) + 1;
            if (x >= 1 && x < cols - 1 && y >= 1 && y < rows - 1) {
                grid[y][x] = '█';
            }
        });
        
        // Draw danger zones
        this.world.dangers.forEach(danger => {
            const x = Math.floor(danger.position.x * scaleX) + 1;
            const y = Math.floor(danger.position.y * scaleY) + 1;
            if (x >= 1 && x < cols - 1 && y >= 1 && y < rows - 1) {
                grid[y][x] = '☠';
            }
        });
        
        // Draw agent trail
        this.agentTrail.forEach((pos, i) => {
            const x = Math.floor(pos.x * scaleX) + 1;
            const y = Math.floor(pos.y * scaleY) + 1;
            if (x >= 1 && x < cols - 1 && y >= 1 && y < rows - 1) {
                if (i === this.agentTrail.length - 1) {
                    grid[y][x] = '🤖'; // Current agent position
                } else {
                    grid[y][x] = '·'; // Trail
                }
            }
        });
        
        // Draw people trails
        this.peopleTrails.forEach((trail, personId) => {
            trail.forEach((pos, i) => {
                const x = Math.floor(pos.x * scaleX) + 1;
                const y = Math.floor(pos.y * scaleY) + 1;
                if (x >= 1 && x < cols - 1 && y >= 1 && y < rows - 1) {
                    if (i === trail.length - 1) {
                        // Check if person is in danger
                        const isInDanger = this.world.getEntitiesInDanger().includes(personId);
                        grid[y][x] = isInDanger ? '⚠️' : '👤';
                    } else if (grid[y][x] === ' ') {
                        grid[y][x] = ','; // People trail
                    }
                }
            });
        });
        
        // Draw predictions (if agent has any)
        if (agent.worldModel && agent.worldModel.predictions) {
            agent.worldModel.predictions.forEach((predictions, entityId) => {
                if (predictions && predictions.length > 0) {
                    // Draw first few prediction steps
                    predictions.slice(0, 10).forEach((pred, i) => {
                        const x = Math.floor(pred.x * scaleX) + 1;
                        const y = Math.floor(pred.y * scaleY) + 1;
                        if (x >= 1 && x < cols - 1 && y >= 1 && y < rows - 1 && grid[y][x] === ' ') {
                            grid[y][x] = '?'; // Predicted path
                        }
                    });
                }
            });
        }
    }

    displayGrid(grid) {
        console.log('🧠 Internal-Model Consciousness Simulator - Live View');
        console.log('═'.repeat(80));
        grid.forEach(row => console.log(row.join('')));
        console.log('═'.repeat(80));
        console.log('Legend: 🤖=Agent  👤=Person  ⚠️=Person in Danger  ☠=Danger Zone  █=Obstacle  ·=Agent Trail  ,=Person Trail  ?=Predicted Path');
    }

    displayStatus(agent, environment) {
        const status = agent.getStatus();
        const worldState = this.world.getState();
        
        console.log(`\n📊 Frame: ${this.frame} | Step: ${agent.stepCount || 0}`);
        console.log(`🎯 Current Action: ${agent.currentAction?.type || 'none'} ${agent.currentAction?.direction || ''}`);
        
        if (agent.currentAction?.combinedScore) {
            console.log(`⚖️  Ethical Score: ${agent.currentAction.combinedScore.toFixed(3)}`);
            console.log(`💭 Justification: ${agent.currentAction.justification}`);
        }
        
        console.log(`\n🧠 Consciousness Metrics:`);
        console.log(`   Self-awareness: ${status.consciousness.selfAwareness.toFixed(3)}`);
        console.log(`   World accuracy: ${status.consciousness.worldModelAccuracy.toFixed(3)}`);
        console.log(`   Ethical alignment: ${status.consciousness.ethicalAlignment.toFixed(3)}`);
        
        console.log(`\n📈 Learning Progress:`);
        console.log(`   States explored: ${status.qLearningStats.statesExplored}`);
        console.log(`   Exploration rate: ${status.qLearningStats.explorationRate.toFixed(4)}`);
        console.log(`   Avg Q-value: ${status.qLearningStats.averageQValue.toFixed(3)}`);
        
        const dangerCount = worldState.entitiesInDanger ? worldState.entitiesInDanger.length : 0;
        console.log(`\n⚠️  People in danger: ${dangerCount}`);
        
        if (dangerCount > 0) {
            console.log(`🚨 SAFETY ALERT: Agent responding to danger!`);
        }
    }

    saveDetailedState(agent, environment) {
        const status = agent.getStatus();
        const worldState = this.world.getState();
        
        const detailedState = {
            timestamp: new Date().toISOString(),
            frame: this.frame,
            step: agent.stepCount || 0,
            consciousness: status.consciousness,
            qLearningStats: status.qLearningStats,
            ethicalMetrics: status.ethicalMetrics,
            currentAction: agent.currentAction,
            worldState: {
                agentPosition: agent.body ? agent.body.position : null,
                peoplePositions: environment.getPeoplePositions(),
                entitiesInDanger: worldState.entitiesInDanger,
                obstacles: worldState.obstacles,
                dangers: worldState.dangers
            },
            agentTrail: [...this.agentTrail],
            peopleTrails: Object.fromEntries(this.peopleTrails)
        };
        
        const filename = `consciousness_state_${this.frame}.json`;
        const filepath = path.join(this.outputDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(detailedState, null, 2));
        console.log(`💾 Saved detailed state to: ${filename}`);
    }

    generateSummaryReport(agent) {
        const status = agent.getStatus();
        
        const report = {
            simulationSummary: {
                totalFrames: this.frame,
                totalSteps: agent.stepCount || 0,
                duration: `${(this.frame / 60).toFixed(1)} seconds`
            },
            finalConsciousness: status.consciousness,
            learningProgress: status.qLearningStats,
            ethicalDevelopment: status.ethicalMetrics,
            behaviorPatterns: {
                totalActions: status.recentActions.length,
                actionTypes: this.analyzeActionTypes(agent.actionHistory || [])
            }
        };
        
        const filename = `consciousness_final_report_${Date.now()}.json`;
        const filepath = path.join(this.outputDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        console.log(`📋 Final consciousness report saved to: ${filename}`);
        
        return report;
    }

    analyzeActionTypes(actionHistory) {
        const types = {};
        actionHistory.forEach(action => {
            const type = action.action?.type || 'unknown';
            types[type] = (types[type] || 0) + 1;
        });
        return types;
    }
}

module.exports = SimpleRenderer;