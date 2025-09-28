import { useNavigate, useParams } from "react-router-dom";
import type { ICml } from "../../interface/cml";
import { useEffect, useState } from "react";
import { AddNewCml, DeleteCml, getcmlbyinfoID } from "../../service/Cml/cml";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  EllipsisVerticalIcon,
  SquareChartGantt,
  SquarePen,
  Trash,
  X,
} from "lucide-react";
import AddCmlModal from "./AddCmlModal";
import EditCmlModal from "./EditCmlModal";

interface Cmlcus extends ICml {
  line_number?: string;
}


const columnHelper = createColumnHelper<Cmlcus>();

function Cmldetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [cmlData, setCmlData] = useState<Cmlcus[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
 
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCml, setEditingCml] = useState<Cmlcus | null>(null);
 



  

  async function fetchCmlData() {
    try {
      console.log("ID:", id);
      const res = await getcmlbyinfoID(Number(id));
      console.log("CML Data:", res);
      setCmlData(res || []); 
    
    } catch (error) {
      console.error("Error fetching CML data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCmlData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  

  const columns = [
    columnHelper.accessor("line_number", {
      header: "Line Number",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("cml_number", {
      header: "CML Number",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("cml_description", {
      header: "Description",
    }),
    columnHelper.accessor("actual_outside_diameter", {
      header: "Actual Outside Diameter",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("design_thickness", {
      header: "Design Thickness",
      cell: (info) => <span className=" badge-neutral">{info.getValue()}</span>,
    }),
    columnHelper.accessor("structural_thickness", {
      header: "Structural Thickness",
      cell: (info) => <span>{info.getValue()} </span>,
    }),
    columnHelper.accessor("required_thickness", {
      header: "Required Thickness",
      cell: (info) => <span>{info.getValue()}</span>,
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (props) => {
        const item = props.row.original;
        return (
            <div className="dropdown dropdown-end relative">
            <div tabIndex={0} role="button" className="btn m-1">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow z-50"
            >
              <li>
                <button className="text-sm" onClick={() => navigate(`/testpoint/${item.ID}`)}>
                  <SquareChartGantt className="w-4 h-4" /> View TP
                </button>
              </li>
              <li>
                <button className="text-sm" onClick={() => {
                  setEditingCml(item);
                  setIsEditModalOpen(true);
                }}>
                  <SquarePen className="w-4 h-4" /> Edit
                </button>
              </li>
              <li>
                <button className="text-sm" onClick={() => handleDeleteCml(item.ID!)}>
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
    data: cmlData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
 
  const handleDeleteCml = async (cmlId: number) => {
    if (!confirm("คุณต้องการลบ CML นี้หรือไม่?")) return;
  
    try {
      const res = await DeleteCml(cmlId);
      if (res) {
        setShowAlert(true); // ใช้ success alert เดิม
        fetchCmlData(); // รีเฟรชข้อมูล
      } else {
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Error deleting CML:", error);
      setShowErrorAlert(true);
    }
  };

  return (
    <div className="p-6"> 
         {/* Success Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div role="alert" className="alert alert-success shadow-lg"> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> 
            </svg> 
            <span>successfully!</span>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => setShowAlert(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
        {/* Error Alert */}
      {showErrorAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div role="alert" className="alert alert-error shadow-lg"> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> 
            </svg> 
            <span>Something went wrong</span>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => setShowErrorAlert(false)}
            >              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <button className=" gap-2 text-[#EB1950] bg-gray-100 rounded-2xl p-2 " onClick={() => navigate(-1)}>
        <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button
          className="btn gap-2 text-white"
          style={{ backgroundColor: "#14094D" }}
          onClick={handleOpenModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add CML
        </button>
      </div>
      

      {/* Search and Page Size */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
          <h2 className="text-2xl font-bold mb-4">
            Line Number:{" "}
            <span className="text-[#EB1950] font-extrabold">
            {cmlData.length > 0 ? cmlData[0].line_number : "This pipeline is empty" }
            </span>
          </h2>
         
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">แสดง:</span>
          <select
            className="select select-bordered select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} รายการ
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-visible">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none hover:bg-gray-100 p-2 rounded"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="inline-block ml-4 w-6 h-6" />,
                          desc: <ChevronDown className="inline-block ml-4 w-6 h-6" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-sm text-gray-600">
          แสดง {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} ถึง{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          จาก {table.getFilteredRowModel().rows.length} รายการ
        </div>
        
        <div className="flex items-center gap-2">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </button>
            
            {/* Page Numbers */}
            {(() => {
              const currentPage = table.getState().pagination.pageIndex
              const pageCount = table.getPageCount()
              const pages = []
              
              const startPage = Math.max(0, currentPage - 2)
              const endPage = Math.min(pageCount - 1, currentPage + 2)
              
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    className={`join-item btn btn-sm ${
                      i === currentPage ? 'btn-active' : ''
                    }`}
                    onClick={() => table.setPageIndex(i)}
                  >
                    {i + 1}
                  </button>
                )
              }
              
              return pages
            })()}
            
            <button
              className="join-item btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Add CML Modal - DaisyUI */}
    <AddCmlModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  infoId={Number(id)}
  onSuccess={fetchCmlData}
  setShowErrorAlert={setShowErrorAlert}
  setShowAlert={setShowAlert}
/>
{editingCml && (
  <EditCmlModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    cmlData={editingCml}
    onSuccess={fetchCmlData}
    setShowErrorAlert={setShowErrorAlert}
    setShowAlert={setShowAlert}
  />
)}


    </div>
  );
}

export default Cmldetail;


