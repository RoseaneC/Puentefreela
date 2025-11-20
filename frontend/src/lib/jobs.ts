import { readContract } from '@wagmi/core'
import { config } from './wagmiConfig'
import { ESCROW_JOBS_ADDRESS, ESCROW_JOBS_ABI, Job } from './contract'

export function listStaticJobs(): number[] {
  return [1, 2, 3, 4, 5]
}

export async function fetchJob(jobId: number): Promise<Job | null> {
  try {
    const data = await readContract(config, {
      address: ESCROW_JOBS_ADDRESS,
      abi: ESCROW_JOBS_ABI,
      functionName: 'jobs',
      args: [BigInt(jobId)],
    }) as readonly [bigint, `0x${string}`, `0x${string}`, bigint, `0x${string}`, 0 | 1 | 2 | 3]

    // Se o job não existe (id = 0 ou client = address(0)), retorna null
    if (!data || data[0].toString() === '0' || data[1] === '0x0000000000000000000000000000000000000000') {
      return null
    }

    return {
      id: data[0],
      client: data[1],
      freelancer: data[2],
      amount: data[3],
      token: data[4],
      status: data[5]
    }
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error)
    return null
  }
}
