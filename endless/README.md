# Endless

**Advanced Storytelling AI powered by Claude Opus 4.5**

Endless is a sophisticated storytelling companion designed to craft extraordinary narratives. Whether you're writing original stories or fan fiction, Endless brings the full creative potential of Claude Opus 4.5 to your storytelling journey.

![Endless - Dreamlike black and purple aesthetic](https://via.placeholder.com/800x400/0a0a0f/a855f7?text=Endless)

## Features

### Core Capabilities

- **Unlimited Generation** - Write chapters of any length, from short scenes to 20,000+ word epics
- **Story Bible System** - Maintain consistency with comprehensive character profiles, world-building elements, and plot tracking
- **Extended Thinking** - Enable "Think Longer" mode for complex narrative challenges
- **Web Search** - Research source material, lore, and real-world details in real-time
- **Streaming Responses** - Watch your story unfold in real-time as Endless writes

### For Original Stories

- Rich character development with authentic voices
- Complex plot structures and emotional arcs
- Any genre, any tone, any style
- Deep thematic exploration

### For Fan Fiction

- Faithful character portrayal with accurate voices and mannerisms
- Respect for source material lore and world rules
- Exploration of "what if" scenarios fans want to see
- Seamless integration with established canon

### Additional Features

- **Chat History** - All conversations saved and accessible from the sidebar
- **Dark Dreamlike UI** - Sleek black and purple aesthetic for focused creativity
- **Discussion Mode** - Analyze craft, explore themes, and dive into meta-commentary
- **Markdown Support** - Rich formatting for your stories

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- An Anthropic API key with access to Claude Opus 4.5

### Installation

1. Clone the repository and navigate to the endless directory:

```bash
cd endless
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

5. (Optional) Add Google Search API credentials for web search:

```
GOOGLE_SEARCH_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Starting a New Story

1. Click "New Story" in the sidebar
2. Describe your story idea, characters, setting, or provide a prompt
3. Use the options at the bottom to enhance generation:
   - **Think Longer** - Enable extended thinking for complex narratives
   - **Web Search** - Research real-world details or source material
   - **Story Bible** - Select a Story Bible for consistent context

### Creating a Story Bible

Story Bibles help Endless maintain consistency across your narrative:

1. Click "Story Bibles" in the sidebar
2. Click "Create New Story Bible"
3. Fill in the details:
   - **General** - Name, description, genre, tone, themes
   - **Characters** - Detailed profiles with personality, backstory, speech patterns
   - **World** - Locations, organizations, items, concepts
   - **Plot** - Key plot points in order with status tracking

### Writing Fan Fiction

For best results with fan fiction:

1. Create a Story Bible with accurate character details from the source material
2. Include speech patterns, relationships, and key personality traits
3. Enable Web Search for lore verification
4. Reference specific source material in your prompts

### Tips for Best Results

- Be specific in your prompts about tone, style, and what you want
- Use Story Bibles for ongoing stories to maintain consistency
- Enable "Think Longer" for complex emotional scenes or intricate plots
- Ask for revisions and discuss the writing to refine it
- Don't hesitate to go meta and discuss craft and technique

## Architecture

Endless is built with:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling with custom dreamlike theme
- **better-sqlite3** - Local database for chat persistence
- **Anthropic SDK** - Official Claude API integration
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful iconography

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `GOOGLE_SEARCH_API_KEY` | No | Google Custom Search API key |
| `GOOGLE_SEARCH_ENGINE_ID` | No | Google Programmable Search Engine ID |

### Model Configuration

Endless uses Claude Opus 4.5 (`claude-opus-4-5-20250127`) by default. The model is configured in `src/lib/claude.ts`.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## License

MIT License - feel free to use and modify for your own creative endeavors.

---

*Endless - Where every story finds its voice.*
