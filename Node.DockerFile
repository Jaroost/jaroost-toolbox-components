FROM node
RUN mkdir jaroost-toolbox-components
WORKDIR jaroost-toolbox-components
COPY . .
RUN yarn