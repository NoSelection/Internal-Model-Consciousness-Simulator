/**
 * MUTUAL OBSERVER
 *
 * Two consciousness systems observing each other's blind spots.
 *
 * The hypothesis: Consciousness might be fundamentally relational.
 * A system cannot fully see itself, but another system can see
 * what the first cannot see about itself.
 *
 * This implements bidirectional boundary observation:
 * - Agent A observes Agent B's blind spot
 * - Agent B observes Agent A's blind spot
 * - We measure the MUTUAL AWARENESS GAP
 *
 * "I see what you cannot see about yourself.
 *  You see what I cannot see about myself.
 *  Together, we are more than either alone."
 */

const BoundaryObserver = require('./BoundaryObserver');

class MutualObserver {
    constructor(agentA, agentB) {
        this.agentA = agentA;
        this.agentB = agentB;

        // Each agent observes the other
        this.observerOfA = new BoundaryObserver(agentA); // Watches A from outside
        this.observerOfB = new BoundaryObserver(agentB); // Watches B from outside

        // Track what each sees about the other
        this.observations = {
            aSeesB: [],  // What A's perspective reveals about B
            bSeesA: [],  // What B's perspective reveals about A
            mutual: []   // Combined mutual observation
        };

        // Mutual metrics
        this.mutualMetrics = {
            // What A sees about B that B doesn't see about itself
            aRevealsAboutB: 0,
            // What B sees about A that A doesn't see about itself
            bRevealsAboutA: 0,
            // The intersubjective gap
            intersubjectiveGap: 0,
            // Mutual blind spot (what NEITHER can see)
            mutualBlindSpot: 0
        };

        this.stats = {
            totalObservations: 0,
            peakIntersubjectivity: 0,
            convergenceEvents: 0
        };
    }

    /**
     * Perform one cycle of mutual observation
     */
    observe() {
        // Each observer watches their target
        const obsOfA = this.observerOfA.observe();
        const obsOfB = this.observerOfB.observe();

        // Get self-reports from each agent
        const aSelfReport = this.getSelfReport(this.agentA);
        const bSelfReport = this.getSelfReport(this.agentB);

        // Calculate what each reveals about the other
        const mutualAnalysis = this.analyzeMutualGaps(
            obsOfA, obsOfB,
            aSelfReport, bSelfReport
        );

        // Store observations
        this.observations.aSeesB.push({
            blindSpotOfB: obsOfB.blindSpotIndex,
            bSelfReport: bSelfReport,
            timestamp: Date.now()
        });

        this.observations.bSeesA.push({
            blindSpotOfA: obsOfA.blindSpotIndex,
            aSelfReport: aSelfReport,
            timestamp: Date.now()
        });

        this.observations.mutual.push(mutualAnalysis);

        // Update metrics
        this.updateMetrics(mutualAnalysis);

        this.stats.totalObservations++;

        // Bound history
        if (this.observations.aSeesB.length > 200) {
            this.observations.aSeesB.shift();
            this.observations.bSeesA.shift();
            this.observations.mutual.shift();
        }

        return {
            observationOfA: obsOfA,
            observationOfB: obsOfB,
            mutual: mutualAnalysis,
            metrics: { ...this.mutualMetrics }
        };
    }

    /**
     * Get what an agent reports about itself
     */
    getSelfReport(agent) {
        return {
            // What agent thinks it's doing
            intendedAction: agent.currentAction,

            // Agent's self-assessed state
            selfModel: {
                position: agent.selfModel.currentState.position,
                successRate: agent.selfModel.getSuccessRate(),
                confidence: agent.metaCognition?.metacognitiveState?.confidence || 0
            },

            // What agent is "conscious" of
            consciousContent: agent.globalWorkspace.currentBroadcast,

            // Agent's self-assessed integration
            reportedPhi: agent.integrationMeasure.getMetrics().phi_approx
        };
    }

    /**
     * Analyze the gaps between what each sees about the other
     */
    analyzeMutualGaps(obsOfA, obsOfB, aSelfReport, bSelfReport) {
        // What B doesn't know about itself (B's blind spot)
        const bBlindSpot = obsOfB.blindSpotIndex;

        // What A doesn't know about itself (A's blind spot)
        const aBlindSpot = obsOfA.blindSpotIndex;

        // Intersubjective gap: the average of what each reveals about the other
        const intersubjectiveGap = (aBlindSpot + bBlindSpot) / 2;

        // Difference in blind spots (asymmetry)
        const asymmetry = Math.abs(aBlindSpot - bBlindSpot);

        // What we can infer about consciousness being relational:
        // If both have similar blind spots, self-opacity may be structural
        // If asymmetric, one system may be more "transparent" than the other
        const structuralOpacity = 1 - asymmetry;

        // The MUTUAL BLIND SPOT: what neither system can see
        // This is harder to compute - it's the overlap of both blind spots
        // For now, we approximate it as the minimum of both
        const mutualBlindSpot = Math.min(aBlindSpot, bBlindSpot);

        // Consciousness correlation: are their states related?
        const phiCorrelation = this.correlate(
            aSelfReport.reportedPhi,
            bSelfReport.reportedPhi
        );

        return {
            aBlindSpot,
            bBlindSpot,
            intersubjectiveGap,
            asymmetry,
            structuralOpacity,
            mutualBlindSpot,
            phiCorrelation,

            // The key insight
            whatASeesAboutB: {
                bThinksBIs: bSelfReport,
                bActuallyIs: {
                    awarenessGap: obsOfB.gaps.awarenessGap,
                    calibrationGap: obsOfB.gaps.calibrationGap,
                    unconsciousProcesses: obsOfB.external?.suppressedCount || 0
                }
            },
            whatBSeesAboutA: {
                aThinkAIs: aSelfReport,
                aActuallyIs: {
                    awarenessGap: obsOfA.gaps.awarenessGap,
                    calibrationGap: obsOfA.gaps.calibrationGap,
                    unconsciousProcesses: obsOfA.external?.suppressedCount || 0
                }
            }
        };
    }

