import { use, useEffect, useState } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
  getPaginationRowModel,
  type PaginationState,
} from '@tanstack/react-table'

import type { IInfo } from "../../interface/info"
import { DeletePipe, getAllInfo } from "../../service/info/index"
import InfoModal from "./modalinfo"
import { useNavigate } from "react-router-dom"
import { EllipsisVerticalIcon } from "lucide-react"

const columnHelper = createColumnHelper<IInfo>()

function Info() {
  const [info, setInfo] = useState<IInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [selectedInfo, setSelectedInfo] = useState<IInfo | null>(null)
 
  const navigate = useNavigate();
  const fetchInfo = async () => {
    try {
      const res = await getAllInfo()
      setInfo(res)
    } catch (err) {
      console.error("Failed to fetch info:", err)
      setError("ไม่สามารถโหลดข้อมูลได้")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const handleInfo = (item: IInfo) => {
    setSelectedInfo(item)
    const modal = document.getElementById('info_modal') as HTMLDialogElement
    modal?.showModal()
  }

  const handleDetail = (id: number) => {
    navigate(`/cml/${id}`)
  }

  const columns = [
    columnHelper.accessor('line_number', {
      header: 'Line Number',
      cell: info => (
        <span className="font-semibold text-[#14094D]">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('service', {
      header: 'Service',
    }),
    columnHelper.accessor('material', {
      header: 'Material',
      cell: info => (
        <span className="text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('pipe_size', {
      header: 'Pipe Size',
      cell: info => <span className="badge badge-neutral">{info.getValue()}"</span>,
    }),
    columnHelper.accessor('operating_pressure', {
      header: 'Operating Pressure',
      cell: info => <span>{info.getValue()} psi</span>,
    }),
    columnHelper.accessor('operating_temperature', {
      header: 'Operating Temp',
      cell: info => <span>{info.getValue()}°C</span>,
    }),
    columnHelper.accessor('location', {
      header: 'Location',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: props => {
        const item = props.row.original
        return (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </div>
            <ul 
              tabIndex={0} 
              className="dropdown-content menu bg-base-100 rounded-box z-[9999] w-32 p-2 shadow-lg border border-gray-200"
              style={{
                position: 'fixed',
                transform: 'translateX(-100px)'
              }}
            >
              <li>
                <button onClick={() => handleInfo(item)} className="text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Info
                </button>
              </li>
              <li>
                <button onClick={() => handleDetail(Number(item.ID))} className="text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Detail
                </button>
              </li>
            </ul>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: info,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  // delete
  const handleDelete = async (id: number) => {
 
    try {
      console.log("Deleting pipeline with ID:", id)
      await DeletePipe(id)
      // Refresh the list after deletion
      fetchInfo()
    } catch (err) {
      console.error("Failed to delete pipeline:", err)
      alert("Failed to delete pipeline. Please try again.")
    }
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    )
  }




  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pipeline Information</h1>
          <p className="text-gray-600">จัดการข้อมูลท่อและอุปกรณ์</p>
        </div>
        <button 
          className="btn gap-2 text-white"
          style={{ backgroundColor: '#14094D' }}
          onClick={() => navigate('/addpipe')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Pipeline
        </button>
      </div>

      {/* Search and Page Size */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="ค้นหา Line Number..."
          className="input input-bordered w-full max-w-xs"
          value={(table.getColumn('line_number')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('line_number')?.setFilterValue(event.target.value)
          }
        />
        <div className="flex items-center gap-2">
          <span className="text-sm">แสดง:</span>
          <select
            className="select select-bordered select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 50].map(pageSize => (
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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="text-left">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:bg-gray-100 p-2 rounded'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
              
              // Show current page and surrounding pages
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

      {/* Info Modal */}
      <InfoModal info={selectedInfo} onDelete={handleDelete}/>
    </div>
  )
}

export default Info