const { Op } = require("sequelize");
const { Lead, User } = require("../models");

const userAttributes = ["id", "name", "email", "role"];

const leadIncludes = [
  { model: User, as: "assignedTo", attributes: userAttributes },
  { model: User, as: "createdBy", attributes: userAttributes },
  { model: User, as: "updatedBy", attributes: userAttributes }
];

const allowedSortFields = new Set([
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "email",
  "company",
  "status",
  "source"
]);

const leadRepository = {
  create(payload, options = {}) {
    return Lead.create(payload, options);
  },

  findById(id, options = {}) {
    return Lead.findByPk(id, {
      ...options,
      include: leadIncludes
    });
  },

  async update(lead, payload, options = {}) {
    await lead.update(payload, options);
    return this.findById(lead.id, options);
  },

  delete(lead, options = {}) {
    return lead.destroy(options);
  },

  list({ page, limit, offset, search, status, source, sortBy, sortOrder, assignedToId }) {
    const where = {};

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    if (search) {
      const value = `%${search.trim()}%`;
      where[Op.or] = [
        { firstName: { [Op.iLike]: value } },
        { lastName: { [Op.iLike]: value } },
        { email: { [Op.iLike]: value } },
        { phone: { [Op.iLike]: value } },
        { company: { [Op.iLike]: value } }
      ];
    }

    const orderField = allowedSortFields.has(sortBy) ? sortBy : "createdAt";
    const orderDirection = String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

    return Lead.findAndCountAll({
      where,
      include: leadIncludes,
      limit,
      offset,
      distinct: true,
      order: [[orderField, orderDirection]]
    }).then(({ rows, count }) => ({
      rows,
      count,
      page,
      limit
    }));
  }
};

module.exports = leadRepository;

