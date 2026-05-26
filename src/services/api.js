import { INITIAL_BOOKS } from "./mockData";

// Optional hosted API (MockAPI, Render json-server, etc.) via Vercel env: VITE_API_BASE_URL
const CONFIGURED_API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const LOCAL_API_URL = "http://localhost:3001/books";
const API_BASE_URL = CONFIGURED_API_URL || LOCAL_API_URL;

// Helper to simulate network delay for the mock/fallback client
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A state tracker to decide if we are using the live LocalStorage DB or the real Server REST API
let useLocalStorage = true;

/** @type {'simulated' | 'local-rest' | 'hosted-rest'} */
export let apiConnectionMode = "simulated";

/**
 * Checks if the local development json-server is up and running.
 * If yes, we use the real REST API. If no, we seamlessly fallback to LocalStorage.
 */
export const initializeApi = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIGURED_API_URL ? 3000 : 1000);

    const response = await fetch(API_BASE_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      apiConnectionMode = CONFIGURED_API_URL ? "hosted-rest" : "local-rest";
      useLocalStorage = false;
    } else {
      throw new Error("API responded with error status.");
    }
  } catch (error) {
    console.warn(
      "⚠️ Local JSON-Server is offline or unreachable. Falling back to Simulated LocalStorage API. (Crucial for live URL deployments!)"
    );
    useLocalStorage = true;
    apiConnectionMode = "simulated";

    // Seed localStorage if it doesn't have any books yet
    if (!localStorage.getItem("book_library_db")) {
      localStorage.setItem("book_library_db", JSON.stringify(INITIAL_BOOKS));
    }
  }

  return useLocalStorage;
};

// ----------------------------------------------------
// LOCAL STORAGE BACKEND SIMULATOR (The "Post Office" in our 5yo analogy)
// ----------------------------------------------------
const getLocalStorageBooks = () => {
  const data = localStorage.getItem("book_library_db");
  return data ? JSON.parse(data) : [];
};

const saveLocalStorageBooks = (books) => {
  localStorage.setItem("book_library_db", JSON.stringify(books));
};

// ----------------------------------------------------
// UNIFIED CRUD API OPERATIONS
// ----------------------------------------------------

export const api = {
  /**
   * 1. READ: Get all books
   */
  async getAll() {
    await delay(600); // Simulate network latency so loading spinners are visible

    if (!useLocalStorage) {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Failed to fetch books from server");
        return await response.json();
      } catch (err) {
        console.error("REST API error, switching to fallback database", err);
        useLocalStorage = true;
        return getLocalStorageBooks();
      }
    } else {
      return getLocalStorageBooks();
    }
  },

  /**
   * 2. CREATE: Add a new book
   */
  async create(bookData) {
    await delay(800);

    const newBook = {
      ...bookData,
      id: Date.now().toString(), // Generate a unique ID
      pubYear: parseInt(bookData.pubYear) || new Date().getFullYear(),
      rating: parseInt(bookData.rating) || 5
    };

    if (!useLocalStorage) {
      try {
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBook)
        });
        if (!response.ok) throw new Error("Failed to save book to server");
        return await response.json();
      } catch (err) {
        console.error("REST API write error, saving locally", err);
        // Fallback write
        const books = getLocalStorageBooks();
        books.push(newBook);
        saveLocalStorageBooks(books);
        return newBook;
      }
    } else {
      const books = getLocalStorageBooks();
      books.push(newBook);
      saveLocalStorageBooks(books);
      return newBook;
    }
  },

  /**
   * 3. UPDATE: Edit an existing book
   */
  async update(id, bookData) {
    await delay(800);

    const updatedBook = {
      ...bookData,
      id: id.toString(),
      pubYear: parseInt(bookData.pubYear) || new Date().getFullYear(),
      rating: parseInt(bookData.rating) || 5
    };

    if (!useLocalStorage) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook)
        });
        if (!response.ok) throw new Error("Failed to update book on server");
        return await response.json();
      } catch (err) {
        console.error("REST API update error, editing locally", err);
        // Fallback update
        const books = getLocalStorageBooks();
        const index = books.findIndex((b) => b.id === id.toString());
        if (index !== -1) {
          books[index] = updatedBook;
          saveLocalStorageBooks(books);
        }
        return updatedBook;
      }
    } else {
      const books = getLocalStorageBooks();
      const index = books.findIndex((b) => b.id === id.toString());
      if (index !== -1) {
        books[index] = updatedBook;
        saveLocalStorageBooks(books);
      }
      return updatedBook;
    }
  },

  /**
   * 4. DELETE: Remove a book
   */
  async delete(id) {
    await delay(600);

    if (!useLocalStorage) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete book from server");
        return true;
      } catch (err) {
        console.error("REST API delete error, removing locally", err);
        // Fallback delete
        const books = getLocalStorageBooks();
        const filtered = books.filter((b) => b.id !== id.toString());
        saveLocalStorageBooks(filtered);
        return true;
      }
    } else {
      const books = getLocalStorageBooks();
      const filtered = books.filter((b) => b.id !== id.toString());
      saveLocalStorageBooks(filtered);
      return true;
    }
  }
};
