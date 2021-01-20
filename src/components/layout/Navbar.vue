<template>
    <div class="navbar">
        <nav class="deep-purple darken-1">
            <div class="container">
                <router-link :to="{ name: 'Gmap' }" class="brand-logo left">Geomap</router-link>
                <ul class="right">
                    <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
                    <li v-if="user"><a>{{ user.email }}</a></li>
                    <li v-if="user"><a v-on:click="logout()">Log out</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Navbar',

    data(){
        return{
            //set user variable
            user: null
        }
    },
    
    methods:{
        logout(){
            //firebase logout function
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login' })
            })
        }
    },

    created(){
        //firebase function to check if auth state changes
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                //if user logs in user is no longer null
                this.user = user
            } else {
                //if user logs out set to null again
                this.user = null
            }
        })
    }
    
}
</script>

<style scoped>

</style>