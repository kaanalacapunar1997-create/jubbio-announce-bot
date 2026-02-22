FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    yt-dlp \
    curl \
    && apt-get clean

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]