# mensa-api-server

Simple API server using Node.js and express.js to fetch the current menu of the Mensa Moltke in Karlsruhe

## API Endpoints
### 1. `/`
Fetches the menu of the current day

Optional arguments: `date` in the form of yyyy-mm-dd

Example GET request: `http://serverurl.com/?date=2023-01-01`

### 2. `/koeriStatus`
Checks if the koeriwerk is open or closed (always uses current day)

Example GET request: `http://serverurl.com/koeriStatus`
