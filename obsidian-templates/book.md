<%*
let title = await tp.system.prompt("Book Title");
// Clean slug by replacing special characters with hyphens
let slug = title.split(" ").join("-").toLowerCase()
    .replace(/[^\w\-]+/g, "-")     // Replace any non-word chars with hyphen
    .replace(/\-{2,}/g, "-")       // Replace multiple consecutive hyphens with single hyphen
    .replace(/^\-+|\-+$/g, "");    // Remove leading and trailing hyphens

// Add "-book-review" suffix if not already present
slug = slug.includes("-book-review") ? slug : slug + "-book-review";
let coverUrl = await tp.system.prompt("Book Cover URL (from Goodreads, Amazon, etc.)", "");

// Get all markdown files in the book directory
const bookFiles = app.vault.getFiles().filter(file => 
  file.path.startsWith('src/content/book/') && 
  file.extension === 'md'
);

// Debug message to confirm files found
console.log(`Found ${bookFiles.length} book files`);

// Initialize collections for extracted metadata
let existingAuthors = new Set();
let existingGenres = new Set();
let authorsFound = []; // For debugging
let genresFound = []; // For debugging

// Helper function to normalize text (trim, lowercase, remove extra hyphens)
function normalizeText(text) {
  if (!text) return "";
  // Trim, convert to lowercase, remove any leading hyphens and extra spaces
  return text.trim().toLowerCase().replace(/^-\s*/, "");
}

// Helper function to clean genre text (remove hyphens and extra spaces)
function cleanGenreText(text) {
  if (!text) return "";
  // Remove any leading hyphens and extra spaces, but preserve case
  return text.trim().replace(/^-\s*/, "");
}

