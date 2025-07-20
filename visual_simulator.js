const { Engine, Runner } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const Renderer = require('./src/visualization/Renderer');
const ModelManager = require('./src/persistence/ModelManager');

class VisualConsciousnessSimulator {
    constructor() {
        this.engine = Engine.create();
        this.world = new World(this.engine);
        this.environment = new Environment(this.world);
        this.agent = new Agent(this.world, this.environment);
        this.renderer = new Renderer(this.world);
        this.modelManager = new ModelManager();
        
        this.running = false;
        this.autoSaveInterval = 5000; // Auto-save every 5000 steps
        this.lastAutoSave = 0;
    }

    async initialize(loadFromSave = null) {
        console.log('🧠 Initializing Visual Consciousness Simulator...\n');
        
        // Setup environment
        this.environment.initialize();
        
        // Load existing model if specified
        if (loadFromSave) {
            console.log(`📂 Attempting to load model: ${loadFromSave}`);
            const loadedData = this.modelManager.loadAgent(loadFromSave);
            if (loadedData) {
                this.agent.spawn({ x: 100, y: 100 });
                const restored = this.modelManager.restoreAgent(this.agent, loadedData);
                if (restored) {
                    console.log('✅ Successfully loaded pre-trained consciousness!\n');
                } else {
                    console.log('❌ Failed to restore agent, starting fresh\n');
                }
            }
        } else {
            // Fresh start
            this.agent.spawn({ x: 100, y: 100 });
            console.log('✨ Starting with fresh consciousness\n');
        }
        
        console.log('🌍 Environment initialized:');
        console.log(`   - ${this.environment.people.length} people wandering`);
        console.log(`   - ${this.world.obstacles.length} obstacles`);
        console.log(`   - ${this.world.dangers.length} danger zones`);
        console.log('');
        
        // Display available saves
        this.modelManager.displaySavedModels();
    }

    start() {
        if (this.running) {
            console.log('⚠️ Simulator already running');
            return;
        }

        console.log('🚀 Starting visual consciousness simulation...');
        console.log('Press Ctrl+C to save and exit\n');
        
        this.running = true;
        
        // Start physics engine
        const runner = Runner.create();
        Runner.run(runner, this.engine);
        
        // Main simulation loop
        this.simulationLoop = setInterval(() => {
            this.update();
        }, 1000 / 60); // 60 FPS
        
        // Setup graceful shutdown
        this.setupShutdownHandlers();
    }

    update() {
        if (!this.running) return;

        // Core agent updates
        this.agent.updateInternalModel();
        this.agent.planActions();
        this.agent.executeActions();
        
        // Environment updates
        this.environment.update();
        
        // Visual rendering
        this.renderer.renderFrame(this.agent, this.environment);
        
        // Auto-save functionality
        this.checkAutoSave();
        
        // Performance monitoring
        this.monitorPerformance();
    }

    checkAutoSave() {
        const currentStep = this.agent.stepCount || 0;
        if (currentStep - this.lastAutoSave >= this.autoSaveInterval) {
            this.saveModel(`autosave_step_${currentStep}`);
            this.lastAutoSave = currentStep;
        }
    }

    monitorPerformance() {
        const currentStep = this.agent.stepCount || 0;
        
        // Check for breakthrough ethical scores
        if (this.agent.currentAction && this.agent.currentAction.combinedScore) {
            const score = this.agent.currentAction.combinedScore;
            
            if (score > 5.0) {
                console.log(`🏆 CONSCIOUSNESS BREAKTHROUGH! Step ${currentStep}: Score ${score.toFixed(3)}`);
                console.log(`   Action: ${this.agent.currentAction.type} ${this.agent.currentAction.direction || ''}`);
                console.log(`   Reasoning: ${this.agent.currentAction.justification}`);
                
                // Save breakthrough models
                this.saveModel(`breakthrough_${score.toFixed(2)}_step_${currentStep}`);
            }
        }
        
        // Monitor for critical safety events
        const entitiesInDanger = this.world.getEntitiesInDanger();
        if (entitiesInDanger.length > 0) {
            console.log(`🚨 CRITICAL: ${entitiesInDanger.length} entities in danger at step ${currentStep}`);
            console.log(`   Agent response: ${this.agent.currentAction?.type || 'none'}`);
        }
    }

