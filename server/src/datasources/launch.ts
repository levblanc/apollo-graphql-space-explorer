import { RESTDataSource } from '@apollo/datasource-rest';

class LaunchAPI extends RESTDataSource {
  override baseURL?: string = 'https://api.spacexdata.com/v2/';

  async getAllLaunches() {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }

  launchReducer(launch) {
    const {
      flight_number,
      launch_date_unix,
      launch_site,
      mission_name,
      links,
      rocket,
    } = launch;
    return {
      id: flight_number || 0,
      cursor: `${launch_date_unix}`,
      site: launch_site && launch_site.site_name,
      mission: {
        name: mission_name,
        missionPatchSmall: links.mission_launch_patch_small,
        missionPatchLarge: links.mission_launch_patch,
      },
      rocket: {
        id: rocket && rocket.rocket_id,
        name: rocket && rocket.rocket_name,
        type: rocket && rocket.rocket_type,
      },
    };
  }

  async getLaunchById({ launchId }) {
    const response = await this.get('launches', {
      params: { flight_numberj: launchId },
    });
    return this.launchReducer(response[0]);
  }

  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    );
  }
}

export default LaunchAPI;
