const API_BASE_URL = 'https://api.tvmaze.com';

const elements = {
    movieDetail: document.getElementById('movieDetail'),
    searchInput: document.getElementById('searchInput'),
    loadingSpinner: document.getElementById('loadingSpinner')
};

let searchTimeout = null;

async function fetchShowDetails() {
    try {
        showLoading(true);
        
        const urlParams = new URLSearchParams(window.location.search);
        const showId = urlParams.get('id');

        if (!showId) {
            throw new Error('ID não encontrado');
        }

        const [showResponse, castResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/shows/${showId}`),
            fetch(`${API_BASE_URL}/shows/${showId}/cast`)
        ]);

        if (!showResponse.ok) {
            throw new Error('Erro ao buscar detalhes');
        }

        const show = await showResponse.json();
        const cast = await castResponse.json();

        displayShowDetails(show, cast);
        
        showLoading(false);
    } catch (error) {
        console.error('Erro:', error);
        showLoading(false);
        elements.movieDetail.innerHTML = `
            <div class="no-results">
                <p>⚠️ ${error.message}</p>
            </div>
        `;
    }
}

function displayShowDetails(show, castData) {
    const posterPath = show.image?.original || show.image?.medium || 'https://via.placeholder.com/500x750/0f3460/ffffff?text=Sem+Poster';
    
    const backdropPath = show.image?.original || posterPath;

    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const releaseYear = show.premiered ? new Date(show.premiered).getFullYear() : 'N/A';
    const runtime = show.runtime ? `${show.runtime} min` : show.averageRuntime ? `${show.averageRuntime} min` : 'N/A';
    
    const cast = castData.slice(0, 12);

    const summary = show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'Sinopse não disponível.';

    document.title = `${show.name} - CineMax`;

    elements.movieDetail.innerHTML = `
        <div class="detail-hero">
            <img src="${backdropPath}" alt="${show.name}" class="detail-backdrop">
        </div>

        <div class="detail-content">
            <div>
                <img src="${posterPath}" alt="${show.name}" class="detail-poster">
            </div>

            <div class="detail-info">
                <h1>${show.name}</h1>
                
                <div class="detail-meta">
                    <div class="meta-item">
                        <span class="rating-badge">⭐ ${rating}</span>
                    </div>
                    <div class="meta-item">
                        <span>📅 ${releaseYear}</span>
                    </div>
                    <div class="meta-item">
                        <span>⏱️ ${runtime}</span>
                    </div>
                    ${show.status ? `
                        <div class="meta-item">
                            <span>📺 ${show.status}</span>
                        </div>
                    ` : ''}
                </div>

                <div class="detail-section">
                    <h2>Sinopse</h2>
                    <p class="detail-overview">${summary}</p>
                </div>

                ${show.genres && show.genres.length > 0 ? `
                    <div class="detail-section">
                        <h2>Gêneros</h2>
                        <div class="genres-list">
                            ${show.genres.map(genre => `
                                <span class="genre-tag">${genre}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${show.network ? `
                    <div class="detail-section">
                        <h2>Rede</h2>
                        <p style="color: var(--color-text-secondary);">${show.network.name} ${show.network.country ? `(${show.network.country.name})` : ''}</p>
                    </div>
                ` : ''}

                ${cast.length > 0 ? `
                    <div class="detail-section">
                        <h2>Elenco Principal</h2>
                        <div class="cast-grid">
                            ${cast.map(item => {
                                const photoPath = item.person?.image?.medium || item.person?.image?.original || 'https://via.placeholder.com/200x300/0f3460/ffffff?text=Sem+Foto';
                                
                                return `
                                    <div class="cast-member">
                                        <img src="${photoPath}" alt="${item.person?.name}" class="cast-photo" loading="lazy">
                                        <div class="cast-name">${item.person?.name || 'N/A'}</div>
                                        <div class="cast-character">${item.character?.name || 'N/A'}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

elements.searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = elements.searchInput.value.trim();
        if (query) {
            window.location.href = `index.html`;
        }
    }, 500);
});

function showLoading(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
    elements.movieDetail.style.display = show ? 'none' : 'block';
}

window.addEventListener('DOMContentLoaded', fetchShowDetails);