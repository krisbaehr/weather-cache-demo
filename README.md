# weather-cache-demo
weather app for teaching caching

server-mem.ts uses local memory to implement a caching solution.
server-redis.ts uses redis to do the same.

# environment setup
1. install Node.js from https://nodejs.org/en/download/
   - may require restart before available
2. from command line
   - npm install typescript -g
   - npm install ts-node -g
3. make sure your redis server is running
   - Windows 10: https://redislabs.com/blog/redis-on-windows-10/
	    the native program is for a pretty old version of redis
	    therefore, it's best to run it through wsl
   - Mac: http://www.codebind.com/mac-osx/install-redis-mac-osx/
   - Ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04

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
