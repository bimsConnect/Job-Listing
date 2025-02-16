import JobList from './components/JobList';
import ErrorBoundary from './components/ErrorBoundary';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8"></h1>
      <ErrorBoundary>
        <JobList />
      </ErrorBoundary>
    </main>
  );
}
