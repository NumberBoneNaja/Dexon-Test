import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ICml } from "../../interface/cml";
import type { ITestpoint } from "../../interface/testpoint";
import { getcmlbyID } from "../../service/Cml/cml";
import { deleteTestPoint, getTestPointByCML, NewTestPoint, updateTestPoint } from "../../service/testpoint/testpoint";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon, SquareChartGantt, SquarePen, Trash, X } from "lucide-react";
import AddTestPointModal from "./addTestpoint";
import EditTestPointModal from "./EditTestPointModal";

const columnHelper = createColumnHelper<ITestpoint>();
const cmlColumnHelper = createColumnHelper<ICml>();

function Testpoint() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [cmlData, setCmlData] = useState<ICml | null>(null);
  const [testpointData, setTestpointData] = useState<ITestpoint[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  // Modal states
  const [isTestPointModalOpen, setIsTestPointModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [testPointFormData, setTestPointFormData] = useState<ITestpoint>({
    tp_description: "",
    note: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingTestPoint, setEditingTestPoint] = useState<ITestpoint | null>(null);
  

  async function fetchCmlData() {
    try {
      const res = await getcmlbyID(Number(id));
      console.log("CML Data:", res);
      setCmlData(res);
    } catch (error) {
      console.error("Error fetching CML data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTestPoint() {
    try {
      const res = await getTestPointByCML(Number(id));
      console.log("test point Data:", res);
      setTestpointData(res);
    } catch (error) {
      console.error("Error fetching test point data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCmlData();
    fetchTestPoint();
  }, []);

  // Test Point Modal functions
  const handleOpenTestPointModal = () => {
    setIsTestPointModalOpen(true);
  };

  const handleCloseTestPointModal = () => {
    setIsTestPointModalOpen(false);
    setTestPointFormData({
      tp_description: "",
      note: "",
    });
  };

  const handleTestPointInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestPointFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestPointSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...testPointFormData,
        cml_id: Number(id), // ใส่เพิ่มตรงนี้
      };
  
    
  
      const res  = await NewTestPoint(payload); // ส่ง payload แทน testPointFormData
      if (!res) {
        console.error("Failed to add Test Point");
        setShowErrorAlert(true);
        return;
      }
      setTestPointFormData({
        tp_description: "",
        note: "",
      });
  
      await fetchTestPoint();
      handleCloseTestPointModal();
  
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
  
    } catch (error) {
      console.error("Error adding Test Point:", error);
    }
  };

  const handleOpenEditModal = (testpoint: ITestpoint) => {
    setEditingTestPoint(testpoint);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: ITestpoint) => {
    try {
      const res = await updateTestPoint(data ,Number(data.ID )); // 👈 ส่งไป update API
      if (res) {
        await fetchTestPoint();
        setIsEditModalOpen(false);
        setShowAlert(true);

      }
    } catch (error) {
      console.error("Error updating test point:", error);
      setShowErrorAlert(true);
    }
  };
  

 

  const columns = [
    columnHelper.accessor("tp_number", {
      header: "TP Number",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("tp_description", {
      header: "TP Description",
    }),
    columnHelper.accessor("note", {
      header: "Note",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.display({
      header: "Actions",
      cell: (props) => {
        const item = props.row.original;
        return (
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-xs"
              onBlur={(e) => {
                setTimeout(() => {
                  if (!e.currentTarget.contains(document.activeElement)) {
                    e.currentTarget.blur();
                  }
                }, 100);
              }}
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg "
              style={{ position: 'absolute', right: 0 }}
            >
              <li>
                <button 
                  className="text-sm flex items-center gap-2" 
                  onClick={() => navigate(`/thickness/${item.ID}`)}
                >
                  <SquareChartGantt className="w-4 h-4" /> 
                  View Thickness
                </button>
              </li>
              <li>
                <button 
                  className="text-sm flex items-center gap-2"
                  onClick={() => handleOpenEditModal(item)}
                >
                  <SquarePen className="w-4 h-4" /> 
                  Edit
                </button>
              </li>

              <li>
                <button className="text-sm flex items-center gap-2"
                  onClick={() => handleDeleteTestPoint(item.ID!)}
                >
                  <Trash className="w-4 h-4" /> 
                  Delete
                </button>
              </li>
            </ul>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: testpointData,
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

  const handleDeleteTestPoint = async (id: number) => {
    if (!confirm("คุณแน่ใจว่าจะลบ Test Point นี้หรือไม่?")) return;
  
    try {
      const res = await deleteTestPoint(id);
      if (res) {
        await fetchTestPoint();
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error deleting test point:", error);
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

    
      
 
    

      {/* Header with Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Test Points</h3>
        <button
          className="btn gap-2 text-white"
          style={{ backgroundColor: "#14094D" }}
          onClick={handleOpenTestPointModal}
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
          Add TestPoint
        </button>
      </div>

      {/* Search and Page Size */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
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

      {/* Test Points Table */}
      <div className="overflow-x-auto">
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
                          asc: " 🔼",
                          desc: " 🔽",
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
                  <td key={cell.id} className="py-3 relative">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Add Test Point Modal */}
      <AddTestPointModal
  isOpen={isTestPointModalOpen}
  onClose={handleCloseTestPointModal}
  onSubmit={handleTestPointSubmit}
  formData={testPointFormData}
  onInputChange={handleTestPointInputChange}
/>
<EditTestPointModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  onSubmit={handleEditSubmit}
  initialData={editingTestPoint}
/>


    </div>
  );
}

export default Testpoint;