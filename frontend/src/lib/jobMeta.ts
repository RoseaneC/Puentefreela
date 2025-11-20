export type JobMeta = {
  id: number;
  title: string;
  description: string;
  country: string;
  valueUSDC: number;
  createdAt: string;
};

const STORAGE_KEY = "puente:jobs";

function loadJobMetas(): JobMeta[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading job metas from localStorage:", error);
    return [];
  }
}

function saveJobMetas(metas: JobMeta[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
  } catch (error) {
    console.error("Error saving job metas to localStorage:", error);
  }
}

export function getJobMeta(jobId: number): JobMeta | null {
  const metas = loadJobMetas();
  return metas.find(meta => meta.id === jobId) || null;
}

export function listJobMeta(): JobMeta[] {
  const metas = loadJobMetas();
  return metas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveJobMeta(meta: JobMeta): void {
  const metas = loadJobMetas();
  const existingIndex = metas.findIndex(existing => existing.id === meta.id);

  if (existingIndex >= 0) {
    metas[existingIndex] = meta;
  } else {
    metas.push(meta);
  }

  saveJobMetas(metas);
}
