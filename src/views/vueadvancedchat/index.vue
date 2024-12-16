<template>
  <chat-window
    :current-user-id="currentUserId"
    :rooms="rooms"
    :messages="messages"
    :rooms-loaded="true"
    :messages-loaded="messagesLoaded"
    @fetch-messages="fetchMessages"
    @send-message="sendMessage"
    theme="light"
    :single-room="false"
    :show-footer="true"
  />
</template>

<script>
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
// 定义一组图标
const icons = [
  "https://img.zcool.cn/community/011be85e7c4746a801216518820a5c.jpg?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100/quality,q_100",
  "https://img2.baidu.com/it/u=791571287,3993258068&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
  "https://img95.699pic.com/photo/30089/8039.jpg_wh300.jpg%21/fh/300/quality/90",
  "https://photo.16pic.com/00/86/39/16pic_8639554_b.jpg",
  "https://image.16pic.com/00/94/61/16pic_9461830_s.png",
  "https://www.16pic.com/test/image/2024_yuandan/logo.png",
  "https://static.16pic.com/static/images/user_lt2.jpg",
];

const room1 = {
  roomId: "room1",
  roomName: "Room 1",
  avatar: icons[1],
  unreadCount: 4,
  index: 3,
  lastMessage: {
    _id: "xyz",
    content: "Last message received",
    senderId: "1234",
    username: "John Doe",
    timestamp: "10:20",
    saved: true,
    distributed: false,
    seen: false,
    new: true,
  },
  users: [
    {
      _id: "user1",
      username: "用户1",
      avatar: icons[1],
      status: {
        state: "online",
        lastChanged: "today, 14:30",
      },
    },
    {
      _id: "user2",
      username: "用户2",
      avatar: icons[2],
      status: {
        state: "offline",
        lastChanged: "14 July, 20:00",
      },
    },
  ],
  typingUsers: ["user2"],
};
const room2 = {
  roomId: "room2",
  roomName: "Room 2",
  avatar: icons[4],
  unreadCount: 4,
  index: 3,
  lastMessage: {
    _id: "xyz",
    content: "Last message received",
    senderId: "1234",
    username: "John Doe",
    timestamp: "10:20",
    saved: true,
    distributed: false,
    seen: false,
    new: true,
  },
  users: [
    {
      _id: "user3",
      username: "用户3",
      avatar: icons[3],
      status: {
        state: "online",
        lastChanged: "today, 14:30",
      },
    },
    {
      _id: "user2",
      username: "用户2",
      avatar: icons[2],
      status: {
        state: "offline",
        lastChanged: "14 July, 20:00",
      },
    },
  ],
  typingUsers: ["user2"],
};
const message1 = {
  _id: 7890,
  indexId: 120921,
  content: "Message 1",
  senderId: "user1",
  username: "用户1",
  avatar: icons[1],
  date: "13 November",
  timestamp: "10:20",
  system: false,
  saved: true,
  distributed: true,
  seen: true,
  deleted: false,
  failure: true,
  disableActions: false,
  disableReactions: false,
  files: [
    {
      name: "My File",
      size: 67351,
      type: "png",
      audio: true,
      duration: 14.4,
      url: icons[4],
      preview: icons[4],
      // progress: 88,
    },
  ],
  reactions: {
    "😁": [
      "hahha", // USER_ID
      4321,
    ],
    "🥰": [1234],
  },
  replyMessage: {
    content: "Reply Message",
    senderId: 4321,
    files: [
      {
        name: "My Replied File",
        size: 67351,
        type: "png",
        audio: true,
        duration: 14.4,
        url: icons[5],
        preview: icons[5],
      },
    ],
  },
};
const message2 = {
  _id: 7890,
  indexId: 120922,
  content: "Message 2",
  senderId: "user2",
  username: "用户2",
  avatar: icons[2],
  date: "13 November",
  timestamp: "10:20",
  system: false,
  saved: true,
  distributed: true,
  seen: true,
  deleted: false,
  failure: false,
  disableActions: false,
  disableReactions: false,
  files: [
    {
      name: "My File",
      size: 67351,
      type: "png",
      audio: true,
      duration: 14.4,
      url: icons[4],
      preview: icons[4],
      // progress: 88,
    },
  ],
  reactions: {
    "😁": [
      1234, // USER_ID
      4321,
    ],
    "🥰": [1234],
  },
  replyMessage: {
    content: "Reply Message",
    senderId: 4321,
    files: [
      {
        name: "My Replied File",
        size: 67351,
        type: "png",
        audio: true,
        duration: 14.4,
        url: icons[5],
        preview: icons[5],
      },
    ],
  },
};
const message3 = {
  _id: 7890,
  indexId: 120923,
  content: "Message 3",
  senderId: "user3",
  username: "用户3",
  avatar: icons[3],
  date: "13 November",
  timestamp: "10:20",
  system: false,
  saved: true,
  distributed: true,
  seen: true,
  deleted: false,
  failure: true,
  disableActions: false,
  disableReactions: false,
};

const roomMsgMap = {
  room1: [message1, message2],
  room2: [message3, message2],
};
export default {
  name: "vue-advanced-chat",
  components: {
    ChatWindow,
  },
  data() {
    return {
      messagesLoaded: false,
      rooms: [room1, room2],
      messages: [],
      currentUserId: "user2",
    };
  },
  mounted() {
    this.getRooms()
  },
  methods: {
    getRooms() {
      this.$axios({
        method: 'get',
        url: '/xgChatServer/api/chat/rooms'
      }).then(res => {
        if(res.code === 200) {
          this.rooms = res.data;
        }
      })
    },
    fetchMessages({ room, options }) {
      options;
      this.messagesLoaded = false;
      // use timeout to imitate async server fetched data
      setTimeout(() => {
        this.messages = roomMsgMap[room.roomId];
        this.messagesLoaded = true;
      });
    },
    sendMessage({ roomId, content, files, replyMessage, usersTag }) {
      roomId, content, files, replyMessage, usersTag;
      const message4 = {
        _id: 7890,
        indexId: 120923,
        content: content,
        senderId: "user2",
        username: "用户2",
        avatar: icons[2],
        date: "13 November",
        timestamp: "10:20",
        system: false,
        saved: true,
        distributed: true,
        seen: true,
        deleted: false,
        failure: false,
        disableActions: false,
        disableReactions: false,
      };
      this.messages = [...this.messages, message4]
    },
  },
};
</script>