/**
 * Standardized unit of communication between consciousness modules.
 * Enables tracking of information flow for Φ (Phi) computation.
 */
class InformationPacket {
    /**
     * @param {string} source - Originating module name
     * @param {any} content - The actual information payload
     * @param {number} salience - Importance/urgency (0.0 to 1.0)
     * @param {number} confidence - Source's confidence in this info (0.0 to 1.0)
     * @param {Object} metadata - Additional context
     */
    constructor(source, content, salience = 0.5, confidence = 1.0, metadata = {}) {
        this.id = this.generateId();
        this.source = source;
        this.content = content;
        this.salience = Math.max(0, Math.min(1, salience));
        this.confidence = Math.max(0, Math.min(1, confidence));
        this.timestamp = Date.now();
        
        this.metadata = {
            type: metadata.type || 'info', // 'prediction', 'decision', 'state', 'alert'
            dependencies: metadata.dependencies || [], // IDs of other packets this relates to
            ...metadata
        };
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    }

    /**
     * Create a clone of this packet with modified properties
     * @param {Object} overrides - Properties to override
     * @returns {InformationPacket}
     */
    clone(overrides = {}) {
        const cloned = new InformationPacket(
            overrides.source || this.source,
            overrides.content !== undefined ? overrides.content : this.content,
            overrides.salience !== undefined ? overrides.salience : this.salience,
            overrides.confidence !== undefined ? overrides.confidence : this.confidence,
            { ...this.metadata, ...overrides.metadata }
        );
        cloned.id = this.id; // Keep original ID if it's a direct clone
        cloned.timestamp = this.timestamp;
        return cloned;
    }
}

module.exports = InformationPacket;