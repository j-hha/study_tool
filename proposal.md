## GA WDIR Hopper Project 2: Proposal

**App:** browser based learning tool

**Summary:** A website that allows the user to access and store learning material on a topic of their choice and use this data to revise

**Core goals:**

- Full-stack app, built in node / express
- MVC file structure, Restful routes
- Data stored in mongoDB
- Repo hosted on gitHub
- App hosted on Heroku
- 3 data models
- Partials, static files, styles, etc

**Draft data structure:**

_Model 1 → the user_

``{
    username: String,
    password: String,
    topics: [ topicID ],
    stats: [
              {
          		    topicID: topicID,
          		    numRevised: Number,
          		    percentageCorrect: Number,
         		      percentageWrong: Number,
       	       }
          ]
    }``

_Model 2 → a topic_

``{
    topic: String,
    data: [dataID]
    }``

_Model 3 → study data entry_

``{
    question: String,
    answer: String,
    topic: [topicID]
}``

**Why store IDs and not schemas?**
→ No duplicates, less data
→ User cannot edit IDs
→ updates / deletes can be handled more easily if I only use IDs

**Fallback Option:**
- focus on only one study topic
→ have only two models: study data and users

**Functionality:**

- users can create an account
- users can store, retrieve, update and delete data for a topic they want to study in a q&a format:
- users can view all topics
- users can view all entries in a topic
- users can view a single entry
- users can edit entries
- users can delete entries

**Stretch goals:**

**a) Mini Browser Game**
- Users can select a topic and test their knowledge with a pop quiz (multiple choice)

_draft logic:_
- Pick a data entry randomly → grab q and a
- Pick two more data entries → grab just a
- Compare if user clicked on the correct a

**b) login**
- Users can log in and out
- User must be logged in to add/update/delete data
- Game is always available, user must not be logged in to revise

**c) stats**
- Users can save stats

**d) get some data via an AJAX request**
-look into finding and accessing open source study material, eg vocabulary data
