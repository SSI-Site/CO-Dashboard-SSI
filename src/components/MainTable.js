import React from "react";
import styled from "styled-components";

const MainTable = ({
  data = [],
  columns = [],
  rowKey = "id",
  onRowClick,
  emptyState = "Nenhum registro encontrado.",
  loading = false,
  className,
}) => {
  return (
    <TableContainer className={className}>
      <ScrollArea>
        <Table>
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <StateRow>Carregando...</StateRow>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <StateRow>{emptyState}</StateRow>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={row?.[rowKey] ?? index}
                  $clickable={Boolean(onRowClick)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </TableContainer>
  );
};

export default MainTable;

const TableContainer = styled.div`
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--outline-neutrals-secondary);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.25rem;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-neutrals-secondary);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--outline-neutrals-secondary);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--content-neutrals-primary);
  }
`;

const Table = styled.table`
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  border: 0;

  th,
  td {
    padding: 1.25rem 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font: 700 1.125rem/1.5rem "At Aero Bold";
  }

  thead {
    border-block: 1px solid var(--outline-neutrals-secondary);
    background-color: var(--content-neutrals-primary);
    color: var(--content-neutrals-inverse);

    tr th {
      color: var(--content-neutrals-inverse);
    }
  }

  th {
    padding: 1.25rem 0.5rem;
    font: 700 1.25rem/1.5rem "At Aero Bold";
  }

  @media (max-width: 768px) {
    min-width: 640px;

    th,
    td {
      padding: 1rem 0.5rem;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    min-width: 560px;

    th,
    td {
      padding: 0.75rem 0.45rem;
      font-size: 0.95rem;
    }
  }
`;

const TableRow = styled.tr`
  background-color: ${({ $clickable }) =>
    $clickable ? "transparent" : "inherit"};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background-color 200ms ease-in-out;

  &:nth-child(even) {
    background-color: var(--background-neutrals-secondary);
  }

  &:hover {
    background-color: var(--state-layers-neutrals-primary-008);
  }

  &:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: -2px;
  }
`;

const StateRow = styled.div`
  width: 100%;
  padding: 5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font: 700 1rem/1.5rem "At Aero Bold";
`;
