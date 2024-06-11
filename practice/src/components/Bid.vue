<template>
    <div class="auction-container">
        <!-- Display data from the list prop -->
        <h1 class="auction-title">Auction for {{ listdata.itemname }}</h1>
        <h1 class="auction-status">{{ (new Date(listdata.end_date) < new Date()) ? 'status off' : 'status on' }}</h1>
                <div class="auction-content">

                    <img v-if="listdata.itemimage" :src="`http://localhost:3001/${listdata.itemimage}`" alt="Item Image"
                        class="item-image" />
                    <div class="auction-details">

                        <h2>current price:{{ cp }}</h2>
                        <h2>starting price:{{ listdata.starting_price }}</h2>

                        <h2>Bid interval :{{ listdata.bid_interval }}</h2>

                        <h4 v-if="new Date(list.end_date) < new Date()">winner is{{ bids[0].name }} </h4>

                    </div>

                    <div class="bids-section">
                        <button v-if="(!(listdata.user_id == props.id) && (new Date(listdata.end_date) > new Date()))"
                            @click="placebid" class="bid-button">placebid</button>
                        <p>current bids</p>
                        <ul v-if="bids.length">
                            <li v-for="bid in bids" :key="bid._id"> {{ bid.amount }} by {{ bid.name }}...... {{
                                formattimestamp(bid.timestamp) }} </li>
                        </ul>
                        <ul v-if="!bids.length">no bid yet</ul>
                    </div>
                </div>
    </div>
</template>
<script setup>
import { onMounted, onUpdated, ref } from 'vue';
import { formatDistance, subDays } from 'date-fns'

import { defineProps } from 'vue';
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
const props = defineProps({
    list: Object,
    id: String
});
let listdata = JSON.parse(JSON.stringify(props.list));
const cp = ref(listdata.current_price);
const bids = ref([]);
const username = ref('');
function formattimestamp(timestamp = Date) {
    return formatDistance(timestamp, new Date(), { addSuffix: true })
};


const placebid = async () => {
    try {
        const response = await fetch('http://localhost:3001/User/bid', {
            method: 'POST',
            headers: { 'content-Type': 'application/json' },
            body: JSON.stringify({ amount: cp.value + listdata.bid_interval, user_id: props.id, item_id: listdata._id }),

        });

        if (response.ok) {
            const data = await response.json();

            cp.value = data.k;
            listdata.current_price = data.k;

            getbid();

        }

    }

    catch (err) {
        console.error({ message: err });
    }
};
const getbid = async () => {
    try {

        const response = await fetch(`http://localhost:3001/User/bidlist/${listdata._id}`, {
            method: 'POST',

            headers: { 'content-Type': 'application/json' },

            body: JSON.stringify({ user_id: props.id })
        }



        )
        if (response.ok) {
            const data = await response.json();

            bids.value = data.response;

        }
    }



    catch (err) {
        console.error({ message: err });

    }
};
onMounted(() => { getbid(); });

</script>
<style scoped>
.auction-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
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
    background-color: #34281627;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    align-self: flex-start;
}

.bid-button:hover {
    background-color: #25272900;
}

.bids-section {
    grid-column: 2/ 5;
    grid-row: 1/ 5;
    background-color: #e9ecef;
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
