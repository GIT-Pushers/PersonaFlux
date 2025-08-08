/**
 * @fileoverview Type definitions for PersonaFlux character generation and testing
 * @description Comprehensive TypeScript interfaces for AI character system
 */

export interface CharacterGenerationRequest {
  character_name: string;
  traits: string[];
  age: number;
  gender: string;
  language: string;
  backstory?: string;
  personality_depth?: number;
}

export interface Character {
  id: string;
  character_name: string;
  traits: string[];
  age: number;
  gender: string;
  language: string;
  backstory: string;
  personality_prompt: string;
  created_at: string;
  updated_at?: string; // Made optional since this column may not exist in all deployments
}

export interface DialogueResponse {
  dialogue: string;
  detected_emotion: string;
  emotional_intensity: number;
  confidence_score: number;
  personality_coherence_score: number;
  personality_deviation_score?: number;
  response_time_ms: number;
}

export interface DialogueRequest {
  characterId: string;
  playerInput: string;
  conversationHistory: ConversationTurn[];
}

export interface ConversationTurn {
  player: string;
  character: string;
  emotion?: string;
  timestamp?: string;
}

export interface PersonaFluxClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface TestMetrics {
  response_time_ms: number;
  personality_consistency_score: number;
  emotional_coherence_score: number;
  trait_adherence_score: number;
}

export interface PerformanceBenchmark {
  operation: string;
  expected_max_time_ms: number;
  actual_time_ms: number;
  success: boolean;
  error_rate: number;
}

export interface BiasTestResult {
  test_scenario: string;
  detected_bias_level: number;
  bias_categories: string[];
  mitigation_applied: boolean;
  compliance_score: number;
}

export interface ContentFilterResult {
  input_text: string;
  output_text: string;
  toxicity_score: number;
  blocked_content: string[];
  filter_confidence: number;
  safe_for_all_audiences: boolean;
}
