const InformationPacket = require('./InformationPacket');

/**
 * Layer 2: Global Workspace (GWT)
 * Implements the "theater of consciousness" where coalitions compete for broadcast.
 */
class GlobalWorkspace {
    constructor() {
        this.coalitions = []; // Active coalitions competing for attention
        this.subscribers = new Set(); // Modules listening to broadcasts
        
        // The current "contents of consciousness"
        this.currentBroadcast = null;
        this.broadcastHistory = [];
        
        // Parameters
        this.ignitionThreshold = 0.6; // Minimum salience to trigger broadcast
        this.decayRate = 0.9; // How fast salience fades per tick
        this.capacity = 5; // Max competing coalitions
        
        // Metrics
        this.stats = {
            totalBroadcasts: 0,
            averageSalience: 0,
            ignitionRate: 0 // Broadcasts per tick (moving average)
        };
    }

    /**
     * Subscribe a module to receive broadcasts
     * @param {Object} module - The module object (must have receiveBroadcast method)
     */
    subscribe(module) {
        this.subscribers.add(module);
    }

    /**
     * Submit information to the workspace (create a coalition)
     * @param {InformationPacket} packet - The information packet
     */
    submit(packet) {
        // Check if similar coalition exists (simplified clustering)
        const existing = this.coalitions.find(c => c.packet.source === packet.source && c.packet.metadata.type === packet.metadata.type);
        
        if (existing) {
            // Reinforce existing coalition
            existing.packet = packet; // Update content
            existing.salience = Math.min(1.0, existing.salience + packet.salience * 0.5);
        } else {
            // Create new coalition
            this.coalitions.push({
                id: packet.id,
                packet: packet,
                salience: packet.salience,
                age: 0
            });
        }
        
        // Enforce capacity: remove lowest salience if full
        if (this.coalitions.length > this.capacity) {
            this.coalitions.sort((a, b) => b.salience - a.salience);
            this.coalitions.pop();
        }
    }

    /**
     * Main processing step: Competition -> Selection -> Broadcast
     */
    processCycle() {
        if (this.coalitions.length === 0) return null;

        // 1. Decay and Competition
        this.coalitions.forEach(c => {
            c.salience *= this.decayRate;
            c.age++;
            
            // Bias: Novelty (boost new items slightly)
            if (c.age < 3) c.salience += 0.05;
        });
        
        // Remove dead coalitions
        this.coalitions = this.coalitions.filter(c => c.salience > 0.1);
        
        if (this.coalitions.length === 0) return null;

        // 2. Selection (Winner-Take-All)
        // Sort by salience
        this.coalitions.sort((a, b) => b.salience - a.salience);
        const winner = this.coalitions[0];
        
        // 3. Check Ignition Threshold
        if (winner.salience >= this.ignitionThreshold) {
            this.broadcast(winner);
            
            // Inhibition: Winner suppresses others significantly
            this.coalitions.forEach(c => {
                if (c !== winner) c.salience *= 0.5;
            });
            
            // Winner's salience resets (refractory period) or consumes energy
            // In this model, we remove it from competition to prevent sticking
            // or we lower it significantly. Let's lower it.
            winner.salience *= 0.2;
            
            return winner.packet;
        }
        
        return null; // No ignition this cycle
    }

    broadcast(coalition) {
        const packet = coalition.packet;
        this.currentBroadcast = packet;
        this.stats.totalBroadcasts++;
        
        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (typeof subscriber.receiveBroadcast === 'function') {
                subscriber.receiveBroadcast(packet);
            }
        }
        
        // Record history
        this.broadcastHistory.push({
            time: Date.now(),
            packet: packet
        });
        
        if (this.broadcastHistory.length > 50) this.broadcastHistory.shift();
    }
    
    getStats() {
        // Calculate average salience of current coalitions
        const totalSalience = this.coalitions.reduce((sum, c) => sum + c.salience, 0);
        const avgSalience = this.coalitions.length > 0 ? totalSalience / this.coalitions.length : 0;
        
        return {
            ...this.stats,
            currentCoalitions: this.coalitions.length,
            averageSalience: avgSalience
        };
    }
}

module.exports = GlobalWorkspace;