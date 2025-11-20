import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Web3Provider } from './providers/Web3Provider'
import Home from './pages/Home'
import CreateJob from './pages/CreateJob'
import JobDetail from './pages/JobDetail'

function App() {
  return (
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateJob />} />
            <Route path="/job/:jobId" element={<JobDetail />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  )
}

export default App

