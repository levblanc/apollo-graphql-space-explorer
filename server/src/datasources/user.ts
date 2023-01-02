import isEmail from 'isemail';

class UserAPI {
  private store;

  constructor({ store }) {
    this.store = store;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ user, email: emailArg }) {
    const email = user ? user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ user, launchIds }) {
    if (!user.id) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ user, launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ user, launchId }) {
    const res = await this.store.trips.findOrCreate({
      where: { userId: user.id, launchId },
    });

    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ user, launchId }) {
    return !!this.store.trips.destroy({ where: { userId: user.id, launchId } });
  }

  async getLaunchIdsByUser({ user }) {
    const found = await this.store.trips.findAll({
      where: { userId: user.id },
    });

    return found && found.length
      ? found.map((l) => l.dataValues.launchId).filter((l) => !!l)
      : [];
  }

  async isBookedOnLaunch({ user, launchId }) {
    if (!user) return false;

    const found = await this.store.trips.findAll({
      where: { userId: user.id, launchId },
    });

    return found && found.length > 0;
  }
}

export default UserAPI;
