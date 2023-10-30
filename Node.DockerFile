FROM node
RUN mkdir jaroost-toolbox-components
WORKDIR jaroost-toolbox-components
RUN corepack enable
RUN yarn init -2