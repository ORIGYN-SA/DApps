export const getStatistics = async (days: number): Promise<Statistics> => {
  const request = await fetch(
    `https://development.canister.origyn.ch/canister/v0/management/statistics/${days}`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-access-token': localStorage.getItem('apiKey'),
      },
    },
  );

  const response: unknown = await request.json();
  if (isValidStatisticsResponse(response)) return response;
  throw Error('Invalid response');
};

const isValidStatisticsResponse = (object: unknown): object is Statistics => {
  if (object !== null && typeof object === 'object') {
    return 'dailyCounts' in object && 'totalClaimedCount' in object;
  }
};

export const getActivityFeed = async (): Promise<ActivityFeed> => {
  const request = await fetch(
    `https://development.canister.origyn.ch/canister/v0/management/activity-feed`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-access-token': localStorage.getItem('apiKey'),
      },
    },
  );

  const response: unknown = await request.json();
  if (isValidActivityFeed(response)) return response;
  throw Error('Invalid response');
};

const isValidActivityFeed = (object: unknown): object is ActivityFeed => {
  const firstActivity = object[0];
  if (firstActivity !== null && typeof firstActivity === 'object') {
    return '_id' in firstActivity && 'latestHistory' in firstActivity;
  }
};

export type Statistics = {
  dailyCounts: DailyCount[];
  daysCount: number;
  totalClaimedCount: number;
  totalUnClaimedCount: number;
  averageTransactions: number;
  uniqueOwnersCount: number;
};

export type DailyCount = {
  _id: string;
  statuses: {
    status: string;
    count: number;
  }[];
  transactionsCount: number;
};

export type ActivityFeed = Activity[];

export type Activity = {
  _id: string;
  latestHistory: {
    status: string;
    webhookEnabled: boolean;
    delivered: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
};
