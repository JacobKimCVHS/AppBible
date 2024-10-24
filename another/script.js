const books = {
    "Genesis": 50,
    "Exodus": 40,
    "Leviticus": 27,
    "Numbers": 36,
    "Deuteronomy": 34,
    "Joshua": 24,
    "Judges": 21,
    "Ruth": 4,
    "1 Samuel": 31,
    "2 Samuel": 24,
    "1 Kings": 22,
    "2 Kings": 25,
    "1 Chronicles": 29,
    "2 Chronicles": 36,
    "Ezra": 10,
    "Nehemiah": 13,
    "Esther": 10,
    "Job": 42,
    "Psalms": 150,
    "Proverbs": 31,
    "Ecclesiastes": 12,
    "Song of Solomon": 8,
    "Isaiah": 66,
    "Jeremiah": 52,
    "Lamentations": 5,
    "Ezekiel": 48,
    "Daniel": 12,
    "Hosea": 14,
    "Joel": 3,
    "Amos": 9,
    "Obadiah": 1,
    "Jonah": 4,
    "Micah": 7,
    "Nahum": 3,
    "Habakkuk": 3,
    "Zephaniah": 3,
    "Haggai": 2,
    "Zechariah": 14,
    "Malachi": 4,
    "Matthew": 28,
    "Mark": 16,
    "Luke": 24,
    "John": 21,
    "Acts": 28,
    "Romans": 16,
    "1 Corinthians": 16,
    "2 Corinthians": 13,
    "Galatians": 6,
    "Ephesians": 6,
    "Philippians": 4,
    "Colossians": 4,
    "1 Thessalonians": 5,
    "2 Thessalonians": 3,
    "1 Timothy": 6,
    "2 Timothy": 4,
    "Titus": 3,
    "Philemon": 1,
    "Hebrews": 13,
    "James": 5,
    "1 Peter": 5,
    "2 Peter": 3,
    "1 John": 5,
    "2 John": 1,
    "3 John": 1,
    "Jude": 1,
    "Revelation": 22
};

// Populate the book dropdown
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const verseSelect = document.getElementById('verseSelect');

for (const book in books) {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    bookSelect.appendChild(option);
}

// Populate chapters based on selected book
bookSelect.addEventListener('change', () => {
    const selectedBook = bookSelect.value;
    chapterSelect.innerHTML = '<option value="">Select a chapter</option>'; // Reset chapter options
    verseSelect.innerHTML = '<option value="">Select a verse</option>'; // Reset verse options

    if (selectedBook) {
        for (let i = 1; i <= books[selectedBook]; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Chapter ${i}`;
            chapterSelect.appendChild(option);
        }
    }
});

// Populate verses based on selected chapter
chapterSelect.addEventListener('change', () => {
    const selectedChapter = chapterSelect.value;
    verseSelect.innerHTML = '<option value="">Select a verse</option>'; // Reset verse options

    if (selectedChapter) {
        for (let i = 1; i <= 31; i++) { // Assuming max 31 verses in a chapter for simplicity
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Verse ${i}`;
            verseSelect.appendChild(option);
        }
    }
});

// Fetch chapter text from API
async function fetchChapter(book, chapter) {
    const url = `https://bible-api.com/${book}%20${chapter}`; // Adjust URL for chapter fetching

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Check if the data contains the expected properties
        if (data && data.text) {
            document.getElementById('chapterText').innerHTML = data.text; // Display chapter text
        } else {
            document.getElementById('chapterText').textContent = 'No text available for this chapter.';
        }
    } catch (error) {
        console.error('Error fetching chapter:', error);
        document.getElementById('chapterText').textContent = 'Error loading chapter: ' + error.message;
    }
}

// Load entire chapter on button click
document.getElementById('loadChapterButton').addEventListener('click', () => {
    const selectedBook = bookSelect.value;
    const selectedChapter = chapterSelect.value;
    if (selectedBook && selectedChapter) {
        fetchChapter(selectedBook, selectedChapter); // Call fetchChapter instead of fetchVerse
    } else {
        document.getElementById('chapterText').textContent = 'Please select a book and chapter.';
    }
});

// Fetch verse text from API
async function fetchVerse(book, chapter, verse) {
    const url = `https://bible-api.com/${book}%20${chapter}:${verse}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Check if the data contains the expected properties
        if (data && data.text) {
            document.getElementById('chapterText').innerHTML = data.text;
        } else {
            document.getElementById('chapterText').textContent = 'No text available for this verse.';
        }
    } catch (error) {
        console.error('Error fetching verse:', error);
        document.getElementById('chapterText').textContent = 'Error loading verse: ' + error.message;
    }
}

// Load verse on button click
document.getElementById('loadButton').addEventListener('click', () => {
    const selectedBook = bookSelect.value;
    const selectedChapter = chapterSelect.value;
    const selectedVerse = verseSelect.value;
    if (selectedBook && selectedChapter && selectedVerse) {
        fetchVerse(selectedBook, selectedChapter, selectedVerse);
    } else {
        document.getElementById('chapterText').textContent = 'Please select a book, chapter, and verse.';
    }
});

// Show daily verse
async function showDailyVerse() {
    try {
        const response = await fetch('bibleverses.json');
        const verses = await response.json();

        // Log the raw data for debugging
        console.log("Raw daily verses data:", verses);

        if (!Array.isArray(verses) || verses.length === 0) {
            throw new Error('No verses found in the JSON file.');
        }

        const randomIndex = Math.floor(Math.random() * verses.length);
        const verse = verses[randomIndex];

        // Check if verse object is valid
        if (verse && verse.reference && verse.text) {
            document.getElementById('verseText').innerHTML = `<strong>${verse.reference}</strong>: ${verse.text}`;
        } else {
            document.getElementById('verseText').textContent = 'Verse data is not properly formatted.';
        }
    } catch (error) {
        console.error('Error fetching daily verse:', error);
        document.getElementById('verseText').textContent = 'Error loading daily verse: ' + error.message;
    }
}

// Show daily praise song
async function showDailyPraiseSong() {
    try {
        const response = await fetch('praisesongs.json');
        const songs = await response.json();

        // Log the raw data for debugging
        console.log("Raw daily songs data:", songs);

        if (!Array.isArray(songs) || songs.length === 0) {
            throw new Error('No songs found in the JSON file.');
        }

        const randomIndex = Math.floor(Math.random() * songs.length);
        const song = songs[randomIndex];

        // Check if song object is valid
        if (song && song.title && song.artist) {
            document.getElementById('songText').innerHTML = `<strong>${song.title}</strong> by ${song.artist}`;
        } else {
            document.getElementById('songText').textContent = 'Song data is not properly formatted.';
        }
    } catch (error) {
        console.error('Error fetching daily praise song:', error);
        document.getElementById('songText').textContent = 'Error loading daily praise song: ' + error.message;
    }
}

// Function to update the daily verse and praise song
async function updateDailyContent() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Check if it's 7 AM
    if (hours === 7 && minutes === 0) {
        await showDailyVerse();
        await showDailyPraiseSong();
    }
}

// Update content on page load
window.addEventListener('load', () => {
    showDailyVerse();
    showDailyPraiseSong();
});

// Optionally, set an interval to update content every minute
setInterval(updateDailyContent, 60000);
