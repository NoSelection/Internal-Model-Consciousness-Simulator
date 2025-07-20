const fs = require('fs');
const path = require('path');

class ModelManager {
    constructor() {
        this.saveDir = path.join(__dirname, '../../saved_models');
        this.ensureSaveDirectory();
    }

    ensureSaveDirectory() {
        if (!fs.existsSync(this.saveDir)) {
            fs.mkdirSync(this.saveDir, { recursive: true });
            console.log(`📁 Created save directory: ${this.saveDir}`);
        }
    }

    saveAgent(agent, sessionName = null) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = sessionName ? `${sessionName}_${timestamp}.json` : `agent_consciousness_${timestamp}.json`;
        const filepath = path.join(this.saveDir, filename);

        const agentData = {
            metadata: {
                saveDate: new Date().toISOString(),
                sessionName: sessionName || 'unnamed_session',
                version: '1.0.0',
                steps: agent.stepCount || 0
            },
            consciousness: agent.consciousness,
            selfModel: this.serializeSelfModel(agent.selfModel),
            worldModel: this.serializeWorldModel(agent.worldModel),
            qLearning: this.serializeQLearning(agent.qLearning),
            ethicalReasoning: this.serializeEthicalReasoning(agent.ethicalReasoning),
            actionHistory: agent.actionHistory || [],
            performance: {
                totalActions: agent.selfModel.performanceMetrics.totalActions,
                successfulInterventions: agent.selfModel.performanceMetrics.successfulInterventions,
                failedInterventions: agent.selfModel.performanceMetrics.failedInterventions,
                successRate: agent.selfModel.getSuccessRate()
            }
        };

