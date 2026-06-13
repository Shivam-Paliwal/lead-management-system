const { LEAD_SOURCES, LEAD_STATUSES } = require("../utils/constants");
const ApiError = require("../utils/apiError");

const titleCase = (value) => {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const randomLeadService = {
  async getRandomLead() {
    const response = await fetch("https://randomuser.me/api/");

    if (!response.ok) {
      throw new ApiError(502, "Random User API request failed.");
    }

    const payload = await response.json();
    const person = payload.results && payload.results[0];

    if (!person) {
      throw new ApiError(502, "Random User API returned an empty response.");
    }

    const city = titleCase(person.location.city);
    const street = titleCase(person.location.street.name);

    return {
      firstName: titleCase(person.name.first),
      lastName: titleCase(person.name.last),
      email: person.email,
      phone: person.phone,
      company: `${city || "Metro"} ${street || "Commercial"} Group`,
      source: LEAD_SOURCES.RANDOM_USER_API,
      status: LEAD_STATUSES.NEW,
      notes: `Imported lead candidate from ${city || "Random User API"}.`
    };
  }
};

module.exports = randomLeadService;

