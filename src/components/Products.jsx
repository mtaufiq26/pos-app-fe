import { Card, Table } from "react-daisyui";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Products() {
  // Menggunakan React Query agar bisa cache hasil fetching API
  const queryClient = useQueryClient();

  return (
    <Card className="bg-base-200 shadow-md shadow-blue-700">
      <Card.Body>
        <Card.Title className="mb-3">Products</Card.Title>
        <div className="overflow-x-auto">
          <Table align="center" cellPadding="3">
            <Table.Head>
              
            </Table.Head>
            <Table.Body>
              
            </Table.Body>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
