import { Sequelize } from "sequelize";

if(!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const sequelize = new Sequelize(process.env.DATABASE_URL,
    {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: 'true'
          }
        },
        define: {

            timestamps: true,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true
            }
      });

export default sequelize;
