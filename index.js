// (c) 2018 Sam Olagun
// Mentee Matcher

"use strict";

// Observations:
// - You must compare each mentor and mentee AT LEAST ONCE.
// - Because of the fact stated above, the problem is intractible and has n^2 time complexity.

const fs = require("fs");

// Mentee
class Mentee {
  constructor(name) {
    this.name = name;
    this.mentor = null;
    this.mentors = [];
    this.index = 0;
  }

  // Ranks the preference of a certain mentor.
  rank(mentor) {
    return this.mentors.indexOf(mentor);
  }
}

// Mentor
class Mentor {
  constructor(name) {
    this.name = name;
    this.mentee = null;
    this.mentees = [];
    this.index = 0;
  }

  // Pairs a given mentee with a mentor.
  mentor(mentee) {
    if (mentee.mentor) mentee.mentor.mentee = null;
    mentee.mentor = this;
    if (this.mentee) this.mentee.mentor = null;
    this.mentee = mentee;
  }

  // Gets the next ranked mentee.
  next() {
    return this.mentees[this.index++];
  }
}

// Reads the input and splits it by a new line.
const input = fs
  .readFileSync("in.txt")
  .toString("utf-8")
  .split("\n");

// Ignores the first line, N.
input.shift();

// Reads the next line, splits it by spaces, reduces it to a map of mentor name to mentor object.
const mentorMap = input
  .shift()
  .split(" ")
  .reduce((acc, name) => {
    acc[name] = new Mentor(name);
    return acc;
  }, {});

// Reads the next line, splits it by spaces, reduces it to a map of mentee name to mentee object.
const menteeMap = input
  .shift()
  .split(" ")
  .reduce((acc, name) => {
    acc[name] = new Mentee(name);
    return acc;
  }, {});

// Reads the next N lines, splits each by spaces, reduces it to an array of mentors with mentee references. (mentor.mentee)
const mentors = Object.values(mentorMap).map(mentor => {
  mentor.mentees = input
    .shift()
    .split(" ")
    .map(name => menteeMap[name]);
  return mentor;
});

// Reads the next N lines, splits each by spaces, reduces it to an array of mentees with mentor references.(mentee.mentor)
const mentees = Object.values(menteeMap).map(mentee => {
  mentee.mentors = input
    .shift()
    .split(" ")
    .map(name => mentorMap[name]);
  return mentee;
});

// Matches a mentor to a mentee if and only if it has not been seen before by the mentor and one of the following
// conditions are satisfied:
// 1) the mentee has no mentor,
// 2) the mentee prefers this mentor to its current mentor.
const match = mentor => {
  const mentee = mentor.next();
  if (!mentee.mentor || mentee.rank(mentor) < mentee.rank(mentee.mentor))
    mentor.mentor(mentee);
};

// While not every mentor is matched (has a mentee/mentee is not null)
while (!mentors.every(e => e.mentee)) {
  // For every mentor without a mentee, match it.
  mentors.filter(e => !e.mentee).map(match);
}

// Write the result.
fs.writeFileSync(
  "out.txt",
  mentors.map(e => [e.name, e.mentee.name].join(" ")).join("\n")
);