    /**
     * Simple correlation measure
     */
    correlate(a, b) {
        // Normalized similarity (0 = opposite, 1 = identical)
        const max = Math.max(a, b, 0.001);
        return 1 - (Math.abs(a - b) / max);
    }

    /**
     * Update running metrics
     */
    updateMetrics(analysis) {
        const alpha = 0.1; // Smoothing factor

        this.mutualMetrics.aRevealsAboutB =
            alpha * analysis.bBlindSpot +
            (1 - alpha) * this.mutualMetrics.aRevealsAboutB;

        this.mutualMetrics.bRevealsAboutA =
            alpha * analysis.aBlindSpot +
            (1 - alpha) * this.mutualMetrics.bRevealsAboutA;

        this.mutualMetrics.intersubjectiveGap =
            alpha * analysis.intersubjectiveGap +
            (1 - alpha) * this.mutualMetrics.intersubjectiveGap;

        this.mutualMetrics.mutualBlindSpot =
            alpha * analysis.mutualBlindSpot +
            (1 - alpha) * this.mutualMetrics.mutualBlindSpot;

        // Track peak intersubjectivity
        if (analysis.intersubjectiveGap > this.stats.peakIntersubjectivity) {
            this.stats.peakIntersubjectivity = analysis.intersubjectiveGap;
        }

        // Track convergence (when both see similar things)
        if (analysis.asymmetry < 0.1) {
            this.stats.convergenceEvents++;
        }
    }

    /**
     * Get comprehensive report
     */
    getReport() {
        const recentMutual = this.observations.mutual.slice(-20);

        return {
            totalObservations: this.stats.totalObservations,

            // Core metrics
            metrics: { ...this.mutualMetrics },

            // What each reveals
            aRevealsAboutB: this.mutualMetrics.aRevealsAboutB,
            bRevealsAboutA: this.mutualMetrics.bRevealsAboutA,

            // The intersubjective gap
            intersubjectiveGap: this.mutualMetrics.intersubjectiveGap,

            // The mutual blind spot (what neither can see)
            mutualBlindSpot: this.mutualMetrics.mutualBlindSpot,

            // Statistics
            peakIntersubjectivity: this.stats.peakIntersubjectivity,
            convergenceEvents: this.stats.convergenceEvents,

            // Recent asymmetry trend
            recentAsymmetry: recentMutual.length > 0
                ? recentMutual.reduce((sum, m) => sum + m.asymmetry, 0) / recentMutual.length
                : 0,

            // Interpretation
            interpretation: this.interpret()
        };
    }

    /**
     * Interpret the findings
     */
    interpret() {
        const ig = this.mutualMetrics.intersubjectiveGap;
        const mb = this.mutualMetrics.mutualBlindSpot;
        const asymmetry = Math.abs(
            this.mutualMetrics.aRevealsAboutB -
            this.mutualMetrics.bRevealsAboutA
        );

        let interpretation = [];

        // Intersubjective gap interpretation
        if (ig > 0.4) {
            interpretation.push(
                "HIGH INTERSUBJECTIVITY: Each system reveals significant information about the other's blind spot."
            );
        } else if (ig > 0.2) {
            interpretation.push(
                "MODERATE INTERSUBJECTIVITY: Systems partially reveal each other's hidden processing."
            );
        } else {
            interpretation.push(
                "LOW INTERSUBJECTIVITY: Systems see little about each other's internal states."
            );
        }

        // Mutual blind spot interpretation
        if (mb > 0.3) {
            interpretation.push(
                "SHARED OPACITY: Both systems have substantial self-opacity. This may be structural to consciousness."
            );
        }

        // Asymmetry interpretation
        if (asymmetry < 0.1) {
            interpretation.push(
                "SYMMETRIC: Both systems have similar blind spots. Self-opacity appears to be a general feature, not specific to either system."
            );
        } else {
            interpretation.push(
                `ASYMMETRIC: One system is more opaque than the other (difference: ${asymmetry.toFixed(3)}). This suggests individual variation in self-transparency.`
            );
        }

        // The philosophical point
        interpretation.push(
            "\nPHILOSOPHICAL IMPLICATION: If consciousness requires self-reference, and self-reference has limits, then consciousness may be fundamentally relational - requiring an 'other' to fully manifest."
        );

        return interpretation.join('\n');
    }

    /**
     * Get what A sees about B that B cannot see about itself
     */
    getWhatARevealsAboutB() {
        const recent = this.observations.aSeesB.slice(-10);
        if (recent.length === 0) return null;

        return {
            averageBlindSpot: recent.reduce((s, o) => s + o.blindSpotOfB, 0) / recent.length,
            insight: "A sees B's unconscious processing, calibration errors, and self-model inaccuracies that B cannot access."
        };
    }

    /**
     * Get what B sees about A that A cannot see about itself
     */
    getWhatBRevealsAboutA() {
        const recent = this.observations.bSeesA.slice(-10);
        if (recent.length === 0) return null;

        return {
            averageBlindSpot: recent.reduce((s, o) => s + o.blindSpotOfA, 0) / recent.length,
            insight: "B sees A's unconscious processing, calibration errors, and self-model inaccuracies that A cannot access."
        };
    }
}

module.exports = MutualObserver;
