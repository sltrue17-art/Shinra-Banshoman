import type { SearchResult } from '@/types';

interface GoogleSearchResponse {
  items?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

export async function performWebSearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.warn('Google Search API not configured');
    return [];
  }

  try {
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('cx', searchEngineId);
    url.searchParams.set('q', query);
    url.searchParams.set('num', '5'); // Get top 5 results

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Search API error:', response.status);
      return [];
    }

    const data: GoogleSearchResponse = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export function formatSearchResultsForContext(results: SearchResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const sections = results.map((result, index) => {
    return `### Source ${index + 1}: ${result.title}
URL: ${result.url}
${result.snippet}`;
  });

  return `## Web Search Results\n\n${sections.join('\n\n')}`;
}
