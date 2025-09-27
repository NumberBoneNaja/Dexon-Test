import { useEffect, useState } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender, type SortingState, type PaginationState } from "@tanstack/react-table";
import AddThicknessModal from "./AddThicknessModal";

import type { IThickness } from "../../interface/thickness";
import { deletethickness, getThicknessBytestpoint, NewThickness, updateThickness } from "../../service/thickness/thickness";
import { useNavigate, useParams } from "react-router-dom";
import EditThicknessModal from "./EditThicknessModal";
import { ChevronLeft, EllipsisVerticalIcon, SquarePen, Trash } from "lucide-react";

const columnHelper = createColumnHelper<thickCus>();

interface thickCus extends IThickness {
  line_number: string;
  cml_number: number;
  tp_number: number;
}

function Thickness() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingThickness, setEditingThickness] = useState<thickCus | null>(null);
  const [thicknessData, setThicknessData] = useState<thickCus[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  async function fetchThicknessData() {
    try {
      const res = await getThicknessBytestpoint(Number(id));
      setThicknessData(res);
      console.log("Thickness Data:", res);
    } catch (error) {
      console.error("Error fetching thickness data:", error);
    }
  }

  useEffect(() => {
    fetchThicknessData();
  }, []);

  const handleAddThickness = async (data: { inspection_date: string; actual_thickness: number }) => {
    const input: IThickness = {
      test_point_id: Number(id),
      inspection_date: new Date(data.inspection_date).toISOString(),
      actual_thickness: data.actual_thickness,
    };
    try {
      await NewThickness(input);
      await fetchThicknessData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding thickness:", error);
    }
  };

  const handleEditThickness = async (data: IThickness) => {
    if (!data.ID) return;
    try {
      await updateThickness(data,Number(data.ID));
      await fetchThicknessData();
      setIsEditModalOpen(false);
      setEditingThickness(null);
    } catch (error) {
      console.error("Error updating thickness:", error);
    }
  };

  const handleDeleteThickness = async (id: number) => {
    if (!confirm("Are you sure you want to delete this thickness?")) return;
    try {
      await deletethickness(id);
      await fetchThicknessData();
    } catch (error) {
      console.error("Error deleting thickness:", error);
    }
  };

  const columns = [
    columnHelper.accessor("line_number", {
      header: "Line Number",
    }),
    columnHelper.accessor("cml_number", {
      header: "CML Number",
    }),
    columnHelper.accessor("tp_number", {
      header: "TP Number",
    })
    ,
    columnHelper.accessor("inspection_date", {
      header: "Inspection Date",
      cell: info => {
        const value = info.getValue();
        if (value !== undefined) {
          return new Date(value).toLocaleDateString();
        }
        return '';
      }
    }),
    columnHelper.accessor("actual_thickness", {
      header: "Actual Thickness (mm)",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
            <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-xs">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-lg"
              style={{
                position: 'fixed',
                transform: 'translateX(-100px)'
              }}
            >
              <li>
                <button
                  className="flex items-center gap-2 text-sm"
                  onClick={() => {setEditingThickness(item)
                    setIsEditModalOpen(true)}
                }
                >
                  <SquarePen className="w-4 h-4" /> Edit
                </button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 text-sm"
                  onClick={() => handleDeleteThickness(item.ID!)}
                >
                  <Trash className="w-4 h-4" /> Delete
                </button>
              </li>
            </ul>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: thicknessData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <button className=" gap-2 text-[#EB1950] bg-gray-100 rounded-2xl p-2 " onClick={() => navigate(-1)}>
        <ChevronLeft className="w-8 h-8" />
        </button>
        <h3 className="text-lg font-semibold">Test Thickness</h3>
        <button
          className="btn gap-2 text-white"
          style={{ backgroundColor: "#14094D" }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Thickness
          
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="text-left">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-2 mt-4">
        <div>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
        <div className="flex gap-1">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="btn btn-sm">«</button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn btn-sm">‹</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn btn-sm">›</button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="btn btn-sm">»</button>
        </div>
      </div>

      {/* Modals */}
      <AddThicknessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddThickness}
      />
      {editingThickness && (
        <EditThicknessModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={editingThickness}
          onSubmit={handleEditThickness}
        />
      )}
    </div>
  );
}

export default Thickness;