        try {
            fs.writeFileSync(filepath, JSON.stringify(agentData, null, 2));
            console.log(`💾 Agent consciousness saved to: ${filename}`);
            console.log(`   Steps completed: ${agent.stepCount || 0}`);
            console.log(`   Consciousness level: ${agent.consciousness.selfAwareness.toFixed(3)}`);
            console.log(`   Success rate: ${(agentData.performance.successRate * 100).toFixed(1)}%`);
            return filepath;
        } catch (error) {
            console.error(`❌ Failed to save agent:`, error.message);
            return null;
        }
    }

    loadAgent(filepath) {
        try {
            if (!fs.existsSync(filepath)) {
                console.error(`❌ Save file not found: ${filepath}`);
                return null;
            }

            const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            console.log(`📂 Loading agent from: ${path.basename(filepath)}`);
            console.log(`   Session: ${data.metadata.sessionName}`);
            console.log(`   Saved: ${data.metadata.saveDate}`);
            console.log(`   Steps: ${data.metadata.steps}`);
            
            return data;
        } catch (error) {
            console.error(`❌ Failed to load agent:`, error.message);
            return null;
        }
    }

    restoreAgent(agent, loadedData) {
        try {
            // Restore consciousness metrics
            agent.consciousness = { ...loadedData.consciousness };

            // Restore self model
            this.restoreSelfModel(agent.selfModel, loadedData.selfModel);

            // Restore world model
            this.restoreWorldModel(agent.worldModel, loadedData.worldModel);

            // Restore Q-learning
            this.restoreQLearning(agent.qLearning, loadedData.qLearning);

            // Restore ethical reasoning
            this.restoreEthicalReasoning(agent.ethicalReasoning, loadedData.ethicalReasoning);

            // Restore action history
            agent.actionHistory = loadedData.actionHistory || [];
            agent.stepCount = loadedData.metadata.steps || 0;

            console.log(`✅ Agent consciousness restored successfully!`);
            console.log(`   Restored ${loadedData.metadata.steps} steps of experience`);
            console.log(`   Consciousness level: ${agent.consciousness.selfAwareness.toFixed(3)}`);
            
            return true;
        } catch (error) {
            console.error(`❌ Failed to restore agent:`, error.message);
            return false;
        }
    }

    serializeSelfModel(selfModel) {
        return {
            physicalProperties: { ...selfModel.physicalProperties },
            capabilities: { ...selfModel.capabilities },
            currentState: {
                position: { ...selfModel.currentState.position },
                velocity: { ...selfModel.currentState.velocity },
                energy: selfModel.currentState.energy,
                isBlocking: selfModel.currentState.isBlocking
            },
            performanceMetrics: { ...selfModel.performanceMetrics },
            actionHistory: selfModel.actionHistory.slice(-50) // Keep last 50 actions
        };
    }

    serializeWorldModel(worldModel) {
        return {
            neuralWeights: {
                hidden: worldModel.neuralWeights.hidden.map(row => [...row]),
                output: worldModel.neuralWeights.output.map(row => [...row])
            },
            learningRate: worldModel.learningRate,
            predictionAccuracy: Object.fromEntries(
                Array.from(worldModel.predictionAccuracy.entries()).map(([key, values]) => 
                    [key, values.slice(-20)] // Keep last 20 accuracy measurements
                )
            )
        };
    }

    serializeQLearning(qLearning) {
        return {
            qTableData: qLearning.saveQTable(),
            stateSize: qLearning.stateSize,
            actionSize: qLearning.actionSize,
            learningRate: qLearning.learningRate,
            discountFactor: qLearning.discountFactor,
            explorationRate: qLearning.explorationRate,
            explorationDecay: qLearning.explorationDecay,
            minExplorationRate: qLearning.minExplorationRate,
            experienceBuffer: qLearning.experienceBuffer.slice(-1000) // Keep last 1000 experiences
        };
    }

    serializeEthicalReasoning(ethicalReasoning) {
        return {
            ethicalPrinciples: { ...ethicalReasoning.ethicalPrinciples },
            ethicalDecisions: ethicalReasoning.ethicalDecisions.slice(-50), // Keep last 50 decisions
            moralDilemmas: ethicalReasoning.moralDilemmas.slice(-20) // Keep last 20 dilemmas
        };
    }

    restoreSelfModel(selfModel, data) {
        Object.assign(selfModel.physicalProperties, data.physicalProperties);
        Object.assign(selfModel.capabilities, data.capabilities);
        Object.assign(selfModel.currentState, data.currentState);
        Object.assign(selfModel.performanceMetrics, data.performanceMetrics);
        selfModel.actionHistory = data.actionHistory || [];
    }

    restoreWorldModel(worldModel, data) {
        worldModel.neuralWeights = {
            hidden: data.neuralWeights.hidden.map(row => [...row]),
            output: data.neuralWeights.output.map(row => [...row])
        };
        worldModel.learningRate = data.learningRate;
        
        worldModel.predictionAccuracy.clear();
        Object.entries(data.predictionAccuracy || {}).forEach(([key, values]) => {
            worldModel.predictionAccuracy.set(key, values);
        });
    }

    restoreQLearning(qLearning, data) {
        qLearning.loadQTable(data.qTableData);
        qLearning.learningRate = data.learningRate;
        qLearning.discountFactor = data.discountFactor;
        qLearning.explorationRate = data.explorationRate;
        qLearning.explorationDecay = data.explorationDecay;
        qLearning.minExplorationRate = data.minExplorationRate;
        qLearning.experienceBuffer = data.experienceBuffer || [];
    }

    restoreEthicalReasoning(ethicalReasoning, data) {
        Object.assign(ethicalReasoning.ethicalPrinciples, data.ethicalPrinciples);
        ethicalReasoning.ethicalDecisions = data.ethicalDecisions || [];
        ethicalReasoning.moralDilemmas = data.moralDilemmas || [];
    }

    listSavedModels() {
        try {
            const files = fs.readdirSync(this.saveDir)
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    const filepath = path.join(this.saveDir, file);
                    const stats = fs.statSync(filepath);
                    
                    try {
                        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                        return {
                            filename: file,
                            filepath: filepath,
                            sessionName: data.metadata?.sessionName || 'unknown',
                            saveDate: data.metadata?.saveDate || stats.mtime.toISOString(),
                            steps: data.metadata?.steps || 0,
                            consciousness: data.consciousness?.selfAwareness || 0,
                            size: stats.size
                        };
                    } catch {
                        return {
                            filename: file,
                            filepath: filepath,
                            sessionName: 'corrupted',
                            saveDate: stats.mtime.toISOString(),
                            steps: 0,
                            consciousness: 0,
                            size: stats.size
                        };
                    }
                })
                .sort((a, b) => new Date(b.saveDate) - new Date(a.saveDate));

            return files;
        } catch (error) {
            console.error(`❌ Failed to list saved models:`, error.message);
            return [];
        }
    }

    displaySavedModels() {
        const models = this.listSavedModels();
        
        if (models.length === 0) {
            console.log('📁 No saved models found');
            return;
        }

        console.log('\n📁 Saved Consciousness Models:');
        console.log('═'.repeat(80));
        
        models.forEach((model, index) => {
            console.log(`${index + 1}. ${model.filename}`);
            console.log(`   Session: ${model.sessionName}`);
            console.log(`   Steps: ${model.steps}`);
            console.log(`   Consciousness: ${model.consciousness.toFixed(3)}`);
            console.log(`   Saved: ${new Date(model.saveDate).toLocaleString()}`);
            console.log(`   Size: ${(model.size / 1024).toFixed(1)} KB`);
            console.log('');
        });
    }

    exportTrainingData(agent, filename = null) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const exportFilename = filename || `training_data_${timestamp}.json`;
        const filepath = path.join(this.saveDir, exportFilename);

        const trainingData = {
            qTable: agent.qLearning.saveQTable(),
            experiences: agent.qLearning.experienceBuffer,
            ethicalDecisions: agent.ethicalReasoning.ethicalDecisions,
            actionHistory: agent.actionHistory,
            performanceMetrics: agent.selfModel.performanceMetrics,
            worldModelWeights: {
                hidden: agent.worldModel.neuralWeights.hidden,
                output: agent.worldModel.neuralWeights.output
            }
        };

        try {
            fs.writeFileSync(filepath, JSON.stringify(trainingData, null, 2));
            console.log(`📊 Training data exported to: ${exportFilename}`);
            return filepath;
        } catch (error) {
            console.error(`❌ Failed to export training data:`, error.message);
            return null;
        }
    }
}

module.exports = ModelManager;