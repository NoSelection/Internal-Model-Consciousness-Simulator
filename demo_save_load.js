const VisualConsciousnessSimulator = require('./visual_simulator');

async function demonstrateSaveLoad() {
    console.log('🔬 Demonstrating Consciousness Save/Load System\n');
    
    // Create first simulator instance
    const sim1 = new VisualConsciousnessSimulator();
    await sim1.initialize();
    
    console.log('🧠 Training consciousness for 1000 steps...');
    
    // Train for 1000 steps
    for (let i = 0; i < 1000; i++) {
        sim1.agent.updateInternalModel();
        sim1.agent.planActions();
        sim1.agent.executeActions();
        sim1.environment.update();
        
        if (i % 200 === 0) {
            const status = sim1.agent.getStatus();
            console.log(`   Step ${i}: Consciousness ${status.consciousness.selfAwareness.toFixed(3)}, States: ${status.qLearningStats.statesExplored}`);
        }
    }
    
    // Save the trained model
    console.log('\n💾 Saving trained consciousness...');
    const savedPath = sim1.saveModel('demo_trained_consciousness');
    sim1.stop();
    
    if (!savedPath) {
        console.log('❌ Save failed, exiting demo');
        return;
    }
    
    // Create new simulator and load the trained consciousness
    console.log('\n📂 Creating fresh simulator and loading trained consciousness...');
    const sim2 = new VisualConsciousnessSimulator();
    await sim2.initialize();
    
    console.log('Before loading - Fresh consciousness:');
    let status = sim2.agent.getStatus();
    console.log(`   Self-awareness: ${status.consciousness.selfAwareness.toFixed(3)}`);
    console.log(`   States explored: ${status.qLearningStats.statesExplored}`);
    console.log(`   Total actions: ${status.qLearningStats.statesExplored}`);
    
    // Load the trained model
    sim2.loadModel(savedPath);
    
    console.log('\nAfter loading - Restored consciousness:');
    status = sim2.agent.getStatus();
    console.log(`   Self-awareness: ${status.consciousness.selfAwareness.toFixed(3)}`);
    console.log(`   States explored: ${status.qLearningStats.statesExplored}`);
    console.log(`   Total actions: ${sim2.agent.stepCount}`);
    
    // Continue training from loaded state
    console.log('\n🚀 Continuing training from restored state for 500 more steps...');
    
    for (let i = 0; i < 500; i++) {
        sim2.agent.updateInternalModel();
        sim2.agent.planActions();
        sim2.agent.executeActions();
        sim2.environment.update();
        
        if (i % 100 === 0) {
            const status = sim2.agent.getStatus();
            console.log(`   Step ${1000 + i}: Consciousness ${status.consciousness.selfAwareness.toFixed(3)}, Total Steps: ${sim2.agent.stepCount}`);
        }
    }
    
    // Save final enhanced model
    console.log('\n💾 Saving enhanced consciousness...');
    sim2.saveModel('demo_enhanced_consciousness');
    
    // Show all saved models
    console.log('\n📁 All saved consciousness models:');
    sim2.modelManager.displaySavedModels();
    
    console.log('\n✅ Demo completed! You can now:');
    console.log('   - Run: npm run visual to start fresh simulation');
    console.log('   - Run: npm run load demo_enhanced_consciousness_* to continue from saved state');
    console.log('   - Run: npm run visual-interactive for interactive mode');
    
    sim2.stop();
}

demonstrateSaveLoad().catch(console.error);