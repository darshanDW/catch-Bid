<template>
  <h1> Item for sale</h1>
  <div class="grid-container">
    <div v-if="!show" v-for="list in lists" :key="list._id" class="item-container">
      <div>
        <img v-if="list.itemimage" :src="`https://catch-bids-3.onrender.com/${list.itemimage}`" alt="Item Image"
          width="150" height="200" class="item-image">
        <div class="item-info">
          <ul>
            <li>Item name: {{ list.itemname }}</li>
            <li>Starting price: {{ list.starting_price }}</li>
            <li>End date: {{ formatDate(list.end_date) }}</li>
          </ul>
          <button @click="getlist(list)" class="bid-button">
            {{ (new Date(list.end_date) < new Date() || t === list.user_id[0]) ? 'View bid' : 'Place bid' }} </button>
        </div>

      </div>
    </div>
  </div>
  <Bid v-if="show" :list="selectedlist" :id="t" />
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { onUpdated } from 'vue';
import Bid from './Bid.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const lists = ref([]);
const show = ref(false);
const selectedlist = ref(null);
const h = ref(route.params.x);
const t = h.value;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
const getdata = async () => {

  try {
    const response = await fetch('https://catch-bids-3.onrender.com/User/lists', {
      method: 'GET',
    })
    if (response.ok) {

      const data = await response.json();
      lists.value = data.response;
    }
    else {
      alert("no auctions get");
    }

  } catch (err) {
    console.error({ message: err })
  }
};

const getlist = (list) => {
  selectedlist.value = list;
  show.value = true;
}
onMounted(() => { getdata(); })

</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 19px;
}

.item-container {
  border: 2px solid #eeeee9;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f6f6ed;
  display: flex;
  flex-direction: column;
}

.item-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.item-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 8px;
}

.bid-button {
  padding: 8px 16px;
  background-color: #2b2925;
  color: rgb(230, 227, 227);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.bid-button:hover {
  background-color: #3627031f;
  ;
}
</style>