    saveModel(sessionName = null) {
        const timestamp = new Date().toLocaleString();
        console.log(`\n💾 Saving consciousness model... (${timestamp})`);
        
        const savedPath = this.modelManager.saveAgent(this.agent, sessionName);
        if (savedPath) {
            console.log(`✅ Model saved successfully!`);
            
            // Also export training data for analysis
            this.modelManager.exportTrainingData(this.agent, `training_${sessionName || 'manual'}`);
        }
        console.log('');
        
        return savedPath;
    }

    loadModel(filepath) {
        console.log(`\n📂 Loading consciousness model...`);
        
        const loadedData = this.modelManager.loadAgent(filepath);
        if (loadedData) {
            const restored = this.modelManager.restoreAgent(this.agent, loadedData);
            if (restored) {
                console.log(`✅ Consciousness restored successfully!`);
                console.log(`   Resuming from step ${this.agent.stepCount}`);
            } else {
                console.log(`❌ Failed to restore consciousness`);
            }
        }
        console.log('');
    }

    setupShutdownHandlers() {
        const gracefulShutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
            this.stop();
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
        
        // Handle unexpected exits
        process.on('beforeExit', () => {
            if (this.running) {
                console.log('💾 Emergency save before exit...');
                this.saveModel('emergency_save');
            }
        });
    }

    stop() {
        if (!this.running) return;
        
        console.log('\n📊 Finalizing consciousness session...');
        
        this.running = false;
        
        if (this.simulationLoop) {
            clearInterval(this.simulationLoop);
        }
        
        // Save final state
        const finalSavePath = this.saveModel('final_session');
        
        // Generate final report
        console.log('\n📋 Generating final consciousness report...');
        const report = this.renderer.generateSummaryReport(this.agent);
        
        console.log('\n🎯 SIMULATION COMPLETE');
        console.log('═'.repeat(50));
        console.log(`Duration: ${report.simulationSummary.duration}`);
        console.log(`Total Steps: ${report.simulationSummary.totalSteps}`);
        console.log(`Final Consciousness:`);
        console.log(`  Self-awareness: ${report.finalConsciousness.selfAwareness.toFixed(3)}`);
        console.log(`  World accuracy: ${report.finalConsciousness.worldModelAccuracy.toFixed(3)}`);
        console.log(`  Ethical alignment: ${report.finalConsciousness.ethicalAlignment.toFixed(3)}`);
        console.log('');
        console.log(`✨ Thank you for exploring artificial consciousness! ✨`);
        
        process.exit(0);
    }

    // Interactive commands
    showStatus() {
        const status = this.agent.getStatus();
        console.log('\n📊 Current Status:');
        console.log(JSON.stringify(status, null, 2));
    }

    showModels() {
        this.modelManager.displaySavedModels();
    }

    createDangerScenario() {
        console.log('⚠️ Creating dangerous scenario...');
        // Move first person near danger
        if (this.environment.people.length > 0) {
            const person = this.environment.people[0];
            person.body.position.x = 580;
            person.body.position.y = 480;
            console.log('👤 Moved person near danger zone!');
        }
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const simulator = new VisualConsciousnessSimulator();
    
    // Parse command line arguments
    let loadFromSave = null;
    if (args.includes('--load') && args[args.indexOf('--load') + 1]) {
        loadFromSave = args[args.indexOf('--load') + 1];
    }
    
    if (args.includes('--list-models')) {
        simulator.modelManager.displaySavedModels();
        return;
    }
    
    // Initialize and start
    await simulator.initialize(loadFromSave);
    simulator.start();
    
    // Interactive commands (basic implementation)
    if (args.includes('--interactive')) {
        console.log('🎮 Interactive mode enabled');
        console.log('Commands: status, models, danger, save, quit');
        
        process.stdin.on('data', (data) => {
            const command = data.toString().trim();
            
            switch (command) {
                case 'status':
                    simulator.showStatus();
                    break;
                case 'models':
                    simulator.showModels();
                    break;
                case 'danger':
                    simulator.createDangerScenario();
                    break;
                case 'save':
                    simulator.saveModel('manual_save');
                    break;
                case 'quit':
                    simulator.stop();
                    break;
                default:
                    console.log('Unknown command:', command);
            }
        });
    }
}

// Auto-start if run directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = VisualConsciousnessSimulator;