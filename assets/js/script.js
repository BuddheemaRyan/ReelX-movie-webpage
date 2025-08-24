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
}