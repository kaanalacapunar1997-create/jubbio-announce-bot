FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
  RUN apt-get update && apt-get install -y \
    ffmpeg \
    yt-dlp \
    curl \
    && apt-get clean 
    && apt-get clean

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]