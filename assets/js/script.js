console.log("Hello, JS is linked!");
class MovieApp{
    constructor(){
        this.apiKey='89d7f57b';
        this.baseUrl='https://www.omdbapi.com/';
        this.currentPage=1;
        this.currentSearch='';
        this.currentSearchType='';
        
        this.topRatedMovies=[
            'tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083',
            'tt0108052', 'tt0167260', 'tt0110912', 'tt0060196', 'tt0137523',
            'tt0120737', 'tt0109830', 'tt0080684', 'tt1375666', 'tt0167261'
        ];

        this.randomMovieKeywords=[
            'batman', 'love', 'war', 'space', 'comedy', 'horror', 'action',
            'drama', 'thriller', 'adventure', 'fantasy', 'mystery', 'crime'
        ];
        this.init();     
    }

    init(){
        this.setupEventListener();
        this.loadtopRatedMovies();
        this.setupNavigation();
    }
    setupEventListener(){
        document.getElementById('title-search-btn').addEventListener('click',() =>this.searchByTitle());
        document.getElementById('keyword-search-btn').addEventListener('click',() =>this.searchByKeyword());
        document.getElementById('imdb-search-btn').addEventListener('click',() =>this.searchByImdbId());

        document.getElementById('title-search').addEventListener('keypress',(e)=>{
            if(e.key ==='Enter')this.searchByTitle();
        });
        document.getElementById('keyword-search').addEventListener('keypress',(e) =>{
            if(e.key === 'Enter') this.searchByKeyword();
        });
        document.getElementById('imdb-search').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') this.searchByImdbId();
        });

        document.getElementById('discover-btn').addEventListener('click', () => this.discoverRandomMovie());
        document.getElementById('hero-discover-btn').addEventListener('click', () => this.discoverRandomMovie());
        document.getElementById('hero-search-btn').addEventListener('click', () => {
            document.getElementById('search').scrollIntoView({behavior: 'smooth'});
        });

        document.getElementById('close-model').addEventListener('click', () =>this.closeModel);
        document.getElementById('movie-model').addEventListener('click', (e) =>{
            if(e.target.id === 'movie-model') this.closeModel();
        });

        document.getElementById('clear-results').addEventListener('click', () => this.clearResults());
        document.getElementById('load-more-btn').addEventListener('click', () => this.loadMoreResults());
        document.getElementById('mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());

        document.addEventListener('keydown',(e) => {
            if(e.key === 'Escape') this.closeModel();
        })
    }
    
}