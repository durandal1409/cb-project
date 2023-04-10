# Endpoints
| Endpoint                           | Description                                     |
|------------------------------------|-------------------------------------------------|
| **Ads endpoints:**
|.get("/api/ads/search/:userId")     |get ads that match search phrase and chosen      |   
|                                    |category. It also adds search to user documen in | 
|                                    |users collection                                 |
|.get("/api/ads/recommended/:userId")|get ads according to user's last search if user  |
|                                    |is logged in and their last search saved in db,  |
|                                    |othervise get random ads                         |
|.get("/api/ads/latest")             |get latest ads according to timestamp field      |
|.get("/api/ads/similar/:title")     |get ads similar to the provided title            |
|.get("/api/ads/:adId")              |get ad by id                                     |
|.post("/api/ads")                   |post new ad                                      |
|.patch("/api/ads")                  |update ad                                        |
|.delete("/api/ads")                 |delete ad                                        |
| **Users endpoints:**      
|.get("/api/users/:userId")          |get user by id and their ads                     |
|.post("/api/users")                 |add new user if doesn't exist                    |
|.patch("/api/users")                |update user                                      |
| **Categories endpoints:**             
|.get("/api/categories")             |get clothing categories object
