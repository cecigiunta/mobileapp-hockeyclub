const app = Vue.createApp({
    data() {
        return {
            url: './api.json',
            search: '',
            gameId : '',
            page: 'Games', 
            
            //register variables
            username_register: '',
            email_register: '',
            password_register: '',
            password_regEx : new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"), //un digito, una minuscula, una mayuscula, 8 caracteres minimo 
            confirm_password: '',

            //login variables
            user_login: '',
            password_login: '',
            isLogged: false,
            errorMessage: '',
            whiteborder : document.getElementsByClassName('white-border'),
            loginError: document.getElementsByClassName('login-error'),

            //user variables
            alias: '',
            usuario: null,

            //comment variables
            divComment: document.getElementsByClassName('comment-dnone'),
            comment: '',
            posts: [],
            filteredPost: [],
            

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
            // this.detalle = JSON.parse(localStorage.getItem('detalle')) || []
    },
    mounted(){
        const comentariosdb = firebase.database().ref('/comentarios')
        comentariosdb.on('child_added', (data) =>{
            getComments(data)
        })
    },
    methods: {
        register() {
            if (this.email_register != '' && this.password_register != '' && this.validatePassword && this.confirmPassword) {
                firebase.auth().createUserWithEmailAndPassword(this.email_register, this.password_register)
                .then((userCredential) => {
                    var user = userCredential.user;
                    this.alias = this.username_register
                    this.page = 'Login'
                    this.email_register = ''
                    this.password_register = ''
                    this.username_register = ''
                    this.confirm_password = ''
                    this.errorMessage = ''
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)

                    if(errorCode === 'auth/invalid-email'){
                        this.errorMessage = 'Invalid email'
                    }
                    if(!loginError[0].classList.contains('d-none')){
                        this.errorMessage = ''
                    }
                });
            }          
            else {
                for(let i = 0; i < this.whiteborder.length; i++) {
                    this.whiteborder[i].classList.add('red-border');
                }
                this.loginError[0].classList.remove('d-none')
                this.errorMessage = ''
            }
        },
        validatePassword(){
            console.log(this.password_register);
            if(!this.password_regEx.test(this.password_register)){
                this.errorMessage = 'Password has to contain: one uppercase, one lowercase, one digit and 8 characters '
            }
            else {
                this.errorMessage = 'Password ok'
            } 
        },
        confirmPassword(){
            if(this.validatePassword){
                if(this.password_register === this.confirm_password){
                    this.errorMessage = 'Passwords match ✔'
                } else{ 
                    console.log(this.errorMessage);
                    this.errorMessage = 'Passwords do not match.'
                }
            }
        },
        logIn() {
            if (this.user_login != '' && this.password_login != '') {
                firebase.auth().signInWithEmailAndPassword(this.user_login, this.password_login)
                .then((userCredential) => {
                    var user = userCredential.user;
                    this.usuario = user
                    this.isLogged = true
                    this.page = 'Home'
                    this.user_login = ''
                    this.password_login = ''
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)
                    
                    if(errorCode === 'auth/wrong-password'){
                        this.errorMessage = 'The password is incorrect'
                    }
                    if(errorCode === 'auth/user-not-found'){
                        this.errorMessage = 'Email is not registered'
                    }
                    if(errorCode === 'auth/invalid-email'){
                        this.errorMessage = 'Email is not valid'
                    }
                });
            } else {
                for(let i = 0; i < this.whiteborder.length; i++) {
                    this.whiteborder[i].classList.add('red-border');
                }
                this.loginError[0].classList.remove('d-none')
                this.errorMessage = ''
            }
        },
        registerGoogle(){
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                let token = credential.accessToken
                let user = result.user
                this.page = 'Login'
            })
            .catch((error) => {
                let errorCode = error.code
                let errorMessage = error.message
                let email = error.email
                let credential = error.credential
            })
        },
        logInWithGoogle(){
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /**@type {firebase.auth.OAuthCredential} */
                var credential = result.credential

                var token = credential.accessToken
                var user = result.user
                this.usuario = user
                this.page = 'Home'
                this.isLogged = true
                this.alias = this.usuario.displayName
            })
            .catch((error) => {
                var errorCode = error.code
                var errorMessage = error.message
                var email = error.email
                var credential = error.credential
            })
        },
        logOut(){
            firebase.auth().signOut()
            this.isLogged = false
            this.page = 'Home'
            this.usuario = null
            this.alias = ''
        },
        removeRedBorder(){
            for(let i = 0; i < this.whiteborder.length; i++) {
                this.whiteborder[i].classList.remove('red-border');
            }
            this.loginError[0].classList.add('d-none')
        },
        crearComentario(juego){
            console.log(juego);
            let gameComment = {
                gameId: juego._id,
                usuario: this.usuario.displayName ? this.usuario.displayName : this.usuario.email,
                comment: this.comment,
            }
            let newComment = firebase.database().ref().child('comentarios').push().key
            var updates = {}
            updates['/comentarios/' + newComment] = gameComment
            firebase.database().ref().update(updates)

            this.comment = ''
            this.posts = []

            const comentariosdb = firebase.database().ref('/comentarios')
            comentariosdb.on('child_added', (data) =>{
                getComments(data)
            })
            this.filteredPost = this.posts.filter(ele => ele.gameId === juego._id)
            this.comment = ''
        },
        seeDetail(game){
            console.log(game._id);
            this.gameId = game._id
            this.detalle = this.results.filter(game => game._id === this.gameId)
            this.page = 'Game Detail'
            this.posts = []
            
            const comentariosdb = firebase.database().ref('/comentarios')
            comentariosdb.on('child_added', (data) =>{
                getComments(data)
            })
            this.filteredPost = this.posts.filter(ele => ele.gameId === game._id)
            this.comment = ''

            return this.detalle
        },
        sortedFunction(arr,prop){
            const newArr = arr.sort( (a,b) => {
                return a[prop] - b[prop]
            })
            return newArr   
        },
        addNewPost(){
            this.divComment[0].classList.remove('d-none')
        }
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
        persistirSesion(){
            firebase.auth().onAuthStateChanged((user) => {
                if(user){
                    console.log(user);
                    var uid = user.uid
                    this.usuario = user 
                    this.isLogged = true
                    this.page = 'Home'
                    this.user_login = ''
                    this.password_login = ''
                }else{
                    this.isLogged = false
                    this.page = 'Home'
                    this.usuario = null
                    this.alias = ""
                }              
            })
        } 
        },            
}).mount('#app')

const getComments = (data) => {
    let gameComment = {
        gameId: data.val().gameId,
        usuario : data.val().usuario,
        comment: data.val().comment
    }
    app.posts.push(gameComment)
}