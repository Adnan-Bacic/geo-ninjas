<template>
    <div class="login container">
        <form v-on:submit.prevent="login()" class="card-panel">
            <h2 class="center deep-purple-text">Login</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p v-if="feedback" class="center red-text">{{ feedback }}</p>
            <div class="field">
                <button class="btn deep purple">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Login',

    data(){
        return{
            //form data
            email: null,
            password: null,

            //feedback
            feedback: null
        }
    },

    methods:{
            login(){
                if(this.email && this.password){
                    //firebase login
                    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                    .then(cred => {
                        console.log(cred.user)
                        //redirect
                        this.$router.push({ name:'Gmap' })
                    })
                    //catch errors
                    .catch(err => {
                        this.feedback = err.message;
                    })

                    //set feedback to null
                    this.feedback = null;
                } else {
                    this.feedback = 'Please fill in both email and password';
                }
            }
        }
}
</script>

<style scoped>
    .login{
        max-width: 400px;
        margin-top: 60px;
    }
    .login h2{
        font-size: 2.4em;
    }
    .login .field{
        margin-bottom: 16px;
    }
</style>