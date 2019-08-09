# weather-cache-demo
weather app for teaching caching

server-mem.ts uses local memory to implement a caching solution.
server-redis.ts uses redis to do the same.

# environment setup
1. Install Node.js from https://nodejs.org/en/download/
   - may require restart before available
2. from command line
   - npm install typescript -g
   - npm install ts-node -g

# getting the source
1. clone or download this project: https://github.com/krisbaehr/weather-cache-demo
2. open terminal to your new weather-cache-demo directory
3. run this command to download dependencies: npm update

# starting the server
1. open weather-cache-demo directory using powershell (vs code terminal works)
2. start the server
  - redis based: ts-node server-redis.ts
  - local memory based: ts-node server-mem.ts
3. Open the "Try this:" URL from the terminal output
