<template>
  <div class="grid-container">

    <div v-if="!show && lists.length" v-for="list in lists" :key="list._id" class="item-container">
      <div>
        <img v-if="list.itemimage" :src="list.itemimage" alt="Item Image"
          class="item-image" />

        <div class="item-info">
          <ul>
            <li>item name:{{ list.itemname }}</li>
            <li>current price:{{ list.current_price }}</li>

            <li>starting price:{{ list.starting_price }}</li>

            <li>end date:{{ formatDate(list.end_date) }}</li>
          </ul>
          <button @click="getlist(list)" class="bid-button">
            view bid
          </button>
          <button @click="del(list)" class="bid-button">
            delete item
          </button>

        </div>
      </div>
    </div>
    <button @click="m" v-if="!lists.length" class="create-auction-button">create auction</button>
    <Bid v-if="show" :list="selectedlist" :id="t" />
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import Bid from './Bid.vue';
import { useRoute } from 'vue-router';
import CreateAuction from './CreateAuction.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
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
const m = () => {
  router.push({ name: 'CreateAuction', params: { t } });

}
const getdata = async () => {

  try {
    const response = await fetch(`https://catch-bids-3.onrender.com/User/mybid/${t}`, {
      method: 'GET',
    })
    if (response.ok) {

      const data = await response.json();
      lists.value = data.response;
      console.log(data);
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
};


const del=async (list) =>{
  console.log(JSON.stringify(list))
  try {
    const response = await fetch(`https://catch-bids-3.onrender.com/User/del`, {
      method: 'DELETE',
      headers: { 'content-Type': 'application/json' },

         body: JSON.stringify(list)
    })
    if (response.ok) {
console.log("deleted");
getdata();
    }
    else {
      alert("no auctions get");
    }

  } catch (err) {
    console.error({ message: err })
  }
}
onMounted(() => { getdata(); })

</script>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
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
  height: 300px;
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
  background-color: #171819;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.bid-button:hover {
  background-color: #5f656b;
}
</style>
