import { get,post, put, del } from "./requester.js";

// import {get, put, post, del } from './requester.js'
(()=>{
    const app = Sammy('#rooter', function () {

        this.use('Handlebars', 'hbs')
    
        this.get('/', function (ctx) {
            debugger
            setHeaderInfo(ctx);
debugger
            if(ctx.isAuth){

                get('appdata', 'recipes', 'Kinvey')
                .then((recipes) => {
                    ctx.recipes = recipes;
                    console.log(recipes)
                    this.loadPartials(getPartials()).partial('./views/recipe/home.hbs')

                })

            }else{
                this.loadPartials(getPartials()).partial('./views/recipe/home.hbs')

            }
            
        });
    
        this.get('/register', function (ctx) {
            debugger
            this.loadPartials(getPartials()).partial('./views/auth/register.hbs')
            
        });
    
        this.post('/register', function (ctx) {
            debugger
            const{firstName, lastName, username, password, repeatPassword} = ctx.params;
    
            if(firstName && lastName && username && password === repeatPassword){
                post('user', '', {firstName, lastName, username, password}, 'Basic')
                .then((userInfo) => {
                    saveAuthInfo(userInfo);
                    ctx.redirect('#/');
                }).catch(console.error)
            }        
        });
    
        this.get('/login', function (ctx) {
            this.loadPartials(getPartials()).partial('./views/auth/login.hbs')
            
        });

        this.post('/login', function (ctx) {
           
            const {username, password} = ctx.params;

            if(username && password){
                post('user', 'login', {username, password}, 'Basic')
                .then((userInfo) => {
                    saveAuthInfo(userInfo);
                    ctx.redirect('/');
                }).catch(console.error)
            }
            
        });

        this.get('/logout', function (ctx) {

            debugger
            post('user', '_logout', {}, 'Kinvey')
            .then(() => {
                sessionStorage.clear();
                ctx.redirect('/');
            })
        });
    
        function saveAuthInfo(userInfo) {
            sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
            sessionStorage.setItem('fullName', userInfo.firstName + ' '+userInfo.lastName);
        }
        function setHeaderInfo(ctx) {
            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.fullName = sessionStorage.getItem('fullName');
        }
        function getPartials() {        
            return{
                header: './views/common/header.hbs',
                footer: './views/common/footer.hbs'
            }
        };
        
    });
    app.run('');
})()
