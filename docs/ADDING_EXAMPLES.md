# Adding Example Prompts and Templates

This guide explains how to add new example prompts and templates to the LLM Prompt Builder. Examples provide quick-start templates and best practices for each supported model.

## Table of Contents

- [Overview](#overview)
- [Understanding the Data Structure](#understanding-the-data-structure)
- [Type Definitions](#type-definitions)
- [Creating a New Example Prompt](#creating-a-new-example-prompt)
- [Block Categories and Patterns](#block-categories-and-patterns)
- [Best Practices](#best-practices)
- [Example Walkthroughs](#example-walkthroughs)
- [Adding a New Model](#adding-a-new-model)
- [Testing Examples](#testing-examples)
- [Common Mistakes](#common-mistakes)

## Overview

The LLM Prompt Builder uses a modular data structure to define:

- **Blocks:** Reusable prompt components (ROLE, TASK, CONTEXT, etc.)
- **Models:** AI model configurations with specific block sets
- **Examples:** Pre-built prompt templates for quick starts

### File Structure

```
src/data/
├── blockDefs.ts    # Block definitions (ROLE, TASK, CONTEXT, etc.)
├── models.ts       # Model configurations (which blocks each model uses)
├── examples.ts     # Example prompts organized by model
└── index.ts       # Central export file
```

### Why Add Examples?

- **Quick Start:** Users can immediately start with working prompts
- **Best Practices:** Demonstrate effective prompt patterns
- **Education:** Teach proper structure for each model
- **Testing:** Provide reference implementations for testing

## Understanding the Data Structure

### Block Definitions (`blockDefs.ts`)

Defines all available blocks with their default content and descriptions:

```typescript
export const BLOCK_DEFS: BlockDefs = {
  role: {
    tag: "ROLE",
    content: "You are an expert AI assistant.",
    desc: "Define the AI's persona"
  },
  task: {
    tag: "TASK",
    content: "Your goal is to...",
    desc: "The main objective"
  },
  // ... more blocks
};
```

### Model Configurations (`models.ts`)

Specifies which blocks are available for each model:

```typescript
export const MODELS: ModelConfigs = {
  generic: {
    name: "Generic / Any",
    blocks: ["role", "task", "context", "rules", "goal", "example", "input", "tot_problem", "tot_branch", "tot_thought", "tot_evaluation", "tot_solution"]
  },
  claude: {
    name: "Anthropic (Claude Family)",
    blocks: ["system", "user", "assistant", "xml_wrapper", "thinking", "context", "tot_problem", "tot_branch", "tot_thought", "tot_evaluation", "tot_solution"]
  },
  // ... more models
};
```

### Examples (`examples.ts`)

Contains pre-built prompts organized by model:

```typescript
export const MODEL_EXAMPLES: ModelExamples = {
  generic: [
    {
      name: "Chain of Thought",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "You are an expert problem solver." },
        { id: uuid(), tag: "TASK", content: "Analyze the input and provide a solution." }
      ]
    }
  ],
  // ... more models
};
```

## Type Definitions

All types are defined in `src/types/index.ts`:

### Node Interface

Represents a single block in the prompt tree:

```typescript
interface Node {
  id: string;              // Unique identifier (use uuid())
  tag: string;             // Block tag (must exist in BLOCK_DEFS)
  content: string;          // Block content
  isList?: boolean;         // True for list containers
  children?: Node[];        // Nested blocks (for complex structures)
}
```

### BlockDef Interface

Defines a block type:

```typescript
interface BlockDef {
  tag: string;       // Block identifier (e.g., "ROLE")
  content: string;    // Default content for new instances
  desc: string;       // Description shown in UI
}
```

### Example Interface

Represents a complete prompt example:

```typescript
interface Example {
  name: string;      // Example name displayed in dropdown
  nodes: Node[];      // Array of blocks forming the prompt
}
```

### ModelKey Type

Valid model keys (must match keys in `MODELS`):

```typescript
type ModelKey = 'generic' | 'gemini' | 'claude' | 'openai' | 'llama' | 'deepseek' | 'qwen' | 'glm' | 'image' | 'video';
```

## Creating a New Example Prompt

### Step 1: Choose Target Model

Decide which model your example is for:

```typescript
// For Generic model
generic: [
  // Your example here
]

// For Claude model
claude: [
  // Your example here
]

// For Image Generation
image: [
  // Your example here
]
```

### Step 2: Check Available Blocks

Verify which blocks the model supports:

```typescript
// Check models.ts
claude: {
  name: "Anthropic (Claude Family)",
  blocks: ["system", "user", "assistant", "xml_wrapper", "thinking", "context"]
}

// Available blocks: system, user, assistant, xml_wrapper, thinking, context
```

### Step 3: Build Node Structure

Create nodes with unique IDs using `uuid()`:

```typescript
import { ModelExamples } from '../types';
import { uuid } from '../utils/uuid';

export const MODEL_EXAMPLES: ModelExamples = {
  openai: [
    {
      name: "My Custom Example",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are a helpful assistant." },
        { id: uuid(), tag: "USER", content: "What is the capital of France?" },
        { id: uuid(), tag: "ASSISTANT", content: "The capital of France is Paris." }
      ]
    }
  ]
};
```

### Step 4: Use Nested Children (Optional)

For complex prompts, use nested structures:

```typescript
{
  name: "Complex Prompt",
  nodes: [
    {
      id: uuid(),
      tag: "CONTEXT",
      content: "Background information...",
      children: [
        { id: uuid(), tag: "SUB_CONTEXT", content: "Additional detail..." },
        { id: uuid(), tag: "SUB_CONTEXT", content: "More detail..." }
      ]
    }
  ]
}
```

### Step 5: Add to MODEL_EXAMPLES

Insert your example into the appropriate model array in `src/data/examples.ts`.

## Block Categories and Patterns

### Text Model Blocks

#### Basic Blocks (Common to all text models)

- **role** - Define AI persona
- **task** - Main objective
- **context** - Background information
- **rules** - List of constraints
- **goal** - Primary goal
- **example** - Few-shot example
- **input** - Placeholder for user data

#### Model-Specific Blocks

**OpenAI/GPT:**
- **system** - System-level prompt
- **user** - Simulated user message
- **assistant** - Simulated AI response
- **tools** - Tool definitions
- **rules** - List of constraints

**Gemini:**
- **sys_instr** - System instructions
- **user_input** - User-provided input
- **model_out** - Expected model output

**Claude:**
- **system** - System instructions
- **user** - User message
- **assistant** - Assistant response
- **xml_wrapper** - XML document wrapper
- **thinking** - Internal reasoning block

**DeepSeek:**
- **deepseek_think** - DeepSeek R1 reasoning block (tag: "think")

**Llama:**
- **instruction** - Direct commands

**Qwen/GLM:**
- **tools** - Tool definitions

#### Advanced Prompting Blocks

**Tree of Thought (ToT):**
- **tot_problem** - Define the core problem
- **tot_branch** - Thought path/solution branch
- **tot_thought** - Individual thought step within branch
- **tot_evaluation** - Evaluate branch quality (Pros/Cons)
- **tot_solution** - Best solution chosen after evaluation

### Image Generation Blocks

#### Visual Description Blocks
- **subject** - Main visual subject
- **scene** - General scene overview
- **visuals** - Detailed visual breakdown
- **environment** - Setting and atmosphere
- **style** - Artistic style & quality
- **lighting** - Lighting conditions
- **color** - Dominant color palette
- **aesthetic** - Overall vibe/mood
- **negative** - What to exclude (negative prompt)

#### Technical Blocks
- **camera** - Camera setup
- **shot_type** - Framing (Close-up, Wide, etc.)
- **angle** - Camera angle
- **params** - Model parameters (--ar 16:9, etc.)

### Video Generation Blocks

All image generation blocks plus:

- **movement** - General motion description
- **motion** - Camera movement
- **audio** - General soundscape
- **sfx** - Specific sound effects
- **music** - Musical score

## Best Practices

### 1. Keep Examples Concise

Aim for:
- **Simple examples:** 3-5 nodes
- **Complex examples:** 5-10 nodes
- **ToT examples:** Problem + 3-5 branches + Solution

### 2. Use Realistic Content

Avoid placeholder text:

```typescript
// Bad
{ id: uuid(), tag: "CONTEXT", content: "Lorem ipsum dolor sit amet..." }

// Good
{ id: uuid(), tag: "CONTEXT", content: "We're analyzing customer feedback from Q4 2023. 15,000 responses received across 3 product categories." }
```

### 3. Provide Variety

Include different use cases per model:

```typescript
gemini: [
  { name: "Content Creator", nodes: [...] },     // Writing task
  { name: "Multimodal Analysis", nodes: [...] }, // Image analysis
  { name: "Tree of Thought Analysis", nodes: [...] } // Complex reasoning
]
```

### 4. Leverage Nested Children

Use nesting for hierarchical structures:

```typescript
{
  id: uuid(),
  tag: "RULES",
  isList: true,
  content: "",
  children: [
    { id: uuid(), tag: "ITEM", content: "Maintain professional tone" },
    { id: uuid(), tag: "ITEM", content: "Be concise" },
    { id: uuid(), tag: "ITEM", content: "Avoid technical jargon" }
  ]
}
```

### 5. Use `isList` for Lists

Mark list containers with `isList: true`:

```typescript
{
  id: uuid(),
  tag: "RULES",
  isList: true,
  children: [ /* items */ ]
}
```

### 6. Use Descriptive Names

Clear, informative example names:

```typescript
// Bad
{ name: "Example 1", nodes: [...] }

// Good
{ name: "Chain of Thought Reasoning", nodes: [...] }
{ name: "Embedded Systems - Timing Issue (ToT)", nodes: [...] }
```

### 7. Always Include "Empty" Template

Include an empty template for starting from scratch:

```typescript
generic: [
  // ... all your examples
  { name: "Empty", nodes: [] }
]
```

## Example Walkthroughs

### Example 1: Simple Prompt (Chain of Thought)

**Model:** Generic

```typescript
{
  name: "Chain of Thought",
  nodes: [
    { id: uuid(), tag: "ROLE", content: "You are an expert problem solver with a focus on logical deduction." },
    { id: uuid(), tag: "TASK", content: "Analyze the input and provide a solution." },
    { id: uuid(), tag: "METHODOLOGY", content: "Use Chain of Thought reasoning. Break down the problem into steps before concluding." }
  ]
}
```

**Pattern:** Single-level structure, 3 blocks

---

### Example 2: Nested Prompt (Code Analysis)

**Model:** Generic

```typescript
{
  name: "Code Analysis",
  nodes: [
    { id: uuid(), tag: "ROLE", content: "Senior Software Engineer" },
    { id: uuid(), tag: "OBJECTIVE", content: "Refactor the provided code for performance and readability." },
    {
      id: uuid(),
      tag: "CONSTRAINTS",
      isList: true,
      content: "",
      children: [
        { id: uuid(), tag: "ITEM", content: "Maintain original functionality" },
        { id: uuid(), tag: "ITEM", content: "Use modern syntax" },
        { id: uuid(), tag: "ITEM", content: "Add type hints" }
      ]
    },
    { id: uuid(), tag: "INPUT_CODE", content: "// Paste code here" }
  ]
}
```

**Pattern:** Multi-level with children, list pattern with `isList: true`

---

### Example 3: Tree of Thought (Embedded Systems)

**Model:** Generic

```typescript
{
  name: "Embedded Systems - Timing Issue (ToT)",
  nodes: [
    { id: uuid(), tag: "ROLE", content: "You are an embedded systems engineer specializing in ARM Cortex-M microcontrollers and real-time systems." },
    { id: uuid(), tag: "CONTEXT", content: "STM32F4 microcontroller with 168MHz clock, using HAL library. Timer configured for 1kHz interrupt but measuring only ~750Hz." },
    {
      id: uuid(),
      tag: "TOT_PROBLEM",
      content: "TIM2 interrupt not firing at expected 1kHz frequency. Configuration: prescaler 167, auto-reload 999, APB1 timer clock set to 84MHz."
    },
    {
      id: uuid(),
      tag: "TOT_BRANCH",
      content: "Branch: System Clock Configuration Error",
      children: [
        { id: uuid(), tag: "TOT_THOUGHT", content: "Verify HSI (16MHz internal RC) vs HSE (8MHz external crystal) selection" },
        { id: uuid(), tag: "TOT_THOUGHT", content: "Check PLL configuration: PLL_M, PLL_N, PLL_P, PLL_Q values" },
        { id: uuid(), tag: "TOT_THOUGHT", content: "Confirm APB1 prescaler is correct for 84MHz output" },
        { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Most common issue, easy to verify\nCons: Would affect entire system, not just timer" }
      ]
    },
    // ... more branches
    {
      id: uuid(),
      tag: "TOT_SOLUTION",
      content: "Root cause: APB1 peripheral clock is 42MHz, not 84MHz.\n\nFix: Configure APB1 prescaler to 2 in RCC->CFGR."
    }
  ]
}
```

**Pattern:** Multi-branch structure, TOT_PROBLEM → TOT_BRANCH nodes → TOT_THOUGHT children → TOT_EVALUATION → TOT_SOLUTION

---

### Example 4: Image Generation Prompt

**Model:** Image

```typescript
{
  name: "Midjourney Photorealism",
  nodes: [
    { id: uuid(), tag: "SUBJECT", content: "A weary astronaut sitting in a diner on Mars, looking out the window at a dust storm." },
    { id: uuid(), tag: "STYLE", content: "Cinematic, photorealistic, 8k, shot on 35mm film." },
    { id: uuid(), tag: "LIGHTING", content: "Neon sign reflection, moody atmosphere, volumetric dust." },
    { id: uuid(), tag: "PARAMETERS", content: "--ar 16:9 --v 6.0 --stylize 250" }
  ]
}
```

**Pattern:** Visual description + style + lighting + parameters

---

## Adding a New Model

### Step 1: Add Model Key to Types

Update `src/types/index.ts`:

```typescript
export type ModelKey = keyof ModelConfigs;

export interface ModelConfigs {
  generic: ModelConfig;
  gemini: ModelConfig;
  // ... existing models
  your_new_model: ModelConfig;  // Add your model here
}
```

### Step 2: Define Model Configuration

Update `src/data/models.ts`:

```typescript
export const MODELS: ModelConfigs = {
  // ... existing models
  your_new_model: {
    name: "Your Model Name",
    blocks: ["role", "task", "context", "rules"]  // Available blocks
  }
};
```

### Step 3: Add Example Prompts

Update `src/data/examples.ts`:

```typescript
export const MODEL_EXAMPLES: ModelExamples = {
  // ... existing examples
  your_new_model: [
    {
      name: "Basic Example",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "You are a helpful assistant." },
        { id: uuid(), tag: "TASK", content: "Complete the following task." }
      ]
    }
  ]
};
```

### Step 4: Verify Block Definitions

Ensure all blocks referenced in `blocks` array exist in `src/data/blockDefs.ts`. If not, add them:

```typescript
export const BLOCK_DEFS: BlockDefs = {
  // ... existing blocks
  custom_block: {
    tag: "CUSTOM_BLOCK",
    content: "Default content...",
    desc: "Block description"
  }
};
```

## Testing Examples

### 1. Verify TypeScript Compilation

```bash
bun typecheck
```

Ensure no type errors occur after adding examples.

### 2. Test in Application

```bash
bun dev
```

1. Open http://localhost:3000
2. Select the model you added examples for
3. Open the example dropdown
4. Load your example
5. Verify all blocks appear correctly
6. Check nested children render properly
7. Test export in multiple formats (XML, JSON, YAML, TOON, MD)

### 3. Verify Block Availability

1. Click "Add Block" button
2. Check that your blocks appear in the BlockPicker
3. Verify block descriptions are accurate

### 4. Test Export Formatting

For each format:

- **XML:** Proper nesting, valid XML syntax
- **JSON:** Valid JSON structure, proper escaping
- **YAML:** Proper indentation, valid YAML syntax
- **TOON:** Correct block formatting
- **MD:** Readable markdown structure

## Common Mistakes to Avoid

### 1. Using Undefined Block Tags

```typescript
// Bad: "CUSTOM_TAG" doesn't exist in BLOCK_DEFS
{ id: uuid(), tag: "CUSTOM_TAG", content: "..." }

// Good: Use existing tag
{ id: uuid(), tag: "TASK", content: "..." }
```

### 2. Forgetting UUID Generation

```typescript
// Bad: Missing ID or not unique
{ tag: "ROLE", content: "..." }

// Good: Always use uuid()
{ id: uuid(), tag: "ROLE", content: "..." }
```

### 3. Incorrect Type Imports

```typescript
// Bad: Missing import
export const MODEL_EXAMPLES: ModelExamples = { ... }

// Good: Import types
import { ModelExamples } from '../types';
export const MODEL_EXAMPLES: ModelExamples = { ... }
```

### 4. Missing Closing Brackets in Nested Structures

```typescript
// Bad: Unclosed children array
{
  id: uuid(),
  tag: "CONTEXT",
  children: [
    { id: uuid(), tag: "SUB", content: "..." }
  // Missing closing bracket
}

// Good: Properly closed
{
  id: uuid(),
  tag: "CONTEXT",
  children: [
    { id: uuid(), tag: "SUB", content: "..." }
  ]
}
```

### 5. Typos in Block Tag Names

```typescript
// Bad: Typo in tag name
{ id: uuid(), tag: "SYSTEMM", content: "..." }

// Good: Exact match with BLOCK_DEFS
{ id: uuid(), tag: "SYSTEM", content: "..." }
```

### 6. Forgetting to Export Examples

```typescript
// Bad: Examples not exported
const EXAMPLES = { ... };

// Good: Export properly
export const MODEL_EXAMPLES: ModelExamples = { ... };
```

## Additional Resources

- [Main README](../README.md) - Project overview and setup
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Prompt Engineering Guide](https://www.promptingguide.ai/) - General prompt engineering techniques

## Getting Help

If you encounter issues:

1. Check TypeScript compilation: `bun typecheck`
2. Verify all block tags exist in `BLOCK_DEFS`
3. Ensure all nodes have unique IDs from `uuid()`
4. Test your example in the development server: `bun dev`
5. Review existing examples for similar patterns

---

**Happy prompting! 🎨**
