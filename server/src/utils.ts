import { Sequelize, DataType } from 'sequelize-typescript';
import { Op } from 'sequelize';

export const paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex((item) => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    // let itemCursor = item.cursor ? item.cursor : getCursor(item);
    let itemCursor = item.cursor ? item.cursor : getCursor();

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};

export const createStore = () => {
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: false,
  });

  const users = db.define('user', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    email: DataType.STRING,
    token: DataType.STRING,
  });

  const trips = db.define('trip', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    launchId: DataType.INTEGER,
    userId: DataType.INTEGER,
  });

  return { users, trips };
};
