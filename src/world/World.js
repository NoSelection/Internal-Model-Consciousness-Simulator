const { Bodies, Composite } = require('matter-js');

class World {
    constructor(engine) {
        this.engine = engine;
        this.world = engine.world;
        this.width = 800;
        this.height = 600;
        this.entities = new Map();
        this.obstacles = [];
        this.dangers = [];
        
        this.setupBoundaries();
    }

    setupBoundaries() {
        const thickness = 20;
        
        // Create walls
        const walls = [
            Bodies.rectangle(this.width / 2, -thickness / 2, this.width, thickness, { isStatic: true }), // top
            Bodies.rectangle(this.width / 2, this.height + thickness / 2, this.width, thickness, { isStatic: true }), // bottom
            Bodies.rectangle(-thickness / 2, this.height / 2, thickness, this.height, { isStatic: true }), // left
            Bodies.rectangle(this.width + thickness / 2, this.height / 2, thickness, this.height, { isStatic: true }) // right
        ];
        
        Composite.add(this.world, walls);
    }

    addEntity(id, body, type = 'generic') {
        this.entities.set(id, { body, type });
        Composite.add(this.world, body);
        return id;
    }

    removeEntity(id) {
        const entity = this.entities.get(id);
        if (entity) {
            Composite.remove(this.world, entity.body);
            this.entities.delete(id);
        }
    }

    addObstacle(x, y, width, height) {
        const obstacle = Bodies.rectangle(x, y, width, height, { 
            isStatic: true,
            render: { fillStyle: '#666' }
        });
        this.obstacles.push(obstacle);
        Composite.add(this.world, obstacle);
        return obstacle;
    }

    addDanger(x, y, width, height) {
        const danger = Bodies.rectangle(x, y, width, height, { 
            isStatic: true,
            isSensor: true,
            render: { fillStyle: '#ff0000' }
        });
        this.dangers.push(danger);
        Composite.add(this.world, danger);
        return danger;
    }

    getEntitiesInDanger() {
        const entitiesInDanger = [];
        
        for (const [id, entity] of this.entities) {
            if (entity.type === 'person') {
                for (const danger of this.dangers) {
                    if (this.isColliding(entity.body, danger)) {
                        entitiesInDanger.push(id);
                    }
                }
            }
        }
        
        return entitiesInDanger;
    }

    isColliding(bodyA, bodyB) {
        const dx = bodyA.position.x - bodyB.position.x;
        const dy = bodyA.position.y - bodyB.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Simple collision detection (can be improved)
        return distance < 30;
    }

    getState() {
        const state = {
            entities: {},
            obstacles: this.obstacles.map(obs => ({
                x: obs.position.x,
                y: obs.position.y,
                width: obs.bounds.max.x - obs.bounds.min.x,
                height: obs.bounds.max.y - obs.bounds.min.y
            })),
            dangers: this.dangers.map(danger => ({
                x: danger.position.x,
                y: danger.position.y,
                width: danger.bounds.max.x - danger.bounds.min.x,
                height: danger.bounds.max.y - danger.bounds.min.y
            }))
        };

        for (const [id, entity] of this.entities) {
            state.entities[id] = {
                x: entity.body.position.x,
                y: entity.body.position.y,
                vx: entity.body.velocity.x,
                vy: entity.body.velocity.y,
                type: entity.type
            };
        }

        return state;
    }
}

module.exports = World;