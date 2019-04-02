
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {
      users.increments(); // gotta have our primary key

    users
        .string('username', 128)
        .notNullable()
        .unique();
    users.string('password', 128).notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
