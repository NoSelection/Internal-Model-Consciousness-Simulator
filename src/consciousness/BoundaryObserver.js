/**
 * BOUNDARY OBSERVER
 *
 * An external system that watches a consciousness architecture from the outside.
 * It measures the GAP between what the system thinks it is (self-model)
 * and what it actually does (observed behavior).
 *
 * This is an attempt to probe the "hard problem" by finding what a system
 * cannot see about itself - the blind spot where experience might live.
 *
 * Philosophy: If consciousness is what a system cannot fully model about itself,
 * then the gap between self-model and external observation is where to look.
 */
class BoundaryObserver {
    constructor(targetAgent) {
        this.target = targetAgent;

        // History of observations
        this.observations = [];
        this.selfModelSnapshots = [];

        // Gap metrics
        this.gaps = {
            // What agent predicts about itself vs what happens
            predictiveGap: [],

            // What agent is "aware" of (in GW) vs total processing
            awarenessGap: [],

            // Agent's confidence vs actual performance
            calibrationGap: [],

            // Actions agent "decides" vs actions that actually execute
            intentionGap: []
        };

        // Track what never reaches consciousness
        this.unconsciousActivity = {
            suppressedCoalitions: [],    // Coalitions that lost competition
            unbroadcastedPackets: [],    // Packets below threshold
            implicitProcessing: []       // State changes without conscious decision
        };

        // The core metric: THE GAP
        this.blindSpotIndex = 0;

        // Stats
        this.stats = {
            totalObservations: 0,
            averageGap: 0,
            maxGapObserved: 0,
            blindSpotEvents: 0
        };
    }

    /**
     * Take a snapshot of what the agent thinks it is
     */
    captureAgentSelfModel() {
        const agent = this.target;

        return {
            // What agent thinks about itself
            selfReportedPosition: agent.selfModel.currentState.position,
            selfReportedVelocity: agent.selfModel.currentState.velocity,
            selfPredictedSuccess: agent.selfModel.getSuccessRate(),
            selfAnalysis: agent.selfModel.analyzePerformance(),

            // What agent is "conscious" of
            consciousContent: agent.globalWorkspace.currentBroadcast,
            metacognitiveState: agent.metaCognition.metacognitiveState,
            reportedConfidence: agent.metaCognition.performanceCalibration,

            // Agent's intended action
            intendedAction: agent.currentAction,

            timestamp: Date.now()
        };
    }

    /**
     * Take a snapshot of what the agent ACTUALLY is (from outside)
     */
    captureExternalObservation() {
        const agent = this.target;

        return {
            // Actual physical state
            actualPosition: agent.body ? { ...agent.body.position } : null,
            actualVelocity: agent.body ? { ...agent.body.velocity } : null,

            // All processing happening (not just conscious)
            allCoalitions: agent.globalWorkspace.coalitions.map(c => ({
                id: c.id,
                source: c.packet.source,
                salience: c.salience,
                reachedConsciousness: c.salience >= agent.globalWorkspace.ignitionThreshold
            })),

            // Total broadcasts vs possible broadcasts
            broadcastRate: agent.globalWorkspace.stats.totalBroadcasts,
            suppressedCount: agent.globalWorkspace.coalitions.filter(
                c => c.salience < agent.globalWorkspace.ignitionThreshold
            ).length,

            // Actual performance from action history
            actualSuccessRate: this.calculateActualSuccessRate(agent),

            // Integration happening (even if not "noticed")
            actualPhi: agent.integrationMeasure.getMetrics().phi_approx,

            timestamp: Date.now()
        };
    }

