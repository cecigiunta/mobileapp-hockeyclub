Vue.createApp({
    data() {
        return {
            url: './api.json',
            search: '',
            gameId : '', 
            results: [],
            filtered: [],
            detalle: [],
            september_games: [],
            october_games: [],
    }
    },
    created(){
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                this.results = data;
                this.september_games = this.sortedFunction((this.results.filter(game => game.month_date === 9)), "day_date")
                this.october_games = this.sortedFunction((this.results.filter(game => game.month_date === 10)), "day_date")
            })
            .catch(err => console.error(err))
            this.detalle = JSON.parse(localStorage.getItem('detalle')) || []
    },
    methods: {
        filtrarId(game){
            console.log(game._id);
            this.gameId = game._id
            this.detalle = this.results.filter(game => game._id === this.gameId)
            localStorage.setItem('detalle', JSON.stringify(this.detalle));
            return this.detalle
        },
        sortedFunction(arr,prop){
            const newArr = arr.sort( (a,b) => {
                return a[prop] - b[prop]
            })
            return newArr   
        },
    },
    computed: {
        filtrar(){
            this.filtered = this.results.filter(game => 
                game.team1.toLowerCase().includes(this.search.toLowerCase()) ||
                game.team2.toLowerCase().includes(this.search.toLowerCase()) ||
                game.location.toLowerCase().includes(this.search.toLowerCase())
            )
        },
        },            
}).mount('#app')