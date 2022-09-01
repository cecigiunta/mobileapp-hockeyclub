Vue.createApp({
    data() {
        return {
            url: './api.json',
            search: '',
            results: [],
            filtered: [],
            detalle: [],
            gameId : '' 
    }
    },
    created(){
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                this.results = data;
                console.log(this.results);
            })
            .catch(err => console.error(err))
    },
    methods: {
        filtrarId: function(game){
            console.log(game._id);
            this.gameId = game._id
            this.filtered = this.results.filter(game => game._id === this.gameId)
            console.log(this.filtered);
            return this.filtered
        },    
    },
    computed: {
        filtrar: function(){
            this.filtered = this.results.filter(game => 
                game.team1.toLowerCase().includes(this.search.toLowerCase()) ||
                game.team2.toLowerCase().includes(this.search.toLowerCase()) ||
                game.location.toLowerCase().includes(this.search.toLowerCase())
                )
        },
 
        },            
}).mount('#app')