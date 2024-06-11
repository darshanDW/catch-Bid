/*<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div>
    <button @click='handleSignIn' :disabled='!Vue3GoogleOauth.isInit || Vue3GoogleOauth.isAuthorized'>Sign In</button>
    <button @click='handleSignOut' :disabled='!Vue3GoogleOauth.isAuthorized'>Sign out</button>

    <header v-if="Vue3GoogleOauth.isAuthorized">

      <RouterLink :to="{ name: 'Allauction',params:{x:this.user_id}}"> Allauction </RouterLink>
      <RouterLink :to="{ name: 'CreateAuction' ,params:{x:this.user_id}}"> CreateAuction </RouterLink>
      <RouterLink :to="{ name: 'Myauction' }">Myauction</RouterLink>
 
   


      <RouterView></RouterView>
    </header>
 
  </div>
  

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { inject } from 'vue';

//<HelloWorld v-if="!Vue3GoogleOauth.isAuthorized" />
// Inject the Vue3GoogleOauth service
const Vue3GoogleOauth = inject('Vue3GoogleOauth');
import Allauction from './components/Allauction.vue';
import Myauction from './components/Myauction.vue';
import CreateAuction from './components/CreateAuction.vue';
import { gapi } from 'gapi-script';
export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
    Allauction,
    Myauction,
    CreateAuction,
    HelloWorld
  },
  data() {
    return {
      signin: false,
      email: '',
      user_id:null,
      clientId: '338987951318-2r5pk9djv0ot94nd7qc22frscn8050ve.apps.googleusercontent.com',
    }
  },



  methods: {
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        console.log(googleUser);
        if (!googleUser) {
          return null;
        }
        this.email = googleUser.getBasicProfile().getEmail();
        console.log(this.email);
      } catch (error) {
        console.log(error);
        return null;
      }
this.postdata();
    },
    async handleSignOut() {
      try {
        await this.$gAuth.signOut();
        this.email = '';
      } catch (error) {
        console.log(error);
      }
    },
    async postdata() {
      try {
        const res = await fetch("http://localhost:3001/User/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email })
        });
        const response = await res.json();
        console.log(response);
        this.user_id = response.response._id;

       console.log(this.user_id);
      } catch (error) {
        console.error("Post data error:", error);
      }
    },
    initializeGapi() {
      const start = () => {
        gapi.client.init({
          clientId: this.clientId,
          scope: "",
        });
      };
      gapi.load("client:auth2", start);
    }
  },

  setup() {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return {
      Vue3GoogleOauth
    };
  }

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


app.post('/profile', upload.single('avatar'), async function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    try {
        const link = req.file.path;
        console.log(req.file.path);


        console.log(req.body);
        const {user_id,end_date,itemname,starting_price,} = req.body;
        


        if (!data) {
            return res.status(400).json({ error });
        }
        const response = await new Items({user_id:user_id,itemname:itemname,itemimage:link,starting_price:starting_price,end_date:end_date}).save();
      
        console.log(response);
        //response.itemimage=link;
        // const Res = await Items({ user_id: user_id, itemimage: link, }).save();
        // console.log(Res);
        res.status(200).json({ response: response });


    } catch (err) {
        return res.status(500).json({ msg: "internal problem" })

    }



    <template>
  <div>
    <header class="main-header">
      <div class="auth-buttons">

    <button @click='handleSignIn' :disabled='!Vue3GoogleOauth.isInit || Vue3GoogleOauth.isAuthorized'>Sign In</button>
    <button @click='handleSignOut' :disabled='!Vue3GoogleOauth.isAuthorized'>Sign out</button>
  </div>

  <div v-if="Vue3GoogleOauth.isAuthorized" class="user-info">
    <h1>{{ this.name }}</h1>
<img :src="this.url" alt="User profile picture" class="profile-picture"/> <!-- Bind profilePicture properly -->
<nav class="nav-links">
<RouterLink    :to="{ name: 'Allauction',params: {x:this.user_id }}"> Allauction </RouterLink>
      <RouterLink :to="{ name: 'CreateAuction', params: {x:this.user_id } }">CreateAuction</RouterLink>
      <RouterLink :to="{ name: 'Myauction',params:{ x:this.user_id }} ">Myauction</RouterLink>
    </nav>
</div>
  </header>




    <main>
      <RouterView></RouterView>
    </main>

          </div>


</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import { inject } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { onMounted } from 'vue';
//<HelloWorld v-if="!Vue3GoogleOauth.isAuthorized" />
// Inject the Vue3GoogleOauth service
const Vue3GoogleOauth = inject('Vue3GoogleOauth');
import Allauction from './components/Allauction.vue';
import Myauction from './components/Myauction.vue';
import CreateAuction from './components/CreateAuction.vue';
import { gapi } from 'gapi-script';
export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
    Allauction,
    Myauction,
    CreateAuction,
    HelloWorld
  },
  data() {
    return {
      signin: false,
      email: '',
      user_id: null,
      name:'',
   url:'',
      clientId: '338987951318-2r5pk9djv0ot94nd7qc22frscn8050ve.apps.googleusercontent.com',
    }
  },



  methods: {
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        if (!googleUser) {
          return null;
        }
        this.name=googleUser.getBasicProfile().getName();

        this.email = googleUser.getBasicProfile().getEmail();
        console.log(this.email);
        this.url= googleUser.getBasicProfile().getImageUrl(); // Add this line to get the user's profile picture URL
      } catch (error) {
        console.log(error);
        return null;
      };
      console.log(this.user_id);
      
     await  this.postdata();
      console.log(this.user_id);


    },
    async handleSignOut() {
      try {
        await this.$gAuth.signOut();
        this.email = '';
      } catch (error) {
        console.log(error);
      }
    },
    async postdata() {
      try {
        const res = await fetch("http://localhost:3001/User/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email,name:this.name })
        });
        const response = await res.json();
        console.log(response);
  console.log(this.name);
        this.user_id = response.response._id;

        console.log(this.user_id);
      } catch (error) {
        console.error("Post data error:", error);
      }
    },
    initializeGapi() {
      const start = () => {
        gapi.client.init({
          clientId: this.clientId,
          scope: "",
        });
      };
      gapi.load("client:auth2", start);
    }
  },

  setup() {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');

    return {
      Vue3GoogleOauth
    };
  }

};
onMounted(()=>{console.log(this.user_id)})
</script>
<style scoped>
.main-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.auth-buttons button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.auth-buttons button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.auth-buttons button:hover:enabled {
  background-color: #03080c;
}

.user-info {
  text-align: center;
}

.user-info h1 {
  margin: 10px 0;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.nav-links a:hover {
  color: #0056b3;
}

main {
  padding: 20px;
}
</style>

});

----------------------------------
<template>
    <div>
        <!-- Display data from the list prop -->
        <h1>auction for{{ listdata.itemname }}</h1>
        <h2 >{{ (new Date(listdata.end_date) < new Date()) ? 'status off' : 'status on' }}</h2>
        <img v-if="listdata.itemimage" :src="`http://localhost:3001/${listdata.itemimage}`" alt="Item Image" />
        <h3>{{ cp }}</h3>
        <h2>{{ listdata.starting_price }}</h2>  

        <h4>{{ listdata.bid_interval }}</h4>
        <button v-if="!(listdata.user_id===props.id&&new Date(list.end_date) < new Date())"  @click="placebid">placebid</button>
        <h4 v-if="new Date(list.end_date) < new Date()">winner is{{ bids[0].name }} </h4>

        <!-- Additional components or content for the Bid component -->
    </div>
<div> 
    <p>current bids</p>   <ul v-if="bids.length">
            <li v-for="bid in bids" :key="bid._id"> {{bid.amount}} by {{ bid.name }}......   {{ formattimestamp(bid.timestamp) }} </li>
        </ul>
        <ul v-else></ul>no bid yet</div>
</template>

*/