import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";

import {
  getActiveSession,
  clearActiveSession
} from "../utils/activeSession.js";

import classModel from "../models/class.model.js";
import attendanceModel from "../models/attendance.model.js";

const JWT_SECRET = config.JWT_SECRET || "madhur";

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (ws, req) => {
    try {
      // 🔐 GET TOKEN
      const token = new URL(
        req.url,
        "http://localhost"
      ).searchParams.get("token");

      if (!token) {
        ws.send(JSON.stringify({
          event: "ERROR",
          data: { message: "Unauthorized or invalid token" }
        }));
        ws.close();
        return;
      }

      // 🔐 VERIFY TOKEN
      const decoded = jwt.verify(token, JWT_SECRET);

      // 👤 ATTACH USER
      ws.user = {
        userId: decoded.userId,
        role: decoded.role
      };

      // ✅ CONNECTED
      ws.send(JSON.stringify({
        event: "CONNECTED",
        data: { message: "WebSocket authenticated" }
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        event: "ERROR",
        data: { message: "Unauthorized or invalid token" }
      }));
      ws.close();
      return;
    }

    // ===============================
    // LISTEN FOR MESSAGES
    // ===============================
    ws.on("message", async (message) => {
      try {
        const parsed = JSON.parse(message);
        const { event, data } = parsed;

        // ===============================
        // ATTENDANCE_MARKED (TEACHER)
        // ===============================
        if (event === "ATTENDANCE_MARKED") {

          if (ws.user.role !== "teacher") {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "Forbidden, teacher event only" }
            }));
            return;
          }

          const session = getActiveSession();

          if (!session) {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "No active attendance session" }
            }));
            return;
          }

          const { studentId, status } = data;
          session.attendance[studentId] = status;

          // broadcast
          wss.clients.forEach(client => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                event: "ATTENDANCE_MARKED",
                data: { studentId, status }
              }));
            }
          });
        }

        // ===============================
        // MY_ATTENDANCE (STUDENT)
        // ===============================
        if (event === "MY_ATTENDANCE") {

          if (ws.user.role !== "student") {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "Forbidden, student event only" }
            }));
            return;
          }

          const session = getActiveSession();

          if (!session) {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "No active attendance session" }
            }));
            return;
          }

          const status = session.attendance[ws.user.userId];

          ws.send(JSON.stringify({
            event: "MY_ATTENDANCE",
            data: {
              status: status ? status : "not yet updated"
            }
          }));
        }

        // ===============================
        // TODAY_SUMMARY (TEACHER)
        // ===============================
        if (event === "TODAY_SUMMARY") {

          if (ws.user.role !== "teacher") {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "Forbidden, teacher event only" }
            }));
            return;
          }

          const session = getActiveSession();

          if (!session) {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "No active attendance session" }
            }));
            return;
          }

          const values = Object.values(session.attendance);
          const present = values.filter(v => v === "present").length;
          const absent = values.filter(v => v === "absent").length;
          const total = present + absent;

          wss.clients.forEach(client => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                event: "TODAY_SUMMARY",
                data: { present, absent, total }
              }));
            }
          });
        }

        // ===============================
        // DONE (TEACHER)
        // ===============================
        if (event === "DONE") {

          if (ws.user.role !== "teacher") {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "Forbidden, teacher event only" }
            }));
            return;
          }

          const session = getActiveSession();

          if (!session) {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "No active attendance session" }
            }));
            return;
          }

          const classData = await classModel.findById(session.classId);

          if (!classData) {
            ws.send(JSON.stringify({
              event: "ERROR",
              data: { message: "Class not found" }
            }));
            return;
          }

          let present = 0;
          let absent = 0;

          for (const studentId of classData.studentIds) {
            const status =
              session.attendance[studentId] || "absent";

            if (status === "present") present++;
            else absent++;

            await attendanceModel.create({
              classId: session.classId,
              studentId,
              status
            });
          }

          const total = present + absent;

          // 🧹 clear memory
          clearActiveSession();

          // broadcast final result
          wss.clients.forEach(client => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                event: "DONE",
                data: {
                  message: "Attendance persisted",
                  present,
                  absent,
                  total
                }
              }));
            }
          });
        }

      } catch (err) {
        ws.send(JSON.stringify({
          event: "ERROR",
          data: { message: "Invalid message format" }
        }));
      }
    });
  });
};
