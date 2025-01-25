'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import topProjectsData from '../data/top_projects.json';

interface Project {
  project_name: string;
  project_rank: number;
  bytes_written: number;
  language_pct: number;
  stars_count: number;
  contributor_count: number;
  repo_count: number;
  fork_count: number;
  weighted_score: number;
  project_category: string;
  language_name: string;
}

const DevelopersPage: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'project_rank',
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isMobile, setIsMobile] = useState(false);

  // State for multi-select filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // State for dropdown visibility
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] =
    useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] =
    useState<boolean>(false);

  // Refs for dropdown containers
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // State for the active row's data (for the tooltip)
  const [activeRowData, setActiveRowData] = useState<Project | null>(null);

  useEffect(() => {
    setData(topProjectsData);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        header: 'Project',
        accessorKey: 'project_name',
        id: 'project_name',
        footer: (props) => props.column.id,
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">{getValue<string>()}</div>
        ),
      },
      {
        header: 'Language',
        accessorKey: 'language_name',
        id: 'language_name',
        footer: (props) => props.column.id,
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">{getValue<string>()}</div>
        ),
      },
      {
        header: 'Rank',
        accessorKey: 'project_rank',
        id: 'project_rank',
        footer: (props) => props.column.id,
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toLocaleString()}
          </div>
        ),
      },
      {
        header: 'Bytes',
        accessorKey: 'bytes_written',
        id: 'bytes_written',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toLocaleString()}
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Lang %',
        accessorKey: 'language_pct',
        id: 'language_pct',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {(getValue<number>() * 100).toFixed(2) + '%'}
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Stars',
        accessorKey: 'stars_count',
        id: 'stars_count',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toLocaleString()}
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Contrib',
        accessorKey: 'contributor_count',
        id: 'contributor_count',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toLocaleString()}
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Repos',
        accessorKey: 'repo_count',
        id: 'repo_count',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toLocaleString()}
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Forks',
        accessorKey: 'fork_count',
        id: 'fork_count',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toLocaleString()}
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Category',
        accessorKey: 'project_category',
        id: 'project_category',
        cell: ({ row }) => {
          const category = row.original.project_category;
          let bgColorClass = '';

          switch (category) {
            case 'Top Project':
              bgColorClass = 'bg-green-600'; // Dark green
              break;
            case 'Leader':
              bgColorClass = 'bg-blue-400'; // Light blue
              break;
            case 'In-The-Mix':
              bgColorClass = 'bg-yellow-600 text-black'; // Yellow with black text
              break;
            case 'Laggard':
              bgColorClass = 'bg-red-400 text-black'; // Red
              break;
            default:
              bgColorClass = 'bg-gray-400'; // Default gray if not found
              break;
          }

          return (
            <div
              className={`${bgColorClass} px-2 py-1 rounded text-sm md:text-base`}
            >
              {category}
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        header: 'Score',
        accessorKey: 'weighted_score',
        id: 'weighted_score',
        cell: ({ getValue }) => (
          <div className="text-sm md:text-base">
            {getValue<number>().toFixed(2)}
          </div>
        ),
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  // Get unique values for filter dropdowns
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    data.forEach((project) => {
      categories.add(project.project_category);
    });
    return Array.from(categories);
  }, [data]);

  const uniqueProjects = useMemo(() => {
    const projects = new Set<string>();
    data.forEach((project) => {
      projects.add(project.project_name);
    });
    return Array.from(projects);
  }, [data]);

  const uniqueLanguages = useMemo(() => {
    const languages = new Set<string>();
    data.forEach((project) => {
      languages.add(project.language_name);
    });
    return Array.from(languages);
  }, [data]);

  // Handle filter changes
  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      const isSelected = prevSelectedCategories.includes(category);
      const nextSelectedCategories = isSelected
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category];
  
      setColumnFilters((prevFilters) => {
        const categoryFilter = prevFilters.find(
          (f) => f.id === 'project_category'
        );
  
        // Toggle the filter value for the clicked category
        const newCategoryFilterValue = nextSelectedCategories;
  
        if (newCategoryFilterValue.length === 0) {
          // Remove the filter if no category is selected
          return prevFilters.filter((f) => f.id !== 'project_category');
        } else {
          // Update or add the filter with the new value
          const newFilter = {
            id: 'project_category',
            value: newCategoryFilterValue
          };
          return categoryFilter
            ? prevFilters.map((f) =>
                f.id === 'project_category' ? newFilter : f
              )
            : [...prevFilters, newFilter];
        }
      });
  
      return nextSelectedCategories;
    });
  };
  
  const handleProjectFilterChange = (project: string) => {
    setSelectedProjects((prevSelectedProjects) => {
      const isSelected = prevSelectedProjects.includes(project);
      const nextSelectedProjects = isSelected
        ? prevSelectedProjects.filter((p) => p !== project)
        : [...prevSelectedProjects, project];
  
      setColumnFilters((prevFilters) => {
        const projectFilter = prevFilters.find((f) => f.id === 'project_name');
  
        // Toggle the filter value for the clicked project
        const newProjectFilterValue = nextSelectedProjects;
  
        if (newProjectFilterValue.length === 0) {
          // Remove the filter if no project is selected
          return prevFilters.filter((f) => f.id !== 'project_name');
        } else {
          // Update or add the filter with the new value
          const newFilter = {
            id: 'project_name',
            value: newProjectFilterValue
          };
          return projectFilter
            ? prevFilters.map((f) =>
                f.id === 'project_name' ? newFilter : f
              )
            : [...prevFilters, newFilter];
        }
      });
  
      return nextSelectedProjects;
    });
  };
  
  const handleLanguageFilterChange = (language: string) => {
    setSelectedLanguages((prevSelectedLanguages) => {
      const isSelected = prevSelectedLanguages.includes(language);
      const nextSelectedLanguages = isSelected
        ? prevSelectedLanguages.filter((l) => l !== language)
        : [...prevSelectedLanguages, language];
  
      setColumnFilters((prevFilters) => {
        const languageFilter = prevFilters.find((f) => f.id === 'language_name');
  
        // Toggle the filter value for the clicked language
        const newLanguageFilterValue = nextSelectedLanguages;
  
        if (newLanguageFilterValue.length === 0) {
          // Remove the filter if no language is selected
          return prevFilters.filter((f) => f.id !== 'language_name');
        } else {
          // Update or add the filter with the new value
          const newFilter = {
            id: 'language_name',
            value: newLanguageFilterValue
          };
          return languageFilter
            ? prevFilters.map((f) =>
                f.id === 'language_name' ? newFilter : f
              )
            : [...prevFilters, newFilter];
        }
      });
  
      return nextSelectedLanguages;
    });
  };

  // Toggle dropdown visibility
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleProjectDropdown = () => {
    setIsProjectDropdownOpen(!isProjectDropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update column visibility based on isMobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches); // Use matchMedia
    }
    if (isMobile) {
      setColumnVisibility({
        project_rank: false,
        bytes_written: false,
        language_pct: false,
        stars_count: false,
        contributor_count: false,
        repo_count: false,
        fork_count: false,
        weighted_score: false,
      });
    } else {
      setColumnVisibility({}); // Show all columns on desktop
    }
  }, [isMobile]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Handle clicks outside of the tooltip
  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (
        !event.target ||
        !(event.target instanceof Element) ||
        !event.target.closest('.tooltip-trigger')
      ) {
        closeTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideTooltip);
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
  }, []);

  const handleRowHover = (rowData: Project) => {
    setActiveRowData(rowData);
  };

  const closeTooltip = () => {
    setActiveRowData(null);
  };

  // Add these near the other click handlers
  const handleProjectOptionClick = (project: string) => {
    handleProjectFilterChange(project);
  };

  const handleLanguageOptionClick = (language: string) => {
    handleLanguageFilterChange(language);
  };

  const handleCategoryOptionClick = (category: string) => {
    handleCategoryFilterChange(category);
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen relative z-0">
      <h1 className="text-2xl font-bold text-center mt-8 mb-8">
        Top Projects across Major Languages
      </h1>

      <div className="mb-4">
        <div className="flex justify-start md:justify-center space-x-4">
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={toggleProjectDropdown}
              className="px-2 py-1 border border-gray-300 rounded bg-black text-white flex items-center text-xs md:text-sm"
            >
              Projects
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isProjectDropdownOpen && (
              <div className="absolute z-30 mt-1 left-0 w-48 bg-gray-800 border border-gray-300 rounded shadow-lg">
                {uniqueProjects.map((project) => (
                  <div
                    key={project}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 text-white text-xs md:text-sm`}
                    onClick={() => handleProjectOptionClick(project)}
                  >
                    <CustomCheckbox
                      checked={selectedProjects.includes(project)}
                      onChange={() => {}}
                    />
                    <span className="ml-2">{project}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={toggleLanguageDropdown}
              className="px-2 py-1 border border-gray-300 rounded bg-black text-white flex items-center text-xs md:text-sm"
            >
              Languages
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute z-30 mt-1 left-0 w-48 bg-gray-800 border border-gray-300 rounded shadow-lg">
                {uniqueLanguages.map((language) => (
                  <div
                    key={language}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 text-white text-xs md:text-sm`}
                    onClick={() => handleLanguageOptionClick(language)}
                  >
                    <CustomCheckbox
                      checked={selectedLanguages.includes(language)}
                      onChange={() => {}}
                    />
                    <span className="ml-2">{language}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={toggleCategoryDropdown}
              className="px-2 py-1 border border-gray-300 rounded bg-black text-white flex items-center text-xs md:text-sm"
            >
              Categories
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isCategoryDropdownOpen && (
              <div className="absolute z-30 mt-1 right-0 w-48 bg-gray-800 border border-gray-300 rounded shadow-lg">
                {uniqueCategories.map((category) => (
                  <div
                    key={category}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 text-white text-xs md:text-sm`}
                    onClick={() => handleCategoryOptionClick(category)}
                  >
                    <CustomCheckbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => {}}
                    />
                    <span className="ml-2">{category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-1">
                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-black text-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-800 cursor-pointer tooltip-trigger"
                onMouseEnter={() => isMobile && handleRowHover(row.original)}
                onMouseLeave={() => isMobile && closeTooltip()}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm whitespace-nowrap text-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip Content */}
      {activeRowData && isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 rounded-t-lg shadow-lg z-50"
          onClick={closeTooltip}
        >
          <h3 className="text-lg font-bold mb-2">
            {activeRowData.project_name}
          </h3>
          <p className="text-xs md:text-sm">
            <strong>Rank:</strong> {activeRowData.project_rank}
          </p>
          <p className="text-xs md:text-sm">
            <strong>Bytes Written:</strong>{" "}
            {activeRowData.bytes_written.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm">
            <strong>Language %:</strong>{" "}
            {(activeRowData.language_pct * 100).toFixed(2)}%
          </p>
          <p className="text-xs md:text-sm">
            <strong>Stars:</strong>{" "}
            {activeRowData.stars_count.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm">
            <strong>Contributors:</strong>{" "}
            {activeRowData.contributor_count.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm">
            <strong>Repos:</strong> {activeRowData.repo_count.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm">
            <strong>Forks:</strong> {activeRowData.fork_count.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm">
            <strong>Score:</strong> {activeRowData.weighted_score.toFixed(2)}
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center space-y-2 md:space-y-0 md:space-x-2 w-full">
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded bg-black text-white text-xs md:text-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded bg-black text-white text-xs md:text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded bg-black text-white text-xs md:text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded bg-black text-white text-xs md:text-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <div className="flex-grow flex justify-center">
          <span className="text-xs md:text-sm text-white">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
        <div className="hidden md:block">
          <select
            className="px-2 py-1 border border-gray-300 rounded bg-black text-white text-xs md:text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[7, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// CustomCheckbox component
interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div
      className={`w-4 h-4 border rounded cursor-pointer flex items-center justify-center ${
        checked ? "bg-blue-600 border-blue-600" : "bg-gray-800 border-gray-300"
      }`}
      onClick={(event) => {
        onChange();
      }}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  );
};

export default DevelopersPage;