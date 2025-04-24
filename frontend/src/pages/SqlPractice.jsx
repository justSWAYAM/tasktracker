import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'reactflow/dist/style.css'
import ReactFlow, { Background } from 'reactflow'

const SqlPractice = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [layout, setLayout] = useState('vertical'); // 'vertical' or 'horizontal'
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    } else {
      fetchTables();
    }
  }, [navigate]);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/sql-practice/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName) => {
    setDataLoading(true);
    setSelectedTable(tableName);
    setQueryResult(null);
    setQueryError('');
    try {
      const response = await axios.get(`http://localhost:8080/api/sql-practice/table/${tableName}`);
      if (response.data.result === 'SUCCESS') {
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setQueryError('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setQueryError('');
    setQueryResult(null);

    try {
      const response = await axios.post('http://localhost:8080/api/sql-practice/execute', {
        query: query.trim()
      });
      
      if (response.data.result === 'SUCCESS') {
        setQueryResult(response.data.data);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 1500);
      } else {
        setQueryError(response.data.message);
      }
    } catch (error) {
      setQueryError(error.response?.data?.message || 'An error occurred while executing the query');
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleLayout = () => {
    setLayout(layout === 'vertical' ? 'horizontal' : 'vertical');
  };

  const handleKeyDown = (e) => {
    // Execute query with Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#293241] to-[#3D5A80] p-4 md:p-8 transition-all duration-300">
       <div className="absolute inset-0 z-0">
      <ReactFlow nodes={[]} edges={[]} fitView={true} panOnScroll={true} zoomOnScroll={false}>
        <Background
          color="#EE6C4D"
          gap={30}
          size={3}
          variant="dots"
          className="bg-gradient-to-br from-[#3D5A80] to-[#293241]"
        />
      </ReactFlow>
    </div>
      <div className="max-w-7xl mx-auto  relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-[#E0FBFC] hover:text-[#EE6C4D] inline-flex items-center transition-colors duration-300 group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </Link>
          <button 
            onClick={toggleLayout}
            className="flex items-center bg-[#3D5A80] hover:bg-[#4d6a90] text-[#E0FBFC] px-3 py-2 rounded-lg transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={layout === 'vertical' ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 10h16M4 14h16M4 18h16"}></path>
            </svg>
            Toggle Layout
          </button>
        </div>

        <h1 className="text-4xl font-bold text-[#E0FBFC] mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#98C1D9] to-[#E0FBFC]">SQL Practice</span>
          <div className="h-1 w-32 bg-gradient-to-r from-[#EE6C4D] to-[#98C1D9] mx-auto mt-2 rounded-full"></div>
        </h1>

        <div className={`${layout === 'vertical' ? 'flex flex-col space-y-8' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}`}>
          {/* Left Panel: Table List & Query Editor */}
          <div className={`${layout === 'vertical' ? 'w-full' : 'lg:col-span-1'}`}>
            {/* Query Input Section */}
            <div className="mb-8">
              <div className="bg-[#3D5A80]/30 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/50 shadow-lg transform transition-all duration-300 hover:shadow-[#98C1D9]/10 hover:border-[#98C1D9]/50">
                <h2 className="text-2xl font-semibold text-[#E0FBFC] mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-[#EE6C4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  SQL Query Editor
                </h2>
                
                <div className="relative">
                  <div className="absolute top-0 right-0 flex items-center space-x-2 p-2 text-xs text-[#98C1D9]">
                    <span className="px-2 py-1 bg-[#293241] rounded">Ctrl+Enter to Execute</span>
                    <button 
                      onClick={() => setQuery('')}
                      className="p-1 hover:text-[#EE6C4D] transition-colors"
                      title="Clear editor"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-48 bg-[#293241] border border-[#3D5A80] rounded-lg p-4 pt-10 text-[#E0FBFC] focus:outline-none focus:border-[#EE6C4D] font-mono shadow-inner resize-y custom-scrollbar"
                    placeholder="SELECT * FROM table_name WHERE condition;"
                    spellCheck="false"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-[#98C1D9]">Enter your SQL query above</div>
                  <button
                    onClick={executeQuery}
                    disabled={isExecuting}
                    className={`py-3 px-6 flex items-center justify-center min-w-[150px] bg-gradient-to-r from-[#EE6C4D] to-[#e85c3a] text-[#E0FBFC] font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${showSuccessAnimation ? 'animate-pulse' : ''}`}
                  >
                    {isExecuting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Executing...
                      </>
                    ) : showSuccessAnimation ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Success!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Execute Query
                      </>
                    )}
                  </button>
                </div>
                
                {queryError && (
                  <div className="mt-4 p-4 bg-[#EE6C4D]/10 border border-[#EE6C4D] text-[#EE6C4D] rounded-lg animate-fadeIn">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{queryError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tables Section */}
            <div className="mb-8">
              <div className="bg-[#3D5A80]/30 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/50 shadow-lg transform transition-all duration-300 hover:shadow-[#98C1D9]/10 hover:border-[#98C1D9]/50">
                <h2 className="text-2xl font-semibold text-[#E0FBFC] mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-[#98C1D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                  </svg>
                  Available Tables
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center p-8 text-[#E0FBFC]">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#98C1D9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading tables...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tables.map((table, index) => (
                      <div 
                        key={index}
                        onClick={() => fetchTableData(table.table_name)}
                        className={`bg-[#293241] border rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                          selectedTable === table.table_name 
                            ? 'border-[#EE6C4D] bg-[#EE6C4D]/10 shadow-md' 
                            : 'border-[#3D5A80]/50 hover:border-[#98C1D9]'
                        }`}
                      >
                        <div className="flex items-center">
                          <svg className={`w-5 h-5 mr-2 ${selectedTable === table.table_name ? 'text-[#EE6C4D]' : 'text-[#98C1D9]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          <h3 className={`font-medium truncate ${selectedTable === table.table_name ? 'text-[#EE6C4D]' : 'text-[#E0FBFC]'}`}>{table.table_name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className={`${layout === 'vertical' ? 'w-full' : 'lg:col-span-1'}`}>
            {/* Results Section */}
            {dataLoading || isExecuting ? (
              <div className="bg-[#3D5A80]/30 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/50 shadow-lg min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-[#98C1D9] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="text-[#E0FBFC] text-lg">Processing your request...</div>
                </div>
              </div>
            ) : (queryResult || tableData) ? (
              <div className="bg-[#3D5A80]/30 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/50 shadow-lg transform transition-all duration-300 hover:shadow-[#98C1D9]/10 hover:border-[#98C1D9]/50 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-[#E0FBFC] flex items-center">
                    {selectedTable ? (
                      <>
                        <svg className="w-6 h-6 mr-2 text-[#98C1D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        {selectedTable}
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-2 text-[#EE6C4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Query Results
                      </>
                    )}
                  </h2>
                  <div className="text-sm bg-[#293241] text-[#98C1D9] px-3 py-1 rounded-full">
                    {(queryResult || tableData).length} rows
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#3D5A80]/70 shadow-inner bg-[#293241]">
                  <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full min-w-max">
                      <thead className="sticky top-0 bg-[#3D5A80]/80 backdrop-blur-md">
                        <tr>
                          {Object.keys((queryResult || tableData)[0] || {}).map((header, index) => (
                            <th key={header} className={`text-left py-3 px-4 text-[#E0FBFC] font-semibold text-sm uppercase whitespace-nowrap ${index === 0 ? 'rounded-tl-lg' : ''} ${index === Object.keys((queryResult || tableData)[0] || {}).length - 1 ? 'rounded-tr-lg' : ''}`}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(queryResult || tableData).map((row, rowIndex) => (
                          <tr 
                            key={rowIndex} 
                            className={`border-b border-[#3D5A80]/30 hover:bg-[#3D5A80]/10 transition-colors ${rowIndex % 2 === 0 ? 'bg-[#293241]' : 'bg-[#293241]/70'}`}
                          >
                            {Object.entries(row).map(([key, value], cellIndex) => (
                              <td key={`${rowIndex}-${cellIndex}`} className="py-3 px-4 text-[#98C1D9] whitespace-nowrap">
                                <div className="flex items-center">
                                  {cellIndex === 0 && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#EE6C4D] mr-2"></div>
                                  )}
                                  {value?.toString() || (
                                    <span className="text-[#3D5A80] italic">NULL</span>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-[#98C1D9]">
                  <div>
                    Press on table names to view their structure
                  </div>
                  <button 
                    onClick={() => {
                      setQueryResult(null);
                      setTableData(null);
                      setSelectedTable(null);
                    }}
                    className="text-[#EE6C4D] hover:text-[#e85c3a] flex items-center transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Clear results
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#3D5A80]/30 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/50 shadow-lg min-h-[400px] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                  <svg className="w-16 h-16 text-[#98C1D9]/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <h3 className="text-xl font-medium text-[#E0FBFC] mb-2">No Results Yet</h3>
                  <p className="text-[#98C1D9]">
                    Execute a SQL query or select a table from the list to view its data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Tips */}
        <div className="mt-8 bg-[#3D5A80]/30 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/50 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#E0FBFC] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-[#98C1D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Quick Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#293241] p-4 rounded-lg border border-[#3D5A80]/50">
              <div className="text-[#EE6C4D] font-medium mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Get Started
              </div>
              <p className="text-[#98C1D9] text-sm">
                Click on a table name to view its structure, or write a SQL query in the editor and click "Execute Query".
              </p>
            </div>
            <div className="bg-[#293241] p-4 rounded-lg border border-[#3D5A80]/50">
              <div className="text-[#EE6C4D] font-medium mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Keyboard Shortcuts
              </div>
              <p className="text-[#98C1D9] text-sm">
                Press <span className="text-[#E0FBFC] bg-[#3D5A80] px-1 rounded">Ctrl+Enter</span> or <span className="text-[#E0FBFC] bg-[#3D5A80] px-1 rounded">Cmd+Enter</span> to execute your query quickly.
              </p>
            </div>
            <div className="bg-[#293241] p-4 rounded-lg border border-[#3D5A80]/50">
              <div className="text-[#EE6C4D] font-medium mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                </svg>
                Change Layout
              </div>
              <p className="text-[#98C1D9] text-sm">
                Toggle between horizontal and vertical layouts using the layout button at the top of the page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add global CSS for animations and custom scrollbar */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #293241;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #98C1D9, #3D5A80);
          border-radius: 10px;
          border: 2px solid #293241;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #EE6C4D, #e85c3a);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #98C1D9 #293241;
        }
      `}</style>
    </div>
  );
};

export default SqlPractice;