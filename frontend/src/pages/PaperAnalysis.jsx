import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReactFlow, { Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { GoogleGenAI } from "@google/genai";

// Replace 'YOUR_API_KEY' with your actual Google AI API key
const ai = new GoogleGenAI({
  apiKey: 'AIzaSyB8WJOZLwF9qOcCSLVlFs1qmlDcosLq2LY'
});

async function main(subject, semester, university) {
  const prompt = `Analyze the following academic information and generate relevant study material from mumbai univeristy
  do not give any other text in response besides the json formatted text nothign else start directly from  question and dont write any starting or ending line for the response or any greeting also should not be there
  :
    Subject: ${subject}
    Semester: ${semester}
    University: ${university}
    
    Please provide:
    1. Key topics to focus on
    2. Important concepts
    3. Study recommendations
    4. Common exam patterns
    
    only return the response in json format
     {
          id: 1,
          question: "",
          answer: "",
          difficulty: "",
          importanceScore: 
        },
        
        this is a sample structure striclt follow this structure return only the json format
        return only questions that come in exam nothign else this should be straightforward as much as possible`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text;
 
}


const PaperAnalysis = () => {
  const [paperLinks, setPaperLinks] = useState(['', '', '', '', ''])
  const [subject, setSubject] = useState('')
  const [university, setUniversity] = useState('')
  const [degree, setDegree] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePaperLinkChange = (index, value) => {
    const newPaperLinks = [...paperLinks]
    newPaperLinks[index] = value
    setPaperLinks(newPaperLinks)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const analysis = await main(subject, degree, university);
      // Extract JSON content from the response text
      const jsonMatch = analysis.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1].trim();
        const parsedQuestions = JSON.parse(jsonString);
        setQuestions(parsedQuestions);
      } else {
        console.error('No valid JSON found in response');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error analyzing papers:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
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
                  <p className="text-sm text-[#98C1D9]/70 mb-4">Add up to 5 links to previous year papers (Optional)</p>
                  
                  {paperLinks.map((link, index) => (
                    <div key={index} className="mb-3">
                      <input
                        type="url"
                        className="w-full bg-[#293241] border border-[#3D5A80] rounded-lg px-4 py-2 text-[#E0FBFC] focus:outline-none focus:border-[#EE6C4D]"
                        placeholder={`Paper ${index + 1} URL (Optional)`}
                        value={link}
                        onChange={(e) => handlePaperLinkChange(index, e.target.value)}
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