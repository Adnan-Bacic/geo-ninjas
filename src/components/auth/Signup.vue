<template>
    <div class="signup container">
        <form v-on:submit.prevent="signUp()" class="card-panel">
            <h2 class="center deep-purple-text">Signup</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input type="password" name="password" v-model="password">
            </div>
            <div class="field">
                <label for="alias">Alias</label>
                <input type="text" name="alias" v-model="alias">
            </div>
            <p v-if="feedback" class="red-text center">{{ feedback }}</p>
            <div class="field center">
                <button class="btn deep-purple">Signup</button>
            </div>
        </form>
    </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'

export default {
    name: 'Signup',

    data(){
        return{
            //input data
            email: null,
            password: null,
            alias: null,

            //giving the user feedback
            feedback: null,

            //slug value
            slug: null
        }
    },

    methods:{
        signUp(){
            if(this.alias && this.email && this.password){
                //slugify the alias.
                this.slug = slugify(this.alias, {
                    //remove the unwanted characters with the replacements. set it to lowercase aswell
                    replacement: '-',
                    remove: /[$*_+~,()'"!\:@]/g, //we removed "-" from the remove
                    lower: true
                })
                //look into users collection for the slug
                //let ref = db.collection('users').doc(this.slug)

                let checkAlias = firebase.functions().httpsCallable("checkAlias")
                checkAlias({ slug: this.slug })
                .then(result => {
                    console.log(result)
                //})

                //ref.get().then(doc => {
                    
                    //if(doc.exists){
                    if(!result.data.unique){
                        this.feedback = 'This alias already exists';
                    } else {
                        //this.feedback = 'This alias is free to use';
                        //firebase auth function and firebase createuser function
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)

                        //firebase credentials
                        .then(cred => {
                            //set is like add to insert data into the datanase
                            //ref.set({
                            db.collection("users").doc(this.slug).set({
                                //database data
                                alias: this.alias,
                                geolocation: null,
                                user_id: cred.user.uid
                            })
                            //at this point the user is added to the auth and database
                        }).then(() => {
                            //redirect
                            this.$router.push({ name: 'Gmap' })
                        })

                        .catch(err => {
                            console.log(err);
                            this.feedback = err.message
                        })
                    }
                    
                })
                console.log(this.slug);
            } else {
                this.feedback = 'Your must enter all fields';
            }
        }
    }
}
</script>

<style scoped>
    .signup{
        max-width: 400px;
        margin-top: 60px;
    }
    .signup h2{
        font-size: 2.4em;
    }
    .signup .field{
        margin-bottom: 16px;
    }
</style>