
# Reste à faire: 
* Mettre les socket dans le back   <span style="float: right;">- [ ]</span>
* faire la logique socket du Chat front & back   <span style="float: right;">- [ ]</span>
* faire la table de settings   <span style="float: right;">- [ ]</span>

# Registration and Signing-in:
requesting of at least their:
* email address   <span style="float: right;">- [X]</span>
* username    <span style="float: right;">- [X]</span>
* last name   <span style="float: right;">- [X]</span>
* first name    <span style="float: right;">- [X]</span>
* and a password (that is somehow protected)    <span style="float: right;">- [X]</span>

The user must be able to login using their:
* username    <span style="float: right;">- [X]</span>
* password    <span style="float: right;">- [X]</span>
and also receive an email allowing them to reset their password if they forget it. 

# Sign-out:
the user must be able to log out with just one click from any page on the site.    <span style="float: right;">- [X]</span>

# Profil:
• Once a user is connected, they must fill out their profile by providing the following
information:
* The gender.   <span style="float: right;">- [X]</span>
* Sexual preferences.   <span style="float: right;">- [X]</span>
* A biography.    <span style="float: right;">- [X]</span>
* A list of interests with tags (e.g. #vegan, #geek, #piercing, etc.), which must be reusable   <span style="float: right;">- [ ]</span>
* Up to 5 pictures, including one to be used as a profile picture.    <span style="float: right;">- [ ]</span>
* At any time, the user must be able to modify this information, as well as their last name, first name, and email address.   <span style="float: right;">- [X]</span>
* The user must be able to check who has viewed their profile,    <span style="float: right;">- [ ]</span>
* as well as who has “liked” them.    <span style="float: right;">- [ ]</span>
* The user must have a public “fame rating” (Up to you to define what “fame rating” means)    <span style="float: right;">- [ ]</span>


* The user must be located using GPS positioning, up to their neighborhood.   <span style="float: right;">- [ ]</span>
  * The user must be able to modify their GPS position in   <span style="float: right;">- [ ]</span>
their profile.

# Browsing

The user must be able to easily get a list of suggestions that match their profile.
* You will only propose “interesting” profiles. For example, only men for a hetero-   <span style="float: right;">- [ ]</span>
sexual girls. You must manage bisexuality.If the user’s orientation isn’t specified,
they will be considered bisexual.
* You must cleverly match 3 based on:   <span style="float: right;">- [ ]</span>
  * Same geographic area as the user.   <span style="float: right;">- [ ]</span>
  * A maximum of common tags.   <span style="float: right;">- [ ]</span>
  * A maximum “fame rating”.    <span style="float: right;">- [ ]</span>
* You must prioritize showing people from the same geographical area.   <span style="float: right;">- [ ]</span>
* The list must be sortable by age, location, “fame rating”, and common tags.   <span style="float: right;">- [ ]</span>
* The list must be filterable by age, location, “fame rating”, and common tags.   <span style="float: right;">- [ ]</span>

# Research
The user must be able to conduct an advanced search by selecting one or more criteria,
such as:
* An age gap.   <span style="float: right;">- [ ]</span>
* A “fame rating” gap.    <span style="float: right;">- [ ]</span>
* A location.   <span style="float: right;">- [ ]</span>
* One or multiple interest tags.    <span style="float: right;">- [ ]</span>
For the suggested list, the resulting list must be sortable and filterable by age, location,
“fame rating” and tags.

# Profile of other users
A user must be able to view the profiles of other users. Profiles must contain all available
information about them, except for the email address and password.
When a user views a profile, it must be added to their visit history.
The user must also be able to:
* “Like” another user’s profile picture. When two people “like” each other’s profiles,    <span style="float: right;">- [ ]</span>
they will be considered “connected” and can start chatting. If the current user does
not have a profile picture, they cannot complete this action.
* You should also remove your “like” to an user whom you had previously “liked”,    <span style="float: right;">- [ ]</span>
The user will no longer generate notifications, and you will not be able to chat with
them anymore.
* Check the “fame rating” of another user.    <span style="float: right;">- [ ]</span>
* See if a user is currently online, and if not, see the date and time of their last    <span style="float: right;">- [ ]</span>
connection.
* Report a user as a “fake account”.    <span style="float: right;">- [ ]</span>
* Block a user. A blocked user will no longer appear in the search results and will   <span style="float: right;">- [ ]</span>
not generate additional notifications. And, of course, it will no longer be possible
to chat with him.
A user can clearly see if the profile they are viewing is connected or has “like” their
profile and must be able to “unlike” or disconnected from that profile.

# Chat
When two users are connected, 4 they must be able to “chat” in real-time. 5 The imple-
mentation of the chat is up to you. The user must be able to see from any page if a new
message is received.

# Notifications
A user must be notified in real-time 6 of the following events:
* When the user receives a “like”.    <span style="float: right;">- [ ]</span>
* When the user’s profile has been viewed.    <span style="float: right;">- [ ]</span>
* When the user receives a message.   <span style="float: right;">- [ ]</span>
* When “liked” user also “likes” the user back.   <span style="float: right;">- [ ]</span>
* When a connected user “unlikes” the user.   <span style="float: right;">- [ ]</span>
A user must be able to see, from any page, that a notification hasn’t been read.


# Peer-evaluation
important security concers:
* Storing plain text passwords in your database.    <span style="float: right;">- [ ]</span>
* Allowing injection of HTML or user Javascript code in unprotected variables.    <span style="float: right;">- [ ]</span>
* Allowing upload of unwanted content.    <span style="float: right;">- [ ]</span>
* Allowing alteration of SQL requests.    <span style="float: right;">- [ ]</span>

* Your code cannot produce any errors, warnings or notices either from the server or
the client side in the web console.
* Anything not specifically authorized is forbidden.
* Finally, the slightest security breach will give you 0. You must at least manage
what is indicated in the general instructions, ie NOT have plain text passwords
stored in your database, be protected against SQL injections, and have a validation
of all the forms and upload.