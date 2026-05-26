import React from "react";
import { BookOpen, Star, Tag, Calendar } from "lucide-react";
import "../styles/Dashboard.css";

export const Dashboard = ({ books = [] }) => {
  // 1. Total Books Count
  const totalBooks = books.length;

  // 2. Average Rating
  const averageRating = totalBooks > 0 
    ? (books.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalBooks).toFixed(1) 
    : "0.0";

  // 3. Top Genre
  const getTopGenre = () => {
    if (totalBooks === 0) return "None";
    const genreCounts = {};
    books.forEach((book) => {
      const genre = book.genre || "Unknown";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    let topGenre = "Unknown";
    let maxCount = 0;
    Object.entries(genreCounts).forEach(([genre, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topGenre = genre;
      }
    });
    return topGenre;
  };

  const topGenre = getTopGenre();

  // 4. Newest/Latest Publication Year
  const latestYear = totalBooks > 0
    ? Math.max(...books.map(b => parseInt(b.pubYear) || 0))
    : "N/A";

  const stats = [
    {
      id: "total",
      label: "Total Books",
      value: totalBooks,
      icon: <BookOpen size={22} />,
    },
    {
      id: "rating",
      label: "Average Rating",
      value: `${averageRating} / 5.0`,
      icon: <Star size={22} />,
    },
    {
      id: "genre",
      label: "Top Genre",
      value: topGenre,
      icon: <Tag size={22} />,
    },
    {
      id: "newest",
      label: "Latest Release",
      value: latestYear,
      icon: <Calendar size={22} />,
    },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      {stats.map((stat) => (
        <div key={stat.id} className="glass-panel stat-card">
          <div className="stat-icon-box">
            {stat.icon}
          </div>
          <div className="stat-content">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;
