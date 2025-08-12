/**
 * @fileoverview PersonaFlux Character Management Service
 * @description Comprehensive service layer for character CRUD operations with Supabase integration
 * Provides type-safe database interactions and error handling for character management
 *
 * @author PersonaFlux Team
 * @version 1.0.0
 * @since 2025-08-08
 *
 * @requires @supabase/supabase-js ^2.53.1
 *
 * Features:
 * - Type-safe character data operations
 * - Comprehensive error handling
 * - Email-based character filtering
 * - Data validation and sanitization
 * - Performance optimized queries
 */

import { createClient } from "@/utils/supabase/client";

/**
 * Interface for game turn data (single interaction in a game)
 */
export interface GameTurn {
  prompt: string;
  description: string;
  options: string[];
  selected_option: string;
}

/**
 * Interface for game log data to be inserted into database
 * Based on the game_log table schema
 */
export interface GameLogInsertData {
  character_id: number;
  game_summary: GameTurn[];
}

/**
 * Interface for complete game log data including database metadata
 */
export interface GameLogData extends GameLogInsertData {
  id: number;
  created_at: string;
}

/**
 * Complete game log interface (alias for GameLogData for backwards compatibility)
 */
export type GameLog = GameLogData;

/**
 * Interface defining the structure for character insertion data
 * Used when creating new characters in the database
 *
 * @interface CharacterInsertData
 * @property {string} character_name - The character's display name
 * @property {string[]} traits - Array of personality traits
 * @property {number} [age] - Optional character age
 * @property {string} gender - Character's gender identity
 * @property {string} voice_name - Selected voice model for TTS
 * @property {number} no_of_scenes - Number of scenes/interactions planned
 * @property {string} language - Primary language for character interactions
 * @property {string|null} [avatar_url] - URL or base64 string for character avatar
 * @property {string} [backstory] - AI-generated character background
 * @property {string} [story_context] - World setting and context
 * @property {string} [starting_prompt] - Initial interaction prompt
 * @property {string[]} start_options - Array of initial dialogue choices
 * @property {string[]} ending_scenes - Array of possible story conclusions
 * @property {string} [user_email] - Email of the character creator (deprecated - use email)
 */
export interface CharacterInsertData {
  character_name: string;
  traits: string[];
  age?: number;
  gender: string;
  voice_name: string;
  no_of_scenes: number;
  language: string;
  avatar_url?: string | null;
  backstory?: string;
  story_context?: string;
  starting_prompt?: string;
  start_options: string[];
  ending_scenes: string[];
  user_email?: string; // Changed from user_id to user_email
}

/**
 * Interface for complete character data including database metadata
 * Extends CharacterInsertData with system-generated fields
 */
export interface CharacterData extends CharacterInsertData {
  id: number;
  email: string;
  created_at: string;
  updated_at?: string; // Made optional since this column may not exist in all deployments
}

/**
 * Standard response interface for all service operations
 * Provides consistent error handling across the application
 */
interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Creates a new character record in the Supabase database
 *
 * This function handles the complete character creation process including:
 * - Data validation and sanitization
 * - Database insertion with error handling
 * - Response formatting for consistent API returns
 *
 * @param {CharacterInsertData} characterData - Complete character information
 * @returns {Promise<ServiceResponse<CharacterData>>} Database response with created character or error
 *
 * @example
 * ```typescript
 * const newCharacter = {
 *   character_name: "Aria Shadowmere",
 *   traits: ["mysterious", "intelligent"],
 *   gender: "female",
 *   voice_name: "ethereal_female",
 *   no_of_scenes: 5,
 *   language: "English",
 *   start_options: ["Hello", "Greetings", "Who are you?"],
 *   ending_scenes: ["Victory", "Sacrifice", "Mystery"],
 *   email: "user@example.com"
 * };
 *
 * const { data, error } = await createCharacter(newCharacter);
 * if (error) {
 *   console.error("Failed to create character:", error.message);
 * } else {
 *   console.log("Character created:", data?.character_name);
 * }
 * ```
 *
 * @throws {Error} When required fields are missing or invalid
 * @throws {Error} When database connection fails
 * @throws {Error} When user lacks permission to create characters
 */
