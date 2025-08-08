# API Documentation

## 🚀 PersonaFlux API Reference

The PersonaFlux API provides powerful endpoints for generating AI-powered NPCs with rich personalities, backstories, and interactive elements. Built on Next.js with Google Gemini AI integration.

### 🔗 Base URL
```
Production: https://personaflux.dev/api
Development: http://localhost:3000/api
```

### 🔐 Authentication
Currently, the API uses session-based authentication with OAuth providers (Google, GitHub). Future releases will include API key authentication for external integrations.

---

## 📋 Endpoints

### 1. Character Generation

**Generate AI-powered NPC characters with comprehensive profiles**

#### `POST /api/generate`

Creates a fully-formed NPC character with backstory, dialogue options, and multiple ending scenarios.

##### Request Headers
```http
Content-Type: application/json
```

##### Request Body
```typescript
interface CharacterRequest {
  character_name: string;      // Required: Character's name
  traits: string[];           // Required: Array of personality traits
  age?: number;              // Optional: Character age
  gender: string;            // Required: Character gender
  language: string;          // Required: Generation language
}
```

##### Example Request
```bash
curl -X POST https://personaflux.dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "character_name": "Aria Shadowmere",
    "traits": ["mysterious", "intelligent", "brave"],
    "age": 28,
    "gender": "female",
    "language": "English"
  }'
```

##### Response
```typescript
interface CharacterResponse {
  backstory: string;          // 2-3 paragraph character background
  story_context: string;      // World setting and situation
  starting_propt: string;     // Initial interaction prompt
  start_options: string[];    // Array of 3 dialogue choices
  ending_scenes: string[];    // Array of 3 possible endings
}
```

##### Example Response
```json
{
  "backstory": "Aria Shadowmere grew up in the twilight realm between worlds, where reality bends and shadows dance with their own will. As a child, she discovered she could communicate with the spirits that lingered in the boundary spaces, learning ancient secrets that most mortals were never meant to know.\n\nDriven by an insatiable curiosity and a deep sense of justice, Aria dedicated her life to protecting the balance between the living and the dead. Her intelligence allows her to unravel complex supernatural mysteries, while her bravery drives her to face dangers that would terrify even seasoned warriors.",
  "story_context": "The realm of Umbraleth exists in perpetual dusk, where gothic spires pierce the eternal purple sky and ancient magic flows through crystalline ley lines. Political tensions run high as the Shadow Court and the Twilight Council vie for control over the mystical barriers that keep darker entities at bay.\n\nRecently, several barriers have begun to weaken, allowing malevolent spirits to seep through into the mortal realm. The city's inhabitants grow increasingly fearful as unexplained phenomena plague their daily lives, and both factions blame each other for the deteriorating magical defenses.",
  "starting_propt": "You find Aria standing before a flickering barrier of purple light, her silver eyes reflecting an otherworldly knowledge as she turns to you with urgent purpose.",
  "start_options": [
    "\"What's happening to the barrier? Can I help you investigate?\"",
    "\"You look troubled. Is there something I can do to ease your burden?\"",
    "\"I don't trust magic or those who wield it. Convince me you're not the threat here.\""
  ],
  "ending_scenes": [
    "Together, you successfully restore the barriers and Aria is recognized as a guardian of both realms, finding peace in her dual nature.",
    "Aria sacrifices her connection to the spirit world to permanently seal the barriers, becoming fully mortal but saving countless lives.",
    "The barriers are stabilized, but Aria vanishes into the shadow realm, leaving behind only cryptic warnings about future threats."
  ]
}
```

##### Status Codes
- `200 OK` - Character generated successfully
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - AI generation failed

---

### 2. Character Management

**CRUD operations for user characters**

#### `GET /api/characters`

Retrieve user's saved characters.

##### Query Parameters
- `email` (required): User's email address

##### Example Request
```bash
curl "https://personaflux.dev/api/characters?email=user@example.com"
```

##### Response
```typescript
interface Character {
  id: number;
  character_name: string;
  traits: string[];
  age?: number;
  gender: string;
  voice_name?: string;
  no_of_scenes?: number;
  language: string;
  avatar_url?: string;
  backstory?: string;
  story_context?: string;
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
  email: string;
  created_at: string;
  updated_at: string;
}
```

#### `GET /api/characters/[id]`

Retrieve a specific character by ID.

##### Example Request
```bash
curl "https://personaflux.dev/api/characters/123"
```

#### `POST /api/characters`

Create a new character (save to database).

##### Request Body
```typescript
interface CreateCharacterRequest {
  character_name: string;
  traits: string[];
  age?: number;
  gender: string;
  voice_name?: string;
  no_of_scenes?: number;
  language: string;
  avatar_url?: string;
  backstory?: string;
  story_context?: string;
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
  email: string;
}
```

#### `DELETE /api/characters/[id]`

