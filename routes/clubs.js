var express = require("express");
var router = express.Router();
const Club = require("../models/club").Club;
const Thread = require("../models/club").Thread;

//INDEX for all Clubs

router.get("/", (request, response) => {
  Club.find().then(clubs => {
    response.json({ clubs });
  });
});

// SHOW for one club

router.get("/:id", (request, response) => {
  Club.findById(request.params.id).then(club => {
    response.json({ club });
  });
});

// DELETE a club

router.delete("/:id", (request, response) => {
  Club.findByIdAndDelete(request.params.id)
    .then(() => {
      return Club.findById(request.params.id);
    })
    .then(clubs => {
      response.json({ clubs });
    });
});

// UPDATE a Club

router.put("/:id", (request, response) => {
  const clubID = request.params.id;

  Club.findById(clubID, (error, foundClub) => {
    if (request.body.title) foundClub.title = request.body.title;
    if (request.body.description)
      foundClub.description = request.body.description;
    if (request.body.currentTopic)
      foundClub.currentTopic = request.body.currentTopic;
    if (request.body.currentMovieURL)
      foundClub.currentMovieURL = request.body.currentMovieURL;
    foundClub.save((error, updatedClub) => {
      if (error) response.json(error);
      else response.json(updatedClub);
    });
  });
});

// POST a new Member to a Club

// router.put("/:id/users/:userId", (request, response) => {

// })

// POST a Thread to a Club

router.post("/:id/threads", (request, response) => {
  const newThread = new Thread({
    title: request.body.title,
    prompt: request.body.prompt,
    thumbnailURL: request.body.thumbnailURL,
    backdropURL: request.body.backdropURL,
    responses: []
  });

  Club.findById(request.params.id, (error, foundClub) => {
    foundClub.threads.push(newThread);

    foundClub.save((error, savedClub) => {
      response.json(savedClub);
    });
    newThread.save();
  });
});

// POST a Response to a Thread on a Club

module.exports = router;
