import React, { useState, useEffect, useMemo } from "react";
import { Book, Wifi, WifiOff, Library, AlertCircle } from "lucide-react";
import { initializeApi, api, apiConnectionMode } from "./services/api";
import { Dashboard } from "./components/Dashboard";
import { FilterBar } from "./components/FilterBar";
import { BookCard } from "./components/BookCard";
import { BookForm } from "./components/BookForm";
import { SkeletonGrid } from "./components/Skeleton";
import { ToastContainer } from "./components/Toast";
import "./App.css";

function App() {
  // --- 1. CORE DATA STATES ---
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiConnecting, setIsApiConnecting] = useState(true);
  const [connectionMode, setConnectionMode] = useState("simulated");

  // --- 2. FILTER & SORT STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title-asc");

  // --- 3. MODAL AND EDIT STATES ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // --- 4. TOAST NOTIFICATION STATES ---
  const [toasts, setToasts] = useState([]);

  // Toast utility helper
  const addToast = (message, type = "info", duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- 5. INITIALIZATION ---
  useEffect(() => {
    const connectAndFetch = async () => {
      setIsApiConnecting(true);
      try {
        // Run our dynamic connectivity check!
        const localMode = await initializeApi();
        setConnectionMode(apiConnectionMode);

        if (localMode) {
          addToast("Using browser fallback database (no API server detected).", "info");
        } else if (apiConnectionMode === "hosted-rest") {
          addToast("Connected to hosted REST API.", "success");
        } else {
          addToast("Connected to local JSON Server.", "success");
        }

        // Fetch initial books list
        await loadBooks();
      } catch (err) {
        console.error("Initialization error", err);
        addToast("Error initializing application.", "error");
      } finally {
        setIsApiConnecting(false);
      }
    };

    connectAndFetch();
  }, []);

  // Fetch helper
  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAll();
      setBooks(data);
    } catch (err) {
      console.error("Error loading books", err);
      addToast("Failed to fetch books.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. CRUD OPERATIONS ---

  // SAVE (Create or Update)
  const handleSaveBook = async (bookPayload) => {
    // Show a loading toast
    const loadingToastId = Date.now().toString();
    setToasts((prev) => [
      ...prev,
      { id: loadingToastId, message: editingBook ? "Updating book details..." : "Saving book to library...", type: "loading" }
    ]);

    try {
      if (editingBook) {
        // Update mode
        await api.update(editingBook.id, bookPayload);
        // Dismiss loading toast, show success toast
        setToasts((prev) => prev.filter((t) => t.id !== loadingToastId));
        addToast(`"${bookPayload.title}" updated successfully!`, "success");
      } else {
        // Add mode
        await api.create(bookPayload);
        // Dismiss loading toast, show success toast
        setToasts((prev) => prev.filter((t) => t.id !== loadingToastId));
        addToast(`"${bookPayload.title}" added to library!`, "success");
      }
      
      // Reload books to update view
      await loadBooks();
    } catch (err) {
      setToasts((prev) => prev.filter((t) => t.id !== loadingToastId));
      addToast("Failed to save book. Please try again.", "error");
      throw err;
    }
  };

  // DELETE
  const handleDeleteBook = async (id) => {
    const bookToDelete = books.find((b) => b.id === id);
    if (!bookToDelete) return;

    const confirmDelete = window.confirm(`Are you sure you want to remove "${bookToDelete.title}"?`);
    if (!confirmDelete) return;

    // Show loading toast
    const loadingToastId = Date.now().toString();
    setToasts((prev) => [
      ...prev,
      { id: loadingToastId, message: `Removing "${bookToDelete.title}"...`, type: "loading" }
    ]);

    try {
      await api.delete(id);
      setToasts((prev) => prev.filter((t) => t.id !== loadingToastId));
      addToast(`"${bookToDelete.title}" removed.`, "success");
      await loadBooks();
    } catch (err) {
      setToasts((prev) => prev.filter((t) => t.id !== loadingToastId));
      addToast("Failed to delete book.", "error");
    }
  };

  // Trigger edit modal
  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  // Trigger add modal
  const handleAddClick = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  // --- 7. FILTER & SORT COMPUTATIONS (useMemo for lightning performance) ---
  
  // Dynamic list of unique genres in the system (updates automatically when custom genres are saved!)
  const uniqueGenres = useMemo(() => {
    const genresSet = new Set();
    books.forEach((book) => {
      if (book.genre) {
        genresSet.add(book.genre);
      }
    });
    return Array.from(genresSet).sort();
  }, [books]);

  // Filtered and Sorted list
  const processedBooks = useMemo(() => {
    let result = [...books];

    // Filter by Genre
    if (selectedGenre !== "All") {
      result = result.filter((book) => book.genre === selectedGenre);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q)
      );
    }

    // Sort operations
    result.sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "year-desc":
          return (b.pubYear || 0) - (a.pubYear || 0);
        case "year-asc":
          return (a.pubYear || 0) - (b.pubYear || 0);
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchQuery, selectedGenre, sortBy]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 80px 20px" }}>
      
      {/* 🚀 Premium Header App Bar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }} className="animate-fade-in">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "var(--primary-gradient)", color: "white", padding: "10px", borderRadius: "12px", display: "flex", alignItems: "center", boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)" }}>
            <Library size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
              Aether<span style={{ background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Books</span>
            </h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>Cosmic Library System</p>
          </div>
        </div>

        {/* Dynamic connection indicator badge */}
        {!isApiConnecting && (
          <div 
            className="glass-panel" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "6px 14px", 
              borderRadius: "20px", 
              fontSize: "0.8rem",
              fontWeight: "600",
              borderColor: connectionMode === "simulated" ? "rgba(217, 70, 239, 0.2)" : "rgba(16, 185, 129, 0.2)"
            }}
          >
            {connectionMode === "simulated" ? (
              <>
                <WifiOff size={14} style={{ color: "var(--accent-pink)" }} />
                <span style={{ color: "var(--accent-pink)" }}>Simulated API (localStorage)</span>
              </>
            ) : connectionMode === "hosted-rest" ? (
              <>
                <Wifi size={14} style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--success)" }}>Hosted REST API</span>
              </>
            ) : (
              <>
                <Wifi size={14} style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--success)" }}>Local JSON Server</span>
              </>
            )}
          </div>
        )}
      </header>

      {/* 📊 Statistics Dashboard Row */}
      <Dashboard books={books} />

      {/* 🔍 Search and Filters Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddClick={handleAddClick}
        genres={uniqueGenres}
      />

      {/* 📚 Books Grid Area */}
      <main style={{ marginTop: "24px" }}>
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : processedBooks.length > 0 ? (
          <div className="books-grid">
            {processedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditClick}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        ) : (
          /* Empty Search or Library State */
          <div className="empty-state animate-fade-in">
            <AlertCircle className="empty-state-icon" size={48} />
            <h3>No books found</h3>
            <p>
              {searchQuery.trim() !== "" || selectedGenre !== "All"
                ? "Try adjusting your search keywords or resetting your genre filters."
                : "Your digital library is currently empty! Add your very first book to get started."}
            </p>
            {(searchQuery.trim() !== "" || selectedGenre !== "All") ? (
              <button 
                className="btn-secondary" 
                onClick={() => { setSearchQuery(""); setSelectedGenre("All"); }}
              >
                Reset Filters
              </button>
            ) : (
              <button className="btn-primary" onClick={handleAddClick}>
                Add Your First Book
              </button>
            )}
          </div>
        )}
      </main>

      {/* 📝 Add/Update Book Modal */}
      <BookForm
        book={editingBook}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBook}
      />

      {/* 🔔 Floating Toast Notification System */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

    </div>
  );
}

export default App;
