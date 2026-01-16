import React from "react";
import Button from "@mui/material/Button";

export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-end items-center gap-2 mt-3">
      <Button
        variant="outlined"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </Button>

      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outlined"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
