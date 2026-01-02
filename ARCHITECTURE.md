# Unified Consciousness Architecture (UCA)
## A Novel Multi-Layer Framework for Computational Consciousness Research

### Overview

This architecture implements three major theories of consciousness as complementary functional layers, enabling ablation studies that test predictions from each theory.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LAYER 3: METACOGNITIVE LAYER                         │
│                         (Higher-Order Theory)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │  MetaMonitor    │  │  Confidence     │  │  Learning       │            │
│  │  (observes GW)  │  │  Calibrator     │  │  Regulator      │            │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │
│           └──────────────┬─────┴──────────────┬─────┘                      │
│                          ▼                    ▼                             │
│              ┌───────────────────────────────────────┐                     │
│              │         MetaCognition Module          │                     │
│              │   - Models the modeling process       │                     │
│              │   - Tracks what's in awareness        │                     │
│              │   - Regulates attention thresholds    │                     │
│              └───────────────────┬───────────────────┘                     │
├──────────────────────────────────┼──────────────────────────────────────────┤
│                                  ▼                                          │
│                     LAYER 2: GLOBAL WORKSPACE                               │
│                    (Global Workspace Theory)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      GlobalWorkspace Module                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │Coalition1│  │Coalition2│  │Coalition3│  │Coalition4│ ◄─Input   │  │
│  │  │(danger)  │  │(ethics)  │  │(goals)   │  │(predict) │  Coalitions│  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │  │
│  │       └──────────────┼─────────────┼─────────────┘                 │  │
│  │                      ▼             ▼                                │  │
│  │              ┌─────────────────────────────┐                        │  │
│  │              │    Competition & Selection   │ ◄─ Attention Gate    │  │
│  │              │    (winner-take-all)         │                       │  │
│  │              └──────────────┬──────────────┘                        │  │
│  │                             ▼                                        │  │
│  │              ┌─────────────────────────────┐                        │  │
│  │              │    BROADCAST (ignition)      │ ──► To all modules    │  │
│  │              │    Global availability       │                       │  │
│  │              └─────────────────────────────┘                        │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                     LAYER 1: INTEGRATION LAYER                              │
│                   (Integrated Information Theory)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    IntegrationMeasure Module                         │  │
│  │                                                                      │  │
│  │   ┌─────────────────────────────────────────────────────────────┐   │  │
│  │   │  Information Flow Graph                                      │   │  │
│  │   │                                                              │   │  │
│  │   │     WorldModel ◄───► EthicalReasoning                       │   │  │
│  │   │         ▲                   ▲                                │   │  │
│  │   │         │    ╲         ╱    │                                │   │  │
│  │   │         │      ╲     ╱      │                                │   │  │
│  │   │         ▼        ╲ ╱        ▼                                │   │  │
│  │   │     SelfModel ◄───X───► QLearning                           │   │  │
│  │   │                  ╱ ╲                                         │   │  │
│  │   └─────────────────────────────────────────────────────────────┘   │  │
│  │                                                                      │  │
│  │   Metrics:                                                           │  │
│  │   - Φ_approx: Approximate integrated information                    │  │
│  │   - MI(A,B): Mutual information between modules                     │  │
│  │   - TE(A→B): Transfer entropy (causal information flow)            │  │
│  │   - Integration Index: Whole > sum of parts measure                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                     LAYER 0: FOUNDATION (Existing)                          │
│                     (World & Self Modeling)                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  SelfModel  │  │  WorldModel │  │  QLearning  │  │  Ethical    │      │
│  │             │  │             │  │             │  │  Reasoning  │      │
│  │ - Position  │  │ - Entities  │  │ - Q-table   │  │ - Principles│      │
│  │ - Velocity  │  │ - Obstacles │  │ - Actions   │  │ - Conflicts │      │
│  │ - Abilities │  │ - Dangers   │  │ - Rewards   │  │ - Decisions │      │
│  │ - History   │  │ - Predict   │  │ - Replay    │  │ - Learning  │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         └────────────────┴────────────────┴────────────────┘              │
│                                   │                                        │
│                    ┌──────────────┴──────────────┐                        │
│                    │      Physics Engine         │                        │
│                    │       (Matter.js)           │                        │
│                    └─────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Specifications

