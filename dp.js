import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://xleyqfmaqovkbtrfzryg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZXlxZm1hcW92a2J0cmZ6cnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDY0MzIsImV4cCI6MjA0MzAyMjQzMn0.tk-qdlJLyy4kLb6Fq32mvzto9bIryuf07n7SSzr9Oes'
);

// Function to calculate disease prediction based on symptom matching
function predictDisease(userSymptoms, diseases) {
  let bestMatch = null;
  let highestConfidence = 0;

  diseases.forEach((disease) => {
    // Convert the symptoms string to an array if needed
    const diseaseSymptoms = disease.symptoms;
    let matchCount = 0;

    // Match user symptoms with disease symptoms
    userSymptoms.forEach((symptom) => {
      if (diseaseSymptoms.includes(symptom)) {
        matchCount++;
      }
    });

    // Calculate confidence as a percentage of matched symptoms
    const confidence = (matchCount / diseaseSymptoms.length) * 100;

    // Update if confidence for this disease is higher than previous
    if (confidence > highestConfidence) {
      highestConfidence = confidence;
      bestMatch = {
        disease: disease.name,
        confidence: confidence,
        recommendation: `Based on your symptoms, you might have ${disease.name}. Please consult a healthcare provider for a precise diagnosis.`
      };
    }
  });

  // Return the best match found or a default response if no good match was found
  return bestMatch || {
    disease: 'Unknown',
    confidence: 0,
    recommendation: 'No strong matches found. Please consult a healthcare provider for further assessment.'
  };
}

// Start the server
serve(async (req) => {
  if (req.method === 'POST' && req.url === '/api/predict') {
    const { symptoms } = await req.json();

    try {
      // Fetch disease information from the database
      const { data: diseases, error: diseaseError } = await supabase
        .from('diseases')
        .select('*');

      if (diseaseError) {
        return new Response(JSON.stringify({ error: diseaseError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Predict disease based on symptoms
      const predictedDisease = predictDisease(symptoms, diseases);

      // Store the prediction result in the database
      const { error: predictionError } = await supabase
        .from('symptom_history')
        .insert({
          symptoms,
          predicted_disease: predictedDisease.disease,
          confidence: predictedDisease.confidence,
        });

      if (predictionError) {
        return new Response(JSON.stringify({ error: predictionError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Return the prediction response
      return new Response(JSON.stringify(predictedDisease), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Not Found', { status: 404 });
});
