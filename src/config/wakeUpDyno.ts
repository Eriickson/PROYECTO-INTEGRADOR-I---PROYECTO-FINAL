import moment from "moment";
import fetch from "node-fetch";

interface IStopTimes {
  start: string;
  end: string;
}

const isStopTime = ({ stopTimes }: { stopTimes: IStopTimes }) => {
  const { start, end } = stopTimes;
  const format = "HH:mm";

  // Check if a start and end time are supplied.
  if (!start || !end) {
    console.log("WARNING: Both a start/end stop time must be defined.");
    return true;
  }

  const current = moment();
  const startTime = moment(start, format);
  const endTime = moment(end, format);

  return current.isBetween(startTime, endTime);
};

interface IOptions {
  interval: number;
  logging: boolean;
  stopTimes: IStopTimes;
}

export const wakeDyno = (url: string, options: IOptions) => {
  const { interval = 29, logging = true, stopTimes = { start: "03:00", end: "12:00" } } = options;
  const milliseconds = interval * 60000;

  setTimeout(() => {
    if (isStopTime({ stopTimes })) {
      wakeDyno(url, options); // Recursively call function until not a stop time.
    } else {
      fetch(url)
        /* eslint-disable-next-line no-console */
        .then(() => logging && console.log("Successfully"))
        /* eslint-disable-next-line no-console */
        .catch(() => logging && console.log("Error attempting to wake the dyno"))
        .finally(() => wakeDyno(url, options));
    }
  }, milliseconds);
};