### Layer 3: MetaCognition Module

**File:** `src/consciousness/MetaCognition.js`

**Purpose:** Implements Higher-Order Theory (HOT) - consciousness arises when a system has representations OF its representations.

```javascript
class MetaCognition {
    // Core state
    workspaceHistory: Array<WorkspaceSnapshot>    // What's been "conscious"
    confidenceModel: ConfidenceCalibrator         // Meta-level confidence
    attentionRegulator: AttentionRegulator        // Dynamic threshold control
    selfModelOfModeling: MetaRepresentation       // Model of the modeling process

    // Key methods
    observeWorkspace(content)       // Monitor what enters GW
    assessConfidence(decision)      // Meta-level confidence rating
    regulateAttention(performance)  // Adjust thresholds based on outcomes
    generateMetaReport()            // "What am I aware of being aware of?"

    // Ablation interface
    disable()                       // For "synthetic blindsight" experiments
    getMetacognitiveAccuracy()      // Calibration between confidence and performance
}
```

**Key Innovation:** The `selfModelOfModeling` creates a recursive structure:
- Level 0: Model of world
- Level 1: Model of self modeling the world
- Level 2: Model of self modeling self modeling (metacognition)

**Testable Predictions (HOT):**
- Ablating this layer should produce "blindsight" - correct actions without metacognitive awareness
- Metacognitive accuracy should correlate with successful learning
- The system should be able to report what it's "aware of"

---

### Layer 2: GlobalWorkspace Module

**File:** `src/consciousness/GlobalWorkspace.js`

**Purpose:** Implements Global Workspace Theory (GWT) - consciousness as information broadcast.

```javascript
class GlobalWorkspace {
    // Core state
    coalitions: Map<string, Coalition>     // Competing information coalitions
    currentBroadcast: BroadcastContent     // What's currently "conscious"
    ignitionThreshold: number              // Threshold for broadcast (0.0-1.0)
    broadcastHistory: Array<Broadcast>     // Record of past broadcasts
    subscribedModules: Set<Module>         // Modules receiving broadcasts

    // Coalition structure
    interface Coalition {
        id: string
        source: string                     // Which module formed this
        content: any                       // The information content
        salience: number                   // Competition strength (0.0-1.0)
        timestamp: number
        associations: string[]             // Links to other coalitions
    }

    // Key methods
    formCoalition(source, content, salience)  // Create competing coalition
    runCompetition()                          // Winner-take-all selection
    broadcast(winner)                         // Make available to all modules
    checkIgnition(coalition)                  // Does it exceed threshold?

    // Metrics
    getBroadcastRate()                        // How often ignition occurs
    getAverageSalience()                      // Competition intensity
    getCoalitionDiversity()                   // How varied are inputs?
}
```

**Competition Dynamics:**
```
salience(t+1) = salience(t) * decay + support_from_associations - inhibition_from_competitors
```

**Testable Predictions (GWT):**
- Information in workspace should be globally available to all modules
- There should be a capacity limit (one broadcast at a time)
- Broadcast content should influence all downstream processing
- Ablating broadcast should fragment processing

---

### Layer 1: IntegrationMeasure Module

**File:** `src/consciousness/IntegrationMeasure.js`

**Purpose:** Implements IIT-inspired integration metrics.

