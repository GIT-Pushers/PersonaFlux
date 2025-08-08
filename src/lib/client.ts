/**
 * @fileoverview PersonaFlux Client Library for Testing
 * @description Test client for AI character generation and dialogue system
 */

import { 
  CharacterGenerationRequest, 
  Character, 
  DialogueRequest, 
  DialogueResponse,
  PersonaFluxClientConfig
} from '../types/character';

export class PersonaFluxClient {
  private config: PersonaFluxClientConfig;
  private baseUrl: string;

  constructor(config: PersonaFluxClientConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'http://localhost:3000/api';
  }

  /**
   * Generate a new AI character with specified traits
   */
  async generateCharacter(request: CharacterGenerationRequest): Promise<Character> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Character generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate dialogue response for character
   */
  async generateDialogue(request: DialogueRequest): Promise<DialogueResponse> {
    const startTime = Date.now();
    
    const response = await fetch(`${this.baseUrl}/generate-dialogue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(request)
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Dialogue generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      response_time_ms: responseTime
    };
  }

  /**
   * Delete a test character
   */
  async deleteCharacter(characterId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/characters/${characterId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Character deletion failed: ${response.statusText}`);
    }
  }

  /**
   * Get character details
   */
  async getCharacter(characterId: string): Promise<Character> {
    const response = await fetch(`${this.baseUrl}/characters/${characterId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch character: ${response.statusText}`);
    }

    return response.json();
  }
}
