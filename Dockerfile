FROM node:20

WORKDIR /app

RUN apt-get update && \
    apt-get install -y ffmpeg curl python3 python3-pip && \
    pip3 install yt-dlp && \
    apt-get clean

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]