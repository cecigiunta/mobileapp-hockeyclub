Vue.createApp({
    data() {
        return {
            url: './api.json',
            search: '',
            gameId : '',
            page: 'Home', 

            
            //registro variables
            user_register: '',
            email_register: '',
            password_register: '',
            
            //login variables
            user_login: '',
            password_login: '',
            isLogged: false,
            whiteborder : document.getElementsByClassName('white-border'),
            loginError: document.getElementsByClassName('login-error'),
            
            //usuario
            alias: '', //el nombre q voy a mostrar en la app
            usuario: null,

            results: [],
            filtered: [],
            detalle: [],
            september_games: [],
            october_games: [],
            posts: [{
                id: 1,
                user: 'Juan',
                text: 'This is the first post',
                created_at: new Date(),
                updated_at: new Date(),
                }, 
                {
                id: 2,
                user: 'Jane',
                text: 'This is the second post',
                created_at: new Date(),
                updated_at: new Date(),
                },
            ],
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
            // this.detalle = JSON.parse(localStorage.getItem('detalle')) || []
    },
    methods: {
        filtrarId(game){
            console.log(game._id);
            this.gameId = game._id
            this.detalle = this.results.filter(game => game._id === this.gameId)
            this.page = 'Game Detail'
            return this.detalle
        },
        sortedFunction(arr,prop){
            const newArr = arr.sort( (a,b) => {
                return a[prop] - b[prop]
            })
            return newArr   
        },
        //* Ya está OK :)
        register() {
            if (this.email_register != '' && this.password_register != '') {
                firebase.auth().createUserWithEmailAndPassword(this.email_register, this.password_register)
                .then((userCredential) => {
                    var user = userCredential.user;
                    console.log(user)
                    // lo que va a pasar, cuando termine de registrarse
                    this.page = 'Login'
                        this.email_register = ''
                        this.password_register = ''
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode)
                        console.log(errorMessage)
                        //MANEJAR ERROR CON ALEERTS, SWEET ALERT O ALGO MAS
                    });
                }
            },
            logIn() {
                if (this.user_login != '' && this.password_login != '') {
                    firebase.auth().signInWithEmailAndPassword(this.user_login, this.password_login)
                    .then((userCredential) => {
                        var user = userCredential.user;
                        
                        this.usuario = user
                        this.alias = this.usuario.email
                        this.isLogged = true
                        this.page = 'Home'
                        this.user_login = ''
                        this.password_login = ''
                        console.log(this.usuario);
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorCode)
                        console.log(errorMessage)
                    });
                }
            },
            logOut(){
                firebase.auth().signOut()
                this.isLogged = false
                this.page = 'Home'
                this.usuario = null
                this.alias = "Anonimo"
                console.log("Signed out");
            },
    },
    computed: {
        filtrar(){
            this.filtered = this.results.filter(game => 
                game.team1.toLowerCase().trim().includes(this.search.toLowerCase()) ||
                game.team2.toLowerCase().trim().includes(this.search.toLowerCase()) ||
                game.location.toLowerCase().trim().includes(this.search.toLowerCase()) 
            )
        },
        changeTitle(){
            document.title = `MDHL | ${this.page}` 
        },
    
        },            
}).mount('#app')

// https://github.com/firebase/quickstart-js/blob/master/database/scripts/main.jshttps://github.com/firebase/quickstart-js/blob/master/database/scripts/main.js