```javascript
class IntegrationMeasure {
    // Information flow tracking
    moduleStates: Map<string, StateHistory>     // State timeseries per module
    informationFlows: Map<string, FlowMetrics>  // Pairwise module relationships

    // Key metrics
    interface FlowMetrics {
        mutualInformation: number      // MI(A,B) - shared information
        transferEntropy_AtoB: number   // TE(A→B) - causal flow A to B
        transferEntropy_BtoA: number   // TE(B→A) - causal flow B to A
        conditionalMI: number          // Information beyond simple correlation
    }

    // Φ approximation (since true Φ is computationally intractable)
    computePhiApprox() {
        // Measure: How much does the whole system know that parts don't?
        // Φ_approx = I(system) - Σ I(partitions)

        // 1. Compute total system mutual information
        // 2. Compute information if system were partitioned
        // 3. Φ = difference (integration above and beyond parts)
    }

    // Key methods
    recordModuleState(moduleId, state)        // Track state evolution
    computeMutualInformation(moduleA, moduleB)
    computeTransferEntropy(source, target)    // Causal information flow
    computeIntegrationIndex()                 // Whole > sum of parts
    findMinimumInformationPartition()         // IIT's MIP concept
}
```

**Practical Φ Approximation:**

Since true Φ is computationally intractable, we use a practical approximation:

```
Φ_approx = Σ MI(module_i, rest_of_system) - Σ MI(module_i, module_j)
                                            i<j

This measures: "How much does each module know about the whole system
               beyond what it knows about individual other modules?"
```

**Testable Predictions (IIT):**
- Higher Φ should correlate with more unified behavior
- Partitioning the system should reduce Φ
- Sleep-like states should show reduced Φ
- Different architectures should produce measurable Φ differences

---

## Ablation Study Framework

**File:** `src/experiments/AblationFramework.js`

```javascript
class AblationFramework {
    // Define lesion types
    lesions = {
        NO_METACOGNITION: {
            description: "Disable Layer 3 - predict synthetic blindsight",
            disable: ['MetaCognition'],
            predictions: [
                "Task performance maintained",
                "Confidence calibration lost",
                "No meta-reports possible",
                "Learning rate unchanged"
            ]
        },

        NO_BROADCAST: {
            description: "Disable GW broadcast - predict fragmentation",
            disable: ['GlobalWorkspace.broadcast'],
            predictions: [
                "Modules process in isolation",
                "Cross-module coordination fails",
                "Local optimization only",
                "No global coherence"
            ]
        },

        NO_INTEGRATION: {
            description: "Disable integration - predict reduced unity",
            disable: ['IntegrationMeasure'],
            predictions: [
                "Φ_approx drops to near zero",
                "Modules don't inform each other",
                "Behavior becomes fragmented",
                "No unified decision-making"
            ]
        },

        FULL_CONSCIOUSNESS: {
            description: "All layers active - baseline",
            disable: [],
            predictions: [
                "High Φ_approx",
                "Accurate metacognition",
                "Global broadcast functioning",
                "Unified coherent behavior"
            ]
        }
    }

    // Run experiment
    runAblationExperiment(lesionType, scenarios, duration) {
        // 1. Apply lesion
        // 2. Run agent through scenarios
        // 3. Collect metrics
        // 4. Compare to predictions
        // 5. Return results
    }
}
```

---

## Consciousness Metrics Dashboard

**File:** `src/consciousness/ConsciousnessMetrics.js`

```javascript
class ConsciousnessMetrics {
    // Real-time metrics
    metrics = {
        // Layer 1 (IIT-inspired)
        phi_approx: 0,                    // Integration measure
        integration_index: 0,             // Whole > parts
        information_flow_graph: {},       // Module interconnections

        // Layer 2 (GWT)
        broadcast_rate: 0,                // Ignitions per second
        workspace_content: null,          // Current broadcast
        coalition_competition: 0,         // Competition intensity
        global_availability: 0,           // How widely broadcast reaches

        // Layer 3 (HOT)
        metacognitive_accuracy: 0,        // Confidence calibration
        meta_awareness_depth: 0,          // Recursion levels active
        attention_regulation_efficacy: 0, // How well thresholds adapt

        // Unified Consciousness Index
        UCI: 0   // Weighted combination: 0.4*Φ + 0.3*GW + 0.3*HOT
    }

    // Compute unified index
    computeUCI() {
        return (
            0.4 * this.normalizedPhi() +
            0.3 * this.normalizedGlobalWorkspace() +
            0.3 * this.normalizedMetacognition()
        );
    }
}
```

