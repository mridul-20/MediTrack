export type MedicineInfo = {
  name: string
  activeIngredient: string
  dosage: string
  usages: string[]
  sideEffects: string[]
  interactions: string[]
  precautions: string[]
}

export type SymptomAnalysis = {
  possibleConditions: string[]
  recommendedMedicines: string[]
  selfCareAdvice: string[]
  whenToSeeDoctor: string
}

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyCOn2D2OyRWNNtoyN3J2LKyj1v8yvW5P1Q";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

// Helper function to make requests to Gemini API
async function generateWithGemini(prompt: string): Promise<string> {
  try {
    console.log("Calling Gemini API with prompt:", prompt.substring(0, 100) + "...");
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error("Unexpected API response format:", JSON.stringify(data));
      throw new Error("Unexpected API response format");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to generate content with Gemini API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Add a mock response generator as a complete fallback
function generateMockResponse(query: string): string {
  // Convert query to lowercase for easier matching
  const q = query.toLowerCase();
  
  // Common medicine queries
  if (q.includes("paracetamol") || q.includes("acetaminophen") || q.includes("tylenol")) {
    return "Paracetamol (also known as Acetaminophen or Tylenol) is commonly used to treat pain and fever. The typical adult dose is 500-1000mg every 4-6 hours, not exceeding 4000mg in 24 hours. Side effects are rare when taken as directed, but can include liver damage if taken in excess. Always follow the dosage instructions on the packaging or as directed by your healthcare provider.";
  }
  
  if (q.includes("ibuprofen") || q.includes("advil") || q.includes("motrin")) {
    return "Ibuprofen (brands include Advil and Motrin) is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce pain, inflammation, and fever. The typical adult dose is 200-400mg every 4-6 hours, not exceeding 1200mg in 24 hours unless directed by a doctor. Take with food to reduce stomach upset. Consult a healthcare provider before use if you have heart disease, high blood pressure, or kidney problems.";
  }
  
  if (q.includes("aspirin")) {
    return "Aspirin is used to treat pain, fever, and inflammation. For adults, the typical dose is 325-650mg every 4 hours as needed. It's also used in low doses (81mg) as a blood thinner to prevent heart attacks and strokes in high-risk individuals. Aspirin should not be given to children or teenagers with viral illnesses due to the risk of Reye's syndrome. Always consult with a healthcare provider before starting aspirin therapy.";
  }
  
  // Common symptom queries
  if (q.includes("headache")) {
    return "Headaches can be caused by stress, dehydration, lack of sleep, or eye strain. For occasional headaches, over-the-counter pain relievers like acetaminophen or ibuprofen may help. Staying hydrated, getting regular sleep, and practicing relaxation techniques can help prevent headaches. If headaches are severe, persistent, or accompanied by other symptoms, please consult a healthcare professional.";
  }
  
  if (q.includes("fever") || q.includes("temperature")) {
    return "Fever is often a sign that your body is fighting an infection. For adults, a temperature above 100.4°F (38°C) is considered a fever. Rest, hydration, and medications like acetaminophen or ibuprofen can help reduce fever. If a fever is very high (above 103°F or 39.4°C), persists for more than three days, or is accompanied by severe symptoms, seek medical attention.";
  }
  
  if (q.includes("cold") || q.includes("flu") || q.includes("cough") || q.includes("congestion")) {
    return "Cold and flu symptoms can include cough, congestion, sore throat, fever, and body aches. Rest, hydration, and over-the-counter medications can help manage symptoms. Decongestants can help with nasal congestion, while cough suppressants can help with coughs. Antiviral medications may be prescribed for flu if caught early. Most colds resolve within 7-10 days, but if symptoms worsen or persist, consult a healthcare provider.";
  }
  
  if (q.includes("allergy") || q.includes("allergies") || q.includes("allergic")) {
    return "Allergies occur when your immune system reacts to a foreign substance. Common allergens include pollen, pet dander, certain foods, and medications. Symptoms can include sneezing, itching, runny nose, and watery eyes. Antihistamines, nasal corticosteroids, and avoiding allergens can help manage symptoms. For severe allergic reactions involving difficulty breathing or swelling, seek emergency medical attention immediately.";
  }
  
  // Generic health advice
  if (q.includes("sleep") || q.includes("insomnia")) {
    return "Adults typically need 7-9 hours of sleep per night. To improve sleep, maintain a regular sleep schedule, create a restful environment, limit screen time before bed, avoid caffeine and large meals before sleeping, and engage in regular physical activity. If sleep problems persist, consult with a healthcare provider as they may indicate an underlying condition.";
  }
  
  if (q.includes("diet") || q.includes("nutrition") || q.includes("eat")) {
    return "A balanced diet typically includes fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive salt. Staying hydrated by drinking plenty of water is also important. Individual nutritional needs can vary based on age, sex, activity level, and health conditions, so consider consulting with a healthcare provider or dietitian for personalized advice.";
  }
  
  if (q.includes("exercise") || q.includes("workout") || q.includes("physical activity")) {
    return "Regular physical activity offers numerous health benefits, including improved cardiovascular health, stronger muscles and bones, better weight management, and enhanced mental health. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities on 2 or more days per week. Always start gradually and consult with a healthcare provider before beginning a new exercise program.";
  }
  
  // Default response if no specific matches
  return "I'm currently operating with limited capabilities. For specific health advice, it's best to consult with a healthcare professional who can provide guidance tailored to your individual situation. They can take into account your medical history, current medications, and specific symptoms to provide appropriate recommendations.";
}

export const aiService = {
  // Identify medicine from image (text description for demo)
  async identifyMedicine(imageDescription: string): Promise<MedicineInfo> {
    try {
      const prompt = `You are a pharmaceutical expert AI. Based on this description of a medicine: "${imageDescription}", 
                identify the medicine and provide detailed information about it.
                
                Format your response as a JSON object with the following structure:
                {
                  "name": "Medicine name",
                  "activeIngredient": "Main active ingredient",
                  "dosage": "Standard dosage information",
                  "usages": ["Usage 1", "Usage 2"],
                  "sideEffects": ["Side effect 1", "Side effect 2"],
                  "interactions": ["Interaction 1", "Interaction 2"],
                  "precautions": ["Precaution 1", "Precaution 2"]
                }`;
      
      const response = await generateWithGemini(prompt);
      return JSON.parse(response) as MedicineInfo;
    } catch (error) {
      console.error("Error identifying medicine:", error);
      
      // Fallback to mock data if API fails
      return {
        name: "Acetaminophen (Tylenol)",
        activeIngredient: "Acetaminophen",
        dosage: "325-650mg every 4-6 hours as needed, not exceeding 3000mg per day",
        usages: ["Pain relief", "Fever reduction", "Headache", "Minor aches and pains"],
        sideEffects: ["Nausea", "Stomach pain", "Loss of appetite", "Headache", "Rash"],
        interactions: ["Alcohol", "Warfarin", "Isoniazid", "Carbamazepine"],
        precautions: ["Liver disease", "Alcohol use", "Pregnancy", "Kidney disease"]
      };
    }
  },
  
  // Analyze symptoms and provide recommendations
  async analyzeSymptoms(symptoms: string, userAge: number, existingConditions: string[] = []): Promise<SymptomAnalysis> {
    try {
      const conditionsText = existingConditions.length > 0 
        ? `with existing conditions: ${existingConditions.join(", ")}` 
        : "with no known existing conditions";
      
      const prompt = `You are a healthcare assistant AI. A ${userAge}-year-old person ${conditionsText} 
                is experiencing the following symptoms: "${symptoms}".
                
                Provide an analysis of possible conditions, recommended medicines, self-care advice, 
                and when they should see a doctor.
                
                Format your response as a JSON object with the following structure:
                {
                  "possibleConditions": ["Condition 1", "Condition 2"],
                  "recommendedMedicines": ["Medicine 1", "Medicine 2"],
                  "selfCareAdvice": ["Advice 1", "Advice 2"],
                  "whenToSeeDoctor": "Advice on when to seek professional medical help"
                }
                
                IMPORTANT: Include a clear disclaimer that this is not medical advice and should not replace 
                consultation with a healthcare professional.`;
      
      const response = await generateWithGemini(prompt);
      return JSON.parse(response) as SymptomAnalysis;
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      
      // Fallback to mock data if API fails
      return {
        possibleConditions: ["Common cold", "Seasonal allergies", "Sinus infection"],
        recommendedMedicines: ["Antihistamines", "Decongestants", "Pain relievers"],
        selfCareAdvice: ["Rest", "Stay hydrated", "Use a humidifier", "Saline nasal spray"],
        whenToSeeDoctor: "If symptoms persist for more than 10 days, if you have a high fever, or if symptoms are severe or worsening."
      };
    }
  },
  
  // Check for potential medicine interactions
  async checkInteractions(medicineList: string[]): Promise<string[]> {
    try {
      const prompt = `You are a pharmaceutical expert AI. Check for potential interactions between these medicines:
                ${medicineList.join(", ")}
                
                Return your response as a JSON array of strings, each describing a potential interaction.
                If there are no known interactions, return an empty array.`;
      
      const response = await generateWithGemini(prompt);
      return JSON.parse(response) as string[];
    } catch (error) {
      console.error("Error checking interactions:", error);
      
      // Fallback to mock data if API fails
      if (medicineList.length > 1) {
        return ["These medications may interact. Please consult with your healthcare provider."];
      }
      return [];
    }
  },
  
  // Generate personalized health tips
  async getHealthTips(userProfile: { age: number, conditions: string[], medications: string[] }): Promise<string[]> {
    try {
      const prompt = `You are a healthcare assistant AI. Generate personalized health tips for a ${userProfile.age}-year-old 
                person with the following conditions: ${userProfile.conditions.join(", ") || "no known conditions"}.
                They are currently taking these medications: ${userProfile.medications.join(", ") || "no medications"}.
                
                Return your response as a JSON array of strings, each containing a helpful health tip.`;
      
      const response = await generateWithGemini(prompt);
      return JSON.parse(response) as string[];
    } catch (error) {
      console.error("Error generating health tips:", error);
      
      // Fallback to mock data if API fails
      return [
        "Stay hydrated by drinking at least 8 glasses of water daily",
        "Aim for 7-9 hours of sleep each night",
        "Include fruits and vegetables in every meal",
        "Take a 30-minute walk daily",
        "Practice stress-reduction techniques like meditation"
      ];
    }
  },
  
  // Generate chat responses for the assistant
  async generateChatResponse(userQuery: string): Promise<string> {
    try {
      const prompt = `You are a helpful health assistant that provides information about medicines, symptoms, and home remedies. 
                You should NOT provide medical diagnosis or prescribe medication.
                Always advise users to consult healthcare professionals for serious concerns.
                
                User query: ${userQuery}`;
    
      try {
        return await generateWithGemini(prompt);
      } catch (apiError) {
        console.error("Gemini API error, using fallback response:", apiError);
        
        // Use our mock response generator as a fallback
        return generateMockResponse(userQuery);
      }
    } catch (error) {
      console.error("Error generating chat response:", error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or consult with a healthcare professional for immediate concerns.";
    }
  }
}