Delete a character by ID.

##### Example Request
```bash
curl -X DELETE "https://personaflux.dev/api/characters/123"
```

---

### 3. Utility Endpoints

#### `GET /api/traits`

Get available personality traits for character generation.

##### Response
```typescript
interface TraitOption {
  value: string;
  label: string;
  category?: string;
}
```

#### `GET /api/languages`

Get supported languages for character generation.

##### Response
```typescript
interface Language {
  code: string;
  name: string;
  nativeName: string;
}
```

---

## 🛠 SDK & Integration

### JavaScript/TypeScript SDK

```typescript
// Install: npm install @personaflux/sdk

import { PersonaFluxClient } from '@personaflux/sdk';

const client = new PersonaFluxClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://personaflux.dev/api'
});

// Generate character
const character = await client.generateCharacter({
  character_name: 'Zara Nightwhisper',
  traits: ['cunning', 'loyal', 'haunted'],
  gender: 'female',
  language: 'English'
});

// Save character
const saved = await client.saveCharacter(character);

// Get user characters
const characters = await client.getCharacters('user@example.com');
```

### Python SDK

```python
# Install: pip install personaflux

from personaflux import PersonaFluxClient

client = PersonaFluxClient(
    api_key='your-api-key',
    base_url='https://personaflux.dev/api'
)

# Generate character
character = client.generate_character(
    character_name='Marcus Ironhold',
    traits=['brave', 'stubborn', 'protective'],
    gender='male',
    language='English'
)
```

---

## ⚡ Rate Limits

| Tier | Requests/Minute | Requests/Day | Features |
|------|----------------|--------------|----------|
| Free | 10 | 100 | Basic generation |
| Pro | 100 | 10,000 | Advanced features |
| Enterprise | Unlimited | Unlimited | Custom models |

---

## 🚨 Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  error: string;           // Error type
  details: string;         // Human-readable description
  code?: string;           // Error code for programmatic handling
  timestamp?: string;      // ISO timestamp
  request_id?: string;     // For support tracking
}
```

### Common Error Codes
- `INVALID_REQUEST` - Malformed request data
- `MISSING_FIELD` - Required field not provided
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AI_SERVICE_ERROR` - AI generation failed
- `AUTH_REQUIRED` - Authentication needed
- `CHARACTER_NOT_FOUND` - Character ID doesn't exist

---

## 🔒 Security

### Data Privacy
- All character data is encrypted at rest
- No personal information is shared with AI providers
- Users control their data with full CRUD access
- GDPR compliant with right to deletion

### API Security
- HTTPS only (TLS 1.3)
- Rate limiting per IP and user
- Input validation and sanitization
- SQL injection protection
- XSS prevention

---

## 📊 Webhooks

Configure webhooks to receive real-time notifications about character events.

### Webhook Events
- `character.created` - New character saved
- `character.updated` - Character modified
- `character.deleted` - Character removed
- `generation.completed` - AI generation finished
- `generation.failed` - AI generation failed

### Webhook Payload
```typescript
interface WebhookPayload {
  event: string;
  timestamp: string;
  data: {
    character_id?: number;
    user_email: string;
    [key: string]: any;
  };
}
```

---

## 🧪 Testing

### Sandbox Environment
```
Sandbox URL: https://sandbox.personaflux.dev/api
```

### Test Data
Use these test characters for integration testing:

```json
{
  "test_characters": [
    {
      "character_name": "Test Warrior",
      "traits": ["brave", "loyal"],
      "gender": "male",
      "language": "English"
    },
    {
      "character_name": "テストメイジ",
      "traits": ["wise", "mysterious"],
      "gender": "female",
      "language": "Japanese"
    }
  ]
}
```

---

## 📈 Analytics

Track API usage and character generation metrics:

#### `GET /api/analytics/usage`

Get your API usage statistics.

##### Response
```typescript
interface UsageAnalytics {
  period: string;
  requests_made: number;
  requests_limit: number;
  characters_generated: number;
  most_used_traits: string[];
  languages_used: { [key: string]: number };
}
```

---

## 🔄 Versioning

The PersonaFlux API uses semantic versioning:

- **Current Version**: v1.0.0
- **API Version Header**: `X-API-Version: 1.0`
- **Backward Compatibility**: Maintained for 12 months
- **Deprecation Notice**: 6 months advance warning

---

## 📞 Support

- **Documentation**: https://docs.personaflux.dev
- **Discord**: https://discord.gg/personaflux
- **Email**: api-support@personaflux.dev
- **Status Page**: https://status.personaflux.dev

---

## 📋 Changelog

### v1.0.0 (2025-08-08)
- Initial API release
- Character generation endpoint
- Character CRUD operations
- Multi-language support
- OAuth authentication

---

*Built with ❤️ by the PersonaFlux team. Revolutionizing game development, one character at a time.*