// Extract metadata from all book files
for (const file of bookFiles) {
  try {
    const content = await app.vault.read(file);
    
    // Look for frontmatter between triple dashes
    const frontmatterMatch = content.match(/---\s*([\s\S]*?)\s*---/);
    
    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatter = frontmatterMatch[1];
      
      // Extract author
      const authorMatch = frontmatter.match(/bookAuthor\s*:\s*([^"\n\r]+?)(?:\n|$)/m) || 
                          frontmatter.match(/bookAuthor\s*:\s*"([^"]+)"/m);
      
      if (authorMatch && authorMatch[1]) {
        const authorName = authorMatch[1].trim();
        existingAuthors.add(authorName);
        authorsFound.push(`${file.basename}: ${authorName}`);
      }
      
      // Extract genre - multiple approaches to handle different formats
      
      // 1. First check for the array format with multiple indented items
      const genreArrayPattern = /genre\s*:\s*\n(\s+\-\s+.+\n)+/m;
      const genreArrayMatch = frontmatter.match(genreArrayPattern);
      
      if (genreArrayMatch) {
        // We found a genre array format, extract each item
        const genreArrayContent = genreArrayMatch[0];
        const genreItemMatches = genreArrayContent.matchAll(/\s+\-\s+(.+?)(?:\n|$)/g);
        
        for (const match of genreItemMatches) {
          if (match[1]) {
            const genreName = cleanGenreText(match[1]);
            if (genreName) {
              existingGenres.add(genreName);
              genresFound.push(`${file.basename}: ${genreName} (array)`);
            }
          }
        }
      } else {
        // 2. Try single value format (not an array)
        const genreMatch = frontmatter.match(/genre\s*:\s*([^"\n\r\[]+?)(?:\n|$)/m) || 
                           frontmatter.match(/genre\s*:\s*"([^"]+)"/m);
        
        if (genreMatch && genreMatch[1]) {
          const genreName = cleanGenreText(genreMatch[1]);
          if (genreName) {
            existingGenres.add(genreName);
            genresFound.push(`${file.basename}: ${genreName} (single)`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${file.path}: ${error.message}`);
  }
}

// Fixed status options without ability to add new ones
const statusOptions = ["reading", "completed", "to-read"];

// Convert Sets to Arrays and sort alphabetically
let authorsList = Array.from(existingAuthors);
let genresList = Array.from(existingGenres);

// Debug output
console.log(`Found ${authorsList.length} unique authors: ${authorsList.join(', ')}`);
console.log(`Found ${genresList.length} unique genres: ${genresList.join(', ')}`);

authorsList.sort();
genresList.sort();

// Simplified modal suggester with search that always keeps "Add new" at the top
// and allows directly adding new items without confirmation
async function customSuggester(options, placeholder, allowAddNew = true) {
  // No options provided
  if (!options || !options.length) {
    if (allowAddNew) {
      return await tp.system.prompt("Enter new value:");
    } else {
      return "";
    }
  }
  
  try {
    let input = "";
    let selectedItem = null;
    
    // We'll create a custom modal using Obsidian's Modal API
    const modal = new tp.obsidian.Modal(app);
    modal.titleEl.setText(placeholder);
    
    // Create a search input field
    const searchContainer = modal.contentEl.createDiv({ cls: "templater-search-container" });
    const searchInput = searchContainer.createEl("input", { 
      type: "text",
      placeholder: "Type to search or enter new value directly",
      cls: "templater-search-input" 
    });
    
    // Create container for displaying options
    const optionsContainer = modal.contentEl.createDiv({ cls: "templater-options-container" });
    
    // Function to refresh the options list based on search term
    const refreshOptions = () => {
      // Clear the options container
      optionsContainer.empty();
      
      // First add the "Add new" option if allowed and input is not empty
      if (allowAddNew && input.trim()) {
        const addNewOption = optionsContainer.createDiv({ cls: "templater-option templater-add-new" });
        addNewOption.innerHTML = `<strong><span style="color: #4caf50;">➕</span> Add "${input}"</strong>`;
        
        addNewOption.addEventListener("click", () => {
          selectedItem = input.trim();
          modal.close();
        });
      }
      
      // Filter options based on input
      let filteredOptions = options;
      if (input) {
        const lowerInput = input.toLowerCase();
        filteredOptions = options.filter(opt => 
          opt.toLowerCase().includes(lowerInput)
        );
      }
      
      // Add filtered options
      filteredOptions.forEach(option => {
        const optionDiv = optionsContainer.createDiv({ cls: "templater-option" });
        optionDiv.textContent = option;
        
        optionDiv.addEventListener("click", () => {
          selectedItem = option;
          modal.close();
        });
      });
      
      // Show message if no options match search and not allowing add
      if (filteredOptions.length === 0 && !allowAddNew) {
        const noResultsDiv = optionsContainer.createDiv({ cls: "templater-no-results" });
        noResultsDiv.textContent = "No matching options found";
      }
    };
    
    // Initial options render
    refreshOptions();
    
    // Handle search input
    searchInput.addEventListener("input", (e) => {
      input = e.target.value;
      refreshOptions();
    });
    
    // Handle enter key to quickly add the current input
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && allowAddNew && input.trim()) {
        e.preventDefault();
        selectedItem = input.trim();
        modal.close();
      }
    });
    
    // Focus the search input when the modal opens
    modal.onOpen = () => {
      searchInput.focus();
    };
    
    // Style the modal components
    modal.contentEl.addClass("templater-suggester-modal");
    
    const styleEl = document.head.createEl("style");
    styleEl.textContent = `
      .templater-suggester-modal {
        padding: 10px;
      }
      .templater-search-container {
        margin-bottom: 10px;
      }
      .templater-search-input {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
      }
      .templater-options-container {
        max-height: 300px;
        overflow-y: auto;
      }
      .templater-option {
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
      }
      .templater-option:hover {
        background-color: var(--background-modifier-hover);
      }
      .templater-add-new {
        color: #4caf50; /* Green color for Add New option */
        border-bottom: 1px solid var(--background-modifier-border);
        margin-bottom: 5px;
        padding-bottom: 10px;
      }
      .templater-add-new strong {
        color: #4caf50; /* Ensure the text is also green */
      }
      .templater-no-results {
        padding: 8px;
        color: var(--text-muted);
        font-style: italic;
      }
    `;
    
    // Open the modal and wait for selection
    modal.open();
    
    // Wait for the modal to close
    return new Promise(resolve => {
      modal.onClose = async () => {
        // Clean up the style element
        styleEl.remove();
        
        if (selectedItem) {
          // User selected something (existing or new)
          resolve(selectedItem);
        } else if (allowAddNew && input.trim()) {
          // User closed modal but had entered text - use it as new entry
          resolve(input.trim());
        } else if (options.length > 0) {
          // Fall back to first option if available
          resolve(options[0]);
        } else {
          // Last resort - empty string
          resolve("");
        }
      };
    });
  } catch (error) {
    console.error(`Error in custom suggester: ${error}`, error.stack);
    // Fallback to simple prompt
    if (allowAddNew) {
      const value = await tp.system.prompt("Enter value:");
      return value && value.trim() ? value.trim() : (options.length > 0 ? options[0] : "");
    } else {
      return options.length > 0 ? options[0] : "";
    }
  }
}

// Multi-select modal for selecting multiple genres
async function multiSelectSuggester(options, placeholder, allowAddNew = true) {
  // No options provided
  if (!options || !options.length) {
    if (allowAddNew) {
      const newValue = await tp.system.prompt("Enter new values (comma separated):");
      return newValue ? newValue.split(",").map(v => v.trim()).filter(v => v) : [];
    } else {
      return [];
    }
  }
  
  try {
    let input = "";
    let selectedItems = [];
    
    // We'll create a custom modal using Obsidian's Modal API
    const modal = new tp.obsidian.Modal(app);
    modal.titleEl.setText(placeholder);
    
    // Create a search input field
    const searchContainer = modal.contentEl.createDiv({ cls: "templater-search-container" });
    const searchInput = searchContainer.createEl("input", { 
      type: "text",
      placeholder: "Type to search or add custom values",
      cls: "templater-search-input" 
    });
    
    // Create container for displaying options
    const optionsContainer = modal.contentEl.createDiv({ cls: "templater-options-container" });
    
    // Create a container for showing selected items
    const selectedContainer = modal.contentEl.createDiv({ cls: "templater-selected-container" });
    selectedContainer.createEl("div", { 
      text: "Selected Items:", 
      cls: "templater-selected-header" 
    });
    const selectedList = selectedContainer.createEl("div", { 
      cls: "templater-selected-list" 
    });
    
    // Create buttons container
    const buttonsContainer = modal.contentEl.createDiv({ cls: "templater-buttons-container" });
    
    // Add "Done" button
    const doneButton = buttonsContainer.createEl("button", {
      text: "Done",
      cls: "templater-button templater-done-button"
    });
    doneButton.addEventListener("click", () => {
      // If we have text in the input, add it as a last item
      if (allowAddNew && input.trim()) {
        // Check if it contains commas - if so, split and add each part
        if (input.includes(",")) {
          const newItems = input.split(",").map(i => i.trim()).filter(i => i);
          selectedItems.push(...newItems);
        } else {
          selectedItems.push(input.trim());
        }
      }
      modal.close();
    });
    
    // Function to update the selected items list display
    const updateSelectedList = () => {
      selectedList.empty();
      
      if (selectedItems.length === 0) {
        selectedList.createEl("div", { 
          text: "No items selected", 
          cls: "templater-no-selected" 
        });
        return;
      }
      
      selectedItems.forEach((item, index) => {
        const itemDiv = selectedList.createEl("div", { 
          cls: "templater-selected-item" 
        });
        
        const itemText = itemDiv.createEl("span", { 
          text: item,
          cls: "templater-selected-text"
        });
        
        const removeButton = itemDiv.createEl("button", {
          text: "×",
          cls: "templater-remove-button"
        });
        removeButton.addEventListener("click", () => {
          selectedItems.splice(index, 1);
          updateSelectedList();
        });
      });
    };
    
    // Initial selected list render
    updateSelectedList();
    
    // Function to refresh the options list based on search term
    const refreshOptions = () => {
      // Clear the options container
      optionsContainer.empty();
      
      // First add the "Add new" option if allowed and input is not empty
      if (allowAddNew && input.trim()) {
        const addNewOption = optionsContainer.createDiv({ cls: "templater-option templater-add-new" });
        
        // Check if it contains commas
        if (input.includes(",")) {
          const items = input.split(",").map(i => i.trim()).filter(i => i);
          addNewOption.innerHTML = `<strong><span style="color: #4caf50;">➕</span> Add ${items.length} items: "${items.join('", "')}"</strong>`;
        } else {
          addNewOption.innerHTML = `<strong><span style="color: #4caf50;">➕</span> Add "${input}"</strong>`;
        }
        
        addNewOption.addEventListener("click", () => {
          if (input.includes(",")) {
            const newItems = input.split(",").map(i => i.trim()).filter(i => i);
            selectedItems.push(...newItems);
          } else {
            selectedItems.push(input.trim());
          }
          input = "";
          searchInput.value = "";
          updateSelectedList();
          refreshOptions();
        });
      }
      
      // Filter options based on input and exclude already selected items
      let filteredOptions = options;
      
      // First filter out already selected items
      filteredOptions = filteredOptions.filter(opt => !selectedItems.includes(opt));
      
      // Then filter by search term if any
      if (input) {
        const lowerInput = input.toLowerCase();
        filteredOptions = filteredOptions.filter(opt => 
          opt.toLowerCase().includes(lowerInput)
        );
      }
      
      // Add filtered options
      filteredOptions.forEach(option => {
        const optionDiv = optionsContainer.createDiv({ cls: "templater-option" });
        optionDiv.textContent = option;
        
        optionDiv.addEventListener("click", () => {
          selectedItems.push(option);
          updateSelectedList();
          
          // Clear search after selection
          input = "";
          searchInput.value = "";
          refreshOptions();
        });
      });
      
      // Show message if no options match search
      if (filteredOptions.length === 0 && !allowAddNew) {
        const noResultsDiv = optionsContainer.createDiv({ cls: "templater-no-results" });
        noResultsDiv.textContent = "No matching options found";
      }
    };
    
    // Initial options render
    refreshOptions();
    
    // Handle search input
    searchInput.addEventListener("input", (e) => {
      input = e.target.value;
      refreshOptions();
    });
    
    // Handle enter key to quickly add the current input
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && allowAddNew && input.trim()) {
        e.preventDefault();
        if (input.includes(",")) {
          const newItems = input.split(",").map(i => i.trim()).filter(i => i);
          selectedItems.push(...newItems);
        } else {
          selectedItems.push(input.trim());
        }
        input = "";
        searchInput.value = "";
        updateSelectedList();
        refreshOptions();
      }
    });
    
    // Focus the search input when the modal opens
    modal.onOpen = () => {
      searchInput.focus();
    };
    
    // Style the modal components
    modal.contentEl.addClass("templater-multiselect-modal");
    
    const styleEl = document.head.createEl("style");
    styleEl.textContent = `
      .templater-multiselect-modal {
        padding: 10px;
      }
      .templater-search-container {
        margin-bottom: 10px;
      }
      .templater-search-input {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
      }
      .templater-options-container {
        max-height: 150px;
        overflow-y: auto;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--background-modifier-border);
      }
      .templater-option {
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
      }
      .templater-option:hover {
        background-color: var(--background-modifier-hover);
      }
      .templater-add-new {
        color: #4caf50; /* Green color for Add New option */
        margin-bottom: 5px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--background-modifier-border);
      }
      .templater-add-new strong {
        color: #4caf50; /* Ensure the text is also green */
      }
      .templater-selected-container {
        margin-bottom: 10px;
        max-height: 150px;
        overflow-y: auto;
      }
      .templater-selected-header {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .templater-selected-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .templater-selected-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        background-color: var(--background-modifier-hover);
        border-radius: 4px;
      }
      .templater-remove-button {
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: var(--text-muted);
        background: none;
        border: none;
        padding: 0 5px;
      }
      .templater-remove-button:hover {
        color: var(--text-error);
      }
      .templater-no-results, .templater-no-selected {
        padding: 8px;
        color: var(--text-muted);
        font-style: italic;
      }
      .templater-buttons-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
      .templater-button {
        padding: 6px 12px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
      }
      .templater-done-button {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
      }
    `;
    
    // Open the modal and wait for selection
    modal.open();
    
    // Wait for the modal to close
    return new Promise(resolve => {
      modal.onClose = async () => {
        // Clean up the style element
        styleEl.remove();
        
        // Return the selected items
        resolve(selectedItems);
      };
    });
  } catch (error) {
    console.error(`Error in multi-select suggester: ${error}`, error.stack);
    // Fallback to simple prompt
    if (allowAddNew) {
      const value = await tp.system.prompt("Enter values (comma separated):");
      return value ? value.split(",").map(v => v.trim()).filter(v => v) : [];
    } else {
      return [];
    }
  }
}

// Get author with a suggester that always shows "Add new" option
let author;
try {
  author = await customSuggester(
    authorsList,
    "Select or add new author",
    true
  );
} catch (error) {
  console.error(`Error with author selection: ${error.message}`);
  // Re-prompt for author name until valid
  do {
    author = await tp.system.prompt("Author name is required. Please enter an author name:");
  } while (!author || author.trim() === "");
}

// Get genres with a multi-select suggester
let genres = [];
try {
  genres = await multiSelectSuggester(
    genresList,
    "Select or add multiple genres",
    true
  );
  
  if (!genres || genres.length === 0) {
    // If no genres selected, prompt directly
    const genreInput = await tp.system.prompt("At least one genre is required. Enter genres (comma separated):");
    if (genreInput && genreInput.trim()) {
      genres = genreInput.split(",").map(g => g.trim()).filter(g => g);
    }
    
    // If still empty, use a default
    if (!genres || genres.length === 0) {
      genres = ["Fiction"];
    }
  }
} catch (error) {
  console.error(`Error with genre selection: ${error.message}`);
  genres = ["Fiction"]; // Default fallback
}

// Get status - only allow selecting from predefined options
let status;
try {
  status = await customSuggester(
    statusOptions,
    "Select a status for this book",
    false // Do NOT allow adding new statuses
  );
} catch (error) {
  console.error(`Error with status selection: ${error.message}`);
  status = statusOptions[0]; // Default fallback
}

// Get current date
const pubDate = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");

// Format postSlug to include "-book-review" suffix
const formattedSlug = slug + (slug.includes("-book-review") ? "" : "-book-review");

// Rename the file using the slug
await tp.file.rename(slug);

// Add additional fields to the frontmatter
let additionalTags = await tp.system.prompt("Additional tags (comma separated)", "english");
let tags = ["bookreview"];

if (additionalTags) {
  const splitTags = additionalTags.split(",").map(tag => tag.trim()).filter(tag => tag);
  tags = tags.concat(splitTags);
}

// Store variables to be used in the frontmatter and content
tR += `---
title: "${title}"
description: 'A Book Review of "${title}"'
pubDatetime: ${pubDate}
postSlug: ${formattedSlug}
featured: false
draft: true
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
bookAuthor: ${author}
rating: 4
genre:
${genres.map(genre => `  - ${genre}`).join('\n')}
status: ${status}
---

<img src="${coverUrl}" style="height: 450px;" alt="${title} Book cover">

A Book Review of "${title}"

${author}'s "${title}" is a 

The narrative follows the lives of several characters.

- **Character Name**, description.
- **Character Name**, description.
- **Character Name**, description.

Themes covered in the book

- **Theme 1** - description.
- **Theme 2** - description.
- **Theme 3** - description.

**Key Location/Concept**

This is a key location or concept in the book. Add details about its significance and how it relates to the overall story.

**Another Key Element**

Further description of another important element, character, or concept from the book.

`;
-%>


