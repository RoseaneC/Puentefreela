import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ESCROW_JOBS_ADDRESS, MOCK_USDC_ADDRESS, ESCROW_JOBS_ABI, MOCK_USDC_ABI } from '../lib/contract'
import { formatEther } from 'viem'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CreditCard, User, DollarSign, Wallet } from 'lucide-react'

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

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const jobIdNum = jobId ? BigInt(jobId) : BigInt(0)

  const { data: jobData, refetch } = useReadContract({
    address: ESCROW_JOBS_ADDRESS,
    abi: ESCROW_JOBS_ABI,
    functionName: 'jobs',
    args: [jobIdNum],
    query: {
      enabled: !!jobId,
    },
  }) as { data: readonly [bigint, `0x${string}`, `0x${string}`, bigint, `0x${string}`, 0 | 1 | 2 | 3] | undefined, refetch: () => void }

  const { writeContract: writeFundJob, data: fundHash, isPending: isFunding } = useWriteContract()
  const { writeContract: writeRelease, data: releaseHash, isPending: isReleasing } = useWriteContract()
  const { writeContract: writeApprove, data: approveHash, isPending: isApproving } = useWriteContract()

  const { isLoading: isFundingTx, isSuccess: isFundingSuccess } = useWaitForTransactionReceipt({ hash: fundHash })
  const { isLoading: isReleasingTx, isSuccess: isReleasingSuccess } = useWaitForTransactionReceipt({ hash: releaseHash })
  const { isLoading: isApprovingTx, isSuccess: isApprovingSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

  // Mostrar toasts de sucesso
  useEffect(() => {
    if (isApprovingSuccess && fundHash) {
      toast.success('Aprovação concedida! Financiando job...')
    }
  }, [isApprovingSuccess, fundHash])

  useEffect(() => {
    if (isFundingSuccess) {
      toast.success('Job financiado com sucesso!')
      refetch()
    }
  }, [isFundingSuccess, refetch])

  useEffect(() => {
    if (isReleasingSuccess) {
      toast.success('Pagamento liberado com sucesso!')
      refetch()
    }
  }, [isReleasingSuccess, refetch])

  if (!jobId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="font-heading text-2xl font-bold mb-4">Invalid Job ID</h1>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  if (!jobData || jobData[0]?.toString() === '0') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="font-heading text-2xl font-bold mb-4">Job #{jobId}</h1>
        <p className="text-muted-foreground mb-8">Job not found or not created yet.</p>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  const isClient = address?.toLowerCase() === jobData[1]?.toLowerCase()
  const status = JobStatus[jobData[5] as keyof typeof JobStatus]
  const amount = jobData[3] ? formatEther(jobData[3]) : '0'
  const amountARS = (parseFloat(amount) * 1000).toFixed(2) // Taxa fixa: 1 USDC = 1000 ARS
  const amountBRL = (parseFloat(amount) * 5).toFixed(2) // Taxa fixa: 1 USDC = 5 BRL

  const handleFundJob = async () => {
    if (!isClient) return

    const amountWei = jobData[3]

    try {
      await writeApprove({
        address: MOCK_USDC_ADDRESS,
        abi: MOCK_USDC_ABI,
        functionName: 'approve',
        args: [ESCROW_JOBS_ADDRESS, amountWei],
      })

      setTimeout(async () => {
        await writeFundJob({
          address: ESCROW_JOBS_ADDRESS,
          abi: ESCROW_JOBS_ABI,
          functionName: 'fundJob',
          args: [jobIdNum],
        })
        setTimeout(() => refetch(), 3000)
      }, 2000)
    } catch (error) {
      console.error('Error funding job:', error)
      toast.error('Erro ao financiar job')
    }
  }

  const handleReleasePayment = async () => {
    if (!isClient) return

    try {
      await writeRelease({
        address: ESCROW_JOBS_ADDRESS,
        abi: ESCROW_JOBS_ABI,
        functionName: 'releasePayment',
        args: [jobIdNum],
      })
      setTimeout(() => refetch(), 3000)
    } catch (error) {
      console.error('Error releasing payment:', error)
      toast.error('Erro ao liberar pagamento')
    }
  }

  const handleApply = () => {
    toast.info('Funcionalidade de aplicação em desenvolvimento. Em breve você poderá se candidatar a jobs!')
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Header */}
          <Card className="glass-card p-8 mb-6 border-gradient">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <Badge variant="outline" className={`${statusColors[status as keyof typeof statusColors]} mb-4`}>
                  {status}
                </Badge>
                <h1 className="font-heading text-3xl font-bold mb-4">Job #{jobId}</h1>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-foreground">{amount} mUSDC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇦🇷</span>
                    <span className="text-muted-foreground">{amountARS} ARS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇧🇷</span>
                    <span className="text-muted-foreground">{amountBRL} BRL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Client: {jobData[1]?.slice(0, 6)}...{jobData[1]?.slice(-4)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/50 mb-6" />

            {/* Client Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-xs text-muted-foreground font-mono">{jobData[1]}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              {isClient && status === 'Created' && (
                <Button
                  variant="outline"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                  onClick={handleFundJob}
                  disabled={isFunding || isFundingTx || isApproving || isApprovingTx}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isApproving || isApprovingTx ? 'Approving...' : isFunding || isFundingTx ? 'Funding...' : 'Fund Job'}
                </Button>
              )}

              {isClient && status === 'Assigned' && (
                <Button
                  variant="outline"
                  className="border-secondary/30 hover:border-secondary hover:bg-secondary/10"
                  onClick={handleReleasePayment}
                  disabled={isReleasing || isReleasingTx}
                >
                  {isReleasing || isReleasingTx ? 'Releasing...' : 'Release Payment'}
                </Button>
              )}

              {!isClient && isConnected && status === 'Funded' && (
                <Button
                  className="bg-primary hover:bg-primary/90 glow-primary"
                  onClick={handleApply}
                >
                  Apply as Freelancer
                </Button>
              )}
            </div>
          </Card>

          {/* Back Button */}
          <div className="mb-6">
            <Button onClick={() => navigate('/')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </div>

          {/* Additional Information */}
          <Card className="glass-card p-8">
            <h2 className="font-heading text-xl font-bold mb-4">Job Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Freelancer</p>
                  <p className="font-mono text-sm">
                    {jobData[2] && jobData[2] !== "0x0000000000000000000000000000000000000000"
                      ? jobData[2]
                      : 'Not assigned'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Token Address</p>
                  <p className="font-mono text-sm">{jobData[4]}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rates</p>
                  <p className="text-xs text-muted-foreground">
                    1 mUSDC = 1000 ARS | 1 mUSDC = 5 BRL<br/>
                    (fake conversions - TODO: Uniswap V3 integration)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {!isConnected && (
            <Alert className="mt-6">
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Connect your wallet to interact with this job
              </AlertDescription>
            </Alert>
          )}

          {(fundHash || releaseHash) && (
            <div className="space-y-4 mt-6">
              {fundHash && (
                <Alert>
                  <AlertDescription>
                    <strong>Job Funded!</strong> Transaction hash: {fundHash}
                  </AlertDescription>
                </Alert>
              )}

              {releaseHash && (
                <Alert>
                  <AlertDescription>
                    <strong>Payment Released!</strong> Transaction hash: {releaseHash}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

