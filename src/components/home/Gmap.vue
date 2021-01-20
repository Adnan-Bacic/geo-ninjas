<template>
    <div class="map">
        <!--div for map-->
        <div class="google-map" id="map"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Gmap',

    data(){
        return{
            //setting lattitude and longittude
            lat: 53,
            lng: -2
        }
    },

    methods:{
        renderMap(){
            //map const
            const map = new google.maps.Map(document.getElementById('map'),{
                //where the map is gonna be centered
                center: {
                    lat: this.lat,
                    lng: this.lng
                },
                //initial zoom of the map. min and max zoom.
                zoom: 6,
                maxZoom: 15,
                minZoom: 3,
                //disable yellow man google maps can set down
                streetViewControl: false
            })

            //get the users
            db.collection('users').get().then(users => {
                //loop through every user
                users.docs.forEach(doc => {
                    //bind data to variable
                    let data = doc.data()
                    //check if they have a geo location
                    if(data.geolocation){
                        //new google marker
                        let marker = new google.maps.Marker({
                            //define positions based on db info
                            position:{
                                lat: data.geolocation.lat,
                                lng: data.geolocation.lng
                            },
                            map: map
                        })
                        //add click event to marker
                        marker.addListener('click', () => {
                            //shows name
                            //console.log(doc.id)
                            this.$router.push({ name: 'ViewProfile', params: { id: doc.id }})
                        })
                    }
                })
            })

        }
    },

    //we must create the map in the mounted(). wont work in created(). mounted() is when the dom has been mounted
    mounted(){
        //get the current user
        let user = firebase.auth().currentUser;
        console.log(user);

        //check if geo location exists in the users browser
        if(navigator.geolocation){
            //get the users current position
            navigator.geolocation.getCurrentPosition(position => {
                //insert lat and long into our lat and lng.
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude

                //find the user record and then update geo cords
                db.collection('users').where('user_id', '==', user.uid).get()
                .then(snapshot => {
                    snapshot.forEach((doc => {
                        console.log(doc.id)
                        //update users
                        db.collection('users').doc(doc.id).update({
                            geolocation:{
                                //update lat and lng based on user position coord
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        })
                    }))
                }).then(() => {
                    this.renderMap();
                })

                this.renderMap();
            }), (err) => {
                console.log(err);
                this.renderMap();
                //check if there is a cached geoloaction
            }, { maximumAge: 60000, timeout: 3000 }
        } else {
            //position center by default values
            this.renderMap();
        }
        //call renderMap function
        //this.renderMap()

        //show current user. shows null if not logged in
        //console.log(firebase.auth().currentUser)
    }
}
</script>

<style scoped>
    .google-map{
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>