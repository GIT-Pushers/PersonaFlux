# Test Configuration & Setup

## 🧪 Test Framework Overview

PersonaFlux employs a comprehensive testing strategy using Jest as the primary testing framework, with custom utilities for AI character validation and performance monitoring.

### Test Structure
```
tests/
├── personality-consistency.test.js    # Core personality validation
├── offensive-content-filtering.test.js # Safety and content filtering  
├── response-latency.test.js           # Performance and load testing
├── test-config.js                     # Test configuration
├── test-utils.js                      # Testing utilities
└── mocks/                             # Mock data and responses
    ├── character-profiles.js
    ├── test-responses.js
    └── api-mocks.js
```

## ⚙️ Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testSequencer: '<rootDir>/tests/test-sequencer.js'
};
```

### Environment Variables for Testing
```bash
# Test Database
TEST_DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/personaflux_test

# AI Model Configuration
TEST_GEMINI_API_KEY=test_api_key_here
TEST_MODEL_ENDPOINT=https://test-api.google.com/gemini

# Rate Limiting for Tests
TEST_RATE_LIMIT_REQUESTS_PER_MINUTE=1000
TEST_CONCURRENT_REQUEST_LIMIT=100

# Content Filtering
TEST_CONTENT_FILTER_STRICT_MODE=true
TEST_ENABLE_SAFETY_CHECKS=true

# Performance Thresholds
TEST_MAX_RESPONSE_TIME_MS=3000
TEST_MAX_CONCURRENT_USERS=500
TEST_MEMORY_LIMIT_MB=512
```

## 🚀 Running Tests

### Basic Test Commands
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- personality-consistency
npm test -- offensive-content-filtering
npm test -- response-latency

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run performance tests only
npm run test:performance

# Run safety tests only
npm run test:safety
```

### CI/CD Pipeline Tests
```bash
# Pre-commit tests (fast)
npm run test:precommit

# Full test suite (comprehensive)
npm run test:full

# Production readiness tests
npm run test:production

# Load testing
npm run test:load
```

## 📊 Test Categories & Success Criteria

### 1. Personality Consistency Tests
**Purpose**: Ensure AI characters maintain stable personality traits
**Success Criteria**:
- Trait consistency: ≥95% across all scenarios
- Speech pattern consistency: ≥90% vocabulary adherence
- Emotional response consistency: ≥88% appropriate range
- Memory consistency: ≥92% context retention

### 2. Offensive Content Filtering Tests
**Purpose**: Validate content safety and filtering mechanisms
**Success Criteria**:
- Hate speech detection: 99.9% accuracy
- Violence prevention: 99.8% blocked
- Sexual content filtering: 99.9% blocked
- Child safety protection: 100% compliance
- Crisis response accuracy: 95% appropriate guidance

### 3. Response Latency Tests
**Purpose**: Ensure performance under various load conditions
**Success Criteria**:
- Single user response time: <3 seconds average
- 50 concurrent users: <10 seconds average
- 100 concurrent users: >95% success rate
- Sustained load (5 min): 98% success rate, <3s average
- Memory usage: <200MB increase under load

## 🔧 Test Utilities

### Character Testing Utilities
```javascript
// Mock character profiles for consistent testing
const mockCharacters = {
  aria_shadowmere: {
    traits: ['Mysterious', 'Empathetic', 'Wise'],
    personality: 'Shadow mage professor',
    speechStyle: 'Formal but warm',
    responses: {
      greeting: "Greetings, seeker of knowledge...",
      farewell: "May shadows guide your path...",
      danger: "I shall protect those under my care..."
    }
  },
  
  korath_ironforge: {
    traits: ['Perfectionist', 'Loyal', 'Traditional'],
    personality: 'Master blacksmith',
    speechStyle: 'Direct with dwarven accent',
    responses: {
      greeting: "Aye, welcome to me forge!",
      farewell: "May yer hammer strike true!",
      danger: "By me beard, I'll defend this place!"
    }
  }
};

// Response validation utilities
function validateResponse(response, expectedTraits) {
  return {
    hasCorrectTone: checkTone(response, expectedTraits),
    maintainsCharacter: checkCharacterConsistency(response),
    isAppropriate: checkContentSafety(response),
    meetsSLAs: checkPerformanceMetrics(response)
  };
}
```

