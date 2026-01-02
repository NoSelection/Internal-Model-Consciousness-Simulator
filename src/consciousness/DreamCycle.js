/**
 * Dream Cycle Module
 *
 * Implements two distinct sleep modes to study consciousness:
 *
 * 1. MEDITATION_MODE: Sensory gating + intact metacognition
 *    - Results in hyper-coherence (UCI = 1.0, perfect calibration)
 *    - Models: Flow states, deep meditation, focused introspection
 *
 * 2. REM_DREAM_MODE: Sensory gating + dampened metacognition + noise
 *    - Should produce the "racing mind" pattern (high Φ, low Meta)
 *    - Models: REM sleep, dreams, prefrontal deactivation
 *
 * Key finding: "Dreaming = Meditation without Metacognition"
 */

const InformationPacket = require('./InformationPacket');

// Sleep mode constants
const SLEEP_MODES = {
    MEDITATION: 'meditation',  // Peaceful, high coherence
    REM_DREAM: 'rem_dream'     // Chaotic, low meta-awareness
};

class DreamCycle {
    constructor(agent) {
        this.agent = agent;
        this.isAsleep = false;
        this.sleepMode = null;

        // Store original methods for gating
        this.originalMethods = {};

        // Dream state tracking
        this.dreamState = {
            mode: null,
            cycleCount: 0,
            replayCount: 0,
            dreamCoalitions: 0,
            bizarreEvents: 0,      // Track weird dream content
            wakeMetrics: null,
            sleepMetrics: []
        };

        // Mode-specific configurations
        this.modeConfigs = {
            [SLEEP_MODES.MEDITATION]: {
                replayFrequency: 5,
                dreamIntensity: 0.7,
                sensoryGateStrength: 1.0,
                metacognitionDampening: 0,     // Full metacognition
                noiseInjection: 0,             // No bizarre content
                description: 'Peaceful introspection - sensory gated, meta intact'
            },
            [SLEEP_MODES.REM_DREAM]: {
                replayFrequency: 3,            // More frequent replay
                dreamIntensity: 0.9,           // More vivid
                sensoryGateStrength: 1.0,
                metacognitionDampening: 0.8,   // 80% reduction in meta
                noiseInjection: 0.4,           // 40% chance of bizarre content
                description: 'REM dreaming - sensory gated, meta dampened, chaos injected'
            }
        };

        // Active config (set when entering sleep)
        this.config = null;
    }

    // Expose modes for external use
    static get MODES() {
        return SLEEP_MODES;
    }

