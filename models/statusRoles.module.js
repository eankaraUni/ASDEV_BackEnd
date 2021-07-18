const IssueStatus = {
  open: "O",
  inProgress: "P",
  solved: "S",
};

const Roles = {
  admin: "A",
  reporter: "R",
  operator: "O",
};

function buildIssue(data) {
  return {
    Description: data.description,
    status: data.status,
    streetAddress: data.streetAddress,
    City: data.City,
    Country: data.Country,
    raportedDate: data.raportedDate,
    author: data.Author,
    assignedUser: data.assignedUser,
  };
}

module.exports = {Roles, IssueStatus, buildIssue};

