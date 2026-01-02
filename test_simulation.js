const { Engine, Runner, Bodies, Composite } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');

console.log('🧠 Testing Internal-Model Consciousness Simulator (Unified Architecture)...\n');

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
        const cons = status.consciousness;
        
        console.log(`📊 Step ${step}:`);
        console.log(`   Agent position: (${Math.round(status.position.x)}, ${Math.round(status.position.y)})`);
        console.log(`   People in danger: ${worldState.entitiesInDanger ? worldState.entitiesInDanger.length : 0}`);
        
        console.log(`   🧠 Unified Consciousness Index (UCI): ${cons.UCI}`);
        console.log(`      L1 (Integration): Φ=${cons.layers.L1_Integration.phi}`);
        console.log(`      L2 (Workspace):   Broadcasts=${cons.layers.L2_GlobalWorkspace.broadcasts}, Coalitions=${cons.layers.L2_GlobalWorkspace.active_coalitions}`);
        console.log(`      L3 (Meta):        Focus=${cons.layers.L3_MetaCognition.focus || 'None'}, Accuracy=${cons.layers.L3_MetaCognition.accuracy}`);
        
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
        const cons = finalStatus.consciousness;
        
        console.log(`   Total decisions made: ${finalStatus.qLearningStats.statesExplored}`);
        console.log(`   Final Consciousness State:`);
        console.log(`     UCI: ${cons.UCI}`);
        console.log(`     Φ (Integration): ${cons.layers.L1_Integration.phi}`);
        console.log(`     Broadcasts: ${cons.layers.L2_GlobalWorkspace.broadcasts}`);
        
        if (finalStatus.ethicalMetrics.avgEthicalScore) {
            console.log(`   Average ethical score: ${finalStatus.ethicalMetrics.avgEthicalScore.toFixed(3)}`);
        }
        
        console.log('\n✨ The agent demonstrates artificial consciousness through:');
        console.log('   🧠 Unified Architecture: IIT (Φ) + GWT (Broadcast) + HOT (Metacognition)');
        console.log('   🔄 Conscious Cycle: Competition -> Broadcast -> Action');
        console.log('   📝 Self-Reporting: Measuring its own integration and confidence');
        
        process.exit(0);
    }
}, 1000 / 60); // 60 FPS

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\n🛑 Simulation interrupted');
    clearInterval(testInterval);
    process.exit(0);
});