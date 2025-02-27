<template>
<div class="users-list" v-if="showList">
    <RecycleScroller :items="player.sortedUsers" :item-size="48" style="height: 100%;" :buffer="300 + offset">
        <template #before>
            <div ref="nonvirtual">
                <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
                <div v-for="(role, roleID) in player.roles" :key="roleID" v-if="role.length > 0">
                    <div class="role-header">
                        <p>{{ roles[roleID].title }} &#8212; {{ role.length }}</p>
                    </div>
                    <div v-for="user in role" :key="user" :status="heros[user]?heros[user].status:'DND'" class="user" v-on:click="openProfile(user)">
                        <div class="user-inner">
                            <div class="avatar">
                                <img class="pfp" :src="heros[user]?heros[user].profileImage:'avatars/1d9c0858378994d85440c0cd30d6fc57.png'" :alt="heros[user]?heros[user].username:''">
                                <div class="status"></div>
                            </div>
                            <div class="user-text">
                                <p class="name" :style="{ color: heros[user]?heros[user].color:'#009696' }">{{ heros[user]?heros[user].username:'Ok' }}</p>
                                <p class="desc" v-if="heros[user]&&heros[user].playing != null">Playing <strong>{{ heros[user]?heros[user].playing:'Meta Studio Incremental' }}</strong></p>
                                <p class="desc" v-else-if="heros[user]&&heros[user].customStatus != null">{{ heros[user]?heros[user].customStatus:'' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="role-header">
                    <p>MEMBERS &#8212; {{ player.sortedUsers.length }}</p>
                </div>
            </div>
        </template>
        <template v-slot="{ item }">
            <div status="Online" class="user" v-on:click="openProfile(item)">
                <div class="user-inner">
                    <div class="avatar">
                        <div class="pfp fa fa-user" :style="{ backgroundColor: pickColor(item) }"></div>
                        <div class="status"></div>
                    </div>
                    <div class="user-text">
                        <p class="name">{{ item }}</p>
                    </div>
                </div>
            </div>
        </template>
    </RecycleScroller>
</div>
</template>

<script>
import { heros, roles } from '../userdata.js';

export default {
    name: 'members-list',
    data() {
        return {
            heros,
            roles,
            offset: 0,
            observer: new ResizeObserver(entries => {
                this.offset = entries[0].contentRect.height;
            })
        }
    },
    computed: {
        showList() {
            return this.player.activeChannel.category !== 'DMs';
        }
    },
    mounted() {
        if (this.showList) {
            this.$nextTick(() => {
                this.observer.observe(this.$refs.nonvirtual);
            });
        }
    },
    watch: {
        showList() {
            if (this.showList) {
                this.$nextTick(() => {
                    this.observer.observe(this.$refs.nonvirtual);
                });
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        openProfile(/*userID*/) {

        },
        pickColor(str) {
            let hash = 0;
              for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
              }
            return `hsl(${hash % 360}, 100%, 80%)`;
        }
    }
}
</script>

<style>
.users-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: var(--background-secondary);
    height: calc(100vh - 1em);
    overflow-y: auto;
    padding-bottom: 1em;
}

.role-header {
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 2em;
    font-size: 0.7em;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.role-header > p {
    text-transform: uppercase;
    color: var(--channels-default);
}

.user {
    --avatar-size: 2em;
    --circle-size: 0.6em;

    margin-top: 0.1em;
    padding: 0.5em 0.2em;
    margin-bottom: 0.1em;
    height: var(--avatar-size);
}

.user.selected > .user-inner {
    background-color: var(--background-modifier-selected);
    cursor: auto;
}

.user.selected > .user-inner > p {
    color: var(--interactive-active);
}

.user-inner {
    padding: 0.25em;
    border-radius: 0.25em;
    margin-left: 0.5em;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    height: 100%;
    cursor: pointer;
}

.user-inner:hover {
    background-color: var(--background-modifier-hover);
}

.user-inner > .avatar {
    height: 100%;
    position: relative;
}

.user-inner > .avatar > .pfp {
    height: 100%;
    width: calc(var(--avatar-size) / 1.75);
    border-radius: 50%;
    margin-right: 0.285em;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-size: 1.75em;
    color: var(--color-default-pfp);
}

.user-inner > .avatar > .status {
    position: absolute;

    width: var(--circle-size);
    height: var(--circle-size);

    border-radius: calc(0.9 * var(--circle-size));

    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary);

    top: calc(var(--avatar-size) - 1.4 * var(--circle-size));
    left: calc(var(--avatar-size) - 1.4 * var(--circle-size));
}

.user-inner:hover > .avatar > .status {
    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary-modifier-hover);
}

.user.selected > .user-inner > .avatar > .status {
    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary-modifier-selected);
}

.user-inner .user-text {
    overflow: hidden;
    white-space: nowrap;
}

.user-inner .name, .user-inner .desc {
    overflow: hidden;
    text-overflow: ellipsis;
}
.user-inner .desc {
    color: var(--channels-default);
    font-size: 0.75em;
}

.user[status="Online"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-online);
}

.user[status="DND"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-dnd);
}

.user[status="Offline"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-offline);
}

.user[status="Idle"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-idle);
}
</style>
