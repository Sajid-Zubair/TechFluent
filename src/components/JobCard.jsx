function JobCard({ job }) {
  return (
    <div className="border p-4 rounded-md shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
      <p className="mb-2">
        <strong>Location: </strong>
        {job.location?.city
          ? `${job.location.city}, ${job.location.countryName}`
          : "Location not available"}
      </p>
      <a
        href={job.jobUrl || job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Apply Here
      </a>
    </div>
  );
}
