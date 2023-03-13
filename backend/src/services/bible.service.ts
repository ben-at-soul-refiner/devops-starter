import { es } from "config";

export class BibleService {
  public search = async (query?: string | string[]) => {
    if (!query) {
      const results = await es.client.search({ index: "bible_asv" });

      return {
        data: results?.hits?.hits ?? [],
        numResults: (results?.hits?.total as any)?.value ?? 0,
      };
    }

    if (Array.isArray(query)) {
      query = query.join(",");
    }

    const results = await es.client.search({
      index: "bible_asv",
      query: {
        multi_match: {
          query: query,
          fields: ["book", "book.name", "book.abbreviation", "content"],
          operator: "or",
          fuzziness: "auto",
          lenient: true,
        },
      },
    });

    return {
      data: results?.hits?.hits ?? [],
      numResults: (results?.hits?.total as any)?.value ?? 0,
    };
  };

  public suggest = async (query?: string | string[]) => {
    if (!query) {
      const results = await es.client.search({ index: "bible_asv" });

      return {
        data: results?.hits?.hits?.map(item => (item._source as any)?.content) ?? [],
        numResults: results?.hits?.hits.length,
      };
    }

    if (Array.isArray(query)) {
      query = query.join(',')
    }

    const results = await es.client.search({
      index: "bible_asv",
      query: {
        match: {
          content: {
            query,
            analyzer: "autocomplete"
          }
        }
      },
    });

    return {
      data: results?.hits?.hits?.map(item => (item._source as any)?.content) ?? [],
      numResults: results?.hits?.hits.length,
    };
  };
}
