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

    setupNavigation(){
        const navLinks=document.querySelector('.nav-link');
        navLinks.forEach(link =>{
            link.addEventListener('click,', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement= document.getElementById(targetId);
                if(targetElement){
                    targetElement.scrollIntoView({behavior: 'smooth'});
                }
            });
        });
        window.addEventListener('scroll', () =>{
            let current = '';
            const sections= document.querySelector('section[id]');

            sections.forEach(section =>{
                const sectionTop= section.offsetTop-100;
                if(window.pageYOffset >= sectionTop){
                    current = section.getAttribute(' id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${current}`){
                    link.classList.add('active');
                }
            });
        });
    }

    toggleMobileMenu(){
        const mobileMenu= document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    }
    
    async searchByTitle(){
        const query= document.getElementById('title-search').value.trim();
        if(!query){
            this.showToast('please enter movie title', 'error');
            return;
        }

        this.currentSearch=query;
        this.currentSearchType='title';
        this.currentPage=1;
         await this.performSearch(query,'title');
    }
    async searchByImdbId(){
        const imdbId=document.getElementById('imdb-search').value.trim();
        if(!imdbId){
            this.showToast('please enter an IMDB ID', 'error');
            return;
        }
        this.showLoading();
        try{
            const movie= await this.fetchMovieById(imdbId);
            if(movie && movie.Response !== 'False'){
                this.showMovieDetails(movie);
            }else{
                this.showToast('Movie not found with this IMDB ID', 'error');
            }
        }catch(error){
            this.showToast('Error fetching movie details','error');
        }finally{
            this.hideLoading();
        }
    }
    async performSearch(query, type){
        this.showLoading();

        try{
            const results= await this.fetchMovies(query, this.currentPage);

            if(results && results.Response !== 'False' && results.search){
                this .displaySearchResults(results.search, `${type.charAt(0).toUpperCase() + type.slice(1)} Result for "${query}"`);

                const totalResults =parseInt(results.totalResults);
                const currentResults= this.currentPage*10;
                if(currentResults< totalResults){
                    document.getElementById('load-more-container').classList.remove('hidden');
                }else{
                    document.getElementById('load-more-container').classList.add('hidden');
                }
                this.showToast(`Found ${totalResults} result `, 'success');
            }else{
                this.showToast('No movies Found', ' error');
                this.clearResults();
            }
        }catch(error){
                this.showToast('Errow searching for movies', 'error');
                this.clearResults();
        }finally{
            this.hideLoading();
        }
    }
    async loadMoreResults(){
        if(!this.currentSearch){
            return;
        }
        this.currentPage++;
        this.showLoading();

        try{
            const results= await this.fetchMovies(this.currentSearch, this.currentPage);
             if(results && results.Response !== 'False' && results.search){
                this.appendSearchResults(results.search);
              
                const totalResults=parseInt(results.totalResults);
                const currentResults=this.currentPage*10;

                if(currentResults >= totalResults){
                    document.getElementById('load-more-container').classList.add('hidden');
                    this.showToast('No more result to load', 'warning');
                }
             }
        }catch(error){
                this.showToast('Error loading more results','error');
        }finally{
            this.hideLoading();
        }
    }

    async discoverRandomMovie(){
        const randomKeyword= this.randomMovieKeywords[Math.floor(Math.random()* this.randomMovieKeywords.length)];
        this.showLoading();

        try{
            const results= await this.fetchMovies(randomKeyword,1);
            if(results && results.Response !== 'False' && results.search && results.search.length>0){
                const randomMovie= results.search[Math.floor(Math.random()*results.search.length)];
                const movieDetails= await this.fetchMovieById(randomMovie.imdbID);

                if(movieDetails && movieDetails.Response !== 'False'){
                    this.showMovieDetails(movieDetails);
                    this.showToast('Discovered a random movie fr you!','sucsess');
                }else{
                    this.showToast('Error loading movie details', 'error');
                }
            }else{
                this.showToast('Could not discover a movie right now','error');
            }
        }catch(error){
            this.showToast('Error discovering movie right now','error');
        }finally{
            this.hideLoading();
        }
    }
    async loadtopRatedMovies(){
        const topRatedGrid = document.getElementById('top-rated-grid');
        topRatedGrid.innerHTML = this.createLoadingCards(8);

        try{
            const moviePromises = this.topRatedMovies.slice(0,8).map(id => this.fetchMovieById(id));
            const movies= await Promise.all(moviePromises);
            const validMovies = movies.filter(movie => movie && movie.Response !== 'False');

            if(validMovies.length > 0){
                topRatedGrid.innerHTML = validMovies.map(movie => this.createMovieCard(movie)).join('');
                this.attachMovieCardListeners();
            }else{
                topRatedGrid.innerHTML = '<p class="col-span-full text-center text-gray-400">Unable to load top rated movies</p>';
            }
        }catch(error){
            topRatedGrid.innerHTML= '<p class="col-span-full text-center text-gray-400">Error loading top rated movies</p>';
        }
    }

    async fetchMovies(){
        if(this.apiKey === '89d7f57b'){
            return this.getDemoSearchResults(query);
        }
        const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&page=${page}`;
        const response = await fetch(url);
        return await response.json();
    }

    async fetchMovieById(imdbId){
        if(this. apiKey === '89d7f57b'){
            return this.getDemoMovieDetails(imdbId);
        }
        const url= `${this.baseUrl}?apikey=${this.apiKey}&i=${imdbId}&plot=full`;
        const respone= await ferch(url);
        return await respone.json();
    }

}