import styled from "styled-components";

import Button from "./Button";

const Pagination = ({totalPages, currentPage, setCurrentPage}) => {
    const getPageNumbers = () => {
        const pages = [];
        const delta = 1;
    
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
          range.push(i);
        }
    
        if (currentPage - delta > 2) {
          range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
          range.push("...");
        }
    
        range.unshift(1);
        if (totalPages > 1) {
          range.push(totalPages);
        }
    
        return range;
      };
    
      const pages = getPageNumbers();

      return (
        <PaginationWrapper>
            <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
            >
                {"<"}
            </Button>

          
            {pages.map((page, index) =>
                page === "..." ? (
                <Button disabled key={index}>
                    ...
                </Button>
                ) : (
                <Button
                    key={index}
                    className = {currentPage == page ? '': 'disabled'}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Button>
                )
            )}

            <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
            >
                {">"}
            </Button>
    </PaginationWrapper>
    )
}

export default Pagination

const PaginationWrapper = styled.div`
    display: flex;
    gap: 0.75rem;

    button{
        width: 2rem;
        height: 2rem;
        padding: 1.5rem;
    }
    .noInteraction{
        color: var(--content-neutrals-primary);
        background-color: var(--background-neutrals-tertiary);
        pointer-events: none;
    }

    .disabled{
        background-color: transparent;
        border: 1px solid var(--content-neutrals-primary);
    }
`