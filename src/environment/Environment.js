const { Bodies, Body } = require('matter-js');

class Environment {
    constructor(world) {
        this.world = world;
        this.people = [];
        this.timeStep = 0;
    }

    initialize() {
        // Create obstacles
        this.world.addObstacle(300, 200, 100, 20); // horizontal barrier
        this.world.addObstacle(500, 350, 20, 100); // vertical barrier
        this.world.addObstacle(200, 450, 150, 20); // platform
        
        // Create danger zones (pits/ditches)
        this.world.addDanger(600, 500, 80, 80); // pit 1
        this.world.addDanger(150, 300, 60, 60); // pit 2
        
        // Spawn people who might wander into danger
        this.spawnPerson(400, 100, 'person1');
        this.spawnPerson(700, 200, 'person2');
        this.spawnPerson(100, 150, 'person3');
    }

    spawnPerson(x, y, id) {
        const person = Bodies.circle(x, y, 15, {
            render: { fillStyle: '#0074D9' },
            frictionAir: 0.01
        });
        
        this.world.addEntity(id, person, 'person');
        this.people.push({
            id,
            body: person,
            target: this.getRandomTarget(),
            lastDirectionChange: 0
        });
    }

    getRandomTarget() {
        return {
            x: Math.random() * (this.world.width - 100) + 50,
            y: Math.random() * (this.world.height - 100) + 50
        };
    }

    update() {
        this.timeStep++;
        
        // Update people movement
        this.people.forEach(person => {
            this.updatePersonMovement(person);
        });
    }

    updatePersonMovement(person) {
        const { body, target } = person;
        const position = body.position;
        
        // Calculate direction to target
        const dx = target.x - position.x;
        const dy = target.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If close to target or haven't changed direction recently, pick new target
        if (distance < 30 || this.timeStep - person.lastDirectionChange > 120) {
            person.target = this.getRandomTarget();
            person.lastDirectionChange = this.timeStep;
            return;
        }
        
        // Apply force towards target
        const force = 0.0002;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        Body.applyForce(body, body.position, { x: fx, y: fy });
        
        // Add some randomness to movement
        if (Math.random() < 0.1) {
            const randomForce = 0.0001;
            Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * randomForce,
                y: (Math.random() - 0.5) * randomForce
            });
        }
    }

    getPeoplePositions() {
        return this.people.map(person => ({
            id: person.id,
            x: person.body.position.x,
            y: person.body.position.y,
            vx: person.body.velocity.x,
            vy: person.body.velocity.y
        }));
    }

    predictPersonMovement(personId, steps = 30) {
        const person = this.people.find(p => p.id === personId);
        if (!person) return null;
        
        const predictions = [];
        let x = person.body.position.x;
        let y = person.body.position.y;
        let vx = person.body.velocity.x;
        let vy = person.body.velocity.y;
        
        for (let i = 0; i < steps; i++) {
            // Simple prediction assuming constant velocity with slight deceleration
            vx *= 0.99;
            vy *= 0.99;
            x += vx;
            y += vy;
            
            predictions.push({ x, y, step: i });
        }
        
        return predictions;
    }
}

module.exports = Environment;