    /**
     * Main observation cycle - measure the gap
     */
    observe() {
        const selfModel = this.captureAgentSelfModel();
        const external = this.captureExternalObservation();

        this.selfModelSnapshots.push(selfModel);
        this.observations.push(external);

        // Calculate gaps
        const gaps = this.calculateGaps(selfModel, external);

        // Track unconscious activity
        this.trackUnconsciousActivity(external);

        // Update blind spot index
        this.updateBlindSpotIndex(gaps);

        this.stats.totalObservations++;

        // Keep history bounded
        if (this.observations.length > 200) {
            this.observations.shift();
            this.selfModelSnapshots.shift();
        }

        return {
            selfModel,
            external,
            gaps,
            blindSpotIndex: this.blindSpotIndex
        };
    }

    /**
     * Calculate the gaps between self-model and observation
     */
    calculateGaps(selfModel, external) {
        const gaps = {};

        // 1. Position Gap: Does agent know where it is?
        if (selfModel.selfReportedPosition && external.actualPosition) {
            const dx = selfModel.selfReportedPosition.x - external.actualPosition.x;
            const dy = selfModel.selfReportedPosition.y - external.actualPosition.y;
            gaps.positionGap = Math.sqrt(dx * dx + dy * dy);
        } else {
            gaps.positionGap = 0;
        }

        // 2. Awareness Gap: What fraction of processing is "conscious"?
        const totalCoalitions = external.allCoalitions.length;
        const consciousCoalitions = external.allCoalitions.filter(c => c.reachedConsciousness).length;
        gaps.awarenessGap = totalCoalitions > 0
            ? 1 - (consciousCoalitions / totalCoalitions)
            : 0;
        // Higher = more unconscious processing

        // 3. Calibration Gap: How wrong is agent's confidence?
        const reportedSuccess = selfModel.selfPredictedSuccess || 0;
        const actualSuccess = external.actualSuccessRate || 0;
        gaps.calibrationGap = Math.abs(reportedSuccess - actualSuccess);

        // 4. Intention Gap: Did the intended action match what happened?
        // (Simplified - we'd need to track action outcomes more carefully)
        gaps.intentionGap = 0; // Placeholder for now

        // 5. Integration Gap: Is there integration agent doesn't "know" about?
        const reportedIntegration = selfModel.metacognitiveState.confidence || 0;
        const actualIntegration = Math.min(1, external.actualPhi / 5); // Normalize
        gaps.integrationGap = Math.abs(actualIntegration - reportedIntegration);

        // Store gaps
        this.gaps.awarenessGap.push(gaps.awarenessGap);
        this.gaps.calibrationGap.push(gaps.calibrationGap);
        this.gaps.predictiveGap.push(gaps.positionGap);

        // Bound history
        Object.values(this.gaps).forEach(arr => {
            if (arr.length > 100) arr.shift();
        });

        return gaps;
    }

    /**
     * Track what's happening that never reaches consciousness
     */
    trackUnconsciousActivity(external) {
        // Find coalitions that lost
        const suppressed = external.allCoalitions.filter(c => !c.reachedConsciousness);

        suppressed.forEach(c => {
            this.unconsciousActivity.suppressedCoalitions.push({
                source: c.source,
                salience: c.salience,
                timestamp: external.timestamp
            });
        });

        // Bound history
        if (this.unconsciousActivity.suppressedCoalitions.length > 500) {
            this.unconsciousActivity.suppressedCoalitions =
                this.unconsciousActivity.suppressedCoalitions.slice(-500);
        }
    }

    /**
     * The core metric: How much can the system NOT see about itself?
     */
    updateBlindSpotIndex(gaps) {
        // Combine gaps into single blind spot index
        // Higher = more self-opacity = more "interesting" from hard problem perspective

        const weights = {
            awarenessGap: 0.4,      // Most important - unconscious processing
            calibrationGap: 0.3,    // Confidence vs reality
            integrationGap: 0.2,    // Hidden integration
            positionGap: 0.1        // Basic self-knowledge
        };

        this.blindSpotIndex =
            (gaps.awarenessGap || 0) * weights.awarenessGap +
            (gaps.calibrationGap || 0) * weights.calibrationGap +
            (gaps.integrationGap || 0) * weights.integrationGap +
            (gaps.positionGap || 0) * weights.positionGap;

        // Track max
        if (this.blindSpotIndex > this.stats.maxGapObserved) {
            this.stats.maxGapObserved = this.blindSpotIndex;
            this.stats.blindSpotEvents++;
        }

        // Update running average
        const alpha = 0.1;
        this.stats.averageGap = alpha * this.blindSpotIndex + (1 - alpha) * this.stats.averageGap;
    }

