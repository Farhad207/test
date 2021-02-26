FROM node:current-buster-slim
RUN mkdir -p /code
WORKDIR /code
ADD . /code
RUN npm install yarn && \
    yarn install
CMD [ "yarn", "start" ]
