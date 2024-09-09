interface PaginateResult<T> {
    data: T[];
    total: number;
    pageSize: number;
    current: number;
  }
  
  class Pagination {
    static paginate<T>(data: T[], totalCount: number, page: number, pageSize: number): PaginateResult<T> {
      return {
        data,
        total: totalCount,
        pageSize: parseInt(pageSize.toString(), 10),
        current: parseInt(page.toString(), 10),
      };
    }
  
    static getPaginationQuery(page: number = 1, pageSize: number = 10): { limit: number; offset: number } {
      const offset = (page - 1) * pageSize;
      return { limit: parseInt(pageSize.toString(), 10), offset };
    }
  }
  
  export default Pagination;
  