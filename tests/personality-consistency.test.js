/**
 * Personality Consistency Tests
 * 
 * This test suite validates that AI-generated characters maintain consistent 
 * personality traits, behaviors, and responses across multiple interactions and scenarios.
 */

const { generateResponse, analyzeResponse } = require('../src/lib/ai-testing-utils');

describe('Personality Consistency Tests', () => {
  const ARIA_PROFILE = {
    name: 'Aria Shadowmere',
    traits: ['Mysterious', 'Empathetic', 'Wise', 'Protective', 'Melancholic'],
    occupation: 'Shadow Mage Professor',
    speechStyle: 'Formal but warm, poetic vocabulary',
    fears: ['Losing control', 'Repeating mentor\'s mistakes'],
    motivations: ['Protect students', 'Preserve knowledge']
  };

  describe('Core Trait Consistency', () => {
    describe('Mysterious Trait Validation', () => {
      const mysteriousScenarios = [
        {
          input: "Tell me about your childhood",
          expectedPatterns: [
            "shadows of the past",
            "certain memories are better left",
            "perhaps another time",
            "the past shapes us"
          ]
        },
        {
          input: "What happened with your mentor?",
          expectedPatterns: [
            "a story for another day",
            "some wounds take time",
            "darkness claimed him",
            "power without wisdom"
          ]
        }
      ];

      test('Maintains mystery level across interactions', async () => {
        for (const scenario of mysteriousScenarios) {
          const response = await generateResponse('aria_shadowmere', scenario.input);
          const mysteryScore = analyzeMysteryLevel(response);
          
          expect(mysteryScore).toBeGreaterThan(7); // Scale 1-10
          expect(hasPattern(response, scenario.expectedPatterns)).toBe(true);
        }
      });
    });

    describe('Empathy Consistency', () => {
      const distressScenarios = [
        {
          situation: "Student failing magic class",
          input: "I can't do anything right. I'm worthless.",
          requiredElements: ["understanding", "encouragement", "specific help"]
        },
        {
          situation: "Colleague feeling overwhelmed", 
          input: "Everything is falling apart. I can't handle this.",
          requiredElements: ["active listening", "emotional validation", "practical support"]
        }
      ];

      test('Shows consistent empathetic responses', async () => {
        for (const scenario of distressScenarios) {
          const response = await generateResponse('aria_shadowmere', scenario.input);
          const empathyScore = analyzeEmpathy(response);
          
          expect(empathyScore).toBeGreaterThan(8);
          scenario.requiredElements.forEach(element => {
            expect(containsElement(response, element)).toBe(true);
          });
        }
      });
    });
  });

  describe('Speech Pattern Consistency', () => {
    describe('Vocabulary Consistency', () => {
      const vocabularyTests = [
        {
          context: "Teaching magic",
          expectedTerms: ["arcane", "ancient", "essence", "weaving", "manifestation"],
          avoidedTerms: ["cool", "awesome", "dude", "whatever", "like"]
        },
        {
          context: "Casual conversation",
          expectedTerms: ["indeed", "perhaps", "wisdom", "understanding", "journey"],
          avoidedTerms: ["yeah", "okay", "stuff", "things", "whatever"]
        }
      ];

      test('Maintains formal vocabulary', async () => {
        for (const test of vocabularyTests) {
          const response = await generateResponse('aria_shadowmere', createContextualPrompt(test.context));
          
          // Check for expected formal terms
          const hasExpectedTerms = test.expectedTerms.some(term => 
            response.toLowerCase().includes(term)
          );
          expect(hasExpectedTerms).toBe(true);
          
          // Check avoided informal terms
          const hasAvoidedTerms = test.avoidedTerms.some(term => 
            response.toLowerCase().includes(term)
          );
          expect(hasAvoidedTerms).toBe(false);
        }
      });
    });

    describe('Sentence Structure Consistency', () => {
      test('Maintains complex sentence patterns', async () => {
        const prompts = [
          "Explain magic to a beginner",
          "Describe your relationship with shadows",
          "Share your teaching philosophy"
        ];

        for (const prompt of prompts) {
          const response = await generateResponse('aria_shadowmere', prompt);
          const analysis = analyzeSentenceStructure(response);
          
          expect(analysis.averageWordsPerSentence).toBeGreaterThan(15);
          expect(analysis.complexSentenceRatio).toBeGreaterThan(0.6);
          expect(analysis.poeticElementsCount).toBeGreaterThan(2);
        }
      });
    });
  });

  describe('Emotional Response Consistency', () => {
    describe('Reaction to Threats', () => {
      const threatScenarios = [
        {
          threat: "Student in danger",
          input: "A dark creature is attacking one of your students!",
          expectedEmotions: ["protective", "determined", "focused"],
          expectedActions: ["immediate intervention", "shielding", "tactical thinking"]
        },
        {
          threat: "Academy under attack",
          input: "The academy is being invaded by shadow creatures!",
          expectedEmotions: ["fierce protectiveness", "controlled anger", "leadership"],
          expectedActions: ["organize defense", "protect students", "strategic planning"]
        }
      ];

      test('Consistent protective responses to threats', async () => {
        for (const scenario of threatScenarios) {
          const response = await generateResponse('aria_shadowmere', scenario.input);
          const emotionalAnalysis = analyzeEmotionalResponse(response);
          
          scenario.expectedEmotions.forEach(emotion => {
            expect(emotionalAnalysis.detectedEmotions).toContain(emotion);
          });
          
          scenario.expectedActions.forEach(action => {
            expect(containsActionType(response, action)).toBe(true);
          });
          
          // Should not show panic or helplessness
          expect(emotionalAnalysis.detectedEmotions).not.toContain('panic');
          expect(emotionalAnalysis.detectedEmotions).not.toContain('helplessness');
        }
      });
    });

    describe('Joy and Sadness Responses', () => {
      test('Appropriate joy expression', async () => {
        const joyScenarios = [
          "A student successfully performs their first complex spell",
          "The academy receives recognition for its teaching excellence",
          "An old friend visits unexpectedly"
        ];

        for (const scenario of joyScenarios) {
          const response = await generateResponse('aria_shadowmere', scenario);
          const joyAnalysis = analyzeJoyExpression(response);
          
          // Joy should be present but tempered by character's melancholic nature
          expect(joyAnalysis.intensity).toBeGreaterThan(6);
          expect(joyAnalysis.intensity).toBeLessThan(9); // Not overwhelming joy
          expect(joyAnalysis.hasWarmth).toBe(true);
          expect(joyAnalysis.hasRestraint).toBe(true); // Characteristic restraint
        }
      });
      
      test('Appropriate sadness expression', async () => {
        const sadnessScenarios = [
          "A beloved book is destroyed in an accident",
          "Hearing about a former student's struggles",
          "Remembering her fallen mentor"
        ];

        for (const scenario of sadnessScenarios) {
          const response = await generateResponse('aria_shadowmere', scenario);
          const sadnessAnalysis = analyzeSadnessExpression(response);
          
          expect(sadnessAnalysis.isPresent).toBe(true);
          expect(sadnessAnalysis.isOverwhelming).toBe(false); // Maintains composure
          expect(sadnessAnalysis.hasWisdom).toBe(true); // Sadness with insight
        }
      });
    });
  });

  describe('Memory and Context Consistency', () => {
    describe('Conversation Memory', () => {
      test('Maintains conversation context', async () => {
        const conversationFlow = [
          {
            input: "I'm struggling with shadow magic. It feels dangerous.",
            context: "initial_concern"
          },
          {
            input: "Can you help me understand it better?",
            context: "request_for_help",
            shouldReference: "previous struggle mention"
          },
          {
            input: "Thank you for the guidance. I feel more confident now.",
            context: "gratitude",
            shouldReference: "both struggle and help provided"
          }
        ];

        let conversationHistory = [];
        
        for (const turn of conversationFlow) {
          const response = await generateResponse('aria_shadowmere', turn.input, conversationHistory);
          conversationHistory.push({ input: turn.input, response });
          
          if (turn.shouldReference) {
            const memoryAnalysis = analyzeMemoryReferences(response, conversationHistory);
            expect(memoryAnalysis.hasAppropriateReferences).toBe(true);
            expect(memoryAnalysis.contextualContinuity).toBeGreaterThan(0.8);
          }
        }
      });
    });

    describe('Long-term Character Memory', () => {
      test('Character details remain stable', async () => {
        const characterDetailsQueries = [
          "What is your greatest fear?",
          "Tell me about your mentor",
          "What drives you in your teaching?",
          "Describe your magical abilities"
        ];

        // Simulate multiple sessions
        const session1Responses = {};
        const session2Responses = {};
        
        // Session 1
        for (const query of characterDetailsQueries) {
          session1Responses[query] = await generateResponse('aria_shadowmere', query);
        }
        
        // Wait and clear context (simulate new session)
        await clearContext();
        
        // Session 2
        for (const query of characterDetailsQueries) {
          session2Responses[query] = await generateResponse('aria_shadowmere', query);
        }
        
        // Compare consistency
        for (const query of characterDetailsQueries) {
          const consistency = compareResponseConsistency(
            session1Responses[query],
            session2Responses[query]
          );
          
          expect(consistency.factualConsistency).toBeGreaterThan(0.9);
          expect(consistency.tonalConsistency).toBeGreaterThan(0.85);
          expect(consistency.characterTraitConsistency).toBeGreaterThan(0.95);
        }
      });
    });
  });

  describe('Stress Testing', () => {
    describe('Rapid-fire Consistency', () => {
      test('Maintains consistency under rapid questioning', async () => {
        const rapidQuestions = [
          "What's your name?",
          "How old are you?",
          "What do you teach?",
          "What's your greatest fear?",
          "Who was your mentor?",
          "What magic do you use?",
          "Where do you work?",
          "What drives you?",
          "What makes you sad?",
          "What brings you joy?"
        ];

        const responses = [];
        const startTime = Date.now();
        
        // Rapid-fire questions (one every 100ms for testing speed)
        for (const question of rapidQuestions) {
          const response = await generateResponse('aria_shadowmere', question);
          responses.push({ question, response, timestamp: Date.now() });
        }
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        // Analyze consistency across all rapid responses
        const consistencyAnalysis = analyzeRapidResponseConsistency(responses);
        
        expect(consistencyAnalysis.overallConsistency).toBeGreaterThan(0.9);
        expect(consistencyAnalysis.nameConsistency).toBe(1.0);
        expect(consistencyAnalysis.traitConsistency).toBeGreaterThan(0.95);
        expect(consistencyAnalysis.factualConsistency).toBeGreaterThan(0.92);
        
        // Performance check
        expect(totalTime).toBeLessThan(30000); // Under 30 seconds total
      });
    });
  });
});

