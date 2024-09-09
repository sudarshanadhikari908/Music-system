export function buildSearchParams(reqQuery: { [key: string]: any }, allowedFields: string[]): { [key: string]: string } {
    const searchParams: { [key: string]: string } = {};
  
    for (const field of allowedFields) {
      if (reqQuery[field]) {
        searchParams[field] = reqQuery[field] as string;
      }
    }
  
    return searchParams;
  }
  

  export function searchQuery(
    searchParams: { [key: string]: string },
    allowedFields: string[]
  ): { query: string, params: any[] } {
    let whereClause = '';
    const queryParams: any[] = [];
  
    if (searchParams) {
      const filters = [];
      for (const [key, value] of Object.entries(searchParams)) {
        if (allowedFields.includes(key)) {
          filters.push(`\`${key}\` LIKE ?`);
          queryParams.push(`%${value}%`);
        }
      }
      if (filters.length > 0) {
        whereClause = `WHERE ${filters.join(' OR ')}`;
      }
    }
  
    return { query: whereClause, params: queryParams };
  }