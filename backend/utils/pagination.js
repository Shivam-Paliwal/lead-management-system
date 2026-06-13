const getPagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || 10;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset
  };
};

const buildPaginationMeta = ({ count, page, limit }) => {
  const totalPages = Math.max(Math.ceil(count / limit), 1);

  return {
    totalItems: count,
    totalPages,
    currentPage: page,
    perPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

module.exports = {
  getPagination,
  buildPaginationMeta
};

