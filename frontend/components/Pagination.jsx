const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const current = pagination.currentPage;
  const start = Math.max(current - 2, 1);
  const end = Math.min(start + 4, pagination.totalPages);
  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return (
    <nav className="d-flex justify-content-end mt-3" aria-label="Lead pagination">
      <ul className="pagination mb-0">
        <li className={`page-item ${pagination.hasPreviousPage ? "" : "disabled"}`}>
          <button className="page-link" type="button" onClick={() => onPageChange(current - 1)}>
            Previous
          </button>
        </li>
        {pages.map((page) => (
          <li className={`page-item ${page === current ? "active" : ""}`} key={page}>
            <button className="page-link" type="button" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${pagination.hasNextPage ? "" : "disabled"}`}>
          <button className="page-link" type="button" onClick={() => onPageChange(current + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

