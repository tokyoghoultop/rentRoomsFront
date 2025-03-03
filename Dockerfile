# ใช้ Node.js เป็น base image สำหรับการ build
FROM node:22-alpine AS build

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ yarn.lock
COPY package.json yarn.lock ./

# ติดตั้ง Dependencies ด้วย Yarn
RUN yarn install --frozen-lockfile

# คัดลอกโค้ดทั้งหมดไปยัง Container
COPY . .

# สร้าง Production Build ของ React
RUN yarn build

# ใช้ Nginx เป็น Web Server
FROM nginx:alpine

# คัดลอกไฟล์ Build ไปยัง Nginx
COPY --from=build /app/build /usr/share/nginx/html

# คัดลอก nginx.conf ไปตั้งค่า Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# เปิด Port 80
EXPOSE 80

# รัน Nginx
CMD ["nginx", "-g", "daemon off;"]
