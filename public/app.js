Vue.createApp({
    data() {
        return {
            url: './api.json',
            results: [],
            filtered: [], 
    }
    },
    mounted(){
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                this.results = data;
                console.log(this.results);
            })
            .catch(err => console.error(err))
    },
    methods: {


        },            
}).mount('#app')