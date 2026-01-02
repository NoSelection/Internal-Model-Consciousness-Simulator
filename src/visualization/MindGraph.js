/**
 * ASCII Force-Directed Mind Graph
 * Visualizes the internal "connective tissue" of the agent's consciousness.
 */
class MindGraph {
    constructor(width = 40, height = 15) {
        this.width = width;
        this.height = height;
        
        // Nodes representing the modules
        this.nodes = [
            { id: 'WorldModel', label: 'W', x: 10, y: 5, vx: 0, vy: 0 },
            { id: 'SelfModel', label: 'S', x: 30, y: 5, vx: 0, vy: 0 },
            { id: 'EthicalReasoning', label: 'E', x: 10, y: 10, vx: 0, vy: 0 },
            { id: 'QLearning', label: 'Q', x: 30, y: 10, vx: 0, vy: 0 }
        ];
        
        this.center = { x: width / 2, y: height / 2 };
    }

    /**
     * Update node positions based on Mutual Information (Phi)
     * @param {Object} metrics - Consciousness metrics from agent
     * @param {Map} flows - Pairwise mutual information from IntegrationMeasure
     */
    update(metrics, flows, currentBroadcast) {
        const repulsion = 1.5;
        const springStrength = 0.5;
        const damping = 0.7;

        // 1. Forces between nodes
        for (let i = 0; i < this.nodes.length; i++) {
            const nodeA = this.nodes[i];
            
            // Attraction to center (gravity)
            nodeA.vx += (this.center.x - nodeA.x) * 0.05;
            nodeA.vy += (this.center.y - nodeA.y) * 0.05;

            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeB = this.nodes[j];
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                
                // Repulsion (Coulomb-ish)
                const forceR = repulsion / (distance * distance);
                nodeA.vx -= (dx / distance) * forceR;
                nodeA.vy -= (dy / distance) * forceR;
                nodeB.vx += (dx / distance) * forceR;
                nodeB.vy += (dy / distance) * forceR;

                // Spring Attraction based on Mutual Information (Phi)
                // If MI is high, target distance is short.
                const flowKey = this.getFlowKey(nodeA.id, nodeB.id);
                const mi = (flows && flows.get(flowKey)) ? flows.get(flowKey).mutualInformation : 0;
                
                const targetDist = Math.max(4, 15 - (mi * 5)); // Higher MI = closer
                const forceA = (distance - targetDist) * springStrength * 0.1;
                
                nodeA.vx += (dx / distance) * forceA;
                nodeA.vy += (dy / distance) * forceA;
                nodeB.vx -= (dx / distance) * forceA;
                nodeB.vy -= (dy / distance) * forceA;
            }
        }

        // 2. Apply movement
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.vx *= damping;
            node.vy *= damping;
            
            // Constrain to bounds
            node.x = Math.max(1, Math.min(this.width - 2, node.x));
            node.y = Math.max(1, Math.min(this.height - 2, node.y));
        });

        this.lastBroadcast = currentBroadcast;
    }

    getFlowKey(idA, idB) {
        // Match the key format in IntegrationMeasure
        const sorted = [idA, idB].sort();
        return `${sorted[0]}->${sorted[1]}`;
    }

    render() {
        const grid = Array(this.height).fill().map(() => Array(this.width).fill(' '));
        
        // Draw Edges (Connections)
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                this.drawLine(grid, this.nodes[i], this.nodes[j]);
            }
        }

        // Draw Nodes
        this.nodes.forEach(node => {
            const x = Math.floor(node.x);
            const y = Math.floor(node.y);
            
            // Check if this node is currently broadcasting or winning
            const isBroadcasting = this.lastBroadcast && this.lastBroadcast.source === node.id;
            
            if (isBroadcasting) {
                // Flash effect
                this.safeSet(grid, y, x-1, '>');
                this.safeSet(grid, y, x+1, '<');
                grid[y][x] = node.label.inverse ? node.label : `*${node.label}*`;
            } else {
                grid[y][x] = `(${node.label})`;
            }
        });

        return grid.map(row => row.join('')).join('\n');
    }

    drawLine(grid, nodeA, nodeB) {
        const x1 = Math.floor(nodeA.x);
        const y1 = Math.floor(nodeA.y);
        const x2 = Math.floor(nodeB.x);
        const y2 = Math.floor(nodeB.y);
        
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        let x = x1;
        let y = y1;

        while (true) {
            if (grid[y] && grid[y][x] === ' ') {
                grid[y][x] = '·';
            }
            if (x === x2 && y === y2) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x += sx; }
            if (e2 < dx) { err += dx; y += sy; }
        }
    }

    safeSet(grid, y, x, char) {
        if (grid[y] && x >= 0 && x < this.width) {
            grid[y][x] = char;
        }
    }
}

module.exports = MindGraph;
