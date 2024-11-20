<template>
  <div class="form-container">
    <h1>post an item</h1>
    <form @submit.prevent="uploadFile" class="upload-form">
      <input type="string" placeholder="name of item" v-model="itemname" class="form-input"></input><br />
      <input type="number" placeholder="starting price" v-model="starting_price" class="form-input"></input><br />
      <input type="Date" placeholder=" Pick  end date" name="end date" v-model="end_date" class="form-input"></input><br />

      <input type="file" @change="onFileChange" class="form-input" />
      <button type="submit" class="submit-button">Upload</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const h = ref(route.params.x);
const user_id = h.value;
import { ref, inject, watch } from 'vue';
const itemname = ref('');
const starting_price = ref(0);
const end_date = ref('');
const file = ref(null);
const message = ref('');
const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const uploadFile = async () => {
  if (!file.value) {
    message.value = 'No file selected';
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file.value);
  formData.append('itemname', itemname.value);
  formData.append('starting_price', starting_price.value);
  formData.append('end_date', end_date.value);
  formData.append('user_id', user_id);
  try {
    const response = await fetch('https://catch-bids-3.onrender.com/uploads', {
      method: 'POST',
      mode:'cors',
      headers:{'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'      
       

      },
      body: formData,
     
    });
    const data = await response.json();

    if (response.ok) {
      message.value = 'File uploaded successfully';
      router.push({ name: 'Allauction', params: { user_id } });

    } else {
      message.value = 'File upload failed';
    }
  } catch (error) {
    message.value = 'Error uploading file';
  }
};
</script>
<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.upload-form {
  display: flex;
  flex-direction: column;
}

.form-input {
  margin-bottom: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 16px;
  background-color: #242102;
  color: rgb(180, 179, 174);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
