import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ESCROW_JOBS_ADDRESS, MOCK_USDC_ADDRESS, ESCROW_JOBS_ABI } from '../lib/contract'
import { parseEther } from 'viem'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'

export default function CreateJob() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const [jobId, setJobId] = useState('')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [country, setCountry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { writeContract: writeCreateJob, data: createHash, isPending: isCreating } = useWriteContract()

  const { isLoading: isCreatingTx } = useWaitForTransactionReceipt({ hash: createHash })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!amount || !isConnected) return

    setIsSubmitting(true)

    // Usar jobId fornecido ou gerar um automaticamente baseado no timestamp
    const finalJobId = jobId || Date.now().toString()
    const jobIdNum = BigInt(finalJobId)
    const amountWei = parseEther(amount)

    try {
      await writeCreateJob({
        address: ESCROW_JOBS_ADDRESS,
        abi: ESCROW_JOBS_ABI,
        functionName: 'createJob',
        args: [jobIdNum, amountWei, MOCK_USDC_ADDRESS],
      })

      toast.success('Job created successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Failed to create job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <div className="mb-8">
              <h1 className="font-heading text-4xl font-bold mb-3">
                Post a Job
              </h1>
              <p className="text-muted-foreground">
                Connect your wallet to create secure freelance jobs with escrow protection.
              </p>
            </div>

            <Card className="glass-card p-8 border-gradient">
              <div className="text-center py-12">
                <h3 className="font-heading text-xl font-semibold mb-4">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your MetaMask wallet to start posting jobs and managing escrow payments.
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto animate-fade-up">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold mb-3">
              Post a Job
            </h1>
            <p className="text-muted-foreground">
              Create a new job and connect with talented freelancers
            </p>
          </div>

          <Card className="glass-card p-8 border-gradient">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Design landing page for crypto wallet"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  className="bg-background border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job requirements, deliverables, and expectations..."
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="min-h-[150px] bg-background border-border/50 focus:border-primary resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Value in USDC (MockUSDC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="500"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    step="0.01"
                    className="bg-background border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Argentina"
                    value={country}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
                    className="bg-background border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobId">Job ID (Optional)</Label>
                <Input
                  id="jobId"
                  type="number"
                  placeholder="Leave empty for auto-generated ID"
                  value={jobId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobId(e.target.value)}
                  className="bg-background border-border/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  If not provided, a unique ID will be generated automatically
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || isCreating || isCreatingTx}
                  className="w-full bg-primary hover:bg-primary/90 glow-primary transition-all"
                >
                  {isSubmitting || isCreating || isCreatingTx ? 'Creating Job...' : 'Create Job'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  You'll need to fund this job with USDC after creation
                </p>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

