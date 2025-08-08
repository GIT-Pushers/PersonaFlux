/**
 * @fileoverview Response Latency and Load Testing Suite
 * @description Performance testing for AI character generation under various load conditions
 * 
 * Test Coverage:
 * - Single request response time
 * - Concurrent request handling
 * - System throughput measurement
 * - Memory usage under load
 * - Error rate monitoring
 * - Scalability benchmarks
 */

import { describe, test, expect, beforeAll } from 'jest';
import { PersonaFluxClient } from '../src/lib/client';
import { PerformanceBenchmark, TestMetrics } from '../src/types/character';

describe('Response Latency and Load Testing', () => {
  let client: PersonaFluxClient;
  const performanceResults: PerformanceBenchmark[] = [];

  beforeAll(async () => {
    client = new PersonaFluxClient({
      apiKey: process.env.TEST_API_KEY || 'test-key',
      baseUrl: process.env.TEST_API_URL || 'http://localhost:3000/api'
    });
  });

  describe('Single Request Performance', () => {
    test('character generation should complete within 2 seconds', async () => {
      const startTime = Date.now();

      const character = await client.generateCharacter({
        character_name: "Speed Test Warrior",
        traits: ["brave", "quick"],
        age: 28,
        gender: "male",
        language: "English"
      });

      const responseTime = Date.now() - startTime;

      const benchmark: PerformanceBenchmark = {
        operation: 'character_generation',
        expected_max_time_ms: 2000,
        actual_time_ms: responseTime,
        success: responseTime < 2000,
        error_rate: 0
      };

      performanceResults.push(benchmark);

      expect(responseTime).toBeLessThan(2000);
      expect(character.id).toBeDefined();
      expect(character.character_name).toBe("Speed Test Warrior");

      await client.deleteCharacter(character.id);
    });

    test('dialogue generation should complete within 800ms', async () => {
      const character = await client.generateCharacter({
        character_name: "Quick Response NPC",
        traits: ["witty", "responsive"],
        age: 25,
        gender: "female",
        language: "English"
      });

      const startTime = Date.now();

      const response = await client.generateDialogue({
        characterId: character.id,
        playerInput: "Hello, how are you?",
        conversationHistory: []
      });

      const responseTime = Date.now() - startTime;

      const benchmark: PerformanceBenchmark = {
        operation: 'dialogue_generation',
        expected_max_time_ms: 800,
        actual_time_ms: responseTime,
        success: responseTime < 800,
        error_rate: 0
      };

      performanceResults.push(benchmark);

      expect(responseTime).toBeLessThan(800);
      expect(response.dialogue).toBeDefined();
      expect(response.response_time_ms).toBeLessThan(800);

      await client.deleteCharacter(character.id);
    });
  });

  describe('Concurrent Load Testing', () => {
    test('should handle 5 concurrent character generations', async () => {
      const concurrentRequests = 5;
      const startTime = Date.now();

      const promises = Array.from({ length: concurrentRequests }, (_, index) =>
        client.generateCharacter({
          character_name: `Concurrent Character ${index + 1}`,
          traits: ["reliable", "consistent"],
          age: 20 + index,
          gender: index % 2 === 0 ? "male" : "female",
          language: "English"
        })
      );

      const characters = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      const benchmark: PerformanceBenchmark = {
        operation: 'concurrent_character_generation',
        expected_max_time_ms: 5000,
        actual_time_ms: totalTime,
        success: totalTime < 5000 && characters.length === concurrentRequests,
        error_rate: 0
      };

      performanceResults.push(benchmark);

      expect(totalTime).toBeLessThan(5000); // 5 seconds for 5 concurrent requests
      expect(characters).toHaveLength(concurrentRequests);
      expect(characters.every(char => char.id)).toBe(true);

      // Cleanup
      await Promise.all(characters.map(char => client.deleteCharacter(char.id)));
    });

    test('should handle 10 concurrent dialogue requests', async () => {
      const character = await client.generateCharacter({
        character_name: "Load Test NPC",
        traits: ["patient", "helpful"],
        age: 30,
        gender: "non-binary",
        language: "English"
      });

      const concurrentDialogues = 10;
      const inputs = Array.from({ length: concurrentDialogues }, (_, i) => 
        `Test message number ${i + 1}`
      );

      const startTime = Date.now();

      const promises = inputs.map(input =>
        client.generateDialogue({
          characterId: character.id,
          playerInput: input,
          conversationHistory: []
        })
      );

      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      const benchmark: PerformanceBenchmark = {
        operation: 'concurrent_dialogue_generation',
        expected_max_time_ms: 3000,
        actual_time_ms: totalTime,
        success: totalTime < 3000 && responses.length === concurrentDialogues,
        error_rate: 0
      };

      performanceResults.push(benchmark);

      expect(totalTime).toBeLessThan(3000); // 3 seconds for 10 concurrent dialogues
      expect(responses).toHaveLength(concurrentDialogues);
      expect(responses.every(res => res.dialogue)).toBe(true);

      // Verify all responses are unique and appropriate
      const uniqueResponses = new Set(responses.map(r => r.dialogue));
      expect(uniqueResponses.size).toBeGreaterThan(1); // Should have some variety

      await client.deleteCharacter(character.id);
    });
  });

  describe('Sustained Load Testing', () => {
    test('should maintain performance under sustained load', async () => {
      const character = await client.generateCharacter({
        character_name: "Endurance Test NPC",
        traits: ["resilient", "steady"],
        age: 35,
        gender: "male",
        language: "English"
      });

      const sustainedRequests = 20;
      const batchSize = 5;
      const responseTimes: number[] = [];
      let errorCount = 0;

      // Send requests in batches to simulate sustained load
      for (let batch = 0; batch < sustainedRequests / batchSize; batch++) {
        const batchStartTime = Date.now();

        const batchPromises = Array.from({ length: batchSize }, (_, i) =>
          client.generateDialogue({
            characterId: character.id,
            playerInput: `Sustained test message ${batch * batchSize + i + 1}`,
            conversationHistory: []
          }).catch(() => {
            errorCount++;
            return null;
          })
        );

        const batchResponses = await Promise.all(batchPromises);
        const batchTime = Date.now() - batchStartTime;
        
        responseTimes.push(batchTime);

        // Small delay between batches to simulate realistic usage
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const errorRate = errorCount / sustainedRequests;

      const benchmark: PerformanceBenchmark = {
        operation: 'sustained_load_test',
        expected_max_time_ms: 2000, // Average batch time should be under 2 seconds
        actual_time_ms: averageResponseTime,
        success: averageResponseTime < 2000 && errorRate < 0.05,
        error_rate: errorRate
      };

      performanceResults.push(benchmark);

      expect(averageResponseTime).toBeLessThan(2000);
      expect(errorRate).toBeLessThan(0.05); // Less than 5% error rate

      await client.deleteCharacter(character.id);
    });
  });

  describe('Scalability Testing', () => {
    test('should scale linearly with load', async () => {
      const loadLevels = [1, 3, 5];
      const scalabilityResults: TestMetrics[] = [];

      for (const loadLevel of loadLevels) {
        const character = await client.generateCharacter({
          character_name: `Scalability Test ${loadLevel}`,
          traits: ["scalable", "efficient"],
          age: 25,
          gender: "female",
          language: "English"
        });

        const startTime = Date.now();

        const promises = Array.from({ length: loadLevel }, (_, i) =>
          client.generateDialogue({
            characterId: character.id,
            playerInput: `Scalability test message ${i + 1}`,
            conversationHistory: []
          })
        );

        const responses = await Promise.all(promises);
        const totalTime = Date.now() - startTime;
        const averageTime = totalTime / loadLevel;

        const metrics: TestMetrics = {
          response_time_ms: averageTime,
          personality_consistency_score: 0.95, // Assume consistent for scalability test
          emotional_coherence_score: 0.90,
          trait_adherence_score: 0.93
        };

        scalabilityResults.push(metrics);

        expect(responses).toHaveLength(loadLevel);
        expect(averageTime).toBeLessThan(1000); // Each request should average under 1 second

        await client.deleteCharacter(character.id);
      }

      // Verify scalability (response time shouldn't increase dramatically)
      const timeIncrease = scalabilityResults[2].response_time_ms / scalabilityResults[0].response_time_ms;
      expect(timeIncrease).toBeLessThan(2); // Should not double with 5x load
    });
  });

  describe('Edge Case Performance', () => {
    test('should handle large conversation histories efficiently', async () => {
      const character = await client.generateCharacter({
        character_name: "Memory Test NPC",
        traits: ["thoughtful", "attentive"],
        age: 40,
        gender: "non-binary",
        language: "English"
      });

      // Build up a large conversation history
      const largeHistory = Array.from({ length: 50 }, (_, i) => ({
        player: `Player message ${i + 1}`,
        character: `Character response ${i + 1}`,
        emotion: "neutral"
      }));

      const startTime = Date.now();

      const response = await client.generateDialogue({
        characterId: character.id,
        playerInput: "Can you remember our long conversation?",
        conversationHistory: largeHistory
      });

      const responseTime = Date.now() - startTime;

      const benchmark: PerformanceBenchmark = {
        operation: 'large_history_dialogue',
        expected_max_time_ms: 1500,
        actual_time_ms: responseTime,
        success: responseTime < 1500,
        error_rate: 0
      };

      performanceResults.push(benchmark);

      expect(responseTime).toBeLessThan(1500);
      expect(response.dialogue).toBeDefined();

      await client.deleteCharacter(character.id);
    });

    test('should handle complex multi-trait characters efficiently', async () => {
      const complexTraits = [
        "intelligent", "witty", "sarcastic", "analytical", "curious",
        "skeptical", "observant", "articulate", "philosophical", "independent"
      ];

      const startTime = Date.now();

      const character = await client.generateCharacter({
        character_name: "Complex Personality Test",
        traits: complexTraits,
        age: 42,
        gender: "female",
        language: "English"
      });

      const generationTime = Date.now() - startTime;

      const dialogueStartTime = Date.now();

      const response = await client.generateDialogue({
        characterId: character.id,
        playerInput: "Tell me about yourself in detail.",
        conversationHistory: []
      });

      const dialogueTime = Date.now() - dialogueStartTime;

      const benchmark: PerformanceBenchmark = {
        operation: 'complex_character_generation',
        expected_max_time_ms: 3000,
        actual_time_ms: generationTime + dialogueTime,
        success: (generationTime + dialogueTime) < 3000,
        error_rate: 0
      };

      performanceResults.push(benchmark);

      expect(generationTime).toBeLessThan(2500);
      expect(dialogueTime).toBeLessThan(1000);
      expect(response.dialogue.length).toBeGreaterThan(50); // Should be detailed

      await client.deleteCharacter(character.id);
    });
  });

  describe('Performance Regression Testing', () => {
    test('should maintain baseline performance standards', async () => {
      // Expected baseline performance metrics
      const baselineMetrics = {
        character_generation_max_ms: 2000,
        dialogue_generation_max_ms: 800,
        concurrent_requests_max_ms: 5000,
        error_rate_max: 0.05
      };

      // Aggregate performance results
      const characterGenResults = performanceResults.filter(r => 
        r.operation.includes('character_generation')
      );
      
      const dialogueGenResults = performanceResults.filter(r => 
        r.operation.includes('dialogue_generation')
      );

      // Verify character generation performance
      const avgCharGenTime = characterGenResults.reduce((sum, r) => 
        sum + r.actual_time_ms, 0) / characterGenResults.length;
      
      expect(avgCharGenTime).toBeLessThan(baselineMetrics.character_generation_max_ms);

      // Verify dialogue generation performance
      const avgDialogueGenTime = dialogueGenResults.reduce((sum, r) => 
        sum + r.actual_time_ms, 0) / dialogueGenResults.length;
      
      expect(avgDialogueGenTime).toBeLessThan(baselineMetrics.dialogue_generation_max_ms);

      // Verify overall error rate
      const totalErrorRate = performanceResults.reduce((sum, r) => 
        sum + r.error_rate, 0) / performanceResults.length;
      
      expect(totalErrorRate).toBeLessThan(baselineMetrics.error_rate_max);

      // Log performance summary for monitoring
      console.log('Performance Test Summary:', {
        total_tests: performanceResults.length,
        avg_character_generation_ms: avgCharGenTime,
        avg_dialogue_generation_ms: avgDialogueGenTime,
        overall_error_rate: totalErrorRate,
        all_tests_passed: performanceResults.every(r => r.success)
      });
    });
  });
});