---

## Information Flow Architecture

### Module Communication Protocol

All modules emit and receive `InformationPackets`:

```javascript
interface InformationPacket {
    source: string           // Originating module
    content: any             // The information
    salience: number         // Importance/urgency (0-1)
    timestamp: number
    metadata: {
        type: 'prediction' | 'decision' | 'state' | 'alert'
        confidence: number   // Source's confidence in this info
        dependencies: string[] // Other packets this relates to
    }
}
```

### Flow Recording for Φ Computation

```javascript
// Every module state change is recorded
this.integrationMeasure.recordModuleState('WorldModel', {
    timestamp: Date.now(),
    state: this.worldModel.getCompressedState(),
    inputs: recentInputPackets,
    outputs: recentOutputPackets
});

// This enables computing:
// - Mutual information between any pair
// - Transfer entropy (causal influence)
// - System-wide integration
```

---

## File Structure

```
src/
├── consciousness/
│   ├── MetaCognition.js          # Layer 3: Higher-Order representations
│   ├── GlobalWorkspace.js        # Layer 2: Competition and broadcast
│   ├── IntegrationMeasure.js     # Layer 1: Φ and information flow
│   ├── ConsciousnessMetrics.js   # Unified metrics dashboard
│   └── InformationPacket.js      # Shared data structure
├── agent/
│   ├── Agent.js                  # Modified to use consciousness layers
│   ├── SelfModel.js              # Layer 0 (existing)
│   ├── WorldModel.js             # Layer 0 (existing)
│   ├── QLearning.js              # Layer 0 (existing)
│   └── EthicalReasoning.js       # Layer 0 (existing)
├── experiments/
│   ├── AblationFramework.js      # Lesion experiments
│   ├── ScenarioRunner.js         # Standardized test scenarios
│   └── MetricsCollector.js       # Data collection for analysis
└── visualization/
    ├── ConsciousnessDashboard.js # Real-time metrics display
    └── InformationFlowGraph.js   # Visual module connections
```

---

## Implementation Priorities

### Phase 1: Foundation
1. `InformationPacket.js` - Shared communication structure
2. `IntegrationMeasure.js` - Start tracking information flow
3. Modify existing modules to emit/receive packets

### Phase 2: Global Workspace
4. `GlobalWorkspace.js` - Competition and broadcast
5. Refactor `Agent.planActions()` to use GW
6. Add broadcast subscription to all modules

### Phase 3: Metacognition
7. `MetaCognition.js` - Higher-order monitoring
8. `ConsciousnessMetrics.js` - Unified dashboard
9. Connect metacognition to regulate GW thresholds

### Phase 4: Experiments
10. `AblationFramework.js` - Lesion studies
11. Standardized scenarios for testing
12. Data collection and analysis tools

---

## Novel Research Contributions

1. **Unified Implementation**: First system implementing IIT, GWT, and HOT as complementary layers

2. **Ablation Methodology**: Systematic lesion studies testing predictions from each theory

3. **Practical Φ Approximation**: Computable integration metric for modular systems

4. **Synthetic Phenomenology**: Observable differences when each layer is disabled

5. **Cross-Theory Predictions**: What happens when theories interact?
   - Does high Φ predict better GW function?
   - Does metacognition improve integration?
   - Are the theories truly independent or coupled?

---

## References

- Tononi, G. (2015). Integrated Information Theory. Scholarpedia.
- Baars, B. J. (1988). A Cognitive Theory of Consciousness. Cambridge.
- Rosenthal, D. (2005). Consciousness and Mind. Oxford.
- Mashour et al. (2020). Conscious Processing and the Global Neuronal Workspace.
- Oizumi et al. (2014). From the Phenomenology to the Mechanisms of Consciousness.
