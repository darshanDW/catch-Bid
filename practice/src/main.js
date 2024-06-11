import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);
import router from './router';

import gAuthPlugin from 'vue3-google-oauth2';
let gauthClientId = '338987951318-2r5pk9djv0ot94nd7qc22frscn8050ve.apps.googleusercontent.com';


app.use(gAuthPlugin, {
    clientId: gauthClientId,
    scope: 'profile email',
    prompt: 'consent',
    fetch_basic_profile: true
});
app.use(router).mount('#app');