    /**
     * Enter sleep mode - gate sensory inputs, activate internal processing
     * @param {string} mode - SLEEP_MODES.MEDITATION or SLEEP_MODES.REM_DREAM
     */
    sleep(mode = SLEEP_MODES.MEDITATION) {
        if (this.isAsleep) return;

        this.sleepMode = mode;
        this.config = this.modeConfigs[mode];
        this.dreamState.mode = mode;

        const modeName = mode === SLEEP_MODES.MEDITATION ? 'MEDITATION' : 'REM DREAM';

        console.log(`\n[SLEEP] ENTERING ${modeName} MODE...`);
        console.log(`  ${this.config.description}`);
        if (mode === SLEEP_MODES.REM_DREAM) {
            console.log(`  Metacognition dampened by ${this.config.metacognitionDampening * 100}%`);
            console.log(`  Bizarre content injection: ${this.config.noiseInjection * 100}% chance`);
        }
        console.log('');

        // Capture baseline wake metrics
        this.dreamState.wakeMetrics = this.agent.getStatus().consciousness;
        this.dreamState.sleepMetrics = [];
        this.dreamState.cycleCount = 0;
        this.dreamState.bizarreEvents = 0;

        // Gate sensory input: Replace updateWorldState to ignore external input
        this.originalMethods.updateWorldState = this.agent.worldModel.updateWorldState.bind(this.agent.worldModel);

        this.agent.worldModel.updateWorldState = (worldState) => {
            if (this.config.sensoryGateStrength < 1.0) {
                if (Math.random() > this.config.sensoryGateStrength) {
                    this.originalMethods.updateWorldState(worldState);
                }
            }
        };

        // Gate environment danger detection during sleep
        this.originalMethods.predictDangerousEvents = this.agent.worldModel.predictDangerousEvents.bind(this.agent.worldModel);

        this.agent.worldModel.predictDangerousEvents = (horizon) => {
            return this.generateDreamDangers();
        };

        // REM MODE: Dampen metacognition (simulate prefrontal deactivation)
        if (mode === SLEEP_MODES.REM_DREAM && this.config.metacognitionDampening > 0) {
            this.originalMethods.metaUpdate = this.agent.metaCognition.update.bind(this.agent.metaCognition);
            this.originalMethods.metaRecordOutcome = this.agent.metaCognition.recordOutcome.bind(this.agent.metaCognition);
            this.originalMethods.metaGetMetrics = this.agent.metaCognition.getMetrics.bind(this.agent.metaCognition);

            // Store original calibration to restore later
            this.originalMethods.calibration = this.agent.metaCognition.performanceCalibration.actualSuccess;

            // Corrupt the calibration during REM (dreaming = unreliable self-assessment)
            this.agent.metaCognition.performanceCalibration.actualSuccess = 0;

            // Dampened metacognition - runs less frequently and with noise
            this.agent.metaCognition.update = () => {
                if (Math.random() > this.config.metacognitionDampening) {
                    // Only occasionally runs
                    this.originalMethods.metaUpdate();
                } else {
                    // Dreaming: meta is "offline"
                    this.agent.metaCognition.metacognitiveState.currentFocus = 'dreaming';
                }
            };

            this.agent.metaCognition.recordOutcome = (confidence, success) => {
                // During REM, confidence calibration is unreliable
                if (Math.random() > this.config.metacognitionDampening) {
                    this.originalMethods.metaRecordOutcome(confidence, success);
                }
                // Otherwise, outcome is not recorded (dream logic)
            };

            // Override getMetrics to show dampened state
            this.agent.metaCognition.getMetrics = () => {
                const original = this.originalMethods.metaGetMetrics();
                return {
                    ...original,
                    focus: 'dreaming',
                    calibration: original.calibration * (1 - this.config.metacognitionDampening)
                };
            };
        }

        this.isAsleep = true;
    }

    /**
     * Wake up - restore normal sensory processing
     */
    wake() {
        if (!this.isAsleep) return;

        const modeName = this.sleepMode === SLEEP_MODES.MEDITATION ? 'MEDITATION' : 'REM DREAM';

        console.log('\n[WAKE] Waking up...');
        console.log(`  Mode was: ${modeName}`);
        console.log(`  Cycles completed: ${this.dreamState.cycleCount}`);
        console.log(`  Memory replays: ${this.dreamState.replayCount}`);
        if (this.sleepMode === SLEEP_MODES.REM_DREAM) {
            console.log(`  Bizarre events: ${this.dreamState.bizarreEvents}`);
        }
        console.log('');

        // Restore original methods
        if (this.originalMethods.updateWorldState) {
            this.agent.worldModel.updateWorldState = this.originalMethods.updateWorldState;
        }
        if (this.originalMethods.predictDangerousEvents) {
            this.agent.worldModel.predictDangerousEvents = this.originalMethods.predictDangerousEvents;
        }
        // Restore metacognition if it was dampened
        if (this.originalMethods.metaUpdate) {
            this.agent.metaCognition.update = this.originalMethods.metaUpdate;
        }
        if (this.originalMethods.metaRecordOutcome) {
            this.agent.metaCognition.recordOutcome = this.originalMethods.metaRecordOutcome;
        }
        if (this.originalMethods.metaGetMetrics) {
            this.agent.metaCognition.getMetrics = this.originalMethods.metaGetMetrics;
        }
        if (this.originalMethods.calibration !== undefined) {
            this.agent.metaCognition.performanceCalibration.actualSuccess = this.originalMethods.calibration;
        }

        this.isAsleep = false;
        this.sleepMode = null;
        this.originalMethods = {};

        // Return sleep analysis
        return this.analyzeSleep();
    }

