const SymptomData = {
    symptoms: [
        'fever', 'cough', 'fatigue', 'headache', 'sore-throat',
        'body-aches', 'shortness-breath', 'nausea'
    ],
    
    diseases: {
        'Common Cold': {
            symptoms: ['cough', 'sore-throat', 'fatigue', 'headache'],
            weight: 0.8,
            recommendations: [
                'Rest and get adequate sleep',
                'Stay hydrated',
                'Use over-the-counter cold medications if needed',
                'Monitor symptoms for worsening'
            ]
        },
        'Flu': {
            symptoms: ['fever', 'body-aches', 'fatigue', 'headache', 'sore-throat'],
            weight: 1.2,
            recommendations: [
                'Rest and isolate to prevent spread',
                'Take fever-reducing medication if needed',
                'Stay hydrated',
                'Seek medical attention if symptoms are severe'
            ]
        },
        'COVID-19': {
            symptoms: ['fever', 'cough', 'shortness-breath', 'fatigue', 'body-aches'],
            weight: 1.5,
            recommendations: [
                'Isolate immediately',
                'Get tested',
                'Monitor oxygen levels',
                'Contact healthcare provider',
                'Follow local health guidelines'
            ]
        },
        'Bronchitis': {
            symptoms: ['cough', 'shortness-breath', 'fatigue', 'sore-throat'],
            weight: 1.0,
            recommendations: [
                'Use a humidifier',
                'Stay hydrated',
                'Avoid irritants',
                'Consider prescribed medications'
            ]
        },
        'Gastroenteritis': {
            symptoms: ['nausea', 'fatigue', 'fever'],
            weight: 0.9,
            recommendations: [
                'Stay hydrated with clear fluids',
                'Rest and avoid solid foods initially',
                'Gradually reintroduce bland foods',
                'Seek medical attention if symptoms persist'
            ]
        }
    }
};