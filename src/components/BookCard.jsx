import React from "react";
import { BookOpen, Edit2, Trash2, Calendar, Star } from "lucide-react";
import "../styles/BookCard.css";

/**
 * Returns a beautiful, vibrant gradient string based on the book's genre.
 * This makes cards look like distinct premium book covers!
 */
const getGenreGradient = (genre = "") => {
  const g = genre.toLowerCase().trim();
  if (g.includes("sci-fi") || g.includes("science")) {
    return "linear-gradient(135deg, #2e0854 0%, #4c1d95 70%, #8b5cf6 100%)";
  }
  if (g.includes("fiction") || g.includes("novel")) {
    return "linear-gradient(135deg, #0f172a 0%, #1e1b4b 70%, #3b0764 100%)";
  }
  if (g.includes("biography") || g.includes("history") || g.includes("memoir")) {
    return "linear-gradient(135deg, #3c1e08 0%, #78350f 70%, #b45309 100%)";
  }
  if (g.includes("self") || g.includes("business") || g.includes("habits")) {
    return "linear-gradient(135deg, #064e3b 0%, #047857 70%, #059669 100%)";
  }
  if (g.includes("thriller") || g.includes("mystery") || g.includes("horror")) {
    return "linear-gradient(135deg, #450a0a 0%, #7f1d1d 70%, #991b1b 100%)";
  }
  
  // Default fallback: Space gradient
  return "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #334155 100%)";
};

export const BookCard = ({ book, onEdit, onDelete }) => {
  const { id, title, author, genre, pubYear, rating, description } = book;

  // Render Star System
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const isFilled = i < rating;
      return (
        <Star
          key={i}
          size={14}
          className={isFilled ? "rating-star" : "rating-star-empty"}
        />
      );
    });
  };

  return (
    <div className="glass-panel book-card animate-slide-up">
      {/* 1. Procedural Book Cover Overlay */}
      <div 
        className="book-cover-mock" 
        style={{ background: getGenreGradient(genre) }}
      >
        <BookOpen className="book-cover-icon" size={60} />
        <span className="book-cover-genre">{genre}</span>
        <h4 className="book-cover-title-overlay" title={title}>{title}</h4>
      </div>

      {/* 2. Text Details */}
      <div className="book-details">
        <h3 className="book-title" title={title}>{title}</h3>
        <span className="book-author">by {author}</span>
      </div>

      {/* 3. Meta and Badges row */}
      <div className="book-meta">
        <span className="book-genre-badge">{genre}</span>
        <div className="book-rating" title={`Rating: ${rating} out of 5 stars`}>
          {renderStars()}
        </div>
      </div>

      {/* 4. Small year tag */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "8px" }}>
        <Calendar size={12} />
        <span>Published {pubYear}</span>
      </div>

      {/* 5. Quick actions on Hover */}
      <div className="book-actions">
        <button 
          className="btn-card-edit" 
          onClick={() => onEdit(book)}
          title="Edit book details"
        >
          <Edit2 size={14} />
          Edit
        </button>
        <button 
          className="btn-card-delete" 
          onClick={() => onDelete(id)}
          title="Delete book"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default BookCard;
