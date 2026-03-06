const getPaginationParams = (req) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  
  // Validation
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100; // Max 100 items per page
  
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

const buildPaginationResponse = (items, page, limit, total) => {
  const pages = Math.ceil(total / limit);
  const hasNext = page < pages;
  const hasPrev = page > 1;
  
  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null
    }
  };
};

module.exports = {
  getPaginationParams,
  buildPaginationResponse
};