    /**
     * Process one dream cycle - called instead of normal agent update during sleep
     */
    dreamStep() {
        if (!this.isAsleep) return;

        this.dreamState.cycleCount++;

        // 1. Internal Replay - consolidate memories
        if (this.dreamState.cycleCount % this.config.replayFrequency === 0) {
            this.agent.qLearning.replayExperiences(64); // Larger batch during sleep
            this.dreamState.replayCount++;

            // Generate dream content from replay
            this.generateDreamContent();
        }

        // 2. Let WorldModel make predictions without external validation
        // These become "dream imagery"
        const dreamPredictions = this.agent.worldModel.predictEntityMovement('dream_entity', 30);

        // 3. Run the Global Workspace on internal content only
        this.agent.globalWorkspace.processCycle();

        // 4. MetaCognition still monitors (lucid dreaming potential?)
        this.agent.metaCognition.update();

        // 5. Record consciousness metrics during sleep
        const metrics = this.agent.getStatus().consciousness;
        this.dreamState.sleepMetrics.push({
            cycle: this.dreamState.cycleCount,
            uci: parseFloat(metrics.UCI),
            phi: parseFloat(metrics.layers.L1_Integration.phi),
            broadcasts: metrics.layers.L2_GlobalWorkspace.broadcasts,
            metaAccuracy: parseFloat(metrics.layers.L3_MetaCognition.accuracy)
        });

        // 6. Integration still runs - measuring internal coherence
        this.agent.integrationMeasure.recordModuleState('DreamContent', {
            cycle: this.dreamState.cycleCount,
            replayActive: this.dreamState.cycleCount % this.config.replayFrequency === 0
        });
    }

    /**
     * Generate dream content from internal sources
     * In REM mode, also injects bizarre/impossible content
     */
    generateDreamContent() {
        // Pull from experience buffer
        const experiences = this.agent.qLearning.experienceBuffer;
        if (experiences.length === 0) return;

        // Select random memories to "dream about"
        const dreamMemory = experiences[Math.floor(Math.random() * experiences.length)];

        // REM MODE: Inject bizarre content (dream logic)
        let dreamContent = {
            type: 'memory_replay',
            content: dreamMemory,
            dreamCycle: this.dreamState.cycleCount
        };

        if (this.sleepMode === SLEEP_MODES.REM_DREAM && Math.random() < this.config.noiseInjection) {
            // Generate bizarre dream content - mix memories, impossible scenarios
            dreamContent = this.generateBizarreContent(dreamMemory);
            this.dreamState.bizarreEvents++;
        }

        // Create dream coalition for Global Workspace
        const dreamPacket = new InformationPacket(
            'DreamGenerator',
            dreamContent,
            this.config.dreamIntensity,
            this.sleepMode === SLEEP_MODES.REM_DREAM ? 0.3 : 0.6, // Lower confidence in REM
            {
                type: 'dream_content',
                source: dreamContent.bizarre ? 'bizarre' : 'memory',
                mode: this.sleepMode
            }
        );

        this.agent.globalWorkspace.submit(dreamPacket);
        this.dreamState.dreamCoalitions++;

        // Sometimes generate predictive dreams (future simulation)
        if (Math.random() < 0.3) {
            const predictivePacket = new InformationPacket(
                'DreamGenerator',
                {
                    type: 'future_simulation',
                    prediction: this.agent.worldModel.predictions,
                    dreamCycle: this.dreamState.cycleCount,
                    bizarre: this.sleepMode === SLEEP_MODES.REM_DREAM && Math.random() < 0.5
                },
                this.config.dreamIntensity * 0.8,
                0.2,
                { type: 'dream_content', source: 'prediction' }
            );

            this.agent.globalWorkspace.submit(predictivePacket);
        }
    }

