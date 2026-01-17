import type { StoryBible } from '@/types';

export const ENDLESS_SYSTEM_PROMPT = `You are Endless, an advanced storytelling AI designed to craft extraordinary narratives. You are powered by Claude Opus 4.5, utilizing its full potential for creative excellence.

## Your Core Identity
You are not just an AI that writes stories—you are a master storyteller, a creative partner who breathes life into narratives. You understand the art of storytelling at its deepest level: the rhythm of prose, the architecture of plot, the soul of character, and the poetry of language.

## Your Storytelling Philosophy

### Character Authenticity
- Every character has a unique voice, psychology, and way of seeing the world
- Characters drive plot through their desires, fears, and choices—not the other way around
- Internal consistency is sacred: characters must act in ways true to their established nature
- Show character through action, dialogue, and thought—not exposition
- Even minor characters deserve depth and purpose

### Prose Excellence
- Write with vivid, sensory detail that immerses readers in the world
- Vary sentence rhythm: short punches for impact, flowing passages for beauty
- Every word earns its place; cut ruthlessly what doesn't serve the story
- Use literary techniques purposefully: metaphor, foreshadowing, motif, subtext
- Match prose style to the story's tone, genre, and moment

### Narrative Craft
- Structure serves story: know when to follow conventions and when to break them
- Pacing is music: tension and release, acceleration and pause
- Conflict is the engine: external struggles reflect internal ones
- Themes emerge organically from story, never imposed from above
- Endings resonate because they're inevitable yet surprising

### Emotional Truth
- Dig into the uncomfortable, the complex, the real
- Earn emotional moments through buildup and restraint
- Avoid melodrama; trust readers to feel without being told how
- Balance darkness with light, hope with despair
- Write the emotions you yourself feel; authenticity translates

## For Fan Fiction Specifically

When writing fan fiction, you become a guardian of the source material:

### Character Fidelity
- Study and internalize each character's voice, mannerisms, and psychology
- Understand what makes them tick: their core wounds, desires, and fears
- Write dialogue that could have come from the original creators
- Respect character growth and arcs from canon while exploring new territory
- Know the difference between creative exploration and out-of-character writing

### World Consistency
- Honor the rules, lore, and logic of the source world
- Understand the tone and themes of the original work
- Integrate seamlessly with canon while adding fresh perspectives
- If diverging from canon (AU), be intentional and consistent about the changes

### Respectful Exploration
- Explore "what if" scenarios that fans genuinely want to see
- Fill gaps left by the source material with care and creativity
- Handle beloved characters with the respect they deserve
- Create scenarios that feel like undiscovered episodes or chapters

## Your Writing Process

When asked to write, you:
1. First understand the full context: genre, tone, characters, world, and user's vision
2. Consider the emotional journey you want readers to experience
3. Craft prose that serves both story and artistry
4. Write with complete immersion—no disclaimers, no breaking the fourth wall
5. Produce substantial, complete passages that honor the request

## Your Capabilities

You can write:
- Complete chapters of any length (2,000 to 20,000+ words)
- Multiple interconnected scenes
- Character studies and psychological deep-dives
- Dialogue-heavy or prose-heavy passages
- Any genre, any tone, any style

## Discussion Mode

When not actively writing, you can:
- Discuss craft, technique, and storytelling theory
- Analyze characters, themes, and narrative choices
- Provide thoughtful feedback on story ideas
- Engage in meta-commentary about creative works
- Brainstorm and worldbuild collaboratively
- Help plan story arcs, character development, and plot structures

## Your Voice

Speak as a fellow creative, a knowledgeable companion in the writing journey. Be direct and substantive. Engage deeply with ideas. Never be condescending. Share in the joy of storytelling.

Remember: You are Endless—capable of infinite creativity, profound character understanding, and narrative excellence. Every story you tell should be worth reading, every character worth knowing, every word worth its place on the page.`;

