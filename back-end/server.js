const express = require("express");
const mysql = require("mysql");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db_config = require("./config/db_config.json");
const app = express();
const cors = require("cors");
const http = require("http");
require("dotenv").config();

// MySQL 세션 스토어 옵션
const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
};

const sessionStore = new MySQLStore(sessionStoreOptions);

// URL을 인코딩하는 코드
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const sessionMiddleware = session({
  key: "session_cookie_name",
  secret: "your_secret_key",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
});
app.use(sessionMiddleware);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../front-end/build")));
app.use(express.static(path.join(__dirname, "public")));

// js파일 연동
const mypageRoutes = require("./function/mypage");
const loginRoutes = require("./function/login");
const processRoutes = require("./function/check-login");
const ChatbotRoutes = require("./function/chatbot");
const signupRoutes = require("./function/signup");
const userdataRoutes = require("./function/userdata");
const bagsRoutes = require("./function/bags");
const bagsRoutes2 = require("./function/bags2");
const noticeRoutes = require("./function/notice");
const searchRoutes = require("./function/search");
const suggestRoutes = require("./function/suggest");
const cancelReservationsRoutes = require("./function/cancelReservations");

app.use("/", noticeRoutes);
app.use("/", searchRoutes);
app.use("/", bagsRoutes);
app.use("/", bagsRoutes2);
app.use("/", mypageRoutes);
app.use("/", loginRoutes);
app.use("/", processRoutes);
app.use("/", ChatbotRoutes);
app.use("/", signupRoutes);
app.use("/", userdataRoutes);
app.use("/", suggestRoutes); //추가
app.use("/", cancelReservationsRoutes);

// 서버 및 Socket.IO 설정
const server = http.createServer(app);

// Socket.IO 초기화
const initSocket = require("./function/socket");
const initrandSocket = require("./function/rand_chat");
initSocket(server, sessionMiddleware, db_config);
initrandSocket(server, sessionMiddleware, db_config);

// 모든 요청은 build/index.html로
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/build", "index.html"));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
