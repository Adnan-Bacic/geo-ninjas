<template>
    <div class="view-profile container">
        <div v-if="profile" class="card">
            <h2 class="deep-purple-text center">{{ profile.alias }}'s wall</h2>
            <ul class="comments collection">
                <li v-for="(comment, index) in comments" v-bind:key="index">
                    <span class="deep-purple-text">{{ comment.from }}:</span>
                    <span class="grey-purple-text">{{ comment.content }}</span>
                </li>
                <form v-on:submit.prevent="addComment()">
                    <div class="field">
                        <label for="comment">Comment</label>
                        <input type="text" name="comment" v-model="newComment">
                        <p v-if="feedback" class="red-text center">{{ feedback }}</p>
                    </div>
                </form>
            </ul>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'ViewProfile',

    data(){
        return{
            //profile variable
            profile: null,

            //comment form
            newComment: null,
            feedback: null,

            //current logged in user
            user: null,

            //display comments
            comments: []
        }
    },

    methods:{
        addComment(){
            if(this.newComment){
                this.feedback = null;

                //db
                db.collection('comments').add({
                    to: this.$route.params.id,
                    from: this.user.alias,
                    content: this.newComment,
                    date: Date.now()

                }).then(() => {
                    this.newComment = null;
                })
            } else {
                this.feedback = 'Your must have write a comment to add it';
            }
        }
    },

    created(){
        //set db vriable
        let ref = db.collection('users')

        //get current user who will add comment
        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.user = doc.data(),
                    this.user.id = doc.id
                })
            })


        //get 1 user - this users wall
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data();
        })

        //comments
        //get where db to == current param id
        db.collection('comments').where('to', '==', this.$route.params.id)
        //onSnapShot for realtime updates
        .onSnapshot((snapshot) => {
            //every time there are changes in the db
            snapshot.docChanges().forEach(change => {
                //if the change type is "added"
                if(change.type == 'added'){
                    //inesrt into start of comment array with unshift
                    this.comments.unshift({
                        //content of the data is based on the db content
                        from: change.doc.data().from,
                        content: change.doc.data().content
                    })
                }
            })
        })
    }
}
</script>

<style scoped>
    .view-profile .card{
        padding: 20px;
        margin-top: 20px;;
    }
    .view-profile h2{
        font-size: 2em;
        margin-top: 0;
    }
    .view-profile li{
        padding: 10px;
        border-bottom: 1px  solid #eee;
    }
</style>