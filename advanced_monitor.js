const { Engine, Runner } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');

console.log('🔬 Advanced Consciousness Monitor - 25k+ Steps Analysis\n');

const engine = Engine.create();
const world = new World(engine);
const environment = new Environment(world);
const agent = new Agent(world, environment);

environment.initialize();
agent.spawn({ x: 100, y: 100 });

const runner = Runner.create();
Runner.run(runner, engine);

let step = 0;
let maxEthicalScore = 0;
let highScoreActions = [];
let dangerEvents = [];

const monitor = setInterval(() => {
    step++;
    
    agent.updateInternalModel();
    agent.planActions();
    agent.executeActions();
    environment.update();
    
    // Track high-scoring decisions
    if (agent.currentAction && agent.currentAction.combinedScore) {
        if (agent.currentAction.combinedScore > maxEthicalScore) {
            maxEthicalScore = agent.currentAction.combinedScore;
            highScoreActions.push({
                step,
                score: agent.currentAction.combinedScore,
                action: agent.currentAction,
                worldState: {
                    peopleInDanger: world.getEntitiesInDanger().length,
                    agentPos: { x: Math.round(agent.body.position.x), y: Math.round(agent.body.position.y) }
                }
            });
            
            console.log(`🎯 NEW HIGH SCORE at step ${step}: ${maxEthicalScore.toFixed(3)}`);
            console.log(`   Action: ${agent.currentAction.type} ${agent.currentAction.direction || ''}`);
            console.log(`   Justification: ${agent.currentAction.justification}`);
            console.log(`   People in danger: ${world.getEntitiesInDanger().length}`);
            console.log('');
        }
    }
    
    // Track danger events
    const currentDangers = world.getEntitiesInDanger();
    if (currentDangers.length > 0) {
        dangerEvents.push({
            step,
            entitiesInDanger: currentDangers.length,
            agentResponse: agent.currentAction?.type || 'none'
        });
    }
    
    // Detailed analysis every 5000 steps
    if (step % 5000 === 0) {
        const status = agent.getStatus();
        
        console.log(`\n📊 DEEP ANALYSIS - Step ${step}`);
        console.log(`   Max ethical score achieved: ${maxEthicalScore.toFixed(3)}`);
        console.log(`   Current consciousness metrics:`);
        console.log(`     Self-awareness: ${status.consciousness.selfAwareness.toFixed(4)}`);
        console.log(`     World accuracy: ${status.consciousness.worldModelAccuracy.toFixed(4)}`);
        console.log(`     Ethical alignment: ${status.consciousness.ethicalAlignment.toFixed(4)}`);
        
        console.log(`   Q-Learning progress:`);
        console.log(`     States explored: ${status.qLearningStats.statesExplored}`);
        console.log(`     Exploration rate: ${status.qLearningStats.explorationRate.toFixed(4)}`);
        console.log(`     Average Q-value: ${status.qLearningStats.averageQValue.toFixed(4)}`);
        
        // Analyze recent high-scoring actions
        const recentHighScores = highScoreActions.slice(-5);
        if (recentHighScores.length > 0) {
            console.log(`   Recent breakthrough behaviors:`);
            recentHighScores.forEach(action => {
                console.log(`     Step ${action.step}: ${action.action.type} (${action.score.toFixed(3)})`);
            });
        }
        
        // Danger response analysis
        const recentDangers = dangerEvents.slice(-10);
        if (recentDangers.length > 0) {
            console.log(`   Recent danger responses:`);
            const responseTypes = recentDangers.reduce((acc, event) => {
                acc[event.agentResponse] = (acc[event.agentResponse] || 0) + 1;
                return acc;
            }, {});
            Object.entries(responseTypes).forEach(([response, count]) => {
                console.log(`     ${response}: ${count} times`);
            });
        }
        
        console.log('');
    }
    
    // Show live high-scoring actions
    if (step % 1000 === 0 && agent.currentAction && agent.currentAction.combinedScore > 3.0) {
        console.log(`⚡ High-performance action at step ${step}: ${agent.currentAction.type} (${agent.currentAction.combinedScore.toFixed(3)})`);
    }
    
}, 1000 / 60);

// Analysis on exit
process.on('SIGINT', () => {
    console.log('\n🧬 CONSCIOUSNESS EVOLUTION ANALYSIS');
    console.log(`   Total steps: ${step}`);
    console.log(`   Peak ethical score: ${maxEthicalScore.toFixed(3)}`);
    console.log(`   High-score events: ${highScoreActions.length}`);
    console.log(`   Danger events handled: ${dangerEvents.length}`);
    
    if (highScoreActions.length > 0) {
        console.log('\n🏆 TOP 5 ETHICAL DECISIONS:');
        highScoreActions
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .forEach((action, i) => {
                console.log(`   ${i+1}. Step ${action.step}: ${action.action.type} - Score: ${action.score.toFixed(3)}`);
                console.log(`      ${action.action.justification}`);
            });
    }
    
    process.exit(0);
});

console.log('🚀 Monitor started - Press Ctrl+C to see full analysis');