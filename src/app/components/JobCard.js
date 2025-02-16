'use client';

import Link from 'next/link';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/jobs/${job.id}`} className="block p-6">
        <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-center">
            <span className="mr-2">💰</span>
            {job.salary}
          </p>
          <p className="flex items-center">
            <span className="mr-2">🏷️</span>
            {job.category}
          </p>
          <p className="flex items-center">
            <span className="mr-2">📍</span>
            {job.location}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;