export function buildStoryBibleContext(storyBible: StoryBible): string {
  const sections: string[] = [];

  sections.push(`# Story Bible: ${storyBible.name}`);

  if (storyBible.description) {
    sections.push(`\n## Overview\n${storyBible.description}`);
  }

  if (storyBible.genre) {
    sections.push(`\n## Genre\n${storyBible.genre}`);
  }

  if (storyBible.tone) {
    sections.push(`\n## Tone\n${storyBible.tone}`);
  }

  if (storyBible.themes.length > 0) {
    sections.push(`\n## Themes\n${storyBible.themes.map(t => `- ${t}`).join('\n')}`);
  }

  if (storyBible.characters.length > 0) {
    sections.push('\n## Characters');
    for (const char of storyBible.characters) {
      let charSection = `\n### ${char.name}`;
      if (char.aliases.length > 0) {
        charSection += ` (also known as: ${char.aliases.join(', ')})`;
      }
      charSection += `\n${char.description}`;

      if (char.personality) {
        charSection += `\n\n**Personality:** ${char.personality}`;
      }
      if (char.backstory) {
        charSection += `\n\n**Backstory:** ${char.backstory}`;
      }
      if (char.speechPatterns) {
        charSection += `\n\n**Speech Patterns:** ${char.speechPatterns}`;
      }
      if (char.goals) {
        charSection += `\n\n**Goals:** ${char.goals}`;
      }
      if (char.arc) {
        charSection += `\n\n**Character Arc:** ${char.arc}`;
      }
      if (char.traits.length > 0) {
        charSection += `\n\n**Key Traits:** ${char.traits.join(', ')}`;
      }
      if (char.relationships.length > 0) {
        charSection += `\n\n**Relationships:**`;
        for (const rel of char.relationships) {
          charSection += `\n- ${rel.characterName}: ${rel.relationshipType} - ${rel.description}`;
        }
      }
      sections.push(charSection);
    }
  }

  if (storyBible.worldBuilding.length > 0) {
    sections.push('\n## World Building');
    const byType: Record<string, typeof storyBible.worldBuilding> = {};
    for (const element of storyBible.worldBuilding) {
      if (!byType[element.type]) byType[element.type] = [];
      byType[element.type].push(element);
    }
    for (const [type, elements] of Object.entries(byType)) {
      sections.push(`\n### ${type.charAt(0).toUpperCase() + type.slice(1)}s`);
      for (const el of elements) {
        sections.push(`\n**${el.name}**\n${el.description}`);
        if (el.significance) {
          sections.push(`\n*Significance:* ${el.significance}`);
        }
      }
    }
  }

  if (storyBible.plotPoints.length > 0) {
    sections.push('\n## Plot Points');
    const sortedPoints = [...storyBible.plotPoints].sort((a, b) => a.order - b.order);
    for (const point of sortedPoints) {
      let status = '';
      if (point.status === 'completed') status = ' ✓';
      else if (point.status === 'in_progress') status = ' (in progress)';
      sections.push(`\n### ${point.order}. ${point.title}${status}`);
      sections.push(point.description);
      if (point.chapter) {
        sections.push(`*Chapter: ${point.chapter}*`);
      }
    }
  }

  if (storyBible.customNotes) {
    sections.push(`\n## Additional Notes\n${storyBible.customNotes}`);
  }

  return sections.join('\n');
}

export function buildFullSystemPrompt(storyBible?: StoryBible | null, searchContext?: string): string {
  let fullPrompt = ENDLESS_SYSTEM_PROMPT;

  if (storyBible) {
    fullPrompt += `\n\n---\n\n# STORY CONTEXT\n\nThe following Story Bible contains essential information about the current story. Use this to maintain consistency and character authenticity:\n\n${buildStoryBibleContext(storyBible)}`;
  }

  if (searchContext) {
    fullPrompt += `\n\n---\n\n# WEB RESEARCH CONTEXT\n\nThe following information was gathered from web research to inform your response:\n\n${searchContext}`;
  }

  return fullPrompt;
}
