const API_BASE_URL = 'https://api.tvmaze.com';

let currentPage = 1;
let allShows = [];
let filteredShows = [];
let isSearchMode = false;
let searchQuery = '';
let searchTimeout = null;
let featuredShow = null;
const itemsPerPage = 20;

const elements = {
    moviesGrid: document.getElementById('moviesGrid'),
    pagination: document.getElementById('pagination'),
    searchInput: document.getElementById('searchInput'),
    sectionTitle: document.getElementById('sectionTitle'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    heroBanner: document.getElementById('heroBanner')
};

async function fetchPopularShows() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/shows`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar séries/filmes');
        }
        
        const data = await response.json();
        allShows = data.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        filteredShows = allShows;
        
        if (allShows.length > 0) {
            featuredShow = allShows[0];
            displayHeroBanner(featuredShow);
        }
        
        displayShows(currentPage);
        updatePagination();
        
        showLoading(false);
    } catch (error) {
        console.error('Erro:', error);
        showLoading(false);
        elements.moviesGrid.innerHTML = `
            <div class="no-results">
                <p>⚠️ ${error.message}</p>
            </div>
        `;
    }
}

function displayHeroBanner(show) {
    const backdropImage = show.image?.original || show.image?.medium || '';
    
    if (backdropImage) {
        elements.heroBanner.style.backgroundImage = `url(${backdropImage})`;
    }
    
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const year = show.premiered ? new Date(show.premiered).getFullYear() : 'N/A';
    const genres = show.genres && show.genres.length > 0 ? show.genres.slice(0, 3).join(' • ') : '';
    const summary = show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'Descrição não disponível.';
    
    const heroTitle = elements.heroBanner.querySelector('.hero-title');
    const heroRating = elements.heroBanner.querySelector('.hero-rating');
    const heroYear = elements.heroBanner.querySelector('.hero-year');
    const heroGenres = elements.heroBanner.querySelector('.hero-genres');
    const heroDescription = elements.heroBanner.querySelector('.hero-description');
    
    if (heroTitle) heroTitle.textContent = show.name;
    if (heroRating) heroRating.innerHTML = `⭐ ${rating}`;
    if (heroYear) heroYear.textContent = year;
    if (heroGenres) heroGenres.textContent = genres;
    if (heroDescription) heroDescription.textContent = summary;
}

async function searchShows(query) {
    try {
        showLoading(true);
        
        elements.heroBanner.style.display = 'none';
        
        const response = await fetch(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar');
        }
        
        const data = await response.json();
        filteredShows = data.map(item => item.show);
        currentPage = 1;
        
        displayShows(currentPage);
        updatePagination();
        
        showLoading(false);
    } catch (error) {
        console.error('Erro:', error);
        showLoading(false);
        elements.moviesGrid.innerHTML = `
            <div class="no-results">
                <p>⚠️ ${error.message}</p>
            </div>
        `;
    }
}

function displayShows(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const showsToDisplay = filteredShows.slice(startIndex, endIndex);

    if (!showsToDisplay || showsToDisplay.length === 0) {
        elements.moviesGrid.innerHTML = '<div class="no-results">Nenhum resultado encontrado.</div>';
        return;
    }

    elements.moviesGrid.innerHTML = showsToDisplay.map(show => {
        const posterPath = show.image?.medium || show.image?.original || 'https://via.placeholder.com/210x295/0f3460/ffffff?text=Sem+Poster';
        
        const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
        const year = show.premiered ? new Date(show.premiered).getFullYear() : 'N/A';

        return `
            <div class="movie-card" onclick="goToDetail(${show.id})">
                <img src="${posterPath}" alt="${show.name}" class="movie-poster" loading="lazy">
                <div class="movie-info">
                    <h3 class="movie-title">${show.name}</h3>
                    <div class="movie-meta">
                        <span class="movie-year">${year}</span>
                        <span class="movie-rating">⭐ ${rating}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredShows.length / itemsPerPage);
    
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ← Anterior
        </button>
    `;

    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">1</button>
        `;
        if (startPage > 2) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
    }

    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Próxima →
        </button>
    `;

    elements.pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredShows.length / itemsPerPage);
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    displayShows(currentPage);
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSearch() {
    const query = elements.searchInput.value.trim();
    
    if (query === '') {
        isSearchMode = false;
        searchQuery = '';
        elements.sectionTitle.textContent = 'Séries e Filmes Populares';
        elements.heroBanner.style.display = 'flex';
        filteredShows = allShows;
        currentPage = 1;
        displayShows(currentPage);
        updatePagination();
    } else {
        isSearchMode = true;
        searchQuery = query;
        elements.sectionTitle.textContent = `Resultados para: "${query}"`;
        searchShows(query);
    }
}

elements.searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        handleSearch();
    }, 500);
});

function goToDetail(showId) {
    window.location.href = `detail.html?id=${showId}`;
}

function playShow() {
    if (featuredShow) {
        goToDetail(featuredShow.id);
    }
}

function showMoreInfo() {
    if (featuredShow) {
        goToDetail(featuredShow.id);
    }
}

function showLoading(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
    elements.moviesGrid.style.display = show ? 'none' : 'grid';
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.changePage = changePage;
window.goToDetail = goToDetail;
window.playShow = playShow;
window.showMoreInfo = showMoreInfo;

fetchPopularShows();