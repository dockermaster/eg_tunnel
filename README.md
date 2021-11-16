
   
# eg_tunnel

## components:
1. Browser
2. Server (proxy)
3. Agent
4. Destination site.

Flow details:
1. Request from browser (Client) goes to Proxy Server.
2. Server store the request in the memory.
3. Agent polling proxy server for new requests.
4. Agent send the request to the destination address.
5. Agent send the response back to Proxy Server 
6. Proxy server return the response back to the browser.

# debug:
1. run `npm i` on both folders.
2. use `npm run watch`.
3. set proxy to `localhost:8000`
4. request a site in the browser.
