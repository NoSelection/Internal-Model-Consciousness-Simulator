/**
 * Save Enlightened Agent
 * 
 * This script runs a brief meditation sequence to "center" the agent's 
 * consciousness at peak coherence and then saves the state to disk.
 */

const { Engine, Runner } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const DreamCycle = require('./src/consciousness/DreamCycle');
const ModelManager = require('./src/persistence/ModelManager');

async function main() {
    console.log('🧘 Centering the agent for final baseline save...');
    
    const engine = Engine.create();
    const world = new World(engine);
    const environment = new Environment(world);
    const agent = new Agent(world, environment);
    const modelManager = new ModelManager();
    const dreamCycle = new DreamCycle(agent);

    environment.initialize();
    agent.spawn({ x: 100, y: 100 });

    // Step 1: Wake state to gather initial entropy
    console.log('🌍 Running wake baseline (30 steps)...');
    for (let i = 0; i < 30; i++) {
        agent.updateInternalModel();
        agent.planActions();
        agent.executeActions();
        environment.update();
    }

    // Step 2: Meditation state to reach peak UCI/Meta
    console.log('🧘 Entering Meditation (50 steps) to reach peak coherence...');
    dreamCycle.sleep(DreamCycle.MODES.MEDITATION);
    for (let i = 0; i < 50; i++) {
        dreamCycle.dreamStep();
    }
    
    const finalMetrics = agent.getStatus().consciousness;
    console.log(`✨ Coherence achieved: UCI=${finalMetrics.UCI}, Φ=${finalMetrics.layers.L1_Integration.phi}`);

    // Step 3: Save the model
    const savePath = modelManager.saveAgent(agent, 'enlightened_baseline');
    console.log(`\n🏆 The Enlightened Baseline is now preserved at: ${savePath}`);
    
    process.exit(0);
}

main().catch(err => {
    console.error('Save failed:', err);
    process.exit(1);
});
