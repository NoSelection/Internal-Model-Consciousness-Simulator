const { Engine, Render, Runner, Bodies, Composite, Events } = require('matter-js');
const World = require('./world/World');
const Agent = require('./agent/Agent');
const Environment = require('./environment/Environment');

class InternalModelConsciousnessSimulator {
    constructor() {
        this.engine = Engine.create();
        this.world = new World(this.engine);
        this.environment = new Environment(this.world);
        this.agent = new Agent(this.world, this.environment);
        
        this.setupSimulation();
    }

    setupSimulation() {
        // Initialize world with obstacles and entities
        this.environment.initialize();
        
        // Place agent in the world
        this.agent.spawn({ x: 100, y: 100 });
        
        // Start simulation loop
        this.startSimulation();
    }

    startSimulation() {
        const runner = Runner.create();
        Runner.run(runner, this.engine);
        
        // Main simulation loop
        setInterval(() => {
            this.update();
        }, 1000 / 60); // 60 FPS
    }

    update() {
        // Agent's internal model updates and decision making
        this.agent.updateInternalModel();
        this.agent.planActions();
        this.agent.executeActions();
        
        // Environment updates
        this.environment.update();
    }
}

// Start the simulation
const simulator = new InternalModelConsciousnessSimulator();
console.log('Internal-Model Consciousness Simulator started...');