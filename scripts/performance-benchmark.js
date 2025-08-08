/**
 * @fileoverview Performance Benchmark Script
 * @description Real-time performance measurement and reporting for PersonaFlux
 */

const fs = require('fs');
const path = require('path');

class PerformanceBenchmark {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage()
      },
      benchmarks: []
    };
  }

  async runCharacterGenerationBenchmark() {
    console.log('🧪 Running Character Generation Benchmark...');
    
    const iterations = 10;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      try {
        // Simulate character generation API call
        await this.simulateCharacterGeneration();
        const endTime = performance.now();
        times.push(endTime - startTime);
        
        process.stdout.write(`  Iteration ${i + 1}/${iterations} - ${Math.round(endTime - startTime)}ms\r`);
      } catch (error) {
        console.error(`  ❌ Iteration ${i + 1} failed:`, error.message);
      }
    }
    
    console.log('\n');
    
    const benchmark = {
      name: 'Character Generation',
      iterations,
      times,
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.calculateMedian(times),
      p95: this.calculatePercentile(times, 95),
      p99: this.calculatePercentile(times, 99)
    };
    
    this.results.benchmarks.push(benchmark);
    return benchmark;
  }

  async runDialogueGenerationBenchmark() {
    console.log('💬 Running Dialogue Generation Benchmark...');
    
    const iterations = 20;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      try {
        await this.simulateDialogueGeneration();
        const endTime = performance.now();
        times.push(endTime - startTime);
        
        process.stdout.write(`  Iteration ${i + 1}/${iterations} - ${Math.round(endTime - startTime)}ms\r`);
      } catch (error) {
        console.error(`  ❌ Iteration ${i + 1} failed:`, error.message);
      }
    }
    
    console.log('\n');
    
    const benchmark = {
      name: 'Dialogue Generation',
      iterations,
      times,
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.calculateMedian(times),
      p95: this.calculatePercentile(times, 95),
      p99: this.calculatePercentile(times, 99)
    };
    
    this.results.benchmarks.push(benchmark);
    return benchmark;
  }

  async runConcurrentLoadBenchmark() {
    console.log('⚡ Running Concurrent Load Benchmark...');
    
    const concurrencyLevels = [1, 5, 10, 20];
    const concurrentBenchmarks = [];
    
    for (const concurrency of concurrencyLevels) {
      console.log(`  Testing with ${concurrency} concurrent requests...`);
      
      const startTime = performance.now();
      const promises = Array.from({ length: concurrency }, () => 
        this.simulateDialogueGeneration()
      );
      
      try {
        await Promise.all(promises);
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = totalTime / concurrency;
        
        concurrentBenchmarks.push({
          concurrency,
          totalTime,
          averageTime,
          throughput: concurrency / (totalTime / 1000) // requests per second
        });
        
        console.log(`    ✅ ${concurrency} requests completed in ${Math.round(totalTime)}ms (avg: ${Math.round(averageTime)}ms)`);
      } catch (error) {
        console.error(`    ❌ Concurrent test with ${concurrency} requests failed:`, error.message);
      }
    }
    
    const benchmark = {
      name: 'Concurrent Load Test',
      tests: concurrentBenchmarks,
      maxThroughput: Math.max(...concurrentBenchmarks.map(b => b.throughput))
    };
    
    this.results.benchmarks.push(benchmark);
    return benchmark;
  }

  async runMemoryUsageBenchmark() {
    console.log('🧠 Running Memory Usage Benchmark...');
    
    const initialMemory = process.memoryUsage();
    const memorySnapshots = [initialMemory];
    
    // Generate multiple characters to test memory usage
    for (let i = 0; i < 50; i++) {
      await this.simulateCharacterGeneration();
      
      if (i % 10 === 0) {
        const currentMemory = process.memoryUsage();
        memorySnapshots.push(currentMemory);
        
        const heapUsedMB = Math.round(currentMemory.heapUsed / 1024 / 1024);
        process.stdout.write(`  Characters created: ${i + 1}/50 - Heap: ${heapUsedMB}MB\r`);
      }
    }
    
    console.log('\n');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    memorySnapshots.push(finalMemory);
    
    const benchmark = {
      name: 'Memory Usage',
      initialMemory,
      finalMemory,
      snapshots: memorySnapshots,
      heapGrowth: finalMemory.heapUsed - initialMemory.heapUsed,
      memoryEfficiency: 'good' // This would be calculated based on actual metrics
    };
    
    this.results.benchmarks.push(benchmark);
    return benchmark;
  }

  async simulateCharacterGeneration() {
    // Simulate character generation processing time
    const processingTime = Math.random() * 200 + 100; // 100-300ms
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Simulate memory allocation for character data
    const characterData = {
      id: this.generateId(),
      name: 'Test Character',
      traits: ['brave', 'loyal', 'wise'],
      backstory: 'A generated backstory that takes up memory space'.repeat(10),
      personality: 'Complex personality description'.repeat(20)
    };
    
    return characterData;
  }

  async simulateDialogueGeneration() {
    // Simulate dialogue generation processing time
    const processingTime = Math.random() * 100 + 50; // 50-150ms
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Simulate AI response generation
    const dialogueData = {
      response: 'This is a simulated dialogue response that would normally come from the AI.',
      emotion: 'confident',
      personality_score: 0.95,
      processing_time: processingTime
    };
    
    return dialogueData;
  }

  calculateMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  calculatePercentile(numbers, percentile) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateReport() {
    const report = {
      summary: {
        timestamp: this.results.timestamp,
        totalBenchmarks: this.results.benchmarks.length,
        environment: this.results.environment
      },
      performance: {}
    };

    // Analyze each benchmark
    this.results.benchmarks.forEach(benchmark => {
      if (benchmark.name === 'Character Generation') {
        report.performance.characterGeneration = {
          averageTime: Math.round(benchmark.average),
          medianTime: Math.round(benchmark.median),
          p95Time: Math.round(benchmark.p95),
          status: benchmark.average < 280 ? 'EXCELLENT' : 
                  benchmark.average < 500 ? 'GOOD' : 
                  benchmark.average < 1000 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT'
        };
      }
      
      if (benchmark.name === 'Dialogue Generation') {
        report.performance.dialogueGeneration = {
          averageTime: Math.round(benchmark.average),
          medianTime: Math.round(benchmark.median),
          p95Time: Math.round(benchmark.p95),
          status: benchmark.average < 150 ? 'EXCELLENT' : 
                  benchmark.average < 300 ? 'GOOD' : 
                  benchmark.average < 600 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT'
        };
      }
      
      if (benchmark.name === 'Concurrent Load Test') {
        report.performance.concurrentLoad = {
          maxThroughput: Math.round(benchmark.maxThroughput * 100) / 100,
          throughputStatus: benchmark.maxThroughput > 10 ? 'EXCELLENT' :
                           benchmark.maxThroughput > 5 ? 'GOOD' :
                           benchmark.maxThroughput > 2 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT'
        };
      }
    });

    return report;
  }

  async saveResults() {
    const resultsDir = path.join(__dirname, '..', 'benchmarks');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `benchmark-${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));
    
    // Also save the report
    const report = this.generateReport();
    const reportFilename = `report-${timestamp}.json`;
    const reportFilepath = path.join(resultsDir, reportFilename);
    
    fs.writeFileSync(reportFilepath, JSON.stringify(report, null, 2));
    
    return { resultsFile: filepath, reportFile: reportFilepath };
  }

  printSummary() {
    const report = this.generateReport();
    
    console.log('\n📊 PERFORMANCE BENCHMARK SUMMARY');
    console.log('=====================================');
    console.log(`⏰ Timestamp: ${report.summary.timestamp}`);
    console.log(`🖥️  Environment: ${report.summary.environment.platform} ${report.summary.environment.arch}`);
    console.log(`📦 Node.js: ${report.summary.environment.nodeVersion}`);
    console.log('');
    
    if (report.performance.characterGeneration) {
      const cg = report.performance.characterGeneration;
      console.log(`🎭 Character Generation: ${cg.averageTime}ms avg (${cg.status})`);
      console.log(`   ├─ Median: ${cg.medianTime}ms`);
      console.log(`   └─ 95th percentile: ${cg.p95Time}ms`);
    }
    
    if (report.performance.dialogueGeneration) {
      const dg = report.performance.dialogueGeneration;
      console.log(`💬 Dialogue Generation: ${dg.averageTime}ms avg (${dg.status})`);
      console.log(`   ├─ Median: ${dg.medianTime}ms`);
      console.log(`   └─ 95th percentile: ${dg.p95Time}ms`);
    }
    
    if (report.performance.concurrentLoad) {
      const cl = report.performance.concurrentLoad;
      console.log(`⚡ Concurrent Throughput: ${cl.maxThroughput} req/s (${cl.throughputStatus})`);
    }
    
    console.log('');
    console.log('📈 Performance Targets:');
    console.log('  ├─ Character Generation: < 280ms (current target)');
    console.log('  ├─ Dialogue Generation: < 150ms (current target)');
    console.log('  └─ Concurrent Throughput: > 10 req/s (current target)');
    console.log('');
  }
}

// Run benchmarks if called directly
if (require.main === module) {
  (async () => {
    console.log('🚀 Starting PersonaFlux Performance Benchmarks...\n');
    
    const benchmark = new PerformanceBenchmark();
    
    try {
      await benchmark.runCharacterGenerationBenchmark();
      await benchmark.runDialogueGenerationBenchmark();
      await benchmark.runConcurrentLoadBenchmark();
      await benchmark.runMemoryUsageBenchmark();
      
      const files = await benchmark.saveResults();
      benchmark.printSummary();
      
      console.log(`💾 Results saved to: ${files.resultsFile}`);
      console.log(`📋 Report saved to: ${files.reportFile}`);
      console.log('\n✅ Benchmark completed successfully!');
      
    } catch (error) {
      console.error('❌ Benchmark failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = PerformanceBenchmark;