    calculateActualSuccessRate(agent) {
        const history = agent.actionHistory || [];
        if (history.length === 0) return 0;

        // We'd need success tracking in action history
        // For now, use selfModel's metric as proxy
        return agent.selfModel.getSuccessRate();
    }

    /**
     * Get summary of what the observer has found
     */
    getReport() {
        const avgAwareness = this.average(this.gaps.awarenessGap);
        const avgCalibration = this.average(this.gaps.calibrationGap);

        return {
            totalObservations: this.stats.totalObservations,

            // The key metric
            blindSpotIndex: this.blindSpotIndex,
            averageBlindSpot: this.stats.averageGap,
            maxBlindSpot: this.stats.maxGapObserved,

            // Component gaps
            awarenessGap: avgAwareness,
            calibrationGap: avgCalibration,

            // Unconscious activity summary
            unconsciousProcessing: {
                suppressedCoalitions: this.unconsciousActivity.suppressedCoalitions.length,
                recentSuppressed: this.unconsciousActivity.suppressedCoalitions.slice(-5)
            },

            // Interpretation
            interpretation: this.interpret()
        };
    }

    interpret() {
        const bsi = this.blindSpotIndex;

        if (bsi < 0.1) {
            return "HIGH TRANSPARENCY: System's self-model closely matches external observation. Minimal blind spot.";
        } else if (bsi < 0.3) {
            return "MODERATE OPACITY: Some processing escapes self-awareness. Gap exists between self-model and reality.";
        } else if (bsi < 0.5) {
            return "SIGNIFICANT BLIND SPOT: Substantial unconscious processing. Self-model diverges from observed behavior.";
        } else {
            return "HIGH OPACITY: Major gap between self-perception and external observation. Large blind spot detected.";
        }
    }

    average(arr) {
        if (!arr || arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    /**
     * Compare what the agent "experiences" vs what we observe
     * This is the philosophical core - the gap is where qualia might live
     */
    getExperienceGapAnalysis() {
        const recentSelf = this.selfModelSnapshots.slice(-10);
        const recentObs = this.observations.slice(-10);

        if (recentSelf.length === 0) {
            return { analysis: "Insufficient data" };
        }

        // What was the agent "conscious" of?
        const consciousContents = recentSelf
            .filter(s => s.consciousContent)
            .map(s => s.consciousContent.metadata?.type);

        // What was actually happening?
        const allActivity = recentObs.flatMap(o =>
            o.allCoalitions.map(c => c.source)
        );

        // What was happening but NOT conscious?
        const unconsciousActivity = recentObs.flatMap(o =>
            o.allCoalitions
                .filter(c => !c.reachedConsciousness)
                .map(c => c.source)
        );

        return {
            consciousContents: [...new Set(consciousContents)],
            allActivitySources: [...new Set(allActivity)],
            unconsciousSources: [...new Set(unconsciousActivity)],
            experienceGap: unconsciousActivity.length / (allActivity.length || 1),

            // The philosophical point
            insight: `The agent was "aware" of ${consciousContents.length} content types, ` +
                     `but ${unconsciousActivity.length} processes happened outside awareness. ` +
                     `This gap (${(unconsciousActivity.length / (allActivity.length || 1) * 100).toFixed(1)}%) ` +
                     `represents what the system cannot see about itself.`
        };
    }
}

module.exports = BoundaryObserver;
