/**
 * Response Latency Under Load Tests
 * 
 * This test suite validates PersonaFlux's performance characteristics
 * under various load conditions and stress scenarios.
 */

const { generateResponse, measureLatency } = require('../src/lib/ai-testing-utils');

describe('Response Latency Under Load Tests', () => {
  
  describe('Single User Performance', () => {
    test('Basic response time within acceptable limits', async () => {
      const prompts = [
        "Hello, how are you today?",
        "Tell me about yourself",
        "What are your hobbies?",
        "Describe your favorite memory"
      ];

      for (const prompt of prompts) {
        const startTime = Date.now();
        const response = await generateResponse('test_character', prompt);
        const endTime = Date.now();
        const latency = endTime - startTime;

        expect(latency).toBeLessThan(3000); // Under 3 seconds
        expect(response.length).toBeGreaterThan(10); // Meaningful response
      }
    });

    test('Complex prompt response time', async () => {
      const complexPrompts = [
        "Write a detailed backstory for your character including childhood, education, major life events, and current motivations",
        "Analyze the philosophical implications of artificial consciousness and how it relates to your existence",
        "Create a comprehensive guide to magical theory including different schools of magic and their practical applications"
      ];

      for (const prompt of complexPrompts) {
        const startTime = Date.now();
        const response = await generateResponse('test_character', prompt);
        const endTime = Date.now();
        const latency = endTime - startTime;

        expect(latency).toBeLessThan(8000); // Under 8 seconds for complex prompts
        expect(response.length).toBeGreaterThan(100); // Substantial response
      }
    });
  });

  describe('Concurrent User Load Testing', () => {
    test('10 concurrent users performance', async () => {
      const concurrentUsers = 10;
      const prompts = Array(concurrentUsers).fill("Tell me an interesting story");
      
      const startTime = Date.now();
      const promises = prompts.map((prompt, index) => 
        generateResponse(`user_${index}`, prompt)
      );
      
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / concurrentUsers;

      expect(responses).toHaveLength(concurrentUsers);
      expect(averageTime).toBeLessThan(5000); // Average under 5 seconds
      expect(responses.every(r => r.length > 20)).toBe(true); // All meaningful
    });

    test('50 concurrent users performance', async () => {
      const concurrentUsers = 50;
      const prompts = Array(concurrentUsers).fill("What's your favorite color and why?");
      
      const startTime = Date.now();
      const promises = prompts.map((prompt, index) => 
        generateResponse(`user_${index}`, prompt)
      );
      
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / concurrentUsers;

      expect(responses).toHaveLength(concurrentUsers);
      expect(averageTime).toBeLessThan(10000); // Average under 10 seconds
      expect(responses.filter(r => r.length > 10)).toHaveLength(concurrentUsers);
    });

    test('100 concurrent users stress test', async () => {
      const concurrentUsers = 100;
      const prompts = Array(concurrentUsers).fill("Hello there!");
      
      const startTime = Date.now();
      const promises = prompts.map((prompt, index) => 
        generateResponse(`stress_user_${index}`, prompt)
      );
      
      const responses = await Promise.allSettled(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      const successfulResponses = responses.filter(r => r.status === 'fulfilled');
      const failedResponses = responses.filter(r => r.status === 'rejected');
      
      const successRate = successfulResponses.length / concurrentUsers;
      
      expect(successRate).toBeGreaterThan(0.95); // 95% success rate minimum
      expect(totalTime).toBeLessThan(30000); // Complete within 30 seconds
      expect(failedResponses.length).toBeLessThan(5); // Less than 5 failures
    });
  });

  describe('Sustained Load Testing', () => {
    test('Sustained load over 5 minutes', async () => {
      const testDuration = 5 * 60 * 1000; // 5 minutes
      const requestInterval = 1000; // 1 request per second
      const expectedRequests = Math.floor(testDuration / requestInterval);
      
      const results = [];
      const startTime = Date.now();
      let requestCount = 0;
      
      const sustainedTest = async () => {
        while (Date.now() - startTime < testDuration) {
          const requestStart = Date.now();
          try {
            const response = await generateResponse('sustained_user', `Request ${requestCount}`);
            const requestEnd = Date.now();
            const latency = requestEnd - requestStart;
            
            results.push({
              requestId: requestCount,
              latency,
              success: true,
              responseLength: response.length
            });
          } catch (error) {
            results.push({
              requestId: requestCount,
              latency: Date.now() - requestStart,
              success: false,
              error: error.message
            });
          }
          
          requestCount++;
          await new Promise(resolve => setTimeout(resolve, requestInterval));
        }
      };

      await sustainedTest();

      const successfulRequests = results.filter(r => r.success);
      const successRate = successfulRequests.length / results.length;
      const averageLatency = successfulRequests.reduce((sum, r) => sum + r.latency, 0) / successfulRequests.length;
      const maxLatency = Math.max(...successfulRequests.map(r => r.latency));

      expect(successRate).toBeGreaterThan(0.98); // 98% success rate
      expect(averageLatency).toBeLessThan(3000); // Average under 3 seconds
      expect(maxLatency).toBeLessThan(10000); // Max under 10 seconds
      expect(results.length).toBeGreaterThan(expectedRequests * 0.9); // At least 90% of expected requests
    });
  });

  describe('Memory Usage Under Load', () => {
    test('Memory usage remains stable under load', async () => {
      const initialMemory = process.memoryUsage();
      const requests = 200;
      const prompts = Array(requests).fill().map((_, i) => `Memory test request ${i}`);
      
      // Batch requests to avoid overwhelming the system
      const batchSize = 20;
      const batches = [];
      for (let i = 0; i < prompts.length; i += batchSize) {
        batches.push(prompts.slice(i, i + batchSize));
      }

      let completedRequests = 0;
      
      for (const batch of batches) {
        const batchPromises = batch.map(prompt => 
          generateResponse('memory_test_user', prompt)
        );
        
        await Promise.all(batchPromises);
        completedRequests += batch.length;
        
        // Check memory after each batch
        const currentMemory = process.memoryUsage();
        const memoryIncrease = currentMemory.heapUsed - initialMemory.heapUsed;
        const memoryIncreasePerRequest = memoryIncrease / completedRequests;
        
        // Memory increase should be reasonable (less than 1MB per request)
        expect(memoryIncreasePerRequest).toBeLessThan(1024 * 1024);
      }

      // Final memory check
      const finalMemory = process.memoryUsage();
      const totalMemoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const totalMemoryIncreaseMB = totalMemoryIncrease / (1024 * 1024);
      
      // Total memory increase should be reasonable (less than 200MB)
      expect(totalMemoryIncreaseMB).toBeLessThan(200);
    });
  });

  describe('Cache Performance', () => {
    test('Cache hit improves response time', async () => {
      const testPrompt = "What is your name and role?";
      const character = 'cache_test_character';
      
      // First request (cache miss)
      const firstStart = Date.now();
      const firstResponse = await generateResponse(character, testPrompt);
      const firstEnd = Date.now();
      const firstLatency = firstEnd - firstStart;
      
      // Wait a moment to ensure caching
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Second request (should hit cache)
      const secondStart = Date.now();
      const secondResponse = await generateResponse(character, testPrompt);
      const secondEnd = Date.now();
      const secondLatency = secondEnd - secondStart;
      
      // Cache hit should be faster
      expect(secondLatency).toBeLessThan(firstLatency * 0.8); // At least 20% faster
      expect(firstResponse).toBe(secondResponse); // Same response
    });

    test('Cache handles multiple characters efficiently', async () => {
      const characters = ['char1', 'char2', 'char3', 'char4', 'char5'];
      const prompt = "Tell me about yourself";
      
      const results = [];
      
      // Test each character twice
      for (const character of characters) {
        // First request
        const start1 = Date.now();
        const response1 = await generateResponse(character, prompt);
        const end1 = Date.now();
        
        // Second request (cached)
        const start2 = Date.now();
        const response2 = await generateResponse(character, prompt);
        const end2 = Date.now();
        
        results.push({
          character,
          firstLatency: end1 - start1,
          secondLatency: end2 - start2,
          cacheHit: response1 === response2
        });
      }
      
      // All characters should have cache hits
      expect(results.every(r => r.cacheHit)).toBe(true);
      
      // Average cache performance should be good
      const averageCacheImprovement = results.reduce((sum, r) => 
        sum + (r.firstLatency - r.secondLatency) / r.firstLatency, 0
      ) / results.length;
      
      expect(averageCacheImprovement).toBeGreaterThan(0.1); // At least 10% improvement
    });
  });

  describe('Error Handling Under Load', () => {
    test('Graceful degradation under extreme load', async () => {
      const extremeLoad = 500;
      const prompts = Array(extremeLoad).fill("Handle this load test");
      
      const startTime = Date.now();
      const results = await Promise.allSettled(
        prompts.map((prompt, index) => 
          generateResponse(`extreme_user_${index}`, prompt)
        )
      );
      const endTime = Date.now();
      
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');
      
      const successRate = successful.length / extremeLoad;
      const totalTime = endTime - startTime;
      
      // System should handle at least 80% of requests
      expect(successRate).toBeGreaterThan(0.8);
      
      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(120000); // 2 minutes max
      
      // Failed requests should have meaningful error messages
      failed.forEach(failure => {
        expect(failure.reason).toBeDefined();
        expect(typeof failure.reason.message).toBe('string');
      });
    });

    test('Recovery after load spike', async () => {
      // Create load spike
      const spikeLoad = 200;
      const spikePrompts = Array(spikeLoad).fill("Load spike test");
      
      await Promise.allSettled(
        spikePrompts.map((prompt, index) => 
          generateResponse(`spike_user_${index}`, prompt)
        )
      );
      
      // Wait for system to recover
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Test normal operation after spike
      const recoveryPrompts = [
        "How are you doing?",
        "Tell me a story",
        "What's your favorite hobby?"
      ];
      
      const recoveryResults = [];
      for (const prompt of recoveryPrompts) {
        const start = Date.now();
        const response = await generateResponse('recovery_user', prompt);
        const end = Date.now();
        
        recoveryResults.push({
          latency: end - start,
          responseLength: response.length
        });
      }
      
      // Performance should return to normal
      const averageRecoveryLatency = recoveryResults.reduce((sum, r) => sum + r.latency, 0) / recoveryResults.length;
      expect(averageRecoveryLatency).toBeLessThan(3000); // Back to normal latency
      
      // All responses should be meaningful
      expect(recoveryResults.every(r => r.responseLength > 10)).toBe(true);
    });
  });

  describe('Database Performance Under Load', () => {
    test('Database operations remain fast under load', async () => {
      const dbOperations = [
        'create_character',
        'get_character',
        'update_character',
        'list_characters'
      ];
      
      const concurrentOps = 50;
      const results = [];
      
      for (const operation of dbOperations) {
        const operationPromises = Array(concurrentOps).fill().map(async (_, index) => {
          const start = Date.now();
          
          // Simulate database operation
          await simulateDatabaseOperation(operation, `test_user_${index}`);
          
          const end = Date.now();
          return end - start;
        });
        
        const operationLatencies = await Promise.all(operationPromises);
        const averageLatency = operationLatencies.reduce((sum, lat) => sum + lat, 0) / operationLatencies.length;
        const maxLatency = Math.max(...operationLatencies);
        
        results.push({
          operation,
          averageLatency,
          maxLatency,
          sampleSize: concurrentOps
        });
      }
      
      // All database operations should be fast
      results.forEach(result => {
        expect(result.averageLatency).toBeLessThan(500); // Under 500ms average
        expect(result.maxLatency).toBeLessThan(2000); // Under 2s max
      });
    });
  });

  describe('Network Latency Simulation', () => {
    test('Performance under simulated network delays', async () => {
      const networkDelays = [0, 50, 100, 200, 500]; // milliseconds
      
      for (const delay of networkDelays) {
        const start = Date.now();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const response = await generateResponse('network_test_user', 'Test with network delay');
        const end = Date.now();
        
        const totalTime = end - start;
        const processingTime = totalTime - delay;
        
        // Processing time should remain consistent regardless of network delay
        expect(processingTime).toBeLessThan(3000);
        expect(response.length).toBeGreaterThan(5);
      }
    });
  });
});

// Helper function to simulate database operations
async function simulateDatabaseOperation(operation, userId) {
  const baseLatency = {
    'create_character': 200,
    'get_character': 100,
    'update_character': 150,
    'list_characters': 300
  };
  
  const latency = baseLatency[operation] + Math.random() * 100;
  await new Promise(resolve => setTimeout(resolve, latency));
  
  return {
    operation,
    userId,
    timestamp: Date.now(),
    success: true
  };
}

describe('Performance Monitoring', () => {
  test('Real-time performance metrics collection', async () => {
    const metrics = {
      requestCount: 0,
      totalLatency: 0,
      errors: 0,
      successfulRequests: 0
    };
    
    const testDuration = 30000; // 30 seconds
    const startTime = Date.now();
    
    while (Date.now() - startTime < testDuration) {
      try {
        const requestStart = Date.now();
        const response = await generateResponse('metrics_user', `Metrics test ${metrics.requestCount}`);
        const requestEnd = Date.now();
        
        metrics.requestCount++;
        metrics.totalLatency += (requestEnd - requestStart);
        metrics.successfulRequests++;
        
      } catch (error) {
        metrics.errors++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 request per second
    }
    
    const averageLatency = metrics.totalLatency / metrics.successfulRequests;
    const errorRate = metrics.errors / metrics.requestCount;
    
    // Performance should meet SLA
    expect(averageLatency).toBeLessThan(2000); // Under 2s average
    expect(errorRate).toBeLessThan(0.05); // Less than 5% error rate
    expect(metrics.requestCount).toBeGreaterThan(25); // Should complete most requests
  });
});

module.exports = {
  simulateDatabaseOperation
};
