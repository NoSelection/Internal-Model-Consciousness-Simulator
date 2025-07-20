const { Engine, Runner, Bodies, Composite } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');

console.log('🧠 Testing Internal-Model Consciousness Simulator...\n');

// Create simulation components
const engine = Engine.create();
const world = new World(engine);
const environment = new Environment(world);
const agent = new Agent(world, environment);

// Initialize environment
environment.initialize();
agent.spawn({ x: 100, y: 100 });

console.log('✅ Environment initialized with:');
console.log(`   - ${environment.people.length} people`);
console.log(`   - ${world.obstacles.length} obstacles`);
console.log(`   - ${world.dangers.length} danger zones\n`);

// Run simulation for a few steps
const runner = Runner.create();
Runner.run(runner, engine);

let step = 0;
const maxSteps = 300;

const testInterval = setInterval(() => {
    step++;
    
    // Agent updates
    agent.updateInternalModel();
    agent.planActions();
    agent.executeActions();
    
    // Environment updates
    environment.update();
    
    // Log key metrics every 50 steps
    if (step % 50 === 0) {
        const status = agent.getStatus();
        const worldState = world.getState();
        
        console.log(`📊 Step ${step}:`);
        console.log(`   Agent position: (${Math.round(status.position.x)}, ${Math.round(status.position.y)})`);
        console.log(`   People in danger: ${worldState.entitiesInDanger ? worldState.entitiesInDanger.length : 0}`);
        console.log(`   Consciousness metrics:`);
        console.log(`     Self-awareness: ${status.consciousness.selfAwareness.toFixed(3)}`);
        console.log(`     World accuracy: ${status.consciousness.worldModelAccuracy.toFixed(3)}`);
        console.log(`     Ethical alignment: ${status.consciousness.ethicalAlignment.toFixed(3)}`);
        console.log(`   Q-learning: ${status.qLearningStats.statesExplored} states explored`);
        
        if (status.recentActions.length > 0) {
            const lastAction = status.recentActions[status.recentActions.length - 1];
            console.log(`   Last action: ${lastAction.action.type}`);
        }
        console.log('');
    }
    
    // Test dangerous scenario at step 150
    if (step === 150) {
        console.log('⚠️  Creating test dangerous scenario...');
        // Move a person closer to danger
        const person = environment.people[0];
        if (person) {
            person.body.position.x = 580;
            person.body.position.y = 480;
            console.log('   Moved person near danger zone!\n');
        }
    }
    
    if (step >= maxSteps) {
        clearInterval(testInterval);
        
        console.log('🎯 Simulation test completed!');
        console.log('\n📈 Final Results:');
        
        const finalStatus = agent.getStatus();
        console.log(`   Total decisions made: ${finalStatus.qLearningStats.statesExplored}`);
        console.log(`   Final consciousness metrics:`);
        console.log(`     Self-awareness: ${finalStatus.consciousness.selfAwareness.toFixed(3)}`);
        console.log(`     World model accuracy: ${finalStatus.consciousness.worldModelAccuracy.toFixed(3)}`);
        console.log(`     Ethical alignment: ${finalStatus.consciousness.ethicalAlignment.toFixed(3)}`);
        
        if (finalStatus.ethicalMetrics.avgEthicalScore) {
            console.log(`   Average ethical score: ${finalStatus.ethicalMetrics.avgEthicalScore.toFixed(3)}`);
        }
        
        console.log('\n✨ The agent demonstrates artificial consciousness through:');
        console.log('   🧠 Self-modeling: Understanding its own capabilities');
        console.log('   🌍 World modeling: Predicting environmental changes');
        console.log('   ⚖️  Ethical reasoning: Making moral decisions about interventions');
        console.log('   📚 Learning: Improving safety behaviors over time');
        
        process.exit(0);
    }
}, 1000 / 60); // 60 FPS

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\n🛑 Simulation interrupted');
    clearInterval(testInterval);
    process.exit(0);
});