import Vue from 'vue';
import App from './App.vue';
import Decimal from './break_eternity.js';
import { format, formatWhole, formatTime } from './numberFormatting.js';
import { updateConversations } from './conversations.js';

// Load data from localStorage
const storageKey = 'VDI';
let startData = {
	categories: {
		info: {
			title: '-={info}=-',
			type: 'text',
			collapsed: false,
			channels: {
				welcome: {
					title: 'welcome',
					messages: [
					{
						timestamp: Date.now(),
						content: "Testerest",
						userId: 350057688182292482,
						first: true
					},
					{
						timestamp: Date.now(),
						content: "Testerest",
						userId: 350057688182292482,
						first: true
					}
					],
					description: ":blobwave:"
				},
			}
		},
		general: {
			title: '-={General Chatting}=-',
			type: 'text',
			collapsed: false,
			channels: {
				general: {
					title: 'general',
					description: "This is where talk about things | Be nice :)",
					ping: true
				}
			}
		},
		voice: {
			title: '-={vcs}=-',
			type: 'voice',
			collapsed: false,
			channels: {
				general: {
					title: 'General'
				}
			}
		}
	},
	activeChannel: {
		category: 'info',
		channel: 'welcome'
	},
	autosave: true,
	timePlayed: 0,
	currentTime: performance.now()
}
function fixData(data, startData) {
	for (let dataKey in startData) {
		if (startData[dataKey] == null) {
			if (data[dataKey] === undefined) {
				data[dataKey] = null;
			}
		} else if (Array.isArray(startData[dataKey])) {
			if (data[dataKey] === undefined) {
				data[dataKey] = startData[dataKey];
			} else {
				fixData(startData[dataKey], data[dataKey]);
			}
		} else if (startData[dataKey] instanceof Decimal) { // Convert to Decimal
			if (data[dataKey] == undefined) {
				data[dataKey] = startData[dataKey];
			} else {
				data[dataKey] = new Decimal(data[dataKey]);
			}
		} else if ((!!startData[dataKey]) && (typeof startData[dataKey] === "object")) {
			if (data[dataKey] == undefined || (typeof data[dataKey] !== "object")) {
				data[dataKey] = startData[dataKey];
			} else {
				fixData(startData[dataKey], data[dataKey]);
			}
		} else {
			if (data[dataKey] == undefined) {
				data[dataKey] = startData[dataKey];
			}
		}
	}
}
let loadedData = localStorage.getItem(storageKey);
if (loadedData == null) {
	loadedData = startData;
} else {
	loadedData = Object.assign({}, startData, JSON.parse(atob(loadedData)));
	fixData(loadedData, startData);
}
const store = window.player = Vue.observable(loadedData);
Vue.prototype.player = store;

// Set up auto-saving every second
window.save = function() {
	if (store.autoSave) {
		localStorage.setItem(storageKey, btoa(JSON.stringify(window.player)));
	}
}
setInterval(window.save, 1000);

// Setup Vue
Vue.filter('numberFormat', function (value) {
	return format(value);
});
Vue.filter('numberFormatWhole', function (value) {
	return formatWhole(value);
});
Vue.filter('timeFormat', function (value) {
	return formatTime(value);
});

// Start Vue
window.vue = new Vue({
	render: h => h(App)
}).$mount('#app');

// Setup game loop
function update(currTime) {
	// TODO offline time doesn't work if using performance.now()
	const delta = (currTime - store.currentTime) / 1000;

	updateConversations(delta);

	// Setup for next frame
	store.currentTime = currTime;
	requestAnimationFrame(update);
}
update(performance.now());
