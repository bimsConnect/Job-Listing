'use client';
import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../utils/api';
import JobCard from './JobCard';

interface Job {
  id: string;
  title: string;
  salary: string;
  category: string;
  location: string;
}

interface ApiResponse {
  success: boolean;
  data?: Job[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  status?: number;
}


const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  useEffect(() => {
    const loadJobs = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const result: ApiResponse = await fetchJobs(currentPage, 10, {});

        
        if (result.success && result.data && result.total !== undefined) {
          setJobs(result.data);
          setTotalJobs(result.total);
          setError(null);
        } else {
          setError(result.message || 'Failed to load job listings');
        }

      } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [currentPage]);

  const filteredJobs = jobs.filter(job => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
           (categoryFilter ? job.category === categoryFilter : true);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading job listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Job Listing</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >

          <option value="">All Categories</option>
          <option value="IT">IT</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
        </select>
        {(searchTerm || categoryFilter) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
            }}
            className="px-6 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
      {(searchTerm || categoryFilter) && (
        <div className="mb-8 text-sm text-gray-600 flex items-center gap-2">
          <span>Active filters:</span>
          {searchTerm && (
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span>Search:</span>
              <span className="font-medium">{`"${searchTerm}"`}</span>




              <button 
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span>Category:</span>
              <span className="font-medium">{categoryFilter}</span>
              <button 
                onClick={() => setCategoryFilter('')}
                className="p-1 rounded-full hover:bg-green-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-2xl mb-4">😕</div>
            <p className="text-gray-600 text-center">
              No jobs found matching your criteria.<br/>
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 mt-12">
        <div className="text-sm text-gray-500 mb-2">
          Showing <span className="font-medium">{(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalJobs)}</span> of <span className="font-medium">{totalJobs}</span> jobs
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg">Page {currentPage}</span>
          <button
            disabled={currentPage * 10 >= totalJobs}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default JobList;
