"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Pencil, Trash2, Users, FileText, Clock } from 'lucide-react'

// Types
type JobPosting = {
  id: number
  title: string
  description: string
  requirements: string
  status: 'open' | 'closed'
}

type Applicant = {
  id: number
  name: string
  email: string
  status: 'applied' | 'reviewing' | 'interviewed' | 'offered' | 'rejected'
  resume: string
  applicationLetter: string
  applicationTime: string
}

// Mock data
const initialJobs: JobPosting[] = [
  { id: 1, title: 'Software Engineer', description: 'We are looking for a talented software engineer to join our team and help build innovative solutions.', requirements: 'Bachelor\'s degree in Computer Science, 3+ years of experience in web development, proficiency in React and Node.js.', status: 'open' },
  { id: 2, title: 'Product Manager', description: 'Seeking an experienced product manager to lead our product development efforts and drive growth.', requirements: '5+ years of experience in product management, strong analytical skills, excellent communication abilities.', status: 'open' },
]

const mockApplicants: Record<number, Applicant[]> = {
  1: [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'applied', resume: 'Experienced software engineer with a focus on web technologies...', applicationLetter: 'Dear Hiring Manager, I am excited to apply for the Software Engineer position...', applicationTime: '2023-05-15T10:30:00Z' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'reviewing', resume: 'Full-stack developer with 5 years of experience in building scalable applications...', applicationLetter: 'To Whom It May Concern, I believe my skills and experience make me an ideal candidate...', applicationTime: '2023-05-16T14:45:00Z' },
  ],
  2: [
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'interviewed', resume: 'Product manager with a track record of launching successful products...', applicationLetter: 'Hello, I am thrilled to apply for the Product Manager role at your company...', applicationTime: '2023-05-14T09:15:00Z' },
  ],
}

export function JobManagementComponent() {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [isJobFormOpen, setIsJobFormOpen] = useState(false)
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)

  const handleCreateOrUpdateJob = (job: Omit<JobPosting, 'id'> & { id?: number }) => {
    if (job.id) {
      setJobs(jobs.map(j => j.id === job.id ? job as JobPosting : j))
    } else {
      setJobs([...jobs, { ...job, id: Math.max(...jobs.map(j => j.id), 0) + 1 }])
    }
    setEditingJob(null)
    setIsJobFormOpen(false)
  }

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  const handleToggleJobStatus = (id: number) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: job.status === 'open' ? 'closed' : 'open' } : job))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto p-4 relative z-10">
        <header className="bg-black text-white p-4 mb-6 rounded-b-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center">SmoothHire Job Management</h1>
        </header>
        <Card className="bg-white/80 backdrop-blur-md shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Job Listings</CardTitle>
            <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingJob(null); setIsJobFormOpen(true); }}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
                </DialogHeader>
                <JobForm 
                  job={editingJob} 
                  onSubmit={handleCreateOrUpdateJob}
                  onCancel={() => { setEditingJob(null); setIsJobFormOpen(false); }} 
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger className="font-medium hover:underline">
                          {job.title}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                          <DialogHeader>
                            <DialogTitle>{job.title}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Job Description:</h4>
                            <p>{job.description}</p>
                            <h4 className="font-semibold mt-4 mb-2">Requirements:</h4>
                            <p>{job.requirements}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                              <DialogTitle>Edit Job</DialogTitle>
                            </DialogHeader>
                            <JobForm 
                              job={job} 
                              onSubmit={handleCreateOrUpdateJob}
                              onCancel={() => { setEditingJob(null); setIsJobFormOpen(false); }} 
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleJobStatus(job.id)}>
                          {job.status === 'open' ? 'Close' : 'Open'}
                        </Button>
                        <Dialog open={isApplicantListOpen && selectedJobId === job.id} onOpenChange={(open) => {
                          setIsApplicantListOpen(open)
                          if (!open) setSelectedJobId(null)
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedJobId(job.id)}>
                              <Users className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[768px] bg-white">
                            <DialogHeader>
                              <DialogTitle>Applicants for {job.title}</DialogTitle>
                            </DialogHeader>
                            <ApplicantList jobId={job.id} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <footer className="bg-black text-white p-4 mt-6 rounded-t-lg shadow-lg">
        <p className="text-center">&copy; 2023 SmoothHire. All rights reserved.</p>
      </footer>
    </div>
  )
}

function JobForm({ job, onSubmit, onCancel }: { job: JobPosting | null, onSubmit: (job: Omit<JobPosting, 'id'> & { id?: number }) => void, onCancel: () => void }) {
  const [title, setTitle] = useState(job?.title || '')
  const [description, setDescription] = useState(job?.description || '')
  const [requirements, setRequirements] = useState(job?.requirements || '')

  useEffect(() => {
    if (job) {
      setTitle(job.title)
      setDescription(job.description)
      setRequirements(job.requirements)
    }
  }, [job])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: job?.id,
      title,
      description,
      requirements,
      status: job?.status || 'open'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          placeholder="Enter job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          placeholder="Enter job description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requirements">Job Requirements</Label>
        <Textarea
          id="requirements"
          placeholder="Enter job requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{job ? 'Update Job' : 'Create Job'}</Button>
      </div>
    </form>
  )
}

function ApplicantList({ jobId }: { jobId: number }) {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isApplicantDetailsOpen, setIsApplicantDetailsOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setApplicants(mockApplicants[jobId] || [])
    }, 500)
  }, [jobId])

  const updateApplicantStatus = (applicantId: number, newStatus: Applicant['status']) => {
    setApplicants(applicants.map(a => a.id === applicantId ? { ...a, status: newStatus } : a))
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map(applicant => (
            <TableRow key={applicant.id}>
              <TableCell>{applicant.name}</TableCell>
              <TableCell>{applicant.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  applicant.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                  applicant.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                  applicant.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                  applicant.status === 'offered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {applicant.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Select
                    value={applicant.status}
                    onValueChange={(value) => updateApplicantStatus(applicant.id, value as Applicant['status'])}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isApplicantDetailsOpen && selectedApplicant?.id === applicant.id} onOpenChange={(open) => {
                    setIsApplicantDetailsOpen(open)
                    if (!open) setSelectedApplicant(null)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedApplicant(applicant)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle>Applicant Details: {applicant.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Resume:</h4>
                          <p className="text-sm">{applicant.resume}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Application Letter:</h4>
                          <p className="text-sm">{applicant.applicationLetter}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Application Time:</h4>
                          <p className="text-sm flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(applicant.applicationTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      />
    </div>
  )
}