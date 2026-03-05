// Helper function to calculate days ago
export const getDaysAgo = (date) => {
  const now = new Date();
  const reportDate = new Date(date);
  const diffTime = Math.abs(now - reportDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

// Helper function to format date as "20th feb, 2026, 12:45"
export const formatDetailedDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  // Add ordinal suffix (st, nd, rd, th)
  let daySuffix = 'th';
  if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
  else if (day === 2 || day === 22) daySuffix = 'nd';
  else if (day === 3 || day === 23) daySuffix = 'rd';
  
  return `${day}${daySuffix} ${month}, ${year}, ${hours}:${minutes}`;
};

// Helper function to get location string
export const getLocationString = (report) => {
  const parts = [];
  if (report.building) parts.push(report.building);
  if (report.street) parts.push(report.street);
  if (report.locality) parts.push(report.locality);
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
};

// Helper function to get status config - supports both user and admin statuses
export const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        color: "border-gray-400",
        bgColor: "bg-gray-400",
        text: "Pending",
      };
    case "reviewed":
      return {
        color: "border-yellow-400",
        bgColor: "bg-yellow-400",
        text: "Reviewed",
      };
    case "rejected":
      return {
        color: "border-red-500",
        bgColor: "bg-red-500",
        text: "Rejected",
      };
    case "approved":
      return {
        color: "border-yellow-500",
        bgColor: "bg-yellow-500",
        text: "Actions Taken",
      };
    case "verified":
      // For admin view - "verified" is same as "approved"
      return {
        color: "border-yellow-500",
        bgColor: "bg-yellow-500",
        text: "Actions Taken",
      };
    default:
      return {
        color: "border-gray-400",
        bgColor: "bg-gray-400",
        text: "Unknown",
      };
  }
};
