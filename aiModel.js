class AIModel {
    constructor() {
        this.model = null;
        this.initialized = false;
        this.symptomWeights = new Map();
        this.initializeWeights();
    }

    initializeWeights() {
        this.symptomWeights.set('fever', 1.5);
        this.symptomWeights.set('shortness-breath', 1.8);
        this.symptomWeights.set('cough', 1.2);
        this.symptomWeights.set('fatigue', 1.0);
        this.symptomWeights.set('body-aches', 1.3);
        this.symptomWeights.set('headache', 1.0);
        this.symptomWeights.set('sore-throat', 1.1);
        this.symptomWeights.set('nausea', 1.4);
    }

    async predict(symptoms) {
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            throw new Error('Invalid symptoms input');
        }

        const predictions = Object.entries(SymptomData.diseases).map(([disease, data]) => {
            const matchScore = this.calculateMatchScore(symptoms, data.symptoms);
            const weightedScore = matchScore * (data.weight || 1.0);
            const confidence = Math.min(Math.round(weightedScore * 100), 100);

            return {
                name: disease,
                confidence,
                recommendations: data.recommendations
            };
        });

        const bestMatch = predictions.sort((a, b) => b.confidence - a.confidence)[0];
        
        // Ensure we always return a valid prediction
        return {
            name: bestMatch.confidence > 0 ? bestMatch.name : 'Unrecognized Condition',
            confidence: bestMatch.confidence,
            recommendations: bestMatch.confidence > 0 
                ? bestMatch.recommendations 
                : ['Please consult a healthcare provider for proper evaluation of your symptoms.']
        };
    }

    calculateMatchScore(userSymptoms, diseaseSymptoms) {
        let totalWeight = 0;
        let matchedWeight = 0;

        // Calculate weights for disease symptoms
        diseaseSymptoms.forEach(symptom => {
            const weight = this.symptomWeights.get(symptom) || 1.0;
            totalWeight += weight;
            if (userSymptoms.includes(symptom)) {
                matchedWeight += weight;
            }
        });

        // Calculate weights for user symptoms
        userSymptoms.forEach(symptom => {
            if (!diseaseSymptoms.includes(symptom)) {
                totalWeight += this.symptomWeights.get(symptom) || 1.0;
            }
        });

        return matchedWeight / totalWeight;
    }
}