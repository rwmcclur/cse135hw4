site url: reporting.ryanmcclure.xyz



AUTHENTICATION

For authenticationg I ended up using passport with express js, and on the backend for username, password storage I used mongoose. The reason I used mongo db was for the ease of use in setting up with express and plethora of online tutorials to do so. I could have used mysql and I did try this for one iteration of my project, but mongoose makes things so much easier and understandable in coding in express. Another reason why I used mongoose is the ability to just use the register() function for new users, which takes care of the salt and hashing of passwords for me so I didnt have to do that on the backend myself. In addition to this, I used this js library called 'connect-ensure-login' which enabled me to place guards on pages so that they are only reachable by logged in users. For my admin check for the users table I did it kind of lazy and would like to update given more time, I just check if the logged in user was named admin before allowing them to go to the users page.

USER MANAGEMENT
admin account
username: admin
password: admin

grader account
username: grader
password: grader

DASHBOARD

I didn't finish this part, I just got a basic pie chart displayed with generic data. 

REPORT

I didn't finish this part, once again I just used a basic pie chart with generic data.