export async function createCharacter(
  characterData: CharacterInsertData
): Promise<ServiceResponse<CharacterData>> {
  const supabase = createClient();

  try {
    // Validate required fields before database operation
    if (!characterData.character_name?.trim()) {
      throw new Error("Character name is required and cannot be empty");
    }

    if (!characterData.traits || characterData.traits.length === 0) {
      throw new Error("At least one character trait must be specified");
    }

    if (!characterData.gender?.trim()) {
      throw new Error("Character gender must be specified");
    }

    if (!characterData.language?.trim()) {
      throw new Error("Character language must be specified");
    }

    // Sanitize and prepare data for insertion
    const sanitizedData = {
      ...characterData,
      character_name: characterData.character_name.trim(),
      traits: characterData.traits.filter((trait) => trait.trim() !== ""),
      start_options: characterData.start_options.filter(
        (option) => option.trim() !== ""
      ),
      ending_scenes: characterData.ending_scenes.filter(
        (scene) => scene.trim() !== ""
      ),
    };

    // Insert character into database with row-level security
    const { data, error } = await supabase
      .from("characters")
      .insert([sanitizedData])
      .select("*") // Return all fields including auto-generated ones
      .single(); // Expect exactly one record back

    if (error) {
      console.error("❌ Supabase character creation error:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);

      // Provide user-friendly error messages based on error type
      if (error.code === "23505") {
        // Unique constraint violation
        throw new Error(
          "A character with this name already exists for this user"
        );
      } else if (error.code === "42501") {
        // Insufficient privilege
        throw new Error("You don't have permission to create characters");
      } else if (error.message.includes("JWT")) {
        throw new Error("Authentication session expired. Please log in again");
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    if (!data) {
      throw new Error("Character was created but no data was returned");
    }

    console.log("✅ Character successfully created:", {
      id: data.id,
      name: data.character_name,
      traits: data.traits.length,
      email: data.email,
    });

    return { data: data as CharacterData, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during character creation";
    console.error("🚨 Character creation service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Retrieves all characters associated with a specific user email
 *
 * This function provides efficient character listing with:
 * - Email-based filtering for user data isolation
 * - Optimized database queries with selected fields
 * - Comprehensive error handling and logging
 * - Support for empty result sets
 *
 * @param {string} email - User's email address for character filtering
 * @returns {Promise<ServiceResponse<CharacterData[]>>} Array of user's characters or error
 *
 * @example
 * ```typescript
 * const { data: characters, error } = await getCharactersByEmail("user@example.com");
 *
 * if (error) {
 *   console.error("Failed to fetch characters:", error.message);
 * } else {
 *   console.log(`Found ${characters?.length || 0} characters`);
 *   characters?.forEach(char => console.log(`- ${char.character_name}`));
 * }
 * ```
 *
 * @throws {Error} When email parameter is invalid
 * @throws {Error} When database query fails
 * @throws {Error} When user lacks permission to view characters
 */
export async function getCharactersByEmail(
  email: string
): Promise<ServiceResponse<CharacterData[]>> {
  // Validate email parameter to prevent unnecessary database queries
  if (!email?.trim()) {
    const error = new Error(
      "Valid email address is required for character retrieval"
    );
    console.error("❌ Invalid email parameter:", email);
    return { data: null, error };
  }

  const supabase = createClient();

  try {
    // Query characters with optimized field selection
    const { data, error } = await supabase
      .from("characters")
      .select(
        `
        id,
        character_name,
        traits,
        age,
        gender,
        voice_name,
        no_of_scenes,
        language,
        avatar_url,
        backstory,
        story_context,
        starting_prompt,
        start_options,
        ending_scenes,
        email,
        created_at
      `
      )
      .eq("email", email.trim())
      .order("created_at", { ascending: false }); // Most recent first

    if (error) {
      console.error("❌ Supabase character fetch error:", error.message);

      if (error.code === "42501") {
        throw new Error("You don't have permission to view these characters");
      } else if (error.message.includes("JWT")) {
        throw new Error("Authentication session expired. Please log in again");
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    const characters = data || [];

    console.log(`✅ Retrieved ${characters.length} characters for ${email}`);

    if (characters.length > 0) {
      console.log(
        "Character summary:",
        characters.map((char) => ({
          id: char.id,
          name: char.character_name,
          created: char.created_at,
        }))
      );
    }

    return { data: characters as CharacterData[], error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during character retrieval";
    console.error("🚨 Character fetch service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Retrieves a specific character by its unique database ID
 *
 * This function provides secure character access with:
 * - ID validation and type checking
 * - Single record retrieval optimization
 * - Row-level security enforcement
 * - Detailed error reporting
 *
 * @param {number} id - Unique character identifier
 * @returns {Promise<ServiceResponse<CharacterData>>} Character data or error
 *
 * @example
 * ```typescript
 * const { data: character, error } = await getCharacterById(123);
 *
 * if (error) {
 *   console.error("Character not found:", error.message);
 * } else {
 *   console.log(`Found character: ${character?.character_name}`);
 * }
 * ```
 *
 * @throws {Error} When ID parameter is invalid
 * @throws {Error} When character doesn't exist
 * @throws {Error} When user lacks permission to view character
 */
export async function getCharacterById(
  id: number
): Promise<ServiceResponse<CharacterData>> {
  // Validate ID parameter with comprehensive type checking
  if (typeof id !== "number" || isNaN(id) || id <= 0) {
    const error = new Error("A valid positive character ID number is required");
    console.error("❌ Invalid character ID:", id);
    return { data: null, error };
  }

  const supabase = createClient();

  try {
    // Fetch specific character with all fields
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("id", id)
      .single(); // Expect exactly one result

    if (error) {
      console.error("❌ Supabase character fetch error:", error.message);

      if (error.code === "PGRST116") {
        // No rows returned
        throw new Error(
          `Character with ID ${id} not found or you don't have permission to view it`
        );
      } else if (error.code === "42501") {
        throw new Error("You don't have permission to view this character");
      } else if (error.message.includes("JWT")) {
        throw new Error("Authentication session expired. Please log in again");
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    if (!data) {
      throw new Error(`Character with ID ${id} not found`);
    }

    console.log(`✅ Successfully retrieved character ${id}:`, {
      name: data.character_name,
      email: data.email,
      created: data.created_at,
    });

    return { data: data as CharacterData, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during character retrieval";
    console.error("🚨 Character fetch by ID service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Permanently deletes a character from the database
 *
 * This function provides secure character deletion with:
 * - ID validation and authorization checks
 * - Cascading deletion of related data
 * - Audit logging for deletion events
 * - Irreversible operation warnings
 *
 * @param {number} id - Unique character identifier to delete
 * @returns {Promise<ServiceResponse<void>>} Success confirmation or error
 *
 * @example
 * ```typescript
 * const { error } = await deleteCharacterById(123);
 *
 * if (error) {
 *   console.error("Failed to delete character:", error.message);
 * } else {
 *   console.log("Character successfully deleted");
 * }
 * ```
 *
 * @warning This operation is irreversible. Ensure user confirmation before calling.
 *
 * @throws {Error} When ID parameter is invalid
 * @throws {Error} When character doesn't exist
 * @throws {Error} When user lacks permission to delete character
 */
export async function deleteCharacterById(
  id: number
): Promise<ServiceResponse<void>> {
  // Validate ID parameter with comprehensive type checking
  if (typeof id !== "number" || isNaN(id) || id <= 0) {
    const error = new Error(
      "A valid positive character ID number is required for deletion"
    );
    console.error("❌ Invalid character ID for deletion:", id);
    return { data: null, error };
  }

  const supabase = createClient();

  try {
    // First, verify the character exists and user has permission
    const { data: existingCharacter, error: fetchError } = await supabase
      .from("characters")
      .select("id, character_name, email")
      .eq("id", id)
      .single();

    if (fetchError || !existingCharacter) {
      throw new Error(
        `Character with ID ${id} not found or you don't have permission to delete it`
      );
    }

    // Step 1: Delete associated game logs first (cascade deletion)
    console.log(`🗑️ Deleting game logs for character ${id}...`);
    const { error: gameLogsDeleteError } = await deleteGameLogsByCharacterId(
      id
    );

    if (gameLogsDeleteError) {
      throw new Error(
        `Failed to delete associated game logs: ${gameLogsDeleteError.message}`
      );
    }

    // Step 2: Perform the character deletion with row-level security
    const { error: deleteError } = await supabase
      .from("characters")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "❌ Supabase character deletion error:",
        deleteError.message
      );

      if (deleteError.code === "42501") {
        throw new Error("You don't have permission to delete this character");
      } else if (deleteError.message.includes("JWT")) {
        throw new Error("Authentication session expired. Please log in again");
      } else {
        throw new Error(`Database error: ${deleteError.message}`);
      }
    }

    console.log(`✅ Successfully deleted character ${id}:`, {
      name: existingCharacter.character_name,
      email: existingCharacter.email,
    });

    // Log deletion for audit purposes
    console.log(
      `🗑️ AUDIT: Character "${existingCharacter.character_name}" (ID: ${id}) and associated game logs deleted by ${existingCharacter.email}`
    );

    return { data: null, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during character deletion";
    console.error("🚨 Character deletion service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Saves a completed game session to the database
 *
 * @param {GameLogData} gameData - Complete game session data
 * @returns {Promise<ServiceResponse<GameLog>>} Saved game log or error
 */
export async function saveGameLog(
  gameData: GameLogInsertData
): Promise<ServiceResponse<GameLog>> {
  const supabase = createClient();

  try {
    // Validate required fields
    if (!gameData.character_id) {
      throw new Error("Character ID is required");
    }
    if (!gameData.game_summary || gameData.game_summary.length === 0) {
      throw new Error("Game summary cannot be empty");
    }

    const { data, error } = await supabase
      .from("game_log")
      .insert([gameData])
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase game log creation error:", error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("✅ Game log saved successfully:", data.id);
    return { data: data as GameLog, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during game log saving";
    console.error("🚨 Game log save service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Retrieves all game logs for a specific user
 *
 * @param {string} email - User's email address
 * @returns {Promise<ServiceResponse<GameLog[]>>} Array of game logs or error
 */
export async function getGameLogsByEmail(
  email: string
): Promise<ServiceResponse<GameLog[]>> {
  if (!email?.trim()) {
    return { data: null, error: new Error("Valid email address is required") };
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("game_log")
      .select("*")
      .eq("email", email.trim())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase game logs fetch error:", error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`✅ Retrieved ${data?.length || 0} game logs for ${email}`);
    return { data: (data as GameLog[]) || [], error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during game logs retrieval";
    console.error("🚨 Game logs fetch service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Retrieves a specific game log by ID
 *
 * @param {number} id - Game log ID
 * @returns {Promise<ServiceResponse<GameLog>>} Game log data or error
 */
export async function getGameLogById(
  id: number
): Promise<ServiceResponse<GameLog>> {
  if (!id || id <= 0) {
    return { data: null, error: new Error("Valid game log ID is required") };
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("game_log")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Supabase game log fetch error:", error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: data as GameLog, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during game log retrieval";
    console.error("🚨 Game log fetch service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Retrieves game logs for a specific character
 *
 * @param {number} characterId - Character ID to fetch game logs for
 * @returns {Promise<ServiceResponse<GameLog[]>>} Array of game logs or error
 */
export async function getGameLogsByCharacterId(
  characterId: number
): Promise<ServiceResponse<GameLog[]>> {
  const supabase = createClient();

  try {
    if (!characterId) {
      throw new Error("Character ID is required");
    }

    const { data, error } = await supabase
      .from("game_log")
      .select("*")
      .eq("character_id", characterId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase game logs fetch error:", error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: (data as GameLog[]) || [], error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during game logs retrieval";
    console.error("🚨 Game logs fetch service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Gets the count of game logs (conversations) for a specific character
 *
 * @param {number} characterId - Character ID to count game logs for
 * @returns {Promise<ServiceResponse<number>>} Count of game logs or error
 */
export async function getGameLogCountByCharacterId(
  characterId: number
): Promise<ServiceResponse<number>> {
  if (
    typeof characterId !== "number" ||
    isNaN(characterId) ||
    characterId <= 0
  ) {
    const error = new Error("A valid positive character ID number is required");
    console.error("❌ Invalid character ID for game log count:", characterId);
    return { data: null, error };
  }

  const supabase = createClient();

  try {
    const { count, error } = await supabase
      .from("game_log")
      .select("id", { count: "exact" })
      .eq("character_id", characterId);

    if (error) {
      console.error("❌ Supabase game log count error:", error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: count || 0, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during game log count retrieval";
    console.error("🚨 Game log count service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}

/**
 * Deletes all game logs for a specific character
 *
 * @param {number} characterId - Character ID to delete game logs for
 * @returns {Promise<ServiceResponse<void>>} Success or error response
 */
export async function deleteGameLogsByCharacterId(
  characterId: number
): Promise<ServiceResponse<void>> {
  if (
    typeof characterId !== "number" ||
    isNaN(characterId) ||
    characterId <= 0
  ) {
    const error = new Error("A valid positive character ID number is required");
    console.error(
      "❌ Invalid character ID for game log deletion:",
      characterId
    );
    return { data: null, error };
  }

  const supabase = createClient();

  try {
    // First, get count of game logs to be deleted for logging
    const { data: gameLogsToDelete, error: countError } = await supabase
      .from("game_log")
      .select("id")
      .eq("character_id", characterId);

    if (countError) {
      console.error("❌ Error counting game logs:", countError.message);
      throw new Error(`Database error: ${countError.message}`);
    }

    const gameLogCount = gameLogsToDelete?.length || 0;

    // Delete all game logs for this character
    const { error: deleteError } = await supabase
      .from("game_log")
      .delete()
      .eq("character_id", characterId);

    if (deleteError) {
      console.error(
        "❌ Supabase game logs deletion error:",
        deleteError.message
      );
      throw new Error(`Database error: ${deleteError.message}`);
    }

    console.log(
      `✅ Successfully deleted ${gameLogCount} game logs for character ${characterId}`
    );

    return { data: null, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during game logs deletion";
    console.error("🚨 Game logs deletion service error:", errorMessage);
    return { data: null, error: new Error(errorMessage) };
  }
}
