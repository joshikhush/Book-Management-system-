import React, { useState, useEffect } from "react";
import { X, Star, Save, Loader2 } from "lucide-react";
import "../styles/BookForm.css";

const STANDARD_GENRES = ["Fiction", "Sci-Fi", "Biography", "Self-Help", "Thriller"];

export const BookForm = ({ book = null, isOpen, onClose, onSave }) => {
  const isEdit = !!book;
  const currentYear = new Date().getFullYear();

  // 1. Initial State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    customGenre: "",
    pubYear: currentYear.toString(),
    rating: 5,
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Load Book data if we are in Edit mode
  useEffect(() => {
    if (isOpen) {
      if (book) {
        const isStandardGenre = STANDARD_GENRES.includes(book.genre);
        setFormData({
          title: book.title || "",
          author: book.author || "",
          genre: isStandardGenre ? book.genre : "Other",
          customGenre: isStandardGenre ? "" : book.genre || "",
          pubYear: (book.pubYear || currentYear).toString(),
          rating: book.rating || 5,
          description: book.description || ""
        });
      } else {
        // Reset form for addition
        setFormData({
          title: "",
          author: "",
          genre: "Fiction",
          customGenre: "",
          pubYear: currentYear.toString(),
          rating: 5,
          description: ""
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [book, isOpen, currentYear]);

  if (!isOpen) return null;

  // 3. Handle inputs changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 4. Handle Rating click
  const handleRatingChange = (ratingValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: ratingValue
    }));
  };

  // 5. Validation Check
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Book title is required.";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required.";
    }
    
    if (formData.genre === "Other" && !formData.customGenre.trim()) {
      newErrors.customGenre = "Please specify the custom genre.";
    }

    const yearNum = parseInt(formData.pubYear);
    if (!formData.pubYear.trim()) {
      newErrors.pubYear = "Publication year is required.";
    } else if (isNaN(yearNum) || yearNum < 0 || yearNum > currentYear) {
      newErrors.pubYear = `Enter a valid year between 0 and ${currentYear}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 6. Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Resolve genre (either selected dropdown value or custom user genre)
    const finalGenre = formData.genre === "Other" 
      ? formData.customGenre.trim() 
      : formData.genre;

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: finalGenre,
      pubYear: parseInt(formData.pubYear),
      rating: formData.rating,
      description: formData.description.trim()
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error("Form submit error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? "Update Book Details" : "Add New Book"}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="form-grid">
          
          {/* Title (Full width) */}
          <div className="form-group full-width">
            <label className="form-label">Book Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Harry Potter and the Sorcerer's Stone"
              disabled={isSubmitting}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Author (Full width) */}
          <div className="form-group full-width">
            <label className="form-label">Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. J.K. Rowling"
              disabled={isSubmitting}
            />
            {errors.author && <span className="form-error">{errors.author}</span>}
          </div>

          {/* Genre Selection */}
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {STANDARD_GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
              <option value="Other">Other / Custom...</option>
            </select>
          </div>

          {/* Publication Year */}
          <div className="form-group">
            <label className="form-label">Publication Year</label>
            <input
              type="text"
              name="pubYear"
              value={formData.pubYear}
              onChange={handleChange}
              placeholder="e.g. 1997"
              maxLength={4}
              disabled={isSubmitting}
            />
            {errors.pubYear && <span className="form-error">{errors.pubYear}</span>}
          </div>

          {/* Conditional Custom Genre input */}
          {formData.genre === "Other" && (
            <div className="form-group full-width">
              <label className="form-label">Specify Genre</label>
              <input
                type="text"
                name="customGenre"
                value={formData.customGenre}
                onChange={handleChange}
                placeholder="e.g. Fantasy, Mystery, Poetry"
                disabled={isSubmitting}
              />
              {errors.customGenre && <span className="form-error">{errors.customGenre}</span>}
            </div>
          )}

          {/* Rating selector (1-5 stars) */}
          <div className="form-group full-width">
            <label className="form-label">Rating</label>
            <div className="rating-selector">
              {Array.from({ length: 5 }).map((_, idx) => {
                const starVal = idx + 1;
                const isActive = starVal <= formData.rating;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`star-button ${isActive ? "active" : ""}`}
                    onClick={() => handleRatingChange(starVal)}
                    disabled={isSubmitting}
                    title={`${starVal} Star${starVal > 1 ? "s" : ""}`}
                  >
                    <Star size={24} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description / Summary */}
          <div className="form-group full-width">
            <label className="form-label">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a brief summary or notes about the book..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Form Actions Footer */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Update" : "Save Book"}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookForm;
