const DiagnosisSystem = {
    aiModel: new AIModel(),
    CONFIDENCE_THRESHOLD: 90,
    MIN_SYMPTOMS: 1,

    async analyze() {
        const symptoms = this.getSelectedSymptoms();
        const additionalInfo = this.getAdditionalSymptoms();

        if (symptoms.length < this.MIN_SYMPTOMS) {
            this.displayValidationError('Please select at least one symptom for analysis.');
            return;
        }

        try {
            const prediction = await this.aiModel.predict(symptoms);
            this.displayResults(prediction);
        } catch (error) {
            console.error('Prediction error:', error);
            this.displayError();
        }
    },

    getSelectedSymptoms() {
        const checkedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
            .map(input => input.value);
        
        const additionalSymptoms = this.getAdditionalSymptoms()
            .toLowerCase()
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        return [...new Set([...checkedSymptoms, ...additionalSymptoms])];
    },

    getAdditionalSymptoms() {
        return document.getElementById('additional-symptoms').value.trim();
    },

    displayResults(prediction) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'block';
        
        const lowConfidence = prediction.confidence < this.CONFIDENCE_THRESHOLD;
        const warningMessage = lowConfidence ? 
            `<p class="warning-text" style="color: #991B1B; margin: 1rem 0;">
                Note: Confidence level is below ${this.CONFIDENCE_THRESHOLD}%. 
                Please consult a healthcare professional for accurate diagnosis.
            </p>` : '';
        
        resultsDiv.innerHTML = `
            <div class="result-card">
                <div class="disease-name">${prediction.name}</div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
                </div>
                <div>Confidence: ${prediction.confidence}%</div>
                ${warningMessage}
                <div class="recommendations">
                    <h3>Recommendations:</h3>
                    <ul>
                        ${prediction.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    displayValidationError(message) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'block';
        
        resultsDiv.innerHTML = `
            <div class="result-card">
                <div class="disease-name" style="color: #991B1B;">Input Required</div>
                <div class="recommendations">
                    <p>${message}</p>
                </div>
            </div>
        `;
    },

    displayError() {
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'block';
        
        resultsDiv.innerHTML = `
            <div class="result-card">
                <div class="disease-name" style="color: #991B1B;">Analysis Error</div>
                <div class="recommendations">
                    <p>Sorry, we couldn't process your symptoms at this time. Please try again later or consult a healthcare provider.</p>
                </div>
            </div>
        `;
    }
};