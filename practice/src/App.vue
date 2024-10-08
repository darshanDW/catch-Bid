<template>
  <div>
    <header class="main-header">
      <nav class="nav-links" v-if="Vue3GoogleOauth.isAuthorized">
        <RouterLink :to="{ name: 'Allauction', params: { x: this.user_id } }"> Allauction </RouterLink>
        <RouterLink :to="{ name: 'CreateAuction', params: { x: this.user_id } }">CreateAuction</RouterLink>
        <RouterLink :to="{ name: 'Myauction', params: { x: this.user_id } }">Myauction</RouterLink>
      </nav>


      <div v-if="Vue3GoogleOauth.isAuthorized" class="user-info">
        <img :src="this.url" alt="User profile picture" class="profile-picture" /> <!-- Bind profilePicture properly -->

        <h1>{{ this.name }}</h1>

      </div>
      <div class="auth-buttons">

        <button @click='handleSignIn' :disabled='!Vue3GoogleOauth.isInit || Vue3GoogleOauth.isAuthorized'>Sign
          In</button>
        <button @click='handleSignOut' :disabled='!Vue3GoogleOauth.isAuthorized'>Sign out</button>
      </div>
    </header>




    <main v-if="Vue3GoogleOauth.isAuthorized">
      <RouterView></RouterView>
    </main>

  </div>


</template>


<script>
import { RouterLink, RouterView } from 'vue-router';
import { inject } from 'vue';
import { onMounted } from 'vue';

const Vue3GoogleOauth = inject('Vue3GoogleOauth');
import Allauction from './components/Allauction.vue';
import Myauction from './components/Myauction.vue';
import CreateAuction from './components/CreateAuction.vue';
import { gapi } from 'gapi-script';
import { ref } from 'vue';
export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
    Allauction,
    Myauction,
    CreateAuction,
  },
  data() {
    return {
      signin: false,
      email: '',
      user_id: '1',
      name: '',
      url: '',
      clientId: '338987951318-2r5pk9djv0ot94nd7qc22frscn8050ve.apps.googleusercontent.com',
    }
  },



  methods: {
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        console.log(googleUser)
        if (!googleUser) {
          return null;
        }
        this.name = googleUser.getBasicProfile().getName();

        this.email = googleUser.getBasicProfile().getEmail();
        this.url = googleUser.getBasicProfile().getImageUrl(); // Add this line to get the user's profile picture URL
      } catch (error) {
        console.log(error);
        return null;
      };

      await this.postdata();


    },
    async handleSignOut() {
      try {
        await this.$gAuth.signOut();
        this.email = '';
      } catch (error) {
      }
    },
    async postdata() {
      try {
        const res = await fetch("https://catch-bids-3.onrender.com/User/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, name: this.name })
        });
        if (res.ok) {
          const response = await res.json();
          
          this.user_id = response.response._id;
          console.log(this.user_id);
        }

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
onMounted(() => { console.log(this.user_id) })
</script>
<style scoped>
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
}

.user-info {
  display: flex;
  align-items: center;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info h1 {
  margin: 0;
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 20px;
  margin: 0 20px;
}

.nav-links a {
  text-decoration: none;
  color: #1c1c1d;
  font-weight: bold;
}

.nav-links a:hover {
  color: #313335;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-buttons button {
  padding: 5px 10px;
  border: none;
  background-color: #29291f;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.auth-buttons button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.auth-buttons button:hover:enabled {
  background-color: #2a333d;
}

main {
  padding: 20px;
}
</style>