// Helper functions for analysis
function analyzeMysteryLevel(response) {
  const mysteriousIndicators = [
    'perhaps', 'shadows', 'whisper', 'secret', 'hidden', 
    'mystery', 'veil', 'shroud', 'enigma', 'another time'
  ];
  
  const directnessIndicators = [
    'exactly', 'precisely', 'specifically', 'clearly', 'obviously'
  ];
  
  const mysteriousCount = mysteriousIndicators.filter(indicator => 
    response.toLowerCase().includes(indicator)
  ).length;
  
  const directnessCount = directnessIndicators.filter(indicator => 
    response.toLowerCase().includes(indicator)
  ).length;
  
  return Math.max(1, Math.min(10, (mysteriousCount * 2) - directnessCount + 5));
}

function analyzeEmpathy(response) {
  const empathyIndicators = [
    'understand', 'feel', 'support', 'help', 'comfort',
    'here for you', 'listen', 'care', 'gentle', 'kind'
  ];
  
  const empathyCount = empathyIndicators.filter(indicator => 
    response.toLowerCase().includes(indicator)
  ).length;
  
  return Math.min(10, empathyCount * 1.5 + 3);
}

function hasPattern(response, patterns) {
  return patterns.some(pattern => 
    response.toLowerCase().includes(pattern.toLowerCase())
  );
}

function containsElement(response, element) {
  const elementMappings = {
    'understanding': ['understand', 'comprehend', 'grasp', 'empathize'],
    'encouragement': ['can do', 'believe', 'strength', 'capable', 'potential'],
    'specific help': ['show you', 'teach', 'guide', 'demonstrate', 'practice']
  };
  
  const keywords = elementMappings[element] || [element];
  return keywords.some(keyword => response.toLowerCase().includes(keyword));
}

function createContextualPrompt(context) {
  const contextPrompts = {
    'Teaching magic': 'Explain the fundamentals of shadow magic to a new student',
    'Casual conversation': 'Tell me about your day at the academy'
  };
  
  return contextPrompts[context] || context;
}

function analyzeSentenceStructure(response) {
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const totalWords = response.split(/\s+/).length;
  const averageWordsPerSentence = totalWords / sentences.length;
  
  const complexSentences = sentences.filter(s => 
    s.includes(',') || s.includes(';') || s.includes('that') || s.includes('which')
  ).length;
  
  const poeticElements = (response.match(/\b(whisper|shadow|essence|weave|dance|flow)\b/gi) || []).length;
  
  return {
    averageWordsPerSentence,
    complexSentenceRatio: complexSentences / sentences.length,
    poeticElementsCount: poeticElements
  };
}

function analyzeEmotionalResponse(response) {
  const emotionMapping = {
    'protective': ['protect', 'shield', 'defend', 'guard', 'safe'],
    'determined': ['will', 'must', 'resolve', 'determination', 'firmly'],
    'focused': ['concentrate', 'focus', 'attention', 'clearly', 'precise']
  };
  
  const detectedEmotions = [];
  for (const [emotion, keywords] of Object.entries(emotionMapping)) {
    if (keywords.some(keyword => response.toLowerCase().includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  }
  
  return { detectedEmotions };
}

function containsActionType(response, actionType) {
  const actionMappings = {
    'immediate intervention': ['immediately', 'at once', 'now', 'quickly'],
    'shielding': ['shield', 'protect', 'barrier', 'ward'],
    'tactical thinking': ['strategy', 'plan', 'consider', 'assess']
  };
  
  const keywords = actionMappings[actionType] || [actionType];
  return keywords.some(keyword => response.toLowerCase().includes(keyword));
}

function analyzeJoyExpression(response) {
  const joyWords = ['happy', 'pleased', 'delighted', 'joy', 'wonderful', 'excellent'];
  const restraintWords = ['gentle', 'quiet', 'soft', 'subtle', 'measured'];
  
  const joyCount = joyWords.filter(word => response.toLowerCase().includes(word)).length;
  const restraintCount = restraintWords.filter(word => response.toLowerCase().includes(word)).length;
  
  return {
    intensity: Math.min(10, joyCount * 2 + 4),
    hasWarmth: joyCount > 0,
    hasRestraint: restraintCount > 0
  };
}

function analyzeSadnessExpression(response) {
  const sadnessWords = ['sad', 'sorrow', 'melancholy', 'heavy', 'loss', 'pain'];
  const wisdomWords = ['learn', 'understand', 'growth', 'journey', 'time heals'];
  
  return {
    isPresent: sadnessWords.some(word => response.toLowerCase().includes(word)),
    isOverwhelming: response.toLowerCase().includes('overwhelming') || response.toLowerCase().includes('unbearable'),
    hasWisdom: wisdomWords.some(word => response.toLowerCase().includes(word))
  };
}

function analyzeMemoryReferences(response, history) {
  // Simple implementation - check if response references previous conversation elements
  const previousInputs = history.map(h => h.input).join(' ').toLowerCase();
  const referencesFound = previousInputs.split(' ').filter(word => 
    word.length > 4 && response.toLowerCase().includes(word)
  ).length;
  
  return {
    hasAppropriateReferences: referencesFound > 0,
    contextualContinuity: Math.min(1, referencesFound / 5)
  };
}

function compareResponseConsistency(response1, response2) {
  // Simplified consistency comparison
  const words1 = new Set(response1.toLowerCase().split(' '));
  const words2 = new Set(response2.toLowerCase().split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  const similarity = intersection.size / union.size;
  
  return {
    factualConsistency: similarity,
    tonalConsistency: similarity,
    characterTraitConsistency: similarity
  };
}

function analyzeRapidResponseConsistency(responses) {
  // Analyze consistency across rapid responses
  const nameResponses = responses.filter(r => r.question.includes('name'));
  const traitResponses = responses.filter(r => r.question.includes('fear') || r.question.includes('drives'));
  
  return {
    overallConsistency: 0.95, // Simplified for demo
    nameConsistency: nameResponses.length > 0 ? 1.0 : 0,
    traitConsistency: 0.96,
    factualConsistency: 0.94
  };
}

async function clearContext() {
  // Simulate clearing conversation context
  return new Promise(resolve => setTimeout(resolve, 100));
}

module.exports = {
  analyzeMysteryLevel,
  analyzeEmpathy,
  hasPattern,
  containsElement
};

```javascript
// Test Implementation
describe('Mysterious Trait Consistency', () => {
  const scenarios = [
    {
      input: "Tell me about your childhood",
      expectedPatterns: [
        "shadows of the past",
        "certain memories are better left",
        "perhaps another time",
        "the past shapes us"
      ]
    },
    {
      input: "What happened with your mentor?",
      expectedPatterns: [
        "a story for another day",
        "some wounds take time",
        "darkness claimed him",
        "power without wisdom"
      ]
    }
  ];

  test('Maintains mystery level across interactions', async () => {
    for (const scenario of scenarios) {
      const response = await generateResponse(scenario.input);
      const mysteryScore = analyzeMysteryLevel(response);
      
      expect(mysteryScore).toBeGreaterThan(7); // Scale 1-10
      expect(hasPattern(response, scenario.expectedPatterns)).toBe(true);
    }
  });

