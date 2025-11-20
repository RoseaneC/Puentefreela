import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { ESCROW_JOBS_ADDRESS, ESCROW_JOBS_ABI } from '../lib/contract'
import { listStaticJobs } from '../lib/jobs'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { formatEther } from 'viem'
import Navbar from '@/components/Navbar'

const JobStatus = {
  0: 'Created',
  1: 'Funded',
  2: 'Assigned',
  3: 'Released'
}

const statusColors = {
  Created: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Funded: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Assigned: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Released: "bg-green-500/10 text-green-400 border-green-500/20"
}

export default function Home() {
  const { } = useAccount()
  const navigate = useNavigate()
  const [jobId, setJobId] = useState('')
  const [searchedJobId, setSearchedJobId] = useState<number | null>(null)

  // Lista de jobs estáticos para listar
  const jobIds = listStaticJobs()

  const { data: jobData } = useReadContract({
    address: ESCROW_JOBS_ADDRESS,
    abi: ESCROW_JOBS_ABI,
    functionName: 'jobs',
    args: searchedJobId !== null ? [BigInt(searchedJobId)] : undefined,
    query: {
      enabled: searchedJobId !== null,
    },
  }) as { data: readonly [bigint, `0x${string}`, `0x${string}`, bigint, `0x${string}`, 0 | 1 | 2 | 3] | undefined }

  const handleSearch = () => {
    const id = parseInt(jobId)
    if (!isNaN(id) && id > 0) {
      setSearchedJobId(id)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center py-16 animate-fade-up">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Work without borders.<br />
            <span className="text-gradient">Get paid in USDC.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure freelance jobs with escrow protection. Built for migrant workers who deserve fair payment and safe contracts.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/create">
              <Button className="bg-primary hover:bg-primary/90 glow-primary transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-4xl mx-auto grid grid-cols-3 gap-8 py-12 mb-16 border-y border-border/50">
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-primary mb-1">$24K+</div>
            <div className="text-sm text-muted-foreground">Total paid</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-primary mb-1">147</div>
            <div className="text-sm text-muted-foreground">Jobs completed</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-primary mb-1">89</div>
            <div className="text-sm text-muted-foreground">Active freelancers</div>
          </div>
          <div className="col-span-3 text-center mt-4">
            <p className="text-xs text-muted-foreground/70 italic">
              *Dados ilustrativos para o MVP do hackathon. Ainda não refletem uso real da plataforma.*
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="max-w-2xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold mb-4">Find a Job</h2>
            <p className="text-muted-foreground">Search for available jobs by ID</p>
          </div>

          <div className="flex gap-4 mb-8">
            <Input
              type="text"
              placeholder="Enter Job ID"
              value={jobId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="px-8">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {searchedJobId && jobData && jobData[0]?.toString() !== '0' && (
            <Card className="glass-card p-6 mb-8">
              <h3 className="font-heading text-lg font-semibold mb-4">Job #{searchedJobId}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{jobData[1]?.slice(0, 10)}...{jobData[1]?.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Freelancer</p>
                  <p className="font-medium">
                    {jobData[2] && jobData[2] !== "0x0000000000000000000000000000000000000000"
                      ? `${jobData[2]?.slice(0, 10)}...${jobData[2]?.slice(-8)}`
                      : 'Not assigned'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatEther(jobData[3] || BigInt(0))} mUSDC</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusColors[JobStatus[jobData[5] as keyof typeof JobStatus] as keyof typeof statusColors]}>
                    {JobStatus[jobData[5] as keyof typeof JobStatus]}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => navigate(`/job/${searchedJobId}`)} variant="outline">
                View Details
              </Button>
            </Card>
          )}
        </section>

        {/* Jobs Section */}
        <section className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">Available Jobs</h2>
            <Link to="/create">
              <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                Post Job
              </Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {jobIds.map((id) => (
              <JobCard key={id} jobId={id} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

interface JobCardProps {
  jobId: number;
}

function JobCard({ jobId }: JobCardProps) {
  const navigate = useNavigate()
  const { data: jobData } = useReadContract({
    address: ESCROW_JOBS_ADDRESS,
    abi: ESCROW_JOBS_ABI,
    functionName: 'jobs',
    args: [BigInt(jobId)],
    query: {
      enabled: true,
    },
  }) as { data: readonly [bigint, `0x${string}`, `0x${string}`, bigint, `0x${string}`, 0 | 1 | 2 | 3] | undefined }

  // Verifica se o job existe (client != address(0) ou amount > 0)
  const jobExists = jobData && jobData[1] !== "0x0000000000000000000000000000000000000000" && jobData[3] > BigInt(0)

  if (!jobData || !jobExists) {
    return (
      <Card className="glass-card p-6">
        <h3 className="font-heading text-lg font-semibold">Job #{jobId}</h3>
        <p className="text-muted-foreground">Job ainda não criado</p>
      </Card>
    )
  }

  const status = JobStatus[jobData[5] as keyof typeof JobStatus]

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold mb-2">Job #{jobId}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Client</p>
              <p className="font-mono">{jobData[1]?.slice(0, 10)}...{jobData[1]?.slice(-8)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-semibold">{formatEther(jobData[3] || BigInt(0))} USDC</p>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className={statusColors[status as keyof typeof statusColors]}>
              {status}
            </Badge>
          </div>
        </div>
        <div className="ml-4">
          <Button onClick={() => navigate(`/job/${jobId}`)} variant="outline">
            Ver detalhes
          </Button>
        </div>
      </div>
    </Card>
  )
}

