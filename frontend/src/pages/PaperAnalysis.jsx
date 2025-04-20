import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactFlow, { Background } from 'reactflow'
import 'reactflow/dist/style.css'

const PaperAnalysis = () => {
  const [paperLinks, setPaperLinks] = useState(['', '', '', '', ''])
  const [subject, setSubject] = useState('')
  const [university, setUniversity] = useState('')
  const [degree, setDegree] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const handlePaperLinkChange = (index, value) => {
    const newPaperLinks = [...paperLinks]
    newPaperLinks[index] = value
    setPaperLinks(newPaperLinks)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call to analyze papers
    setTimeout(() => {
      const mockQuestions = [
        {
          id: 1,
          question: "Explain the significance of vector calculus in electromagnetic field theory.",
          answer: "Vector calculus plays a crucial role in electromagnetic field theory as it provides the mathematical framework to describe the behavior of electric and magnetic fields in space. Maxwell's equations, which are the fundamental equations of electromagnetism, are expressed using vector calculus operations like divergence, gradient, and curl. This mathematical approach allows us to understand how electromagnetic fields propagate through space and interact with matter.",
          difficulty: "Medium",
          importanceScore: 95
        },
        {
          id: 2,
          question: "Compare and contrast synchronous and asynchronous sequential circuits.",
          answer: "Synchronous sequential circuits operate based on a global clock signal that synchronizes all state transitions, while asynchronous sequential circuits change states in response to input changes without relying on a clock. Synchronous circuits are easier to design and test due to their predictable timing, but they may consume more power and have clock distribution challenges. Asynchronous circuits can be more power-efficient and don't suffer from clock skew issues, but they're harder to design, test, and can experience hazards and race conditions.",
          difficulty: "Hard",
          importanceScore: 90
        },
        {
          id: 3,
          question: "Discuss the principles of packet switching in computer networks.",
          answer: "Packet switching is a method where data is broken into small chunks called packets, which are transmitted individually through the network and reassembled at the destination. Each packet contains addressing information and can take different routes. This approach enables efficient use of network resources through statistical multiplexing, provides resilience to network failures, and allows for fair sharing of network capacity among multiple users. Key principles include connectionless service, store-and-forward transmission, dynamic routing, and packet sequencing.",
          difficulty: "Medium",
          importanceScore: 88
        },
        {
          id: 4,
          question: "Describe the process of memory allocation in operating systems.",
          answer: "Memory allocation in operating systems involves assigning portions of memory to processes upon request. The main strategies include: 1) Contiguous allocation, where each process gets a single continuous block of memory; 2) Paging, which divides physical memory into fixed-size frames and logical memory into pages; 3) Segmentation, which divides memory into logical segments of varying sizes. The OS maintains data structures to track free and allocated memory regions. Memory allocation must handle fragmentation issues, optimize space utilization, and ensure memory protection between processes.",
          difficulty: "Medium",
          importanceScore: 85
        },
        {
          id: 5,
          question: "Analyze the time complexity of quicksort algorithm in best, average, and worst cases.",
          answer: "Quicksort has different time complexities depending on the scenario: Best case: O(n log n) occurs when the pivot element consistently divides the array into roughly equal halves, resulting in balanced partitioning. Average case: O(n log n) applies to random data where partitioning is reasonably balanced most of the time. Worst case: O(n²) happens when the array is already sorted (or reverse sorted) and the first/last element is chosen as pivot, causing highly unbalanced partitions. Space complexity is O(log n) for the recursive call stack in the average case, but can be O(n) in the worst case.",
          difficulty: "Hard",
          importanceScore: 82
        }
      ]
      
      setQuestions(mockQuestions)
      setIsLoading(false)
    }, 2000)
  }

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question)
    setShowAnswer(false)
  }

  return (
    <div className="min-h-screen relative bg-[#293241]">
      {/* ReactFlow Background Pattern */}
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
      
      {/* Header */}
      <div className="relative bg-[#3D5A80] py-12">
        <div className="absolute inset-0">
          <svg className="absolute h-full w-full" viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0,200 C300,150 600,50 1200,0 L1200,200 Z" 
              fill="#98C1D9" 
              opacity="0.1" 
            />
          </svg>
        </div>
        <div className="container mx-auto px-6 relative">
          <Link to="/" className="text-[#E0FBFC] hover:text-[#EE6C4D] mb-6 inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-[#E0FBFC] mt-4">Paper Analysis</h1>
          <p className="text-[#98C1D9] mt-2">
            Upload your previous year papers to get AI-generated important questions
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-[#3D5A80]/20 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/30">
              <h2 className="text-2xl font-semibold text-[#E0FBFC] mb-6">Upload Papers</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-[#98C1D9] mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-[#293241] border border-[#3D5A80] rounded-lg px-4 py-2 text-[#E0FBFC] focus:outline-none focus:border-[#EE6C4D]"
                    placeholder="e.g., Computer Networks"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#98C1D9] mb-2">University</label>
                  <input
                    type="text"
                    className="w-full bg-[#293241] border border-[#3D5A80] rounded-lg px-4 py-2 text-[#E0FBFC] focus:outline-none focus:border-[#EE6C4D]"
                    placeholder="e.g., MIT"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#98C1D9] mb-2">Class/Degree</label>
                  <input
                    type="text"
                    className="w-full bg-[#293241] border border-[#3D5A80] rounded-lg px-4 py-2 text-[#E0FBFC] focus:outline-none focus:border-[#EE6C4D]"
                    placeholder="e.g., B.Tech Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#98C1D9] mb-2">Paper Links (PDF)</label>
                  <p className="text-sm text-[#98C1D9]/70 mb-4">Add up to 5 links to previous year papers</p>
                  
                  {paperLinks.map((link, index) => (
                    <div key={index} className="mb-3">
                      <input
                        type="url"
                        className="w-full bg-[#293241] border border-[#3D5A80] rounded-lg px-4 py-2 text-[#E0FBFC] focus:outline-none focus:border-[#EE6C4D]"
                        placeholder={`Paper ${index + 1} URL`}
                        value={link}
                        onChange={(e) => handlePaperLinkChange(index, e.target.value)}
                        required={index === 0} // Only the first link is required
                      />
                    </div>
                  ))}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#EE6C4D] hover:bg-[#e85c3a] text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Analyzing</span>
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </>
                  ) : (
                    'Generate Important Questions'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-2">
            {questions.length > 0 && (
              <div className="bg-[#3D5A80]/20 backdrop-blur-lg rounded-xl p-6 border border-[#3D5A80]/30">
                <h2 className="text-2xl font-semibold text-[#E0FBFC] mb-6">Important Questions</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className={`bg-[#293241] border ${
                        selectedQuestion?.id === q.id ? 'border-[#EE6C4D]' : 'border-[#3D5A80]/50'
                      } rounded-lg p-4 cursor-pointer hover:border-[#EE6C4D] transition-colors`}
                      onClick={() => handleQuestionClick(q)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-[#E0FBFC] font-medium">{q.question}</h3>
                        <div className="flex flex-col items-end ml-4">
                          <span className="px-2 py-1 bg-[#3D5A80]/30 rounded-full text-xs text-[#98C1D9]">
                            {q.difficulty}
                          </span>
                          <span className="text-xs text-[#EE6C4D] mt-1">
                            {q.importanceScore}% Importance
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedQuestion && (
                  <div className="bg-[#293241] border border-[#3D5A80]/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-[#E0FBFC] mb-4">{selectedQuestion.question}</h3>
                    
                    {showAnswer ? (
                      <div className="mb-4">
                        <h4 className="text-[#98C1D9] mb-2 font-medium">Answer:</h4>
                        <p className="text-[#E0FBFC]">{selectedQuestion.answer}</p>
                      </div>
                    ) : (
                      <button
                        className="bg-[#3D5A80] hover:bg-[#2d4a70] text-[#E0FBFC] font-medium py-2 px-4 rounded-lg transition-colors"
                        onClick={() => setShowAnswer(true)}
                      >
                        Show Answer
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {questions.length === 0 && !isLoading && (
              <div className="bg-[#3D5A80]/20 backdrop-blur-lg rounded-xl p-8 border border-[#3D5A80]/30 flex flex-col items-center justify-center h-full">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-[#E0FBFC] mb-2">No Questions Yet</h3>
                <p className="text-[#98C1D9] text-center">
                  Add your paper links and generate important questions to see them here
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="bg-[#3D5A80]/20 backdrop-blur-lg rounded-xl p-8 border border-[#3D5A80]/30 flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-t-transparent border-[#EE6C4D] rounded-full animate-spin mb-4"></div>
                <p className="text-[#E0FBFC]">Analyzing papers...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaperAnalysis