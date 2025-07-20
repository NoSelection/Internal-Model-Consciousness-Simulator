const { Engine, Runner } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const Renderer = require('./src/visualization/Renderer');

console.log('🔧 Quick Movement Test\n');

const engine = Engine.create();
const world = new World(engine);
const environment = new Environment(world);
const agent = new Agent(world, environment);
const renderer = new Renderer(world);

environment.initialize();
agent.spawn({ x: 100, y: 100 });

const runner = Runner.create();
Runner.run(runner, engine);

console.log('Initial agent position:', agent.body.position);

// Run for exactly 180 frames (3 seconds)
let frame = 0;
const maxFrames = 180;

const testLoop = setInterval(() => {
    frame++;
    
    // Track position before update
    const beforePos = { x: agent.body.position.x, y: agent.body.position.y };
    
    // Run one simulation step
    agent.updateInternalModel();
    agent.planActions();
    agent.executeActions();
    environment.update();
    
    // Track position after update
    const afterPos = { x: agent.body.position.x, y: agent.body.position.y };
    
    // Calculate movement
    const deltaX = afterPos.x - beforePos.x;
    const deltaY = afterPos.y - beforePos.y;
    const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Log every 30 frames (0.5 seconds)
    if (frame % 30 === 0) {
        console.log(`Frame ${frame}:`);
        console.log(`  Position: (${afterPos.x.toFixed(2)}, ${afterPos.y.toFixed(2)})`);
        console.log(`  Movement this frame: ${movement.toFixed(4)}`);
        console.log(`  Current action: ${agent.currentAction?.type || 'none'} ${agent.currentAction?.direction || ''}`);
        console.log(`  Ethical score: ${agent.currentAction?.combinedScore?.toFixed(3) || 'N/A'}`);
        
        // Test visual rendering
        renderer.renderFrame(agent, environment);
        console.log('');
    }
    
    if (frame >= maxFrames) {
        clearInterval(testLoop);
        
        const finalPos = agent.body.position;
        const totalMovement = Math.sqrt(
            Math.pow(finalPos.x - 100, 2) + Math.pow(finalPos.y - 100, 2)
        );
        
        console.log('🎯 Test Results:');
        console.log(`  Started at: (100, 100)`);
        console.log(`  Ended at: (${finalPos.x.toFixed(2)}, ${finalPos.y.toFixed(2)})`);
        console.log(`  Total movement: ${totalMovement.toFixed(2)} units`);
        console.log(`  Movement per frame: ${(totalMovement / maxFrames).toFixed(4)}`);
        
        if (totalMovement > 10) {
            console.log('✅ MOVEMENT WORKING - Agent is moving visibly!');
        } else {
            console.log('❌ MOVEMENT ISSUE - Agent barely moved');
        }
        
        process.exit(0);
    }
}, 1000 / 60); // 60 FPS

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\nTest interrupted');
    clearInterval(testLoop);
    process.exit(0);
});