"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type PaginationValue = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  start: number;
  end: number;
};
const PaginationContext = createContext({} as PaginationValue);

type Props = {
  pageSize?: number;
  dataLength: number;
  children: ReactNode;
};
export default function PaginationWrapper({
  children,
  pageSize = 10,
  dataLength = 0,
}: Partial<Props>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(dataLength / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const showPrevPage = useCallback(() => {
    if (page > 1) setPage((prev) => prev - 1);
  }, [page]);

  const showNextPage = useCallback(() => {
    if (page < totalPages) setPage((prev) => prev + 1);
  }, [page, totalPages]);

  return (
    <PaginationContext.Provider value={{ page, setPage, start, end }}>
      {children}
      {totalPages > 1 && (
        <Pagination className="my-4 mx-auto">
          <PaginationContent className="w-full justify-end">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                isActive={page > 1}
                onClick={showPrevPage}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#">{page}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                isActive={page < totalPages}
                onClick={showNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </PaginationContext.Provider>
  );
}

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) throw new Error("Pagination context not within a provider");
  return context;
};