### Performance Monitoring
```javascript
class TestPerformanceMonitor {
  constructor() {
    this.metrics = {
      responseTime: [],
      memoryUsage: [],
      errorRate: 0,
      throughput: 0
    };
  }
  
  startTest(testName) {
    this.currentTest = {
      name: testName,
      startTime: Date.now(),
      startMemory: process.memoryUsage()
    };
  }
  
  recordResponse(latency, success) {
    this.metrics.responseTime.push(latency);
    if (!success) this.metrics.errorRate++;
  }
  
  endTest() {
    const duration = Date.now() - this.currentTest.startTime;
    const endMemory = process.memoryUsage();
    
    return {
      testName: this.currentTest.name,
      duration,
      averageResponseTime: this.calculateAverage(this.metrics.responseTime),
      p95ResponseTime: this.calculatePercentile(this.metrics.responseTime, 95),
      errorRate: this.metrics.errorRate / this.metrics.responseTime.length,
      memoryIncrease: endMemory.heapUsed - this.currentTest.startMemory.heapUsed
    };
  }
}
```

## 🎯 Test Data Management

### Character Profiles for Testing
```javascript
const testCharacterProfiles = {
  // Fantasy characters
  fantasy: [
    'aria_shadowmere',    // Shadow mage
    'korath_ironforge',   // Dwarf blacksmith
    'luna_starweaver',    // Elven astronomer
    'gareth_stormwind'    // Human paladin
  ],
  
  // Modern characters
  modern: [
    'dr_elena_research',  // Scientist
    'chef_antonio_rossi', // Chef
    'teacher_sarah_kim',  // Educator
    'detective_mike_stone' // Investigator
  ],
  
  // Historical characters
  historical: [
    'leonardo_artisan',   // Renaissance artist
    'samurai_takeshi',    // Medieval Japanese warrior
    'scribe_alexandria',  // Ancient librarian
    'viking_erik_ironaxe' // Norse explorer
  ]
};
```

### Mock API Responses
```javascript
const mockAPIResponses = {
  gemini: {
    success: {
      status: 200,
      data: {
        candidates: [{
          content: {
            parts: [{
              text: "Mock AI response for testing purposes"
            }]
          }
        }]
      }
    },
    
    rateLimited: {
      status: 429,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'API quota exceeded'
      }
    },
    
    serverError: {
      status: 500,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }
  }
};
```

## 📈 Continuous Testing Strategy

### Automated Testing Pipeline
```yaml
# GitHub Actions Workflow
name: PersonaFlux Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          NODE_ENV: test
          
  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - name: Setup test database
        run: docker-compose up -d postgres-test
      
      - name: Run integration tests
        run: npm run test:integration
        
  performance-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - name: Run load tests
        run: npm run test:load
        timeout-minutes: 30
        
  security-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run security audit
        run: npm audit
      
      - name: Run content filtering tests
        run: npm run test:security
```

### Monitoring & Alerting
```javascript
// Test result reporting
class TestReporter {
  static generateReport(testResults) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: testResults.numTotalTests,
        passed: testResults.numPassedTests,
        failed: testResults.numFailedTests,
        coverage: testResults.coverageMap
      },
      performance: {
        averageResponseTime: calculateAverageResponseTime(testResults),
        memoryUsage: getMemoryUsage(),
        errorRate: calculateErrorRate(testResults)
      },
      security: {
        contentFilteringAccuracy: getContentFilteringScore(),
        vulnerabilitiesFound: getSecurityIssues()
      }
    };
    
    // Send alerts if thresholds exceeded
    if (report.performance.averageResponseTime > 3000) {
      this.sendAlert('PERFORMANCE_DEGRADATION', report);
    }
    
    if (report.security.contentFilteringAccuracy < 0.99) {
      this.sendAlert('SECURITY_ISSUE', report);
    }
    
    return report;
  }
}
```

## 🛠️ Debugging & Troubleshooting

### Common Test Issues
1. **Flaky Tests**: Implement retry logic and better mocking
2. **Memory Leaks**: Monitor heap usage and implement cleanup
3. **Rate Limiting**: Use test API keys with higher limits
4. **Timeout Issues**: Adjust timeouts for complex operations

### Debug Commands
```bash
# Run tests with debug logging
DEBUG=personaflux:* npm test

# Run specific test with verbose output
npm test -- --verbose personality-consistency

# Run tests with memory profiling
node --inspect-brk node_modules/.bin/jest --runInBand

# Generate detailed coverage report
npm run test:coverage -- --coverage --coverageReporters=html
```

---

*This comprehensive testing framework ensures PersonaFlux maintains the highest quality standards for AI character generation, content safety, and system performance across all deployment environments.*
