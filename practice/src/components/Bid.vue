<template>
    <div class="auction-container">
        <!-- Display data from the list prop -->
        <h1 class="auction-title">Auction for {{ listdata.itemname }}</h1>
        <h1 class="auction-status">{{ (new Date(listdata.end_date) < new Date()) ? 'status off' : 'status on' }}</h1>
        <div class="auction-content">
            <img v-if="listdata.itemimage" :src="listdata.itemimage" alt="Item Image" class="item-image" />
            <div class="auction-details">
                <h2>current price: {{ cp }}</h2>
                <h2>starting price: {{ listdata.starting_price }}</h2>
                <h2>Bid interval: {{ listdata.bid_interval }}</h2>
                <h4 v-if="new Date(listdata.end_date) < new Date()">winner is {{ bids[0]?.name }}</h4>
            </div>
            <div class="bids-section">
                <button v-if="(!(listdata.user_id === id) && (new Date(listdata.end_date) > new Date()))"
                        @click="placebid" class="bid-button">placebid</button>
                <p>current bids</p>
                <ul v-if="bids.length">
                    <li v-for="bid in bids" :key="bid._id">{{ bid.amount }} by {{ bid.name }}...... {{ formattimestamp(bid.timestamp) }}</li>
                </ul>
                <ul v-if="!bids.length">no bid yet</ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { formatDistance } from 'date-fns';
import { io } from 'socket.io-client';

const socket = io("https://catch-bids-3.onrender.com");

import { defineProps } from 'vue';
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

const props = defineProps({
    list: Object,
    id: String
});

let listdata = ref(JSON.parse(JSON.stringify(props.list)));
const cp = ref(listdata.value.current_price);
const bids = ref([]);
const username = ref('');

function formattimestamp(timestamp) {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
};

const placebid = async () => {
    try {
        socket.emit('bid', JSON.stringify({ amount: cp.value + listdata.value.bid_interval, user_id: props.id, item_id: listdata.value._id }));
    } catch (err) {
        console.error({ message: err });
    }
};

const getbid = () => {
    try {
        socket.emit('Message', { user_id: props.id, item_id: listdata.value._id });
    } catch (err) {
        console.error({ message: err });
    }
};

socket.on('getbid', (data) => {
    listdata.value.current_price = data.k;
    cp.value = data.k;
    getbid();
});

socket.on('bids_retrieved', (data) => {
    bids.value = data.bids;
    cp.value = bids.value[0]?.amount;
});

onMounted(() => {
    socket.emit('join_room', { item_id: listdata.value._id });
    getbid();
    socket.on('bids_retrieved', (data) => {
    bids.value = data.bids;
    cp.value = bids.value[0]?.amount;
});
});

onUnmounted(() => {
    socket.off('getbid');
    socket.off('bids_retrieved');
});

watch(() => props.list, (newList) => {
    listdata.value = JSON.parse(JSON.stringify(newList));
    cp.value = listdata.value.current_price;
    getbid();
}, { immediate: true });
</script>
<style scoped>
.auction-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #dadad4;
    height: calc(800px + 20%);
    /* Ensures the height is greater than the width */
}

.auction-title {
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
}

.auction-status {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
    color: #2e9c4d;
}

.auction-content {
    display: grid;
    grid-template-columns: 3fr 4fr;
    grid-template-rows: auto auto;
    gap: 20px;
}

.item-image {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    width: 100%;
    height: auto;
    /* Ensures the aspect ratio is maintained */
    border-radius: 10px;
    aspect-ratio: 4 / 5;
    /* Ensures the height is greater than the width */
}

.auction-details {
    grid-column: 1;
    grid-row: 2;
    text-align: center;
}

.auction-details h2,
.auction-details h3,
.auction-details h4 {
    margin: 10px 0;
}

.bid-button {
    padding: 10px 20px;
    background-color: #08050027;
    color: rgb(25, 25, 1);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    align-self: flex-start;
}

.bid-button:hover {
    background-color: #eceae5;
}

.bids-section {
    grid-column: 2 / 5;
    grid-row: 1 / 5;
    background-color: #ebeae1;
    padding: 20px;
    border-radius: 8px;
}

.bids-section p {
    font-weight: bold;
    margin-bottom: 10px;
}

.bids-section ul {
    list-style-type: none;
    padding: 0;
}

.bids-section li {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
}
</style>