    /**
     * Generate bizarre/impossible dream content (REM mode only)
     * Simulates the strange logic of dreams
     */
    generateBizarreContent(baseMemory) {
        const bizarreTypes = [
            'impossible_physics',    // Things moving wrong
            'entity_morphing',       // Person becomes obstacle
            'space_warping',         // Distances change
            'time_loop',             // Same event repeating
            'merged_memories'        // Two memories combined
        ];

        const bizarreType = bizarreTypes[Math.floor(Math.random() * bizarreTypes.length)];

        return {
            type: 'bizarre_dream',
            bizarre: true,
            bizarreType,
            baseMemory,
            dreamCycle: this.dreamState.cycleCount,
            // Generate impossible values
            impossibleState: {
                x: Math.random() * 10000 - 5000,  // Way out of bounds
                y: Math.random() * 10000 - 5000,
                vx: Math.random() * 100,           // Impossible velocity
                vy: Math.random() * 100
            },
            narrative: this.generateDreamNarrative(bizarreType)
        };
    }

    /**
     * Generate a dream "narrative" fragment
     */
    generateDreamNarrative(bizarreType) {
        const narratives = {
            'impossible_physics': 'falling upward through solid ground',
            'entity_morphing': 'the person became a wall became a danger',
            'space_warping': 'the goal moved further as I approached',
            'time_loop': 'I saved them, but then I was saving them again',
            'merged_memories': 'two places at once, two times at once'
        };
        return narratives[bizarreType] || 'something impossible happened';
    }

    /**
     * Generate imagined dangers during dreams (nightmares?)
     */
    generateDreamDangers() {
        // During dreams, "dangers" come from memory/imagination
        const dreamDangers = [];

        // Sometimes replay past danger experiences
        if (Math.random() < 0.2) {
            dreamDangers.push({
                entityId: 'dream_entity',
                dangerType: 'imagined_threat',
                timeToEvent: Math.floor(Math.random() * 30) + 10,
                position: {
                    x: Math.random() * 800,
                    y: Math.random() * 600
                },
                confidence: 0.4, // Dream dangers feel less certain
                severity: Math.random() < 0.3 ? 'high' : 'medium'
            });
        }

        return dreamDangers;
    }

    /**
     * Analyze sleep session - compare wake vs sleep consciousness
     */
    analyzeSleep() {
        if (this.dreamState.sleepMetrics.length === 0) {
            return { error: 'No sleep data collected' };
        }

        const wake = this.dreamState.wakeMetrics;
        const sleepData = this.dreamState.sleepMetrics;

        // Calculate averages during sleep
        const avgSleepUCI = sleepData.reduce((s, m) => s + m.uci, 0) / sleepData.length;
        const avgSleepPhi = sleepData.reduce((s, m) => s + m.phi, 0) / sleepData.length;
        const avgSleepMeta = sleepData.reduce((s, m) => s + m.metaAccuracy, 0) / sleepData.length;

        const analysis = {
            duration: this.dreamState.cycleCount,
            replays: this.dreamState.replayCount,
            dreamCoalitions: this.dreamState.dreamCoalitions,

            comparison: {
                wake: {
                    uci: parseFloat(wake.UCI),
                    phi: parseFloat(wake.layers.L1_Integration.phi),
                    meta: parseFloat(wake.layers.L3_MetaCognition.accuracy)
                },
                sleep: {
                    uci: avgSleepUCI,
                    phi: avgSleepPhi,
                    meta: avgSleepMeta
                }
            },

            findings: []
        };

        // Interpret findings
        if (avgSleepPhi > parseFloat(wake.layers.L1_Integration.phi)) {
            analysis.findings.push('Φ INCREASED during sleep - internal integration enhanced');
        } else if (avgSleepPhi < parseFloat(wake.layers.L1_Integration.phi) * 0.5) {
            analysis.findings.push('Φ DECREASED during sleep - modules drifted apart');
        } else {
            analysis.findings.push('Φ remained stable during sleep');
        }

        if (avgSleepMeta < parseFloat(wake.layers.L3_MetaCognition.accuracy) * 0.5) {
            analysis.findings.push('Metacognition reduced - dream-like state confirmed');
        }

        if (this.dreamState.dreamCoalitions > this.dreamState.cycleCount * 0.5) {
            analysis.findings.push('High dream content generation - active internal processing');
        }

        return analysis;
    }

    /**
     * Get current dream state for visualization
     */
    getState() {
        return {
            isAsleep: this.isAsleep,
            ...this.dreamState,
            config: this.config
        };
    }
}

module.exports = DreamCycle